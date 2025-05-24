import axios, { AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for auth cookie handling
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    // Let the calling code handle the error
    return Promise.reject(error);
  }
); 