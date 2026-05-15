import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (certificateId, passwordData) => 
    api.post(`/auth/change-password/${certificateId}`, passwordData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

// Certificate services
export const certificateService = {
  issue: (certificateData) => api.post('/certificates/issue', certificateData),
  verify: (verificationData) => api.post('/certificates/verify', verificationData),
  getDetails: (certificateId) => api.get(`/certificates/${certificateId}`),
  getHistory: (params) => api.get('/certificates/history', { params }),
};

// Admin services
export const adminService = {
  authorizeIssuer: (issuerData) => api.post('/admin/authorize-issuer', issuerData),
  deauthorizeIssuer: (issuerData) => api.post('/admin/deauthorize-issuer', issuerData),
  resetPassword: (userData) => api.post('/admin/reset-password', userData),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (userId) => api.patch(`/admin/toggle-status/${userId}`),
  deleteUser: (userId) => api.delete(`/admin/user/${userId}`),
  getAnomalies: (params) => api.get('/admin/anomalies', { params }),
  getDashboardStats: () => api.get('/admin/dashboard'),
};

// Health check
export const healthCheck = () => api.get('/health', { baseURL: 'http://localhost:8000' });

export default api;
