import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# ⚠️ Put your keys here
CLIENT_ID = "your_spotify_client_id"
CLIENT_SECRET = "your_spotify_client_secret"

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id="Client ID here",
    client_secret="Client secret here"
))

def get_playlist_tracks(playlist_url):
    """Fetch all tracks from a Spotify playlist"""
    results = sp.playlist_tracks(playlist_url)
    tracks = []

    while results:
        for item in results['items']:
            track = item['track']
            if track:
                track_name = track['name']
                artist = track['artists'][0]['name']
                tracks.append(f"{track_name} - {artist}")
        if results['next']:
            results = sp.next(results)
        else:
            break

    return tracks
