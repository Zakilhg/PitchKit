const trimTrailingSlash = (value) => value.replace(/\/+$/, "");
const trimLeadingSlash = (value) => value.replace(/^\/+/, "");

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
);

export const ASSET_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_ASSET_BASE_URL || "http://127.0.0.1:8000",
);

export const apiUrl = (path) =>
  `${API_BASE_URL}/${trimLeadingSlash(String(path))}`;

export const assetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  return encodeURI(`${ASSET_BASE_URL}/${trimLeadingSlash(String(path))}`);
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // The server did not return JSON, so the status-based message is safest.
    }

    throw new ApiError(message, response.status);
  }

  return response.json();
};
