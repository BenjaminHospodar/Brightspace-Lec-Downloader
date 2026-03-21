## Carleton Lecture Downloader

A lightweight Chrome extension that allows you to download lecture videos from Brightspace with ease. Choose your preferred quality and download instantly.

## Features

- **Auto Download**: One-click auto-download with the highest available quality.
- **Manual Mode**: Generate custom download links for multiple quality options.
- **Fast & Lightweight**: Minimal resource usage and optimized performance.
- **No Sign-in Required**: Works out of the box with no account or email registration needed.
- **Data Transparency**: No user data is collected. This service exists purely to make your life easier! 🙂

## Table of Contents

- [Installation](#installation)
- [Usage Instructions](#usage-instructions)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install this Chrome extension via the official **Chrome Web Store** or by manually loading the source code (developer method).

### Option 1: Chrome Web Store (Recommended)

The easiest and most secure way to install.

1.  Click the link below:
    - **[[Link to Chrome Web Store](https://chromewebstore.google.com/detail/iokaghgiknoaonaimicjdjgjmcmpjeno?utm_source=item-share-cb)]**
2.  Click **"Add to Chrome."**

### Option 2: Manual Installation (Load Unpacked)

Use this method to install the source code from this repository.

1.  **Clone or Download** this repository.
2.  Navigate to `chrome://extensions/` in your Chrome browser.
3.  Enable **Developer mode** (top-right toggle).
4.  Click **"Load unpacked"** and select the project folder that contains the `manifest.json` file.
5.  The extension will now appear in your toolbar.

## Usage Instructions

### Auto Download (Recommended)

1. Navigate to a Brightspace lecture page with a video player
2. Right-click on the video player
3. Select **"Copy debug info"** from the context menu

   ![Auto Download Step](./docs/gifs/auto-download-step-1.gif)

4. Click the extension icon in your Chrome toolbar
5. Click **"Auto Download"** button
6. The video will automatically download with the highest quality option

   ![Download Complete](./docs/gifs/auto-download-complete.gif)

### Manual Download (Choose Quality)

1. Follow steps 1-3 from Auto Download above
2. In the extension popup, navigate to the **"Manual"** tab
3. Paste the debug info into the text box

   ![Manual Mode Paste](./docs/gifs/manual-paste.gif)

4. Click **"Generate Download Links"**
5. Select your preferred quality from the available options
6. Click **"Download Option"** button for your chosen quality (higher the number, better the quality)

   ![Manual Download](./docs/gifs/manual-download.gif)

### Project Structure

```
Carleton-Lecture-Downloader/
├── static/
│   ├── css/
│   │   └── popup-styles.css
│   ├── js/
│   │   └── popup-controller.js
│   └── img/
│       ├── 128.png
│       └── Logo.svg
├── pages/
│   └── popup.html
├── manifest.json
├── README.md
└── docs/
    └── gifs/
```
### Troubleshooting

- **Clipboard access denied**: Try using Manual Mode and paste the debug info manually
- **No quality options shown**: Ensure you copied the correct debug info from the video player
- **Download fails**: Check your internet connection and that the video is publicly accessible

### Support

- **Issues**: Found a bug? [Open an issue](https://github.com/BenjaminHospodar/Brightspace-Lec-Downloader/issues)
- **Discussions**: Have a question? [Email me!](https://https://github.com/BenjaminHospodar/Carleton-Lecture-Downloader/discussions)

## License

This project is licensed under the MIT License - see LICENSE file for details.


**© 2025 Benjamin Hospodar**

