import { MESSAGE_TYPES, MESSAGES } from "./constants.js";
import { renderMessage, showOutput } from "./ui.js";
import {
  validateJsonInput,
  extractKsToken,
  buildDownloadUrl,
} from "./validator.js";

export async function processDownload(input) {
  const inputText = input.trim();

  showOutput(MESSAGE_TYPES.LOADING, MESSAGES.PROCESSING);

  const validation = validateJsonInput(inputText);
  if (!validation.valid) {
    renderMessage(
      MESSAGE_TYPES.ERROR,
      MESSAGES[validation.error].title,
      MESSAGES[validation.error].text,
    );
    return false;
  }

  const { partnerId, entryId, manifestUrl } = validation.data;

  const ksToken = extractKsToken(manifestUrl);
  if (!ksToken) {
    renderMessage(
      MESSAGE_TYPES.ERROR,
      MESSAGES.INVALID_MANIFEST.title,
      MESSAGES.INVALID_MANIFEST.text,
    );
    return false;
  }

  const downloadUrl = buildDownloadUrl(partnerId, entryId, ksToken);

  renderMessage(
    MESSAGE_TYPES.PROCESSING,
    MESSAGES.PROCESSING_DOWNLOAD.title,
    MESSAGES.PROCESSING_DOWNLOAD.text,
  );

  try {
    const res = await fetch(downloadUrl, { method: "HEAD" });
    if (!res.ok) throw new Error(`Failed to fetch video: ${res.statusText}`);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "lecture.mp4";
    document.body.appendChild(link);
    link.click();
    link.remove();

    renderMessage(
      MESSAGE_TYPES.SUCCESS,
      MESSAGES.DOWNLOAD_COMPLETE.title,
      MESSAGES.DOWNLOAD_COMPLETE.text,
    );
    return true;
  } catch (err) {
    renderMessage(
      MESSAGE_TYPES.ERROR,
      MESSAGES.DOWNLOAD_FAILED.title,
      err.message || "Could not reach the video server.",
    );
    console.error("Download Error:", err);
    return false;
  }
}
