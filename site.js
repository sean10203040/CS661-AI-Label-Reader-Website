// Add the presentation's YouTube URL here when the recording is uploaded.
const PRESENTATION_URL = "";
if (PRESENTATION_URL) {
  try {
    const url = new URL(PRESENTATION_URL);
    const host = url.hostname.replace(/^www\./, "");
    const id = host === "youtu.be" ? url.pathname.slice(1) :
      ["youtube.com", "m.youtube.com"].includes(host) ?
        url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] : null;
    if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) {
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${id}`;
      frame.title = "Sean Farmer — product label reading tutorial presentation";
      frame.loading = "lazy";
      frame.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture";
      frame.allowFullscreen = true;
      const link = document.createElement("a");
      link.href = `https://www.youtube.com/watch?v=${id}`;
      link.textContent = "Watch the presentation on YouTube";
      link.style.color = "#d6ef7e";
      document.getElementById("video").replaceChildren(frame, link);
    }
  } catch { /* Keep the informative fallback if a URL has not been configured correctly. */ }
}
