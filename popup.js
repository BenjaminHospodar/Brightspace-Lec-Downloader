// --- DOM element references ---
const jsonInput = document.getElementById("jsonInput");
const processBtn = document.getElementById("processBtn");
const autoProcessBtn = document.getElementById("autoProcessBtn");
const errorMessage = document.getElementById("errorMessage");
const output = document.getElementById("output");
const tabList = document.getElementById("myTab");
const tabPanes = document.querySelectorAll(".tab-pane");
const tabButtons = document.querySelectorAll(".nav-tabs .nav-link");

// --- Custom Tab Switching and Visibility Utility ---

/**
 * Hides or shows the shared output container based on the active tab.
 * Output is only visible on 'auto-pane' and 'manual-pane'.
 * @param {string} tabPaneId - The ID of the tab pane that is currently active (e.g., 'auto-pane').
 */
function handleTabVisibility(tabPaneId) {
  const isVisible = tabPaneId === "auto-pane" || tabPaneId === "manual-pane";

  if (isVisible) {
    output.classList.remove("d-none");
  } else {
    output.classList.add("d-none");
  }
}

/**
 * Programmatically switches the active tab and updates output visibility.
 * @param {string} paneId - The ID of the pane to switch to (e.g., 'manual-pane').
 */
function switchToTab(paneId) {
  const targetButton = document.getElementById(paneId.replace("-pane", "-tab"));

  // 1. Hide all panes and remove 'active' from all buttons
  tabPanes.forEach((pane) => {
    pane.classList.remove("show", "active");
  });
  tabButtons.forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-selected", "false");
  });

  // 2. Show the target pane and set the button as active
  const targetPane = document.getElementById(paneId);
  if (targetPane) {
    targetPane.classList.add("show", "active");
    targetButton.classList.add("active");
    targetButton.setAttribute("aria-selected", "true");
  }

  // 3. Handle output visibility
  handleTabVisibility(paneId);
}

function switchToManualTabWithError() {
  switchToTab("manual-pane");
  // Show the general error message in the output box
  errorMessage.classList.remove("d-none");
}

// --- Event Listener for Tab Clicks ---
tabButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const targetId = event.currentTarget.dataset.target;
    switchToTab(targetId);
  });
});

// Set initial visibility on load
document.addEventListener("DOMContentLoaded", () => {
  // 'auto-pane' is active by default in HTML
  handleTabVisibility("auto-pane");
});

