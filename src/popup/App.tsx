import { useState } from "react";
import { Header } from "./components/Header";
import { TabNav } from "./components/TabNav";
import { AutoTab } from "./components/AutoTab";
import { ManualTab } from "./components/ManualTab";
import { HelpPanel } from "./components/HelpPanel";
import { StatusMessage } from "./components/StatusMessage";
import { useDownload } from "./hooks/useDownload";
import { useTheme, type Theme } from "./hooks/useTheme";
import { APP_VERSION } from "../lib/constants";

interface AppProps {
  initialTheme: Theme;
}

export function App({ initialTheme }: AppProps) {
  const [showHelp, setShowHelp] = useState(false);
  const { theme, toggleTheme } = useTheme(initialTheme);
  const {
    activeTab,
    setActiveTab,
    status,
    jsonInput,
    setJsonInput,
    handleAutoDownload,
    handleManualDownload,
  } = useDownload();

  const isDownloading =
    status?.type === "loading" || status?.type === "processing";

  return (
    <div className="flex w-full flex-col bg-theme-page">
      <Header
        showHelp={showHelp}
        theme={theme}
        onToggleHelp={() => setShowHelp((prev) => !prev)}
        onToggleTheme={toggleTheme}
      />

      <main className="flex flex-col gap-3 p-3">
        {showHelp && <HelpPanel />}

        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "auto" && (
          <AutoTab
            onAutoDownload={handleAutoDownload}
            isLoading={isDownloading}
          />
        )}
        {activeTab === "manual" && (
          <ManualTab
            jsonInput={jsonInput}
            onJsonInputChange={setJsonInput}
            onManualDownload={handleManualDownload}
            isLoading={isDownloading}
          />
        )}

        {status && <StatusMessage status={status} />}
      </main>

      <footer className="border-t border-theme-border px-3 py-1.5 text-center text-[10px] text-theme-subtle">
        v{APP_VERSION}
      </footer>
    </div>
  );
}
