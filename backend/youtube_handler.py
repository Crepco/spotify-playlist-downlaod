# backend/youtube_handler.py - No FFmpeg Version
import os
import re
import yt_dlp

# downloads folder at project root (one level up from backend/)
DOWNLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "downloads"))
os.makedirs(DOWNLOADS_DIR, exist_ok=True)


def sanitize_filename(name: str) -> str:
    """Remove characters that are invalid in Windows filenames."""
    return re.sub(r'[<>:"/\\|?*\n\r]+', "_", name).strip()


def search_youtube(query: str, max_results: int = 1) -> str | None:
    """Return top YouTube video URL for a search query."""
    ydl_opts = {"quiet": True, "skip_download": True, "extract_flat": "in_playlist"}
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"ytsearch{max_results}:{query}", download=False)
            if "entries" in info and info["entries"]:
                vid = info["entries"][0].get("id")
                return f"https://www.youtube.com/watch?v={vid}" if vid else None
    except Exception as e:
        print("YouTube search error:", e)
    return None


def download_audio(youtube_url: str) -> str:
    """
    Download audio from YouTube into downloads/ folder and return absolute path.
    Downloads best available audio format (no conversion to MP3).
    """
    # Use title-based outtmpl so user-friendly filenames are produced
    outtmpl = os.path.join(DOWNLOADS_DIR, "%(title)s.%(ext)s")

    ydl_opts = {
        "format": "bestaudio/best",  # Download best audio quality available
        "outtmpl": outtmpl,
        "quiet": True,
        "no_warnings": True,
        # Remove postprocessors - no FFmpeg conversion
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(youtube_url, download=True)
        # Get the actual downloaded filename
        filename = ydl.prepare_filename(info)
        final_path = os.path.abspath(filename)
        
        # Sanitize filename if necessary
        base = os.path.basename(final_path)
        safe_base = sanitize_filename(base)
        safe_path = os.path.join(os.path.dirname(final_path), safe_base)
        
        if safe_path != final_path:
            try:
                os.replace(final_path, safe_path)
                return safe_path
            except FileNotFoundError:
                # If final_path does not exist, return the safe path
                pass
                
        return final_path