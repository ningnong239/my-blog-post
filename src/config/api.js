// API Configuration
const API_BASE_URL = 'https://myblogpostserver.vercel.app';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_USER: `${API_BASE_URL}/auth/get-user`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  
  // Posts endpoints
  POSTS: `${API_BASE_URL}/posts`,
  POST_BY_ID: (id) => `${API_BASE_URL}/posts/${id}`,
  
  // Categories endpoints
  CATEGORIES: `${API_BASE_URL}/categories`,
  CATEGORY_BY_ID: (id) => `${API_BASE_URL}/categories/${id}`,
  
  // Profile endpoints
  PROFILE: `${API_BASE_URL}/profile`,
  UPLOAD_AVATAR: `${API_BASE_URL}/profile/avatar`,
};

// API Helper Functions
export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  // Add Authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log('Making API request to:', url);
    console.log('Request config:', config);
    console.log('Request body:', config.body);
    
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error Response:', data);
      console.error('Full error details:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        body: config.body
      });
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    console.log('API request successful');
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API Functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    return apiRequest(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (email, password) => {
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get user info
  getUser: async () => {
    return apiRequest(API_ENDPOINTS.GET_USER, {
      method: 'GET',
    });
  },

  // Logout user
  logout: async () => {
    return apiRequest(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
    });
  },

  // Reset password
  resetPassword: async (email) => {
    return apiRequest(API_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Posts API Functions
export const postsAPI = {
  // Get all posts
  getAll: async () => {
    return apiRequest(API_ENDPOINTS.POSTS, {
      method: 'GET',
    });
  },

  // Get post by ID
  getById: async (id) => {
    return apiRequest(API_ENDPOINTS.POST_BY_ID(id), {
      method: 'GET',
    });
  },

  // Create post (Admin only)
  create: async (postData) => {
    return apiRequest(API_ENDPOINTS.POSTS, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // Update post (Admin only)
  update: async (id, postData) => {
    return apiRequest(API_ENDPOINTS.POST_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  // Delete post (Admin only)
  delete: async (id) => {
    return apiRequest(API_ENDPOINTS.POST_BY_ID(id), {
      method: 'DELETE',
    });
  },
};

// Categories API Functions
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    return apiRequest(API_ENDPOINTS.CATEGORIES, {
      method: 'GET',
    });
  },

  // Get category by ID
  getById: async (id) => {
    return apiRequest(API_ENDPOINTS.CATEGORY_BY_ID(id), {
      method: 'GET',
    });
  },

  // Create category (Admin only)
  create: async (categoryData) => {
    return apiRequest(API_ENDPOINTS.CATEGORIES, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Update category (Admin only)
  update: async (id, categoryData) => {
    return apiRequest(API_ENDPOINTS.CATEGORY_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Delete category (Admin only)
  delete: async (id) => {
    return apiRequest(API_ENDPOINTS.CATEGORY_BY_ID(id), {
      method: 'DELETE',
    });
  },
};

// Profile API Functions
export const profileAPI = {
  // Update profile (User only)
  update: async (profileData) => {
    return apiRequest(API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Upload avatar (User only)
  uploadAvatar: async (formData) => {
    const token = localStorage.getItem('token');
    return fetch(API_ENDPOINTS.UPLOAD_AVATAR, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(response => response.json());
  },
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  apiRequest,
  authAPI,
  postsAPI,
  categoriesAPI,
  profileAPI,
};
