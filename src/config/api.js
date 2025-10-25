// API Configuration
export const API_BASE_URL = 'https://myblogpostserver.vercel.app';

// Import Supabase services
import { postsService, categoriesService } from '@/services/supabaseService';

// Legacy API endpoints (for backward compatibility)
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  GET_USER: '/auth/get-user',
  LOGOUT: '/auth/logout',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Posts endpoints
  POSTS: '/posts',
  POST_BY_ID: (id) => `/posts/${id}`,
  
  // Categories endpoints
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,
  
  // Profile endpoints
  PROFILE: '/profile',
  PROFILE_AVATAR: '/profile/avatar',
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

// Auth API Functions (Now using Supabase)
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

// Posts API Functions (Now using Supabase)
export const postsAPI = {
  // Get all posts
  getAll: async (params = {}) => {
    console.log("🚀 [postsAPI.getAll] Starting API call with params:", params);
    
    try {
      const result = await postsService.getPosts(params);
      console.log("📊 [postsAPI.getAll] Supabase service result:", result);
      
      if (result.error) {
        console.error("❌ [postsAPI.getAll] Supabase service error:", result.error);
        throw new Error(result.error.message || 'Failed to fetch posts');
      }
      
      console.log("✅ [postsAPI.getAll] Successfully fetched posts:", result.data);
      console.log("📈 [postsAPI.getAll] Posts count:", result.data?.posts?.length || 0);
      console.log("📈 [postsAPI.getAll] Total count:", result.data?.totalCount || 0);
      
      return result.data;
    } catch (error) {
      console.error("💥 [postsAPI.getAll] API call failed:", error);
      throw error;
    }
  },

  // Get post by ID
  getById: async (id) => {
    const result = await postsService.getPostById(id);
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to fetch post');
    }
    
    return result.data;
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
    const result = await postsService.deletePost(id);
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to delete post');
    }
    
    return { success: true };
  },
};

// Categories API Functions (Now using Supabase)
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    console.log("🚀 [categoriesAPI.getAll] Starting categories API call");
    
    try {
      const result = await categoriesService.getCategories();
      console.log("📊 [categoriesAPI.getAll] Supabase service result:", result);
      
      if (result.error) {
        console.error("❌ [categoriesAPI.getAll] Supabase service error:", result.error);
        throw new Error(result.error.message || 'Failed to fetch categories');
      }
      
      console.log("✅ [categoriesAPI.getAll] Successfully fetched categories:", result.data);
      console.log("📈 [categoriesAPI.getAll] Categories count:", result.data?.length || 0);
      
      return result.data;
    } catch (error) {
      console.error("💥 [categoriesAPI.getAll] API call failed:", error);
      throw error;
    }
  },

  // Get category by ID
  getById: async (id) => {
    const result = await categoriesService.getCategories();
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to fetch category');
    }
    
    return result.data.find(cat => cat.id === id);
  },

  // Create category (Admin only)
  create: async (categoryData) => {
    const result = await categoriesService.createCategory(categoryData);
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to create category');
    }
    
    return result.data;
  },

  // Update category (Admin only)
  update: async (id, categoryData) => {
    const result = await categoriesService.updateCategory(id, categoryData);
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to update category');
    }
    
    return result.data;
  },

  // Delete category (Admin only)
  delete: async (id) => {
    const result = await categoriesService.deleteCategory(id);
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to delete category');
    }
    
    return { success: true };
  },
};

// Profile API Functions (Now using Supabase)
export const profileAPI = {
  // Update profile
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

// Export Supabase services for direct use
export { 
  authService, 
  commentsService,
  initializeDatabase 
} from '@/services/supabaseService';
