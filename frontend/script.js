const API_BASE = "http://127.0.0.1:5000";

async function fetchSongs() {
  const url = document.getElementById("playlistUrl").value.trim();
  const resultsDiv = document.getElementById("results");
  
  if (!url) {
    resultsDiv.innerHTML = '<div class="error">Please enter a Spotify playlist URL</div>';
    return;
  }
  
  resultsDiv.innerHTML = '<div class="loading">🎵 Fetching songs from Spotify...</div>';

  try {
    const res = await fetch(`${API_BASE}/fetch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlist_url: url }),
    });
    
    const data = await res.json();
    
    if (data.error) {
      resultsDiv.innerHTML = `<div class="error">❌ Error: ${data.error}</div>`;
      return;
    }
    
    displaySongs(data.tracks || []);
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = `<div class="error">❌ Fetch failed: ${err.message}</div>`;
  }
}

function displaySongs(tracks) {
  const resultsDiv = document.getElementById("results");
  
  if (!tracks.length) {
    resultsDiv.innerHTML = '<div class="no-results">🤷‍♂️ No tracks found in this playlist</div>';
    return;
  }

  let html = `<div class="stats">Found ${tracks.length} tracks</div>`;
  
  tracks.forEach((t, index) => {
    const hasYouTube = t.youtube_url && t.youtube_url !== null;
    html += `
      <div class="song">
        <div class="song-info">
          <div class="song-name">${escapeHtml(t.name)}</div>
          ${hasYouTube ? 
            `<a href="${t.youtube_url}" target="_blank" class="song-link">🎬 View on YouTube</a>` : 
            '<span style="color: #ff6b6b; font-size: 14px;">❌ No YouTube match found</span>'
          }
        </div>
        <div class="controls">
          ${hasYouTube ? 
            `<button class="download-btn" onclick="downloadSong('${t.youtube_url}', '${escapeHtml(t.name).replace(/'/g, "\\'")}', this)">⬇️ Download</button>` :
            '<button class="download-btn" disabled>Unavailable</button>'
          }
        </div>
        <div class="music-note">🎵</div>
      </div>
    `;
  });
  
  resultsDiv.innerHTML = html;
}

async function downloadSong(youtubeUrl, name, btn) {
  if (!youtubeUrl) {
    alert("No YouTube link found for this track.");
    return;
  }

  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = "⏳ Downloading...";
  
  const status = document.createElement("span");
  status.className = "status";
  status.textContent = "Processing...";
  btn.parentNode.appendChild(status);

  try {
    const res = await fetch(`${API_BASE}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtube_url: youtubeUrl, title: name }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      alert("❌ Download failed: " + (err.error || res.statusText));
      return;
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = name.replace(/[\/\\:*?"<>|]/g, "_") + ".mp3";
    a.href = blobUrl;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
    
    btn.innerHTML = "✅ Downloaded!";
    status.textContent = "Complete!";
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      status.remove();
    }, 2000);
    
  } catch (err) {
    console.error("Download error:", err);
    alert("❌ Download error: " + err.message);
  } finally {
    btn.disabled = false;
    if (btn.innerHTML.includes("Downloading")) {
      btn.innerHTML = originalText;
    }
  }
}

function escapeHtml(text) {
  return text ? text.replace(/[&<>"']/g, (m) => ({ 
    "&": "&amp;", 
    "<": "&lt;", 
    ">": "&gt;", 
    '"': "&quot;", 
    "'": "&#39;" 
  }[m])) : "";
}

// Allow Enter key to trigger fetch
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("playlistUrl").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      fetchSongs();
    }
  });
  
  // Add dynamic particles
  createFloatingParticles();
});

// Create floating particles dynamically
function createFloatingParticles() {
  const particleContainer = document.querySelector('.particles');
  
  setInterval(() => {
    if (document.querySelectorAll('.particle').length < 10) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: ${Math.random() > 0.5 ? '#1DB954' : '#ff6b35'};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        pointer-events: none;
        animation: floatUp ${Math.random() * 10 + 15}s linear forwards;
        opacity: ${Math.random() * 0.7 + 0.3};
      `;
      
      particleContainer.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 25000);
    }
  }, 2000);
}

// Add sparkle effects to buttons
function addSparkleEffects() {
  const buttons = document.querySelectorAll('.download-btn:not([disabled])');
  
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      createSparkles(this);
    });
  });
}

function createSparkles(element) {
  const rect = element.getBoundingClientRect();
  
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: #fff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      left: ${rect.left + Math.random() * rect.width}px;
      top: ${rect.top + Math.random() * rect.height}px;
      animation: sparkle 1s ease-out forwards;
    `;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 1000);
  }
}

// Add CSS for floating particles and sparkles
const additionalStyles = `
  @keyframes floatUp {
    0% { 
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { 
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes sparkle {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: scale(1) rotate(180deg);
      opacity: 1;
    }
    100% {
      transform: scale(0) rotate(360deg);
      opacity: 0;
    }
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);