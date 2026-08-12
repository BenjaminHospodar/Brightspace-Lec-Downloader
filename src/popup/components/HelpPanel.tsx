import { ClipboardCopy, Download, Github, MonitorPlay } from "lucide-react";
import { InstructionList } from "./InstructionList";

const steps = [
  {
    icon: MonitorPlay,
    title: "Open your lecture",
  },
  {
    icon: ClipboardCopy,
    title: "Copy debug info",
    detail: 'Right-click the player → "Copy debug info"',
  },
  {
    icon: Download,
    title: "Download",
    detail: "Tap Download on the Clipboard tab below",
  },
];

export function HelpPanel() {
  return (
    <div
      className="animate-fade-in rounded-lg border border-theme-border border-l-[3px] border-l-carleton-accent bg-theme-surface px-2.5 py-2"
      role="region"
      aria-label="Instructions"
    >
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-carleton-red">
        Quick start
      </p>
      <InstructionList steps={steps} compact />
      <a
        className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-theme-muted transition-colors hover:text-carleton-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carleton-red/40 focus-visible:ring-offset-1"
        href="https://github.com/BenjaminHospodar/Carleton-Lecture-Downloader"
        target="_blank"
        rel="noreferrer"
      >
        <Github className="h-3 w-3" aria-hidden="true" />
        GitHub
      </a>
    </div>
  );
}
