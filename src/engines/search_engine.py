from yt_dlp import YoutubeDL


def search(playlist):
    opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "ignoreconfig": True,
    }
    playlist_links = []

    with YoutubeDL(opts) as ydl:
        for song in playlist:
            try:
                info = ydl.extract_info(f"ytsearch1:{song}", download=False)
                entries = info.get("entries") or []
                if entries:
                    playlist_links.append(f"https://www.youtube.com/watch?v={entries[0]['id']}")
                else:
                    print(f"Nenhum vídeo encontrado para '{song}'")
            except Exception as e:
                print(f"Erro ao buscar '{song}': {e}")

    return playlist_links
