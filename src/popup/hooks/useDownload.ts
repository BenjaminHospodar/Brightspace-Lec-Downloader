import { useCallback, useRef, useState } from "react";
import { processDownload } from "../../lib/download";
import { MESSAGE_TYPES, MESSAGES } from "../../lib/constants";
import type { StatusState, TabId } from "../../lib/types";

export function useDownload() {
  const [activeTab, setActiveTab] = useState<TabId>("auto");
  const [status, setStatus] = useState<StatusState | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const downloadInFlightRef = useRef(false);

  const handleDownload = useCallback(async (input: string) => {
    if (downloadInFlightRef.current) return;
    downloadInFlightRef.current = true;
    try {
      await processDownload(input, setStatus);
    } finally {
      downloadInFlightRef.current = false;
    }
  }, []);

  const handleAutoDownload = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      await handleDownload(text);
    } catch (err) {
      setJsonInput("");
      setActiveTab("manual");
      setStatus({
        type: MESSAGE_TYPES.ERROR,
        title: MESSAGES.CLIPBOARD_ERROR.title,
        message: MESSAGES.CLIPBOARD_ERROR.text,
      });
      console.error("Clipboard Access Error:", err);
    }
  }, [handleDownload]);

  const handleManualDownload = useCallback(async () => {
    await handleDownload(jsonInput);
  }, [handleDownload, jsonInput]);

  return {
    activeTab,
    setActiveTab,
    status,
    jsonInput,
    setJsonInput,
    handleAutoDownload,
    handleManualDownload,
  };
}
