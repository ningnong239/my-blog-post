// API Configuration
export const API_BASE_URL = 'http://localhost:4001';

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
  console.log("🔍 [apiRequest] URL:", url);
  console.log("📦 [apiRequest] Options:", options);

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
    console.log("🔑 [apiRequest] Token found:", token.substring(0, 20) + "...");
  } else {
    console.log("❌ [apiRequest] No token found");
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
    console.log('🚀 [apiRequest] Making API request to:', url);
    console.log('⚙️ [apiRequest] Request config:', config);
    console.log('📝 [apiRequest] Request body:', config.body);
    
    const response = await fetch(url, config);
    console.log('📡 [apiRequest] Response status:', response.status);
    console.log('📋 [apiRequest] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📨 [apiRequest] Response data:', data);

    if (!response.ok) {
      console.error('❌ [apiRequest] API Error Response:', data);
      console.error('🔍 [apiRequest] Full error details:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        body: config.body
      });
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ [apiRequest] API request successful');
    return data;
  } catch (error) {
    console.error('💥 [apiRequest] API Request Error:', error);
    throw error;
  }
};

// Auth API Functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    console.log("📝 [authAPI.register] User data:", userData);
    return apiRequest(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (email, password) => {
    console.log("🔐 [authAPI.login] Email:", email);
    console.log("🔐 [authAPI.login] Password:", password);
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get user info
  getUser: async () => {
    console.log("👤 [authAPI.getUser] Fetching user data...");
    return apiRequest(API_ENDPOINTS.GET_USER, {
      method: 'GET',
    });
  },

  // Logout user
  logout: async () => {
    console.log("🚪 [authAPI.logout] Logging out user...");
    return apiRequest(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
    });
  },

  // Reset password
  resetPassword: async (passwordData) => {
    console.log("🔄 [authAPI.resetPassword] Password data:", passwordData);
    return apiRequest(API_ENDPOINTS.RESET_PASSWORD, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
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
    const token = localStorage.getItem('token');
    const config = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: postData,
    };

    try {
      console.log('Making API request to:', API_ENDPOINTS.POSTS);
      console.log('Request config:', config);
      
      const response = await fetch(API_ENDPOINTS.POSTS, config);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('API Error Response:', data);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('API request successful');
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },

  // Update post (Admin only)
  update: async (id, postData) => {
    const token = localStorage.getItem('token');
    
    // Check if postData is FormData
    if (postData instanceof FormData) {
      const config = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: postData,
      };

      try {
        console.log('Making API request to:', API_ENDPOINTS.POST_BY_ID(id));
        console.log('Request config:', config);
        
        const response = await fetch(API_ENDPOINTS.POST_BY_ID(id), config);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
          console.error('API Error Response:', data);
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        console.log('API request successful');
        return data;
      } catch (error) {
        console.error('API Request Error:', error);
        throw error;
      }
    } else {
      // For JSON data, use the regular apiRequest function
      return apiRequest(API_ENDPOINTS.POST_BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(postData),
      });
    }
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
    const token = localStorage.getItem('token');
    
    // Check if profileData is FormData
    if (profileData instanceof FormData) {
      const config = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: profileData,
      };

      try {
        console.log('Making API request to:', API_ENDPOINTS.PROFILE);
        console.log('Request config:', config);
        
        const response = await fetch(API_ENDPOINTS.PROFILE, config);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
          console.error('API Error Response:', data);
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        console.log('API request successful');
        return data;
      } catch (error) {
        console.error('API Request Error:', error);
        throw error;
      }
    } else {
      // For JSON data, use the regular apiRequest function
      return apiRequest(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    }
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
