import os
import yt_dlp


current_directory = os.getcwd()

def download(url_list):
    for url in url_list:
        output_path = os.path.join(current_directory, 'downloads', f'{url['title']}.mp3')
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': output_path,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            if url['url'] :
                ydl.download([url['url']])
