document.addEventListener("DOMContentLoaded", function () {
  function styleEditorIframe(iframe) {
    if (iframe && iframe.contentDocument && !iframe.dataset.styled) {
      const doc = iframe.contentDocument;
      const rootStyles = getComputedStyle(document.documentElement);
      const bgColor = rootStyles.getPropertyValue('--config-body-background-color').trim() || '#121212';

      doc.body.style.backgroundColor = bgColor;
      doc.body.style.color = "white";

      const style = doc.createElement("style");
      style.textContent = `a { color: #aad8ff !important; }`;
      doc.head.appendChild(style);

      iframe.dataset.styled = "true";
    }
  }

  function styleDropdownIframe(iframe) {
    if (iframe && iframe.contentDocument && !iframe.dataset.styled) {
      const doc = iframe.contentDocument;
      const style = doc.createElement("style");
      style.textContent = `
        .cke_panel_listItem a,
        .cke_panel_listItem a:hover,
        .cke_panel_listItem a:focus,
        .cke_panel_listItem a:active,
        .cke_panel_listItem {
          color: black !important;
          background-color: white !important;
        }
      `;
      doc.head.appendChild(style);
      iframe.dataset.styled = "true";
    }
  }

  setInterval(() => {
    document.querySelectorAll('iframe.cke_wysiwyg_frame').forEach(styleEditorIframe);
    document.querySelectorAll('iframe.cke_panel_frame').forEach(styleDropdownIframe);
  }, 400);
});
