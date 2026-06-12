const DEFAULT_API_URL = typeof window !== "undefined"
  ? `${window.location.protocol}//${window.location.hostname}:4000`
  : "http://localhost:4000";

const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

export function getToken() {
  return localStorage.getItem("token");
}

export function setSession(session) {
  localStorage.setItem("token", session.token);
  localStorage.setItem("user", JSON.stringify(session.user));
}

export function getStoredUser() {
  const value = localStorage.getItem("user");
  return value ? JSON.parse(value) : null;
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud.");
  }
  return data;
}

export function formatMoney(cents) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format((cents || 0) / 100);
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
