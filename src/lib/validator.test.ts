import { describe, expect, it } from "vitest";
import {
  buildDownloadUrl,
  extractKsToken,
  parseContentDispositionFilename,
  resolveDownloadFilename,
  validateJsonInput,
} from "./validator";

const MANIFEST_URL =
  "https://cdnapisec.kaltura.com/p/123456/sp/12345600/playManifest/entryId/0_abc123/format/url/protocol/https/ks/testKsToken123/video.mp4";

describe("validateJsonInput", () => {
  it("parses flat JSON with explicit fields", () => {
    const result = validateJsonInput(
      JSON.stringify({
        partnerId: "123456",
        entryId: "0_abc123",
        manifestUrl: MANIFEST_URL,
        name: "Lecture 1",
      }),
    );

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.partnerId).toBe("123456");
      expect(result.data.entryId).toBe("0_abc123");
      expect(result.data.manifestUrl).toBe(MANIFEST_URL);
      expect(result.data.displayName).toBe("Lecture 1");
    }
  });

  it("accepts numeric partnerId", () => {
    const result = validateJsonInput(
      JSON.stringify({
        partnerId: 123456,
        entryId: "0_abc123",
        manifestUrl: MANIFEST_URL,
      }),
    );

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.partnerId).toBe("123456");
    }
  });

  it("finds nested manifest URL and derives ids from it", () => {
    const result = validateJsonInput(
      JSON.stringify({
        id: "wrong-id-should-not-be-used",
        media: {
          playback: {
            manifestUrl: MANIFEST_URL,
          },
        },
        title: "Nested Lecture",
      }),
    );

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.entryId).toBe("0_abc123");
      expect(result.data.partnerId).toBe("123456");
      expect(result.data.displayName).toBe("Nested Lecture");
    }
  });

  it("accepts a raw manifest URL string", () => {
    const result = validateJsonInput(MANIFEST_URL);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.partnerId).toBe("123456");
      expect(result.data.entryId).toBe("0_abc123");
    }
  });

  it("does not treat a wrong top-level id as entryId", () => {
    const result = validateJsonInput(
      JSON.stringify({
        id: "wrong-id-should-not-be-used",
        manifestUrl: MANIFEST_URL,
      }),
    );

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.entryId).toBe("0_abc123");
      expect(result.data.entryId).not.toBe("wrong-id-should-not-be-used");
    }
  });

  it("returns MISSING_FIELDS when manifest URL is absent", () => {
    const result = validateJsonInput(
      JSON.stringify({ partnerId: "123456", entryId: "0_abc123" }),
    );

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe("MISSING_FIELDS");
    }
  });
});

describe("extractKsToken", () => {
  it("extracts the ks token from a manifest URL", () => {
    expect(extractKsToken(MANIFEST_URL)).toBe("testKsToken123");
  });

  it("returns null when ks token is missing", () => {
    expect(
      extractKsToken(
        "https://cdnapisec.kaltura.com/p/123456/sp/12345600/playManifest/entryId/0_abc123/format/url/protocol/https/video.mp4",
      ),
    ).toBeNull();
  });
});

describe("parseContentDispositionFilename", () => {
  it("parses quoted filename values", () => {
    expect(
      parseContentDispositionFilename('attachment; filename="lecture.mp4"'),
    ).toBe("lecture.mp4");
  });

  it("parses UTF-8 encoded filename values", () => {
    expect(
      parseContentDispositionFilename(
        "attachment; filename*=UTF-8''Lecture%201.mp4",
      ),
    ).toBe("Lecture 1.mp4");
  });

  it("returns null for missing headers", () => {
    expect(parseContentDispositionFilename(null)).toBeNull();
  });
});

describe("resolveDownloadFilename", () => {
  it("prefers content-disposition over display name", () => {
    expect(
      resolveDownloadFilename("Display Name", 'attachment; filename="server.mp4"'),
    ).toBe("server.mp4");
  });

  it("falls back to display name and adds mp4 extension", () => {
    expect(resolveDownloadFilename("My Lecture", null)).toBe("My Lecture.mp4");
  });

  it("sanitizes invalid filename characters", () => {
    expect(resolveDownloadFilename('Bad:Name|Here', null)).toBe(
      "Bad_Name_Here.mp4",
    );
  });
});

describe("buildDownloadUrl", () => {
  it("builds a download URL with partner, entry, and ks token", () => {
    expect(buildDownloadUrl("123456", "0_abc123", "testKsToken123")).toBe(
      "https://cdnapisec.kaltura.com/p/123456/sp/12345600/playManifest/entryId/0_abc123/format/download/protocol/https/ks/testKsToken123/video.mp4",
    );
  });
});
