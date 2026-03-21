import { CONFIG } from "./constants.js";

export function validateJsonInput(inputText) {
  if (!inputText.trim())
    return { valid: false, error: "EMPTY_INPUT", data: null };

  let data;
  try {
    data = JSON.parse(inputText);
  } catch {
    return { valid: false, error: "INVALID_JSON", data: null };
  }

  const missingFields = CONFIG.REQUIRED_FIELDS.filter((field) => !data[field]);
  if (missingFields.length)
    return { valid: false, error: "MISSING_FIELDS", data: null };

  return { valid: true, error: null, data };
}

export function extractKsToken(manifestUrl) {
  const match = manifestUrl.match(CONFIG.KS_TOKEN_PATTERN);
  return match ? match[1] : null;
}

export function buildDownloadUrl(partnerId, entryId, ksToken) {
  return `${CONFIG.KALTURA_API}/p/${partnerId}/sp/${partnerId}00/playManifest/entryId/${entryId}/format/download/protocol/https/ks/${ksToken}/video.mp4`;
}
