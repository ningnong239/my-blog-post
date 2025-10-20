// Import Supabase services
import { 
  authService, 
  postsService, 
  categoriesService, 
  commentsService,
  initializeDatabase 
} from '@/services/supabaseService';

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

// Default options for API requests
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Generic API request function (Legacy - now uses Supabase)
const apiRequest = async (url, options = {}) => {
  console.warn('⚠️ Legacy API request detected. Consider using Supabase services directly.');
  
  // For backward compatibility, we'll try to map to Supabase services
  if (url.includes('/auth/')) {
    throw new Error('Please use authService from @/services/supabaseService instead of legacy API');
  }
  
  if (url.includes('/posts')) {
    throw new Error('Please use postsService from @/services/supabaseService instead of legacy API');
  }
  
  if (url.includes('/categories')) {
    throw new Error('Please use categoriesService from @/services/supabaseService instead of legacy API');
  }
  
  throw new Error('Legacy API not supported. Please use Supabase services.');
};

// Auth API Functions (Now using Supabase)
export const authAPI = {
  // Register user
  register: async (userData) => {
    const { email, password, full_name } = userData;
    const result = await authService.signUp(email, password, full_name);
    
    if (result.error) {
      throw new Error(result.error.message || 'Registration failed');
    }
    
    return {
      user: result.data.user,
      access_token: result.data.session?.access_token
    };
  },

  // Login user
  login: async (email, password) => {
    const result = await authService.signIn(email, password);
    
    if (result.error) {
      throw new Error(result.error.message || 'Login failed');
    }
    
    return {
      user: result.data.user,
      access_token: result.data.session?.access_token
    };
  },

  // Get user info
  getUser: async () => {
    const result = await authService.getCurrentUser();
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to get user');
    }
    
    if (!result.data) {
      throw new Error('No user found');
    }
    
    // Get user profile
    const profileResult = await authService.getUserProfile(result.data.id);
    
    return {
      ...result.data,
      ...profileResult.data
    };
  },

  // Logout user
  logout: async () => {
    const result = await authService.signOut();
    
    if (result.error) {
      throw new Error(result.error.message || 'Logout failed');
    }
    
    return { success: true };
  },

  // Reset password
  resetPassword: async (email) => {
    // Note: This would need to be implemented with Supabase Auth
    throw new Error('Password reset not implemented yet');
  },
};

// Posts API Functions (Now using Supabase)
export const postsAPI = {
  // Get all posts
  getAll: async (params = {}) => {
    const result = await postsService.getPosts(params);
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to fetch posts');
    }
    
    return result.data;
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
    const result = await postsService.createPost(postData);
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to create post');
    }
    
    return result.data;
  },

  // Update post (Admin only)
  update: async (id, postData) => {
    const result = await postsService.updatePost(id, postData);
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to update post');
    }
    
    return result.data;
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
    const result = await categoriesService.getCategories();
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to fetch categories');
    }
    
    return result.data;
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
    // Get current user
    const { data: { user } } = await authService.getCurrentUser();
    if (!user) throw new Error('No user found');
    
    const result = await authService.updateProfile(user.id, profileData);
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to update profile');
    }
    
    return result.data;
  },

  // Upload avatar
  uploadAvatar: async (avatarFile) => {
    // This would need to be implemented with Supabase Storage
    throw new Error('Avatar upload not implemented yet');
  },
};

// Export Supabase services for direct use
export { 
  authService, 
  postsService, 
  categoriesService, 
  commentsService,
  initializeDatabase 
} from '@/services/supabaseService';
