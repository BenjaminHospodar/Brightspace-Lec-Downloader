import { CONFIG } from "./constants.js";

export const DOM = {
  jsonInput: document.getElementById("jsonInput"),
  processBtn: document.getElementById("processBtn"),
  autoProcessBtn: document.getElementById("autoProcessBtn"),
  output: document.getElementById("output"),
  tabPanes: document.querySelectorAll(".tab-pane"),
  tabButtons: document.querySelectorAll(".nav-tabs .nav-link"),
};

export function renderMessage(type, title, message) {
  const icons = {
    loading:
      '<span class="spinner-border spinner-border-sm text-secondary"></span>',
    processing:
      '<span class="spinner-border spinner-border-sm text-info"></span>',
    error: '<i class="bi bi-x-octagon-fill text-danger"></i>',
    success: '<i class="bi bi-check-circle-fill text-success"></i>',
  };

  const colorMap = {
    loading: "secondary",
    processing: "info",
    error: "danger",
    success: "success",
  };

  const baseStyle =
    type === "success" ? 'style="backdrop-filter: blur(10px);"' : "";
  const borderClass =
    type === "loading"
      ? ""
      : `border border-${colorMap[type]} border-opacity-25`;

  const bgClass = `bg-${colorMap[type]} bg-opacity-10`;
  const textColor = `text-${colorMap[type]}`;

  DOM.output.classList.remove("d-none");
  DOM.output.innerHTML = `
    <div class="d-flex align-items-center gap-3 p-3 rounded-3 ${bgClass} ${borderClass}" ${baseStyle}>
      ${icons[type]}
      <div>
        <span class="fw-bold ${textColor} d-block">${title}</span>
        <span class="small ${textColor} text-opacity-75">${message}</span>
      </div>
    </div>
  `;
}

export function showOutput(type, messageData) {
  DOM.output.classList.remove("d-none");
  if (type && messageData) {
    renderMessage(type, messageData.title, messageData.text);
  }
}

export function hideOutput() {
  DOM.output.classList.add("d-none");
}

export function handleTabVisibility(tabPaneId) {
  const shouldShow =
    CONFIG.VISIBLE_TABS.includes(tabPaneId) &&
    DOM.output.innerHTML.trim() !== "";
  DOM.output.classList.toggle("d-none", !shouldShow);
}

export function switchToTab(paneId) {
  const tabId = paneId.replace("-pane", "-tab");
  const targetButton = document.getElementById(tabId);

  DOM.tabPanes.forEach((pane) => pane.classList.remove("show", "active"));
  DOM.tabButtons.forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-selected", "false");
  });

  const targetPane = document.getElementById(paneId);
  if (targetPane && targetButton) {
    targetPane.classList.add("show", "active");
    targetButton.classList.add("active");
    targetButton.setAttribute("aria-selected", "true");
  }

  if (!CONFIG.VISIBLE_TABS.includes(paneId)) {
    hideOutput();
  }
}
