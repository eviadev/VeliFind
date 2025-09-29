import axios from 'axios';

export const API_URL = process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
