import { ClipboardPaste, FileJson } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { TabId } from "../../lib/types";

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof ClipboardPaste }[] = [
  { id: "auto", label: "Clipboard", icon: ClipboardPaste },
  { id: "manual", label: "Paste", icon: FileJson },
];

type IndicatorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement>>>({});
  const [indicatorRect, setIndicatorRect] = useState<IndicatorRect | null>(null);

  const activeIndex = Math.max(
    0,
    tabs.findIndex(({ id }) => id === activeTab),
  );

  const updateIndicator = useCallback(() => {
    const tab = tabRefs.current[activeTab];
    if (!tab) return;

    setIndicatorRect({
      left: tab.offsetLeft,
      top: tab.offsetTop,
      width: tab.offsetWidth,
      height: tab.offsetHeight,
    });
  }, [activeTab]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(container);
    return () => observer.disconnect();
  }, [updateIndicator]);

  const focusTab = (index: number) => {
    const tab = tabs[index];
    onTabChange(tab.id);
    document.getElementById(`${tab.id}-tab`)?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (activeIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    focusTab(nextIndex);
  };

  return (
    <div
      ref={containerRef}
      className="glass-segment relative flex gap-0.5 rounded-xl p-1"
      role="tablist"
      aria-label="Download mode"
      onKeyDown={handleKeyDown}
    >
      {indicatorRect && (
        <div
          className="glass-tab-indicator pointer-events-none absolute rounded-lg transition-[left,top,width,height] duration-300 ease-out"
          style={indicatorRect}
          aria-hidden="true"
        />
      )}

      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            ref={(element) => {
              tabRefs.current[id] = element ?? undefined;
            }}
            type="button"
            id={`${id}-tab`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${id}-pane`}
            tabIndex={isActive ? 0 : -1}
            className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carleton-red/40 ${
              isActive ? "text-carleton-red" : "text-theme-muted hover:text-theme-text"
            }`}
            onClick={() => onTabChange(id)}
          >
            <Icon
              className={`h-3.5 w-3.5 transition-transform duration-300 ease-out ${isActive ? "scale-110" : "scale-100"}`}
              aria-hidden="true"
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
