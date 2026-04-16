import uuid
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from yt_dlp import YoutubeDL
from src.engines.search_engine import search
from src.engines.download_engine import download

app = Flask(__name__)
CORS(app)

jobs = {}

YOUTUBE_HOSTS = ("youtube.com/watch", "youtu.be/", "m.youtube.com/watch")

def is_youtube_url(value):
    return any(host in value for host in YOUTUBE_HOSTS)

def _thumbnail(video_id):
    return f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"



@app.route("/search", methods=["POST"])
def search_song():
    data = request.get_json()
    query = (data.get("query") or "").strip()
    if not query:
        return jsonify({"error": "Provide a query"}), 400

    ytdl_opts = {"quiet": True, "no_warnings": True, "extract_flat": True}
    original = query

    try:
        with YoutubeDL(ytdl_opts) as ydl:
            if is_youtube_url(query):
                info = ydl.extract_info(query, download=False)
            else:
                info = ydl.extract_info(f"ytsearch1:{query}", download=False)

        # ytsearch result
        if info.get("_type") == "playlist" and not is_youtube_url(original):
            entry = info["entries"][0]
            video_id = entry["id"]
            return jsonify({
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "title": entry.get("title", original),
                "thumbnail": _thumbnail(video_id),
                "is_playlist": False,
            })

        # Playlist URL
        if info.get("_type") == "playlist":
            entries = info.get("entries") or []
            first_id = entries[0]["id"] if entries else None
            return jsonify({
                "url": original,
                "title": info.get("title", "Playlist"),
                "thumbnail": _thumbnail(first_id) if first_id else "",
                "is_playlist": True,
            })

        # Single video
        video_id = info["id"]
        return jsonify({
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "title": info.get("title", original),
            "thumbnail": _thumbnail(video_id),
            "is_playlist": False,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def process_job(job_id, songs, download_path, playlist_first_only):
    job = jobs[job_id]

    for i, song in enumerate(songs):
        try:
            if is_youtube_url(song):
                urls = [song]
            else:
                job["songs"][i]["status"] = "searching"
                urls = search([song])

            if not urls:
                job["songs"][i]["status"] = "error"
                job["songs"][i]["message"] = "Not found on YouTube"
                continue

            def on_status(status, idx=i):
                jobs[job_id]["songs"][idx]["status"] = status

            first_only = song in playlist_first_only
            result = download(urls, download_path=download_path, first_only=first_only, on_status=on_status)

            if result:
                job["songs"][i]["status"] = "completed"
            else:
                job["songs"][i]["status"] = "error"
                job["songs"][i]["message"] = "Download failed"

        except Exception as e:
            job["songs"][i]["status"] = "error"
            job["songs"][i]["message"] = str(e)

    has_errors = any(s["status"] == "error" for s in job["songs"])
    job["status"] = "completed_with_errors" if has_errors else "completed"


@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    if not data or not data.get("songs"):
        return jsonify({"error": "Provide a 'songs' list"}), 400

    songs = data["songs"]
    titles = data.get("titles") or songs
    download_path = data.get("download_path", "downloads")
    playlist_first_only = set(data.get("playlist_first_only", []))
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "status": "processing",
        "songs": [{"name": title, "status": "queued"} for title in titles],
    }

    thread = threading.Thread(
        target=process_job,
        args=(job_id, songs, download_path, playlist_first_only),
        daemon=True,
    )
    thread.start()

    return jsonify({"job_id": job_id}), 202


@app.route("/status/<job_id>", methods=["GET"])
def get_status(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify({"job_id": job_id, **job})


if __name__ == "__main__":
    app.run(debug=True, port=8000)
