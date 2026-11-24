import { getToken } from "./session";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");
const trimLeadingSlash = (value) => value.replace(/^\/+/, "");

// Demo builds (GitHub Pages) have no backend: requests are answered from a
// bundled catalog and images are served next to the app.
export const DEMO_MODE = import.meta.env.VITE_DEMO === "true";

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
);

export const ASSET_BASE_URL = trimTrailingSlash(
  DEMO_MODE
    ? import.meta.env.BASE_URL
    : import.meta.env.VITE_ASSET_BASE_URL || "http://127.0.0.1:8000",
);

// Where the Laravel admin panel lives. Local and Docker builds serve it from the
// API host; the static demo has no backend, so it only links there when told to.
export const ADMIN_URL = trimTrailingSlash(
  import.meta.env.VITE_ADMIN_URL || (DEMO_MODE ? "" : `${ASSET_BASE_URL}/admin`),
);

export const apiUrl = (path) =>
  `${API_BASE_URL}/${trimLeadingSlash(String(path))}`;

export const assetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  return encodeURI(`${ASSET_BASE_URL}/${trimLeadingSlash(String(path))}`);
};

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    // Laravel validation errors: { field: ["message"] }
    this.errors = errors;
  }

  /** First message for a field, e.g. error.field("email"). */
  field(name) {
    return this.errors?.[name]?.[0];
  }
}

/**
 * fetch() wrapper for the Laravel API. `json` sends a JSON body; the signed-in
 * customer's token is attached automatically. Throws ApiError on failure.
 */
export const requestJson = async (url, { json, method, headers, ...options } = {}) => {
  const verb = (method || (json ? "POST" : "GET")).toUpperCase();

  if (DEMO_MODE) {
    if (verb !== "GET") {
      throw new ApiError("This demo has no backend, so accounts and checkout are turned off.", 503);
    }
    const { demoRequest } = await import("../demo/api.js");
    return demoRequest(url);
  }

  const token = getToken();
  let response;
  try {
    response = await fetch(url, {
      ...options,
      method: verb,
      body: json ? JSON.stringify(json) : options.body,
      headers: {
        Accept: "application/json",
        ...(json ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError("We couldn't reach the store. Check your connection and try again.", 0);
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    let errors = {};

    try {
      const body = await response.json();
      message = body.message || message;
      errors = body.errors || {};
    } catch {
      // The server did not return JSON, so the status-based message is safest.
    }

    throw new ApiError(message, response.status, errors);
  }

  return response.json();
};
