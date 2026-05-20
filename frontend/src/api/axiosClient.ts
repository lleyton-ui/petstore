import axios from 'axios';

let apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
if (import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.startsWith('http')) {
  apiBaseUrl = `https://${import.meta.env.VITE_API_BASE_URL}/api`;
} else if (import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.endsWith('/api')) {
  apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
}

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
