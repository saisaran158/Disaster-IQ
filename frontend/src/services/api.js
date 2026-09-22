import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8071', // API Gateway port / Render URL
});

// Automatically append the JWT token to headers if the user is logged in
api.interceptors.request.use((config) => {
  if (config.url && config.url.includes('/api/auth/login')) {
    delete config.headers.Authorization;
    return config;
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
