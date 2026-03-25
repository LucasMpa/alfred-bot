from yt_dlp import YoutubeDL

def download(video_urls):
    print(video_urls)
    options = {
        'format': 'bestaudio/best',
        'postprocessors': [
            {
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }
        ],
        'outtmpl': 'downloads/%(title)s.%(ext)s',  
    }

    try:
        with YoutubeDL(options) as ydl:
            for url in video_urls:
                ydl.download(url)
        print("Download completed!")
        return "downloads/"
    except Exception as e:
        print(f"Error during download: {e}")
        return None
