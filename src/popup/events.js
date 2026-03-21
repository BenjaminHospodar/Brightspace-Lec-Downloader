import { DOM, renderMessage } from "./ui.js";
import { switchToTab } from "./ui.js";
import { processDownload } from "./download.js";
import { MESSAGE_TYPES, MESSAGES } from "./constants.js";

export function setupEventListeners() {
  DOM.tabButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const targetId = event.currentTarget.dataset.target;
      switchToTab(targetId);
    });
  });

  DOM.processBtn.addEventListener("click", () => {
    processDownload(DOM.jsonInput.value);
  });

  DOM.autoProcessBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      DOM.jsonInput.value = text;
      await processDownload(text);
    } catch (err) {
      DOM.jsonInput.value = "";
      switchToTab("manual-pane");
      renderMessage(
        MESSAGE_TYPES.ERROR,
        MESSAGES.CLIPBOARD_ERROR.title,
        "Please manually paste the JSON data in Manual Mode.",
      );
      console.error("Clipboard Access Error:", err);
    }
  });
}
