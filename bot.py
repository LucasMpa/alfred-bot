from src.engines.search_engine import search
from src.engines.download_engine import download

def main():
    song_list =  [   
                  ' ARTBAT & Vintage Culture - She The Last One (Extended Mix) lyricara'
    ]
    print('Start searching...')
    videos_url = search(song_list)
    if videos_url:
        mp3_path = download(videos_url)
        print(f"MP3 saved at: {mp3_path}")

if __name__ == "__main__":
    main()
