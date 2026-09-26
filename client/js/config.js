// File previews and local web servers use the local API; deployments use same-domain API routes.
const API_BASE_URL = (location.protocol === "file:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "http://localhost:5000"
  : "";
