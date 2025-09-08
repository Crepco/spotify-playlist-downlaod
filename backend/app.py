# backend/app.py
import os
import threading
import time
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

# Import your existing spotify handler (assumes spotify_handler.py in same folder)
from spotify_handler import get_playlist_tracks
from youtube_handler import search_youtube, download_audio

app = Flask(__name__)
CORS(app)


@app.route("/fetch", methods=["POST"])
def fetch():
    data = request.get_json(force=True)
    playlist_url = data.get("playlist_url")
    if not playlist_url:
        return jsonify({"error": "Playlist URL is required"}), 400

    try:
        tracks = get_playlist_tracks(playlist_url)
    except Exception as e:
        return jsonify({"error": f"Spotify error: {e}"}), 500

    results = []
    for track in tracks:
        yt = None
        try:
            yt = search_youtube(track)
        except Exception as e:
            print("search_youtube error:", e)
        results.append({"name": track, "youtube_url": yt})

    return jsonify({"tracks": results})


@app.route("/download", methods=["POST"])
def download():
    data = request.get_json(force=True)
    youtube_url = data.get("youtube_url") or data.get("url")
    title = data.get("title", "song")

    if not youtube_url:
        return jsonify({"error": "YouTube URL required"}), 400

    try:
        print(f"Starting download for: {youtube_url}")
        filepath = download_audio(youtube_url)
        print("Downloaded to:", filepath)
    except Exception as e:
        print("Download error:", e)
        return jsonify({"error": str(e)}), 500

    if not os.path.exists(filepath):
        return jsonify({"error": "Downloaded file not found"}), 500

    # schedule cleanup after 60 seconds (daemon thread)
    def delete_later(path: str, delay: int = 60):
        time.sleep(delay)
        try:
            if os.path.exists(path):
                os.remove(path)
                print("Deleted temp file:", path)
        except Exception as exc:
            print("Failed to delete file:", path, exc)

    threading.Thread(target=delete_later, args=(filepath, 60), daemon=True).start()

    # send file as attachment
    return send_file(filepath, as_attachment=True)


if __name__ == "__main__":
    print("Starting Flask app on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
