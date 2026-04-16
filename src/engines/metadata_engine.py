import re
import time
import urllib.request
import musicbrainzngs
from mutagen.id3 import ID3, TIT2, TPE1, TALB, TDRC, APIC

musicbrainzngs.set_useragent("alfred-bot", "1.0", "alfred-bot@local")


def parse_title(title: str) -> tuple[str, str]:
    cleaned = re.sub(r"\(.*?\)|\[.*?\]", "", title).strip()
    if " - " in cleaned:
        artist, song = cleaned.split(" - ", 1)
        return artist.strip(), song.strip()
    return "", cleaned.strip()


def fetch_metadata(artist: str, song: str) -> dict:
    try:
        time.sleep(1)  # MusicBrainz rate limit
        result = musicbrainzngs.search_recordings(
            recording=song,
            artist=artist,
            limit=1,
        )
        recordings = result.get("recording-list", [])
        if not recordings:
            return {}

        rec = recordings[0]
        release = (rec.get("release-list") or [{}])[0]

        return {
            "title": rec.get("title"),
            "artist": rec.get("artist-credit-phrase"),
            "album": release.get("title"),
            "year": (release.get("date") or "")[:4],
            "release_id": release.get("id"),
        }
    except Exception as e:
        print(f"MusicBrainz lookup failed: {e}")
        return {}


def fetch_cover(release_id: str) -> bytes | None:
    try:
        data = musicbrainzngs.get_image_list(release_id)
        images = data.get("images", [])
        if not images:
            return None
        url = images[0]["thumbnails"].get("large") or images[0]["image"]
        with urllib.request.urlopen(url, timeout=10) as r:
            return r.read()
    except Exception:
        return None


def tag_mp3(mp3_path: str, youtube_title: str) -> bool:
    artist, song = parse_title(youtube_title)
    if not song:
        return False

    meta = fetch_metadata(artist, song)
    if not meta:
        return False

    cover = fetch_cover(meta["release_id"]) if meta.get("release_id") else None

    try:
        tags = ID3(mp3_path)
        if meta.get("title"):  tags["TIT2"] = TIT2(text=meta["title"])
        if meta.get("artist"): tags["TPE1"] = TPE1(text=meta["artist"])
        if meta.get("album"):  tags["TALB"] = TALB(text=meta["album"])
        if meta.get("year"):   tags["TDRC"] = TDRC(text=meta["year"])
        if cover:
            tags["APIC:"] = APIC(mime="image/jpeg", type=3, desc="Cover", data=cover)
        tags.save()
        return True
    except Exception as e:
        print(f"Failed to write tags to {mp3_path}: {e}")
        return False
