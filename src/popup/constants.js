export const CONFIG = {
  KALTURA_API: "https://cdnapisec.kaltura.com",
  KS_TOKEN_PATTERN: /\/ks\/([^/]+)/,
  REQUIRED_FIELDS: ["partnerId", "entryId", "manifestUrl"],
  VISIBLE_TABS: ["auto-pane", "manual-pane"],
};

export const MESSAGE_TYPES = {
  LOADING: "loading",
  PROCESSING: "processing",
  ERROR: "error",
  SUCCESS: "success",
};

export const MESSAGES = {
  PROCESSING: { title: "Processing data...", text: "Processing data..." },
  EMPTY_INPUT: {
    title: "Input is Empty",
    text: "Please paste data in the message box",
  },
  INVALID_JSON: { title: "Invalid Format", text: "The data is not valid JSON" },
  MISSING_FIELDS: {
    title: "Missing Fields",
    text: "Required: partnerId, entryId, manifestUrl",
  },
  INVALID_MANIFEST: {
    title: "Invalid Manifest",
    text: "Could not extract KS token",
  },
  PROCESSING_DOWNLOAD: {
    title: "Processing your download...",
    text: "Processing your download...",
  },
  DOWNLOAD_COMPLETE: { title: "Download Complete", text: "Your file is ready" },
  DOWNLOAD_FAILED: { title: "Download Failed", text: "" },
  CLIPBOARD_ERROR: {
    title: "Clipboard Error",
    text: "Clipboard access denied. Please manually paste data.",
  },
};
