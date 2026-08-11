# 🤵🏻‍♂️ Alfred

**Alfred** is a local full-stack application for downloading YouTube audio as MP3, with a web interface and automatic metadata enrichment using [MusicBrainz](https://musicbrainz.org/).

The project combines a **React + TypeScript frontend** with a **Python backend**, integrating external services and tools to automate the entire workflow from search to metadata processing.

---

## 🏗️ Architecture

Alfred is structured as a local full-stack application:

```text
┌──────────────────────────┐
│      React + Vite        │
│         Frontend         │
└────────────┬─────────────┘
             │ HTTP
             ▼
┌──────────────────────────┐
│        Flask API         │
└────────────┬─────────────┘
             │
       ┌─────┼──────────────┐
       ▼     ▼              ▼
   Download Metadata       Search
    Engine   Engine        Engine
       │        │             │
     FFmpeg  MusicBrainz   Selenium
```

The backend separates the main responsibilities into dedicated engines:

- **Download Engine** — downloads and converts audio to MP3.
- **Metadata Engine** — retrieves and applies metadata using MusicBrainz.
- **Search Engine** — searches for content using Selenium as a fallback.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Python
- Flask
- Selenium

### Integrations & Tools

- FFmpeg
- MusicBrainz
- yt-dlp

---

## ✨ Technical Highlights

- Full-stack architecture with separate frontend and backend applications
- React + TypeScript frontend
- Python backend using Flask
- Separation of download, metadata and search responsibilities
- Automatic metadata enrichment through MusicBrainz
- Audio conversion using FFmpeg
- Selenium-based search fallback
- Local development environment with independent frontend and API processes

---

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- [FFmpeg](https://ffmpeg.org/download.html) installed and available in `PATH`
- Google Chrome installed (used by Selenium as a fallback)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/LucasMpa/alfred-bot.git
cd alfred-bot
```

### 2. Backend — Python

Create and activate a virtual environment:

```bash
python -m venv venv
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

**Windows:**

```bash
venv\Scripts\activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Frontend — Node.js

Install the frontend dependencies:

```bash
cd client
npm install
```

---

## 🌐 Optional Local Domain

You can access Alfred through:

```text
http://alfred.bot
```

instead of `http://localhost`.

Add the following entry to your system's hosts file:

```text
127.0.0.1 alfred.bot
```

### Hosts file locations

| OS | File |
| --- | --- |
| macOS/Linux | `/etc/hosts` |
| Windows | `C:\Windows\System32\drivers\etc\hosts` |

**macOS/Linux:**

```bash
echo "127.0.0.1 alfred.bot" | sudo tee -a /etc/hosts
```

---

## ▶️ Running the Application

Open **two terminals** from the project root.

### Terminal 1 — API

Activate the virtual environment if necessary:

**macOS/Linux:**

```bash
source venv/bin/activate
```

**Windows:**

```bash
venv\Scripts\activate
```

Start the Flask API:

```bash
python api.py
```

The API will be available at:

```text
http://localhost:8000
```

### Terminal 2 — Frontend

```bash
cd client
```

Start the development server:

**macOS/Linux:**

```bash
sudo npm run dev
```

**Windows:**

```bash
npm run dev
```

The frontend will be available at:

```text
http://alfred.bot
```

or:

```text
http://localhost
```

depending on your local configuration.

---

## 📁 Project Structure

```text
alfred-bot/
├── api.py                        # Flask API
├── requirements.txt
├── src/
│   └── engines/
│       ├── download_engine.py    # Download and MP3 conversion
│       ├── metadata_engine.py    # MusicBrainz metadata processing
│       └── search_engine.py      # Selenium-based search fallback
└── client/                       # React + Vite frontend
    ├── src/
    │   ├── App.tsx
    │   ├── api.ts
    │   ├── types.ts
    │   └── components/
    └── vite.config.ts
```

---

## 🎯 Project Goals

Alfred started as a personal automation project and evolved into an opportunity to explore:

- Full-stack application development
- Frontend/backend separation
- External service integration
- Media processing
- Python development
- Web automation
- Modular backend design

The project is intentionally local and focused on the development experience rather than production deployment.

---

## 📌 Status

This is a personal project and is not intended to be a production-grade media service.

The codebase is mainly maintained as a practical project for experimentation, learning and exploring different approaches to full-stack development.
