import axios from "axios";

const getDefaultApiUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:5000/api";
  }

  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:5000/api`;
};

// Can be overridden with VITE_API_URL; otherwise use the same hostname on backend port 5000.
const API_URL = import.meta.env.VITE_API_URL || getDefaultApiUrl();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token automatically if it exists in local storage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tech_store_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("tech_store_token");
      localStorage.removeItem("tech_store_user");
    }
    const message =
      error.response?.data?.message ||
      (error.request
        ? "Could not connect to the API server. Please make sure the backend is running."
        : "An unexpected error occurred.");
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
