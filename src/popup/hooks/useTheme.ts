import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "dark";

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readLocalTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore quota / privacy errors in popup context.
  }

  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.set({ [STORAGE_KEY]: theme });
  }
}

export function readStoredTheme(): Promise<Theme> {
  const localTheme = readLocalTheme();

  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return Promise.resolve(localTheme);
  }

  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        resolve(localTheme);
        return;
      }

      const stored = result[STORAGE_KEY];
      if (stored === "light" || stored === "dark") {
        try {
          localStorage.setItem(STORAGE_KEY, stored);
        } catch {
          // Ignore localStorage sync failures.
        }
        resolve(stored);
        return;
      }

      chrome.storage.local.set({ [STORAGE_KEY]: localTheme });
      resolve(localTheme);
    });
  });
}

export function useTheme(initialTheme?: Theme) {
  const [theme, setThemeState] = useState<Theme>(
    () => initialTheme ?? readLocalTheme(),
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
