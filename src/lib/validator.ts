import { CONFIG } from "./constants";
import type { DebugInfo, ValidationResult } from "./types";

const NAME_FIELDS = ["name", "entryName", "title", "mediaName"] as const;
const MANIFEST_KEYS = [
  "manifestUrl",
  "manifestUri",
  "manifest",
  "playbackUrl",
  "url",
] as const;
const PARTNER_KEYS = ["partnerId", "partner_id", "partnerID", "PartnerId"] as const;
const ENTRY_KEYS = [
  "entryId",
  "entry_id",
  "entryID",
  "EntryId",
  "mediaId",
] as const;
const PARTNER_ID_PATTERN = /\/p\/(\d+)\//;
const ENTRY_ID_PATTERN = /\/entryId\/([^/]+)\//;

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

function collectValue(
  source: unknown,
  keys: readonly string[],
): string | undefined {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return undefined;
  }

  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = asNonEmptyString(record[key]);
    if (value) return value;
  }

  return undefined;
}

function isManifestUrl(value: string): boolean {
  return value.includes("/playManifest/") && value.includes("/ks/");
}

function findManifestUrl(source: unknown, depth = 0): string | undefined {
  if (depth > 10 || source === null || source === undefined) {
    return undefined;
  }

  const direct = collectValue(source, MANIFEST_KEYS);
  if (direct && isManifestUrl(direct)) {
    return direct;
  }

  if (typeof source === "string" && isManifestUrl(source)) {
    return source.trim();
  }

  if (Array.isArray(source)) {
    for (const item of source) {
      const found = findManifestUrl(item, depth + 1);
      if (found) return found;
    }
    return undefined;
  }

  if (typeof source !== "object") {
    return undefined;
  }

  for (const value of Object.values(source as Record<string, unknown>)) {
    const found = findManifestUrl(value, depth + 1);
    if (found) return found;
  }

  return undefined;
}

function findDisplayName(source: unknown, depth = 0): string | undefined {
  if (depth > 10 || source === null || source === undefined) {
    return undefined;
  }

  const direct = collectValue(source, NAME_FIELDS);
  if (direct) return direct;

  if (Array.isArray(source)) {
    for (const item of source) {
      const found = findDisplayName(item, depth + 1);
      if (found) return found;
    }
    return undefined;
  }

  if (typeof source !== "object") {
    return undefined;
  }

  for (const value of Object.values(source as Record<string, unknown>)) {
    const found = findDisplayName(value, depth + 1);
    if (found) return found;
  }

  return undefined;
}

function extractFromManifestUrl(manifestUrl: string): {
  partnerId?: string;
  entryId?: string;
} {
  return {
    partnerId: manifestUrl.match(PARTNER_ID_PATTERN)?.[1],
    entryId: manifestUrl.match(ENTRY_ID_PATTERN)?.[1],
  };
}

function normalizeDebugInfo(source: unknown): DebugInfo | null {
  const manifestUrl = findManifestUrl(source);
  if (!manifestUrl) return null;

  const fromUrl = extractFromManifestUrl(manifestUrl);
  const partnerId = collectValue(source, PARTNER_KEYS) ?? fromUrl.partnerId;
  const entryId = collectValue(source, ENTRY_KEYS) ?? fromUrl.entryId;

  if (!partnerId || !entryId) return null;

  return {
    partnerId,
    entryId,
    manifestUrl,
    displayName: findDisplayName(source),
  };
}

function ensureMp4Extension(name: string): string {
  return /\.mp4$/i.test(name) ? name : `${name}.mp4`;
}

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|]/g, "_").trim();
  return cleaned || "lecture.mp4";
}

export function parseContentDispositionFilename(
  header: string | null,
): string | null {
  if (!header) return null;

  const utf8Match = header.match(/filename\*=(?:UTF-8''|utf-8'')([^;]+)/i);
  if (utf8Match) {
    const raw = utf8Match[1].trim().replace(/^"|"$/g, "");
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  const quotedMatch = header.match(/filename="([^"]+)"/i);
  if (quotedMatch) return quotedMatch[1];

  const unquotedMatch = header.match(/filename=([^;]+)/i);
  if (unquotedMatch) return unquotedMatch[1].trim().replace(/^"|"$/g, "");

  return null;
}

export function resolveDownloadFilename(
  displayName: string | undefined,
  contentDisposition: string | null,
): string | undefined {
  const fromHeader = parseContentDispositionFilename(contentDisposition);
  if (fromHeader) {
    return sanitizeFilename(ensureMp4Extension(fromHeader));
  }

  if (displayName) {
    return sanitizeFilename(ensureMp4Extension(displayName));
  }

  return undefined;
}

export function validateJsonInput(inputText: string): ValidationResult {
  const trimmed = inputText.trim();
  if (!trimmed) {
    return { valid: false, error: "EMPTY_INPUT", data: null };
  }

  let parsed: unknown = trimmed;

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return { valid: false, error: "INVALID_JSON", data: null };
    }
  } else if (isManifestUrl(trimmed)) {
    parsed = { manifestUrl: trimmed };
  } else {
    return { valid: false, error: "INVALID_JSON", data: null };
  }

  const data = normalizeDebugInfo(parsed);
  if (!data) {
    return { valid: false, error: "MISSING_FIELDS", data: null };
  }

  return {
    valid: true,
    error: null,
    data,
  };
}

export function extractKsToken(manifestUrl: string): string | null {
  const match = manifestUrl.match(CONFIG.KS_TOKEN_PATTERN);
  return match ? match[1] : null;
}

export function buildDownloadUrl(
  partnerId: string,
  entryId: string,
  ksToken: string,
): string {
  return `${CONFIG.KALTURA_API}/p/${partnerId}/sp/${partnerId}00/playManifest/entryId/${entryId}/format/download/protocol/https/ks/${ksToken}/video.mp4`;
}
