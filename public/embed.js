/**
 * FormCraft Chatbot Widget Embed Script
 * Embed on any website by adding:
 * <script src="https://your-domain.com/embed.js" data-form-id="YOUR_FORM_ID" defer></script>
 */
(function () {
  "use strict";

  // Prevent multiple initializations
  if (window.__FORMCRAFT_INITIALIZED__) return;
  window.__FORMCRAFT_INITIALIZED__ = true;

  // Locate the script tag to extract data attributes
  const currentScript =
    document.currentScript ||
    (function () {
      const scripts = document.getElementsByTagName("script");
      for (let i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src && scripts[i].src.includes("embed.js")) {
          return scripts[i];
        }
      }
      return null;
    })();

  const scriptSrc = currentScript ? currentScript.src : window.location.origin;
  const baseUrl = (function () {
    try {
      const url = new URL(scriptSrc);
      return url.origin;
    } catch (e) {
      return window.location.origin;
    }
  })();

  const config = window.FormCraftConfig || {};
  const formId =
    currentScript?.getAttribute("data-form-id") ||
    config.formId ||
    new URLSearchParams(window.location.search).get("formId");

  if (!formId) {
    console.warn("[FormCraft] Missing data-form-id attribute on script tag.");
    return;
  }

  const themeColor = currentScript?.getAttribute("data-color") || config.themeColor || "#4f46e5";
  const position = currentScript?.getAttribute("data-position") || config.position || "right"; // "right" or "left"

  // Inject widget CSS
  const style = document.createElement("style");
  style.textContent = `
    .formcraft-widget-container {
      position: fixed;
      bottom: 24px;
      ${position === "left" ? "left: 24px;" : "right: 24px;"}
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .formcraft-launcher-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${themeColor};
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      color: white;
      outline: none;
    }
    .formcraft-launcher-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 16px 30px -5px rgba(0, 0, 0, 0.3);
    }
    .formcraft-launcher-btn:active {
      transform: scale(0.96);
    }
    .formcraft-iframe-wrapper {
      position: fixed;
      bottom: 96px;
      ${position === "left" ? "left: 24px;" : "right: 24px;"}
      width: 410px;
      height: 620px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 120px);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.08);
      background: #ffffff;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 999998;
    }
    .formcraft-iframe-wrapper.is-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    .formcraft-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
    @media (max-width: 480px) {
      .formcraft-iframe-wrapper {
        bottom: 0;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
      }
      .formcraft-widget-container.is-open {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  // Create elements
  const container = document.createElement("div");
  container.className = "formcraft-widget-container";

  const button = document.createElement("button");
  button.className = "formcraft-launcher-btn";
  button.setAttribute("aria-label", "Open Form Chatbot");
  button.innerHTML = `
    <svg id="formcraft-icon-chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
    </svg>
    <svg id="formcraft-icon-close" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  const iframeWrapper = document.createElement("div");
  iframeWrapper.className = "formcraft-iframe-wrapper";

  const iframe = document.createElement("iframe");
  iframe.className = "formcraft-iframe";
  iframe.src = `${baseUrl}/embed/${formId}`;
  iframe.title = "FormCraft Chatbot";
  iframe.allow = "clipboard-write";

  iframeWrapper.appendChild(iframe);
  container.appendChild(button);
  document.body.appendChild(iframeWrapper);
  document.body.appendChild(container);

  let isOpen = false;

  function toggleWidget() {
    isOpen = !isOpen;
    if (isOpen) {
      iframeWrapper.classList.add("is-open");
      container.classList.add("is-open");
      document.getElementById("formcraft-icon-chat").style.display = "none";
      document.getElementById("formcraft-icon-close").style.display = "block";
    } else {
      iframeWrapper.classList.remove("is-open");
      container.classList.remove("is-open");
      document.getElementById("formcraft-icon-chat").style.display = "block";
      document.getElementById("formcraft-icon-close").style.display = "none";
    }
  }

  button.addEventListener("click", toggleWidget);

  // Listen for messages from inside the iframe (e.g. close request)
  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "FORMCRAFT_CLOSE") {
      if (isOpen) toggleWidget();
    }
  });
})();
