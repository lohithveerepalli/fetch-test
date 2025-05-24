import axios, { AxiosError } from 'axios';

export const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

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
    if (error.response?.status === 401) {
      // Handle unauthorized access - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 