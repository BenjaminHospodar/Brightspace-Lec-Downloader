import { Clipboard, Download } from "lucide-react";
import { Button } from "./Button";

interface AutoTabProps {
  onAutoDownload: () => void;
  isLoading?: boolean;
}

export function AutoTab({ onAutoDownload, isLoading = false }: AutoTabProps) {
  return (
    <div id="auto-pane" role="tabpanel" aria-labelledby="auto-tab">
      <div className="mb-3 flex items-start gap-2 rounded-md border border-theme-border bg-theme-surface/40 px-2.5 py-2">
        <Clipboard
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-theme-muted"
          aria-hidden="true"
        />
        <p className="text-xs leading-relaxed text-theme-muted">
          Reads debug info from your clipboard and downloads the lecture as an
          MP4. Use the Paste tab if clipboard access is blocked.
        </p>
      </div>

      <Button
        fullWidth
        icon={<Download className="h-4 w-4" aria-hidden="true" />}
        isLoading={isLoading}
        onClick={onAutoDownload}
      >
        Download
      </Button>
    </div>
  );
}
