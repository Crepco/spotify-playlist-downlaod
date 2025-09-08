# 🎵 Spotify → YouTube Audio Downloader

This is a simple web application that allows you to fetch all the tracks from a Spotify playlist, find the corresponding audio on YouTube, and download them.

---

## 🚀 Features

- **Spotify Integration** – Fetch all songs from any public Spotify playlist.  
- **YouTube Search** – Automatically finds the best matching YouTube video for each song.  
- **Direct Audio Download** – Downloads the audio from the matched YouTube videos.  
- **Clean & Modern UI** – Dark-themed interface with animations and a smooth workflow.  
- **Simple Setup** – Get it running in just a few steps.  

---

## 🛠️ How it Works

The project consists of a **Python backend** and a **JavaScript frontend**.

### 🔹 Backend (Python)
- `app.py` → Flask server with two main endpoints:
  - `/fetch` → Get tracks from Spotify.
  - `/download` → Download audio from YouTube.
- `spotify_handler.py` → Uses **Spotipy** to fetch track info from Spotify playlists.
- `youtube_handler.py` → Uses **yt-dlp** to search and download audio from YouTube.
- Auto-cleans downloaded files after **60 seconds** to save disk space.

### 🔹 Frontend (HTML, CSS, JS)
- `index.html` → Main page structure.  
- `style.css` → Dark theme styling + animations.  
- `script.js` → Handles user interactions and connects to backend.  

---

## ⚙️ Project Setup

### 1️⃣ Prerequisites
- Python **3.7+**
- [pip](https://pip.pypa.io/en/stable/installation/) (Python package manager)


---

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/Crepco/spotify-playlist-downlaod
cd spotify-playlist-downlaod
```

---

### 3️⃣ Set Up Spotify API Credentials
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).  
2. Log in (or create a free account).  
3. Create an app → copy **Client ID** and **Client Secret**.  
4. Open `backend/spotify_handler.py` and replace:

```python
CLIENT_ID = "your_spotify_client_id"
CLIENT_SECRET = "your_spotify_client_secret"
```

---

### 4️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

---

### 5️⃣ Run the Application
```bash
cd backend
python app.py
```
Backend will start at:  
👉 `http://127.0.0.1:5000`

---

### 6️⃣ Open the Frontend
- Navigate to `frontend/index.html`  
- Open it in your browser (double-click works).  

---

## 🧑‍💻 Usage
1. Copy a Spotify playlist link (e.g., `https://open.spotify.com/playlist/...`).  
2. Paste it in the input field.  
3. Click **Fetch Songs** → songs & YouTube matches will load.  
4. Click **Download** next to a song → audio will be downloaded.  

---

## 📂 Project Structure

```
spotify-youtube-downloader/
│── backend/
│   ├── app.py
│   ├── spotify_handler.py
│   ├── youtube_handler.py
│   ├── requirements.txt
│
│── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│
│── README.md
```


## 🤝 Contributing
Pull requests and feature requests are welcome!  

---
