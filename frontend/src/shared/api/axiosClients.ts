import axios from 'axios';

// Unified Spring Boot Core Backend Client (Port 8080)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_SPRINGBOOT_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Backward-compatible alias
export const springBootClient = apiClient;
export const nodeClient = apiClient; // in case anything imported nodeClient, points to unified Spring Boot

// Request interceptor to attach JWT from localStorage
const attachAuthToken = (config: any) => {
  const token = localStorage.getItem('novamart_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

apiClient.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));
