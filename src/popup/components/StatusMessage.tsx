import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { StatusState } from "../../lib/types";

interface StatusMessageProps {
  status: StatusState;
}

const typeStyles = {
  loading: {
    container: "bg-status-loading-bg",
    border: "border-theme-border",
    text: "text-status-loading-text",
  },
  processing: {
    container: "bg-status-processing-bg",
    border: "border-status-processing-border",
    text: "text-status-processing-text",
  },
  error: {
    container: "bg-status-error-bg",
    border: "border-status-error-border",
    text: "text-status-error-text",
  },
  success: {
    container: "bg-status-success-bg",
    border: "border-status-success-border",
    text: "text-status-success-text",
  },
} as const;

function StatusIcon({ type }: { type: StatusState["type"] }) {
  switch (type) {
    case "loading":
    case "processing":
      return (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-current" />
      );
    case "error":
      return <AlertCircle className="h-3.5 w-3.5 shrink-0 text-current" />;
    case "success":
      return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-status-success-icon" />;
  }
}

export function StatusMessage({ status }: StatusMessageProps) {
  const styles = typeStyles[status.type];
  const showMessage = status.message && status.message !== status.title;

  return (
    <div
      className={`flex animate-fade-in items-start gap-2 rounded-md border px-2.5 py-2 ${styles.container} ${styles.border}`}
      role="status"
      aria-live="polite"
    >
      <StatusIcon type={status.type} />
      <div className={`min-w-0 text-xs leading-snug ${styles.text}`}>
        <span className="font-semibold">{status.title}</span>
        {showMessage && (
          <span className="opacity-80"> — {status.message}</span>
        )}
      </div>
    </div>
  );
}
