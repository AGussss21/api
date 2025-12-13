import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/admin/products";

export const adminProductsApi = axios.create({
  baseURL: BASE_URL,
  // jangan set default Content-Type di sini
});

// Interceptor: set Authorization, dan jika body adalah FormData -> biarkan browser set Content-Type
adminProductsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };

  // Jika body FormData, hapus Content-Type supaya browser menambahkan boundary otomatis
  if (config.data instanceof FormData) {
    if (config.headers) {
      // hapus header Content-Type jika ada
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }

  return config;
}, (error) => Promise.reject(error));

export default adminProductsApi;