// --- Video Processing Logic ---
function processDownload() {
  // Ensure output is visible before processing
  const currentActivePane = document.querySelector(".tab-pane.active").id;
  handleTabVisibility(currentActivePane);

  const inputText = jsonInput.value.trim();
  output.innerHTML = '<p class="small text-muted mb-0">Processing data...</p>';
  errorMessage.classList.add("d-none");

  if (!inputText) {
    output.innerHTML =
      '<p class="text-danger fw-semibold">Error: Input is empty. Please paste data in message box.</p>';
    return false;
  }

  let data;
  try {
    data = JSON.parse(inputText);
  } catch (e) {
    output.innerHTML =
      '<p class="text-danger fw-semibold">Error: Invalid JSON format.</p>';
    return false;
  }

  const { partnerId, entryId, manifestUrl } = data;
  if (!partnerId || !entryId || !manifestUrl) {
    output.innerHTML =
      '<p class="text-danger fw-semibold">Error: Missing required fields (partnerId, entryId, or manifestUrl).</p>';
    return false;
  }

  const flavorMatch = manifestUrl.match(/flavorIds\/([^\/\?]+)/);
  if (!flavorMatch) {
    output.innerHTML =
      '<p class="text-danger fw-semibold">Error: Could not extract flavorIds.</p>';
    return false;
  }

  const flavorIds = flavorMatch[1].split(",");
  const baseUrl = `https://cfvod.kaltura.com/p/${partnerId}/sp/${partnerId}00/serveFlavor/entryId/${entryId}/v/1/ev/3/flavorId/`;

  // Clear and build the output links
  output.innerHTML = "";

  const header = document.createElement("div");
  header.className = "fw-bold text-light mb-2";
  header.textContent = `Detected ${flavorIds.length} video quality option(s):`;
  output.appendChild(header);

  flavorIds.forEach((flavorId, index) => {
    const downloadUrl = `${baseUrl}${flavorId}/name/a.mp4`;

    const btn = document.createElement("button");
    btn.className = "btn btn-success btn-download";
    btn.innerHTML = `<i class="bi bi-download"></i> Download Option ${
      index + 1
    }`;

    btn.addEventListener("click", async () => {
      btn.disabled = true;

      // Show loading spinner
      const spinner = document.createElement("span");
      spinner.className = "spinner-border spinner-border-sm";
      btn.innerHTML = "";
      btn.appendChild(spinner);
      btn.appendChild(document.createTextNode(" Downloading..."));

      try {
        const res = await fetch(downloadUrl);
        if (!res.ok)
          throw new Error("Failed to fetch video: " + res.statusText);

        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${entryId}_${flavorId}.mp4`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();

        btn.classList.replace("btn-success", "btn-secondary");
        btn.innerHTML =
          '<i class="bi bi-check-circle-fill"></i> Download Complete';
      } catch (err) {
        btn.classList.replace("btn-success", "btn-danger");
        btn.innerHTML =
          '<i class="bi bi-x-octagon-fill"></i> Error Downloading';
        console.error("Download Error:", err);
      }
    });

    output.appendChild(btn);
  });

  return true; // Processing was successful (links generated)
}

// --- Event Handlers ---

// Manual Process button handler
processBtn.addEventListener("click", () => {
  processDownload();
});

// Auto Process button handler - auto-download last flavorId
autoProcessBtn.addEventListener("click", async () => {
  try {
    // 1. Paste from clipboard
    const text = await navigator.clipboard.readText();
    jsonInput.value = text;

    // Try to parse clipboard JSON. If parsing fails, fall back to normal processing UI.
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      const success = processDownload();
      if (!success) {
        switchToManualTabWithError();
      }
      return;
    }

    const { partnerId, entryId, manifestUrl } = data;
    if (!partnerId || !entryId || !manifestUrl) {
      const success = processDownload();
      if (!success) {
        switchToManualTabWithError();
      }
      return;
    }

    const flavorMatch = manifestUrl.match(/flavorIds\/([^\/\?]+)/);
    if (!flavorMatch) {
      const success = processDownload();
      if (!success) {
        switchToManualTabWithError();
      }
      return;
    }

    const flavorIds = flavorMatch[1].split(",");
    const lastFlavorId = flavorIds[flavorIds.length - 1];
    const downloadUrl = `https://cfvod.kaltura.com/p/${partnerId}/sp/${partnerId}00/serveFlavor/entryId/${entryId}/v/1/ev/3/flavorId/${lastFlavorId}/name/a.mp4`;

    // Provide immediate feedback in the output area
    output.classList.remove("error", "success");
    output.classList.add("downloading");
    output.innerHTML =
      '<div class="d-flex"><span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span><span class="small text-light">Automaticly downloading best option...</span></div>';
    handleTabVisibility("auto-pane");

    // Perform the download
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Failed to fetch video: " + res.statusText);

      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${entryId}_${lastFlavorId}.mp4`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();

      output.classList.remove("downloading", "error");
      output.classList.add("success");
      output.innerHTML =
        '<div class="d-flex align-items-center"><i class="bi bi-check-circle-fill me-2"></i><span class="fw-semibold">Download Complete</span></div>';
    } catch (err) {
      console.error("Auto Download Error:", err);
      output.classList.remove("downloading", "success");
      output.classList.add("error");
      output.innerHTML =
        '<div class="d-flex align-items-center"><i class="bi bi-x-octagon-fill me-2"></i><span class="fw-semibold">Auto download failed. Switching to Manual mode.</span></div>';
      switchToManualTabWithError();
    }
  } catch (err) {
    // Handle critical clipboard read failure (Permission denied)
    jsonInput.value = "";
    switchToManualTabWithError();
    output.classList.remove("downloading", "success");
    output.classList.add("error");
    output.innerHTML =
      '<div class="d-flex align-items-center"><i class="bi bi-x-octagon-fill me-2"></i><span>Fatal Error: Clipboard access denied. Please manually paste the data in <strong>Manual Mode</strong>.</span></div>';
    console.error("Clipboard Access Error:", err);
  }
});
