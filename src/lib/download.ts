import { MESSAGE_TYPES, MESSAGES } from "./constants";
import {
  validateJsonInput,
  extractKsToken,
  buildDownloadUrl,
  resolveDownloadFilename,
} from "./validator";
import type { StatusState } from "./types";

const DOWNLOAD_WAIT_TIMEOUT_MS = 5 * 60 * 1000;

function startChromeDownload(url: string, filename?: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const options: chrome.downloads.DownloadOptions = { url, saveAs: false };
    if (filename) {
      options.filename = filename;
    }

    chrome.downloads.download(options, (downloadId) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (downloadId === undefined) {
        reject(new Error("Download failed to start."));
        return;
      }

      resolve(downloadId);
    });
  });
}

function waitForDownloadComplete(downloadId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = (listener: (delta: chrome.downloads.DownloadDelta) => void) => {
      clearTimeout(timeoutId);
      chrome.downloads.onChanged.removeListener(listener);
    };

    const settle = (
      listener: (delta: chrome.downloads.DownloadDelta) => void,
      outcome: "resolve" | "reject",
      error?: Error,
    ) => {
      if (settled) return;
      settled = true;
      cleanup(listener);
      if (outcome === "resolve") {
        resolve();
      } else {
        reject(error ?? new Error("Download was interrupted."));
      }
    };

    const listener = (delta: chrome.downloads.DownloadDelta) => {
      if (delta.id !== downloadId) return;

      if (delta.state?.current === "complete") {
        settle(listener, "resolve");
      } else if (delta.state?.current === "interrupted") {
        settle(
          listener,
          "reject",
          new Error(delta.error?.current || "Download was interrupted."),
        );
      }
    };

    const timeoutId = setTimeout(() => {
      settle(
        listener,
        "reject",
        new Error(
          "Download is still in progress. Check Chrome's download tray.",
        ),
      );
    }, DOWNLOAD_WAIT_TIMEOUT_MS);

    chrome.downloads.onChanged.addListener(listener);

    chrome.downloads.search({ id: downloadId }, (results) => {
      if (chrome.runtime.lastError || settled) return;

      const download = results[0];
      if (download?.state === "complete") {
        settle(listener, "resolve");
      } else if (download?.state === "interrupted") {
        settle(
          listener,
          "reject",
          new Error(download.error || "Download was interrupted."),
        );
      }
    });
  });
}

async function fetchContentDisposition(url: string): Promise<string | null> {
  try {
    const headResponse = await fetch(url, { method: "HEAD" });
    if (!headResponse.ok) {
      return null;
    }

    const fromHead = headResponse.headers.get("content-disposition");
    if (fromHead) {
      return fromHead;
    }

    const rangeResponse = await fetch(url, {
      headers: { Range: "bytes=0-0" },
    });

    if (rangeResponse.ok || rangeResponse.status === 206) {
      return rangeResponse.headers.get("content-disposition");
    }
  } catch {
    return null;
  }

  return null;
}

export async function processDownload(
  input: string,
  onStatus: (status: StatusState) => void,
): Promise<boolean> {
  const inputText = input.trim();

  onStatus({
    type: MESSAGE_TYPES.LOADING,
    title: MESSAGES.PROCESSING.title,
    message: MESSAGES.PROCESSING.text,
  });

  const validation = validateJsonInput(inputText);
  if (!validation.valid) {
    const message = MESSAGES[validation.error];
    onStatus({
      type: MESSAGE_TYPES.ERROR,
      title: message.title,
      message: message.text,
    });
    return false;
  }

  const { partnerId, entryId, manifestUrl, displayName } = validation.data;

  const ksToken = extractKsToken(manifestUrl);
  if (!ksToken) {
    onStatus({
      type: MESSAGE_TYPES.ERROR,
      title: MESSAGES.INVALID_MANIFEST.title,
      message: MESSAGES.INVALID_MANIFEST.text,
    });
    return false;
  }

  if (!chrome?.downloads?.download) {
    onStatus({
      type: MESSAGE_TYPES.ERROR,
      title: MESSAGES.DOWNLOAD_API_UNAVAILABLE.title,
      message: MESSAGES.DOWNLOAD_API_UNAVAILABLE.text,
    });
    return false;
  }

  const downloadUrl = buildDownloadUrl(partnerId, entryId, ksToken);

  onStatus({
    type: MESSAGE_TYPES.PROCESSING,
    title: MESSAGES.PROCESSING_DOWNLOAD.title,
    message: MESSAGES.PROCESSING_DOWNLOAD.text,
  });

  try {
    const contentDisposition = displayName
      ? null
      : await fetchContentDisposition(downloadUrl);
    const filename = resolveDownloadFilename(displayName, contentDisposition);
    const downloadId = await startChromeDownload(downloadUrl, filename);
    await waitForDownloadComplete(downloadId);

    onStatus({
      type: MESSAGE_TYPES.SUCCESS,
      title: MESSAGES.DOWNLOAD_COMPLETE.title,
      message: MESSAGES.DOWNLOAD_COMPLETE.text,
    });
    return true;
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Could not reach the video server.";
    onStatus({
      type: MESSAGE_TYPES.ERROR,
      title: MESSAGES.DOWNLOAD_FAILED.title,
      message: message || "Could not reach the video server.",
    });
    console.error("Download Error:", err);
    return false;
  }
}
