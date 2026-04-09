// src/api/axiosConfig.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://swadeshi-fit-backend.onrender.com", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor for adding tokens
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          "https://swadeshi-fit-backend.onrender.com/api/v1/users/refresh-token",
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Store new tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
