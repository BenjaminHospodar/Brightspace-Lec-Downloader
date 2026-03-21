<div align="center">

# Carleton Lecture Downloader

**A lightweight Chrome extension for downloading lecture videos from Brightspace and Mediaspace.**

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Install-CC0000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/iokaghgiknoaonaimicjdjgjmcmpjeno?utm_source=item-share-cb)
[![License: MIT](https://img.shields.io/badge/License-MIT-222222?style=for-the-badge)](LICENSE)

![Extension Preview](docs/img/banner.png)

</div>

---

## Overview

Carleton Lecture Downloader lets you save Brightspace and Mediaspace lecture recordings directly to your computer. Copy the video's debug info, click the extension, and download — no sign-in, no tracking, no data collection.

## Features

| Feature                 | Description                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| **Auto Download**       | Automatically pulls debug info from your clipboard to initiate a high-quality download.            |
| **Manual Mode**         | Use this as a backup if Auto Mode fails, manually paste your link or data to trigger the download. |
| **Fast & Lightweight**  | Minimal footprint — no background processes or heavy dependencies.                                 |
| **No Sign-in Required** | Works out of the box with zero account or registration steps.                                      |
| **Privacy First**       | No user data is collected, stored, or transmitted.                                                 |

## Installation

### Chrome Web Store (Recommended)

1. Visit the **[Chrome Web Store listing](https://chromewebstore.google.com/detail/iokaghgiknoaonaimicjdjgjmcmpjeno?utm_source=item-share-cb)**.
2. Click **"Add to Chrome"**.
3. The extension icon will appear in your toolbar.

### Manual Installation (Developer Mode)

1. **Clone** this repository:
   ```
   git clone https://github.com/BenjaminHospodar/Carleton-Lecture-Downloader.git
   ```
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **"Load unpacked"** and select the cloned `Carleton-Lecture-Downloader` folder (the one containing `manifest.json`).
5. The extension will appear in your toolbar.

## Usage

### Auto Download (Recommended)

1. Navigate to a Brightspace or Mediaspace page with the lecture video.
2. Right-click the video player and select **"Copy debug info"**.

   ![Copy Debug Info](docs/gifs/copy-debug-info.png)

3. Click the extension icon in your toolbar.
4. Click **"Auto Download"**.
5. The video downloads automatically.

   ![Auto Download](docs/gifs/auto-download.png)

### Manual Download (Choose Quality)

1. Right-click the video player and select **"Copy debug info"** (same as above).
2. Open the extension and switch to the **Manual** tab.
3. Paste the debug info into the text box.
4. Click **"Download"**.

   ![Manual Paste](docs/gifs/manual-paste.png)

## Project Structure

```
Carleton-Lecture-Downloader/
├── manifest.json
├── pages/
│   └── popup.html
├── src/
│   └── popup/
│       ├── index.js          # Entry point
│       ├── constants.js      # Config & message strings
│       ├── events.js         # Tab switching & button handlers
│       ├── download.js       # Fetch & download logic
│       ├── validator.js      # JSON validation & URL building
│       └── ui.js             # DOM refs & render helpers
├── static/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── bootstrap-icons.min.css
│   │   └── popup-styles.css
│   ├── fonts/
│   │   ├── bootstrap-icons.woff2
│   │   └── bootstrap-icons.woff
│   └── img/
│       └── 128.png
├── docs/
│   └── img/
├── LICENSE
└── README.md
```

## Troubleshooting

| Problem                     | Solution                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------- |
| **Clipboard access denied** | Use Manual mode — paste the debug info directly.                                   |
| **JSON error**              | Ensure you copied the correct debug info from the video player's right-click menu. |
| **Download fails**          | Check your internet connection and verify the video is accessible in your browser. |

## Support

- **Bug Reports** — [Open an issue](https://github.com/BenjaminHospodar/Carleton-Lecture-Downloader/issues)
- **Questions** — [Start a discussion](https://github.com/BenjaminHospodar/Carleton-Lecture-Downloader/discussions)

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

**© 2026 Benjamin Hospodar**

</div>
