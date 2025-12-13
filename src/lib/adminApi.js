// src/lib/adminapi.js
import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// export bernama 'api' yang dipakai AdminLogin.jsx
export const api = axios.create({
  baseURL: `${API_ROOT}/admin`, // -> http://localhost:5000/api/admin
});

// export untuk produk
export const adminProductsApi = axios.create({
  baseURL: `${API_ROOT}/admin/products`,
});

// pasang interceptor token (dipakai oleh kedua instance)
function attachToken(instance) {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (!config.headers) config.headers = {};
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // biarkan browser atur Content-Type untuk FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    return config;
  });
}

attachToken(api);
attachToken(adminProductsApi);

// helper yang dipakai AdminLogin.jsx
export function saveAuth({ token, user }) {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function loadAuth() {
  return {
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "null"),
  };
}
