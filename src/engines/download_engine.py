import os
from yt_dlp import YoutubeDL
from src.engines.metadata_engine import tag_mp3


YOUTUBE_CLIENTS = ("android", "web", "mweb")


def download(video_urls, download_path="downloads", first_only=False, on_status=None):
    downloaded_files = []

    def progress_hook(d):
        if on_status is None:
            return
        if d["status"] == "downloading":
            on_status("downloading")
        elif d["status"] == "finished":
            on_status("converting")
            info_dict = d.get("info_dict", {})
            title = info_dict.get("title", "")
            base = os.path.splitext(d["filename"])[0]
            mp3_path = base + ".mp3"
            downloaded_files.append((mp3_path, title))

    base_options = {
        'format': 'bestaudio/best',
        'ignoreconfig': True,
        'postprocessors': [
            {
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }
        ],
        'outtmpl': f'{download_path}/%(title)s.%(ext)s',
        'progress_hooks': [progress_hook],
    }

    try:
        last_error = None

        for client in YOUTUBE_CLIENTS:
            options = {
                **base_options,
                'extractor_args': {
                    'youtube': {
                        'player_client': [client],
                    },
                },
            }

            if first_only:
                options['playlist_items'] = '1'

            try:
                with YoutubeDL(options) as ydl:
                    for url in video_urls:
                        ydl.download(url)
                last_error = None
                break
            except Exception as e:
                last_error = e
                print(f"Download with YouTube client '{client}' failed: {e}")

        if last_error is not None:
            raise last_error

        if on_status:
            on_status("tagging")

        for mp3_path, title in downloaded_files:
            if os.path.exists(mp3_path):
                tag_mp3(mp3_path, title)

        print("Download completed!")
        return download_path
    except Exception as e:
        print(f"Error during download: {e}")
        print("Try updating yt-dlp in the active venv: python -m pip install -U yt-dlp")
        return None
