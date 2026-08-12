export interface DebugInfo {
  partnerId: string;
  entryId: string;
  manifestUrl: string;
  displayName?: string;
}

export type MessageType = "loading" | "processing" | "error" | "success";

export type ValidationError = "EMPTY_INPUT" | "INVALID_JSON" | "MISSING_FIELDS";

export type TabId = "auto" | "manual";

export interface StatusState {
  type: MessageType;
  title: string;
  message: string;
}

export type ValidationResult =
  | { valid: true; error: null; data: DebugInfo }
  | { valid: false; error: ValidationError; data: null };
