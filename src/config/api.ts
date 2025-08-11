import axios from 'axios';
import { getConfig } from './environment';

// API Configuration
const config = getConfig();
const API_BASE_URL = process.env.REACT_APP_API_URL || config.API_URL;
const API_TIMEOUT = 15000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Create axios instance with optimal configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true, // Enable credentials for CORS
  validateStatus: (status) => {
    // Consider only 2xx status codes as successful
    return status >= 200 && status < 300;
  }
});

// Request interceptor for authentication and logging
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    // Log request in development
    if (!IS_PRODUCTION) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: {
          'Content-Type': config.headers['Content-Type'],
          'Authorization': config.headers.Authorization ? 'Bearer [HIDDEN]' : undefined,
          'Origin': window.location.origin
        }
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (!IS_PRODUCTION) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
        data: response.data,
        headers: response.headers
      });
    }
    
    return response;
  },
  async (error) => {
    const { response, request, config } = error;
    
    // Log error details
    console.error('❌ API Error:', {
      status: response?.status,
      statusText: response?.statusText,
      url: config?.url,
      method: config?.method,
      data: response?.data,
      message: error.message
    });
    
    // Handle specific error cases
    if (response) {
      // Server responded with error status
      switch (response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden - CORS or permission error
          console.error('CORS or permission error:', response.data);
          break;
          
        case 429:
          // Rate limited
          console.error('Rate limit exceeded:', response.data);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', response.data);
          break;
          
        default:
          // Other errors
          console.error(`HTTP ${response.status} error:`, response.data);
      }
    } else if (request) {
      // Request was made but no response received
      console.error('Network error - no response received');
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Utility function to generate request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// API service functions
export const apiService = {
  // Health check
  async healthCheck() {
    return api.get('/health');
  },
  
  // CORS test
  async corsTest() {
    return api.get('/cors-test');
  },
  
  // CORS POST test
  async corsPostTest(data: any) {
    return api.post('/cors-test', data);
  },
  
  // Routes test
  async routesTest() {
    return api.get('/routes-test');
  },
  
  // Debug endpoint
  async debugRequest(method: string, data?: any) {
    return api.request({
      method: method.toUpperCase(),
      url: '/debug',
      data
    });
  }
};

// Export the configured axios instance
export default api; 