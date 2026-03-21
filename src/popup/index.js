import { hideOutput } from "./ui.js";
import { setupEventListeners } from "./events.js";

document.addEventListener("DOMContentLoaded", () => {
  hideOutput();
  setupEventListeners();
});
