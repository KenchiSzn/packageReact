import axios from "axios";
import Cookies from "universal-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5008/api/v1",
});

api.interceptors.request.use((config) => {
  const token = new Cookies().get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
