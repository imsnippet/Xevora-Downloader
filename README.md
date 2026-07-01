# ⚡ Xevora - High Performance Media Downloader

Xevora is a fast, clean, and private media downloader that runs entirely locally on your machine. Powered by **TanStack Start**, **React 19**, and a native **yt-dlp** extraction engine, it transforms your browser into a powerful downloading tool capable of extracting media from hundreds of sites with no external API keys or third-party servers.

**Tags:** #media-downloader #yt-dlp #tanstack-start #react19 #typescript #tailwind-css #modern-ui #neon-aesthetics #high-performance #local-extraction

## 🌟 Features

- ⚡ **Local Extraction**: Downloads directly using `yt-dlp` on your local server. No external APIs, no usage limits, no registration.
- 🎨 **Modern Glassmorphic UI**: Sleek neon elements, custom glassmorphism panels, and highly interactive micro-animations.
- ☀️ **Fixed Light Mode**: Forced clean, high-contrast light mode layout for maximum clarity and aesthetic appeal.
- 📏 **Enhanced UI Scaling**: Comfortably scaled typography (125% global font size) for easier reading and layout accessibility.
- 📊 **Smart Format Filtering**:
  - Filters out streaming playlists like HLS (`.m3u8`), DASH (`.mpd`), and `mhtml` formats.
  - Filters out low-quality thumbnails and video formats below **240p**.
  - Keeps high resolutions (720p, 1080p, 1440p) up to **4K and 8K** if available.
- 🎵 **Audio Extraction**: Instantly isolate high-quality audio files (MP3/M4A) from any video source.
- 🔒 **Privacy First**: No tracking, logs, cookies, or external metrics. Your searches and downloads stay on your local server.

## 🛠️ Technology Stack

**Frontend:** React 19, TypeScript, Tailwind CSS, Motion (framer-motion), Lucide Icons  
**UI Design:** Modern light-theme glassmorphism, glowing borders, custom typography  
**Backend & Routing:** TanStack Start, TanStack Router (SSR-first React meta-framework)  
**Extraction Engine:** `youtube-dl-exec` wrapper around `yt-dlp` (fully automated binary deployment)  
**Build Tool:** Vite

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **NPM** (or Bun / Yarn)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imsnippet/Xevora-Downloader.git
   
   cd Xevora-Downloader
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(On install, `youtube-dl-exec` automatically pulls the correct `yt-dlp` binary for your OS).*

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   - Navigate to `http://localhost:3000` (or the port specified in your console).
   - Paste a video link and download!

## 📊 How It Works

### Architecture
Xevora utilizes a full-stack **TanStack Start** architecture:

1. **Client Interface**: React components submit video URLs to the backend API route.
2. **Local API Handler**: The server endpoint (`/api/public/analyze`) intercepts the request.
3. **Execution Engine**: Spawns a native `yt-dlp` child process locally to query format metadata.
4. **Format Normalizer**: Normalizes raw `yt-dlp` output to clean JSON and serves it back to the client interface.

### Format Filtering
To avoid cluttered and non-functional download links, Xevora filters options:
- **Manifest Filtering**: Excludes `.m3u8`, `.mpd`, and `.mhtml` files since they cannot be downloaded as standalone video files.
- **Resolution Range**: Valid video formats are constrained to heights of **240p and above**, ensuring high-definition options (including 4K/8K) are prioritized while avoiding sub-240p low-quality streams.
- **Audio Preservation**: Standard audio-only formats are preserved so you can retrieve track-only versions.

## 🔒 Privacy

- ✅ All processing happens **locally on your machine** or your private server.
- ✅ No data is sent to external downloader services or third-party APIs.
- ✅ No tracking, cookies, database logging, or analytics.
- ✅ Direct connection between your server and the media platform.

## 📦 Testing

> 🧪 **Live Demo**: https://xevora-downloader.netlify.app/

---

## 👨‍💻 Developed By

Developed with ❤️ by **Subhan Kashif**.
