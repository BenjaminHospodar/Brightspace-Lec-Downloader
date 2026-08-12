import { HelpCircle, Moon, Sun } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

interface HeaderProps {
  showHelp: boolean;
  theme: Theme;
  onToggleHelp: () => void;
  onToggleTheme: () => void;
}

const iconButtonClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carleton-accent/60";

export function Header({
  showHelp,
  theme,
  onToggleHelp,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="w-full bg-[#181818]">
      <div className="h-1 bg-carleton-accent" aria-hidden="true" />

      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <img
          src={chrome.runtime.getURL("icons/128.png")}
          alt=""
          className="h-7 w-7 shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1 border-l border-white/15 pl-2.5">
          <p className="truncate text-[11px] font-bold uppercase leading-tight tracking-wide text-white">
            Carleton University
          </p>
          <h1 className="truncate text-xs font-semibold leading-tight text-white/75">
            Lecture Downloader
          </h1>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
          }
          className={iconButtonClass}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={onToggleHelp}
          aria-label={showHelp ? "Hide instructions" : "Show instructions"}
          aria-expanded={showHelp}
          className={iconButtonClass}
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
