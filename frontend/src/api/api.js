import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mern-internship-assessment.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for performance monitoring
api.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for performance monitoring
api.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const duration = endTime.getTime() - response.config.metadata.startTime.getTime();
    if (duration > 3000) {
      console.warn(`Slow API call: ${response.config.url} took ${duration}ms`);
    }
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.config?.url || 'Unknown'}`, error.message);
    return Promise.reject(error);
  }
);

// User API endpoints
export const userAPI = {
  // Get all users with pagination
  getUsers: (page = 1, limit = 10) => {
    return api.get(`/users?page=${page}&limit=${limit}`);
  },

  // Get user by ID
  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },

  // Create new user
  createUser: (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    return api.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update user
  updateUser: (id, userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    return api.put(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete user
  deleteUser: (id) => {
    return api.delete(`/users/${id}`);
  },

  // Search users
  searchUsers: (keyword) => {
    return api.get(`/users/search?keyword=${keyword}`);
  },

  // Export users to CSV
  exportUsers: () => {
    return api.get('/users/export', {
      responseType: 'blob',
    });
  },
};

export default api;
