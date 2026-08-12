import { Download } from "lucide-react";
import { Button } from "./Button";

interface ManualTabProps {
  jsonInput: string;
  onJsonInputChange: (value: string) => void;
  onManualDownload: () => void;
  isLoading?: boolean;
}

export function ManualTab({
  jsonInput,
  onJsonInputChange,
  onManualDownload,
  isLoading = false,
}: ManualTabProps) {
  return (
    <div id="manual-pane" role="tabpanel" aria-labelledby="manual-tab">
      <label htmlFor="jsonInput" className="mb-1.5 block text-xs font-medium text-theme-text">
        Debug info JSON
      </label>
      <textarea
        id="jsonInput"
        className="mb-3 w-full resize-none rounded-md border border-theme-border bg-theme-input px-2.5 py-2 font-mono text-xs text-theme-text placeholder:text-theme-subtle focus-visible:border-carleton-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carleton-red/20"
        placeholder='{"partnerId":"...","entryId":"...","manifestUrl":"..."}'
        rows={3}
        value={jsonInput}
        onChange={(e) => onJsonInputChange(e.target.value)}
      />
      <Button
        fullWidth
        icon={<Download className="h-4 w-4" aria-hidden="true" />}
        isLoading={isLoading}
        disabled={!jsonInput.trim()}
        onClick={onManualDownload}
      >
        Download
      </Button>
    </div>
  );
}
