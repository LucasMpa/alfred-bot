
# Alfred Bot

Alfred Bot is a simple web scraper bot that searches for songs on YouTube and downloads audio files using `yt-dlp`.

## Features
- Searches for songs on YouTube.
- Downloads audio files in `.mp3` format.
- Saves downloads in the `downloads` directory.

## Prerequisites

Before running the bot, make sure you have the following installed:

- Python 3.6+
- `yt-dlp` library

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/lucasmpa/alfred-bot.git
   cd alfred-bot
   ```

2. **Create a virtual environment (optional but recommended):**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

## Usage

To run the bot, use the following command:

```bash
python bot.py
```

The bot will search for songs on YouTube based on the input you provide and download the audio files into the `downloads` directory.

## Project Structure

- `bot.py` - The main entry point of the bot.
- `src/engines/download_engine.py` - Handles the downloading of audio files.
- `src/engines/search_engine.py` - Manages the search functionality on YouTube.
- `downloads/` - Directory where the downloaded audio files are stored.
