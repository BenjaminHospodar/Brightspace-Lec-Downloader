import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { applyTheme, readStoredTheme } from "./hooks/useTheme";
import "../styles/index.css";

const root = document.getElementById("root")!;

readStoredTheme().then((theme) => {
  applyTheme(theme);
  createRoot(root).render(
    <StrictMode>
      <App initialTheme={theme} />
    </StrictMode>,
  );
});
