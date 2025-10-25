import { supabase, supabaseAdmin, debugSupabase } from '@/lib/supabase';
import { debugAPI, debugError } from '@/utils/debug';

// Initialize debug
debugSupabase();

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

export const authService = {
  // Sign up new user
  async signUp(email, password, fullName) {
    try {
      debugAPI.request('/auth/signup', 'POST', { email, fullName });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      // Create user profile in users table using admin client
      if (data.user) {
        try {
          const { error: profileError } = await supabaseAdmin
            .from('users')
            .insert([{
              id: data.user.id,
              email: data.user.email,
              name: fullName,
              username: email.split('@')[0], // Use email prefix as username
              role: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (profileError) {
            console.error('Failed to create user profile:', profileError);
            // Don't throw error, just log it
          } else {
            console.log('✅ User profile created successfully');
          }
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      debugAPI.response('/auth/signup', 200, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'authService.signUp');
      return { data: null, error };
    }
  },

  // Sign in user
  async signIn(email, password) {
    try {
      debugAPI.request('/auth/signin', 'POST', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      debugAPI.response('/auth/signin', 200, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'authService.signIn');
      return { data: null, error };
    }
  },

  // Sign out user
  async signOut() {
    try {
      debugAPI.request('/auth/signout', 'POST');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      debugAPI.response('/auth/signout', 200, 'Success');
      return { error: null };
    } catch (error) {
      debugError(error, 'authService.signOut');
      return { error };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      debugAPI.request('/auth/user', 'GET');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;

      debugAPI.response('/auth/user', 200, user);
      return { data: user, error: null };
    } catch (error) {
      debugError(error, 'authService.getCurrentUser');
      return { data: null, error };
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      debugAPI.request(`/users/${userId}`, 'GET');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      debugAPI.response(`/users/${userId}`, 200, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'authService.getUserProfile');
      return { data: null, error };
    }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      debugAPI.request(`/users/${userId}`, 'PUT', profileData);
      
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      debugAPI.response(`/users/${userId}`, 200, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'authService.updateProfile');
      return { data: null, error };
    }
  }
};

// ============================================================================
// POSTS SERVICE
// ============================================================================

export const postsService = {
  // Get all posts with pagination and filtering
  async getPosts(options = {}) {
    try {
      const {
        page = 1,
        limit = 6,
        category = null,
        categoryId = null,
        keyword = null,
        authorId = null
      } = options;

      debugAPI.request('/posts', 'GET', options);

      let query = supabase
        .from('posts')
        .select(`
          *,
          categories(name)
        `)
        // Temporarily disabled status filter to debug
        // .eq('status_id', 2)
        .order('date', { ascending: false });

      // Apply filters
      if (categoryId) {
        console.log("📁 [postsService.getPosts] Filtering by categoryId:", categoryId);
        query = query.eq('category_id', categoryId);
      } else if (category) {
        // Fallback: support category name for backward compatibility
        console.log("📁 [postsService.getPosts] Filtering by category name:", category);
        // Note: This won't work correctly with Supabase joins
        // Better to use categoryId
      }

      // Note: posts table doesn't have author_id column

      if (keyword) {
        query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      console.log("🔍 [postsService.getPosts] Supabase query result:", { 
        dataLength: data?.length, 
        error, 
        count,
        firstPost: data?.[0],
        allData: data
      });
      
      console.log("📊 [postsService.getPosts] Posts data details:");
      if (data && data.length > 0) {
        console.log("📝 [postsService.getPosts] First post details:", {
          id: data[0].id,
          title: data[0].title,
          category_id: data[0].category_id,
          status_id: data[0].status_id,
          likes_count: data[0].likes_count,
          categories: data[0].categories
        });
        
        console.log("🔍 [postsService.getPosts] Status information:", {
          status_id: data[0].status_id,
          is_published: data[0].status_id === 2,
          status_name: data[0].status_id === 2 ? 'Published' : 'Draft'
        });
      }

      if (error) {
        console.error("❌ Supabase query error:", error);
        throw error;
      }

      // Get total count for pagination
      const { count: totalCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });
        // Temporarily disabled status filter to match main query
        // .eq('status_id', 2);

      const result = {
        posts: data || [],
        currentPage: page,
        totalPages: Math.ceil((totalCount || 0) / limit),
        totalCount: totalCount || 0,
        hasMore: page < Math.ceil((totalCount || 0) / limit)
      };

      debugAPI.response('/posts', 200, result);
      return { data: result, error: null };
    } catch (error) {
      debugError(error, 'postsService.getPosts');
      return { data: null, error };
    }
  },

  // Get post by ID
  async getPostById(postId) {
    try {
      debugAPI.request(`/posts/${postId}`, 'GET');
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories(name)
        `)
        .eq('id', postId)
        .eq('status_id', 2)
        .single();

      if (error) throw error;

      // Data is already in correct format
      const transformedData = {
        ...data,
        likes_count: data.likes_count || 0
      };

      debugAPI.response(`/posts/${postId}`, 200, transformedData);
      return { data: transformedData, error: null };
    } catch (error) {
      debugError(error, 'postsService.getPostById');
      return { data: null, error };
    }
  },

  // Create new post
  async createPost(postData) {
    try {
      debugAPI.request('/posts', 'POST', postData);
      
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select(`
          *,
          categories(name),
        `)
        .single();

      if (error) throw error;

      debugAPI.response('/posts', 201, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'postsService.createPost');
      return { data: null, error };
    }
  },

  // Update post
  async updatePost(postId, postData) {
    try {
      debugAPI.request(`/posts/${postId}`, 'PUT', postData);
      
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', postId)
        .select(`
          *,
          categories(name),
        `)
        .single();

      if (error) throw error;

      debugAPI.response(`/posts/${postId}`, 200, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'postsService.updatePost');
      return { data: null, error };
    }
  },

  // Delete post
  async deletePost(postId) {
    try {
      debugAPI.request(`/posts/${postId}`, 'DELETE');
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      debugAPI.response(`/posts/${postId}`, 200, 'Deleted');
      return { error: null };
    } catch (error) {
      debugError(error, 'postsService.deletePost');
      return { error };
    }
  },

  // Like post
  async likePost(postId) {
    try {
      debugAPI.request(`/posts/${postId}/like`, 'POST');
      
      const { data, error } = await supabase
        .from('posts')
        .update({ likes_count: supabase.raw('likes_count + 1') })
        .eq('id', postId)
        .select('likes_count')
        .single();

      if (error) throw error;

      debugAPI.response(`/posts/${postId}/like`, 200, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'postsService.likePost');
      return { data: null, error };
    }
  },

  // Unlike post
  async unlikePost(postId) {
    try {
      debugAPI.request(`/posts/${postId}/unlike`, 'DELETE');
      
      const { data, error } = await supabase
        .from('posts')
        .update({ likes_count: supabase.raw('likes_count - 1') })
        .eq('id', postId)
        .select('likes_count')
        .single();

      if (error) throw error;

      debugAPI.response(`/posts/${postId}/unlike`, 200, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'postsService.unlikePost');
      return { data: null, error };
    }
  },

  // Get post likes count
  async getPostLikes(postId) {
    try {
      debugAPI.request(`/posts/${postId}/likes`, 'GET');
      
      const { data, error } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (error) throw error;

      debugAPI.response(`/posts/${postId}/likes`, 200, data);
      return { data: { like_count: data.likes_count }, error: null };
    } catch (error) {
      debugError(error, 'postsService.getPostLikes');
      return { data: null, error };
    }
  }
};

// ============================================================================
// CATEGORIES SERVICE
// ============================================================================

export const categoriesService = {
  // Get all categories
  async getCategories() {
    try {
      debugAPI.request('/categories', 'GET');
      console.log("🔄 [categoriesService] Fetching categories from Supabase...");
      console.log("🔧 [categoriesService] Supabase client:", supabase);
      console.log("🔧 [categoriesService] Supabase URL:", supabase.supabaseUrl);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      console.log("🔍 [categoriesService] Raw Supabase response:", { data, error });

      if (error) {
        console.error("❌ [categoriesService] Supabase error:", error);
        throw error;
      }

      console.log("✅ [categoriesService] Categories fetched successfully:", data);
      console.log("📊 [categoriesService] Categories count:", data?.length || 0);
      
      if (data && data.length > 0) {
        console.log("📝 [categoriesService] Categories details:", data.map(cat => ({
          id: cat.id,
          name: cat.name
        })));
      }
      
      debugAPI.response('/categories', 200, data);
      return { data: data || [], error: null };
    } catch (error) {
      console.error("💥 [categoriesService] Error in getCategories:", error);
      debugError(error, 'categoriesService.getCategories');
      return { data: null, error };
    }
  },

  // Create category (Admin only)
  async createCategory(categoryData) {
    try {
      debugAPI.request('/categories', 'POST', categoryData);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      debugAPI.response('/categories', 201, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'categoriesService.createCategory');
      return { data: null, error };
    }
  },

  // Update category (Admin only)
  async updateCategory(categoryId, categoryData) {
    try {
      debugAPI.request(`/categories/${categoryId}`, 'PUT', categoryData);
      
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', categoryId)
        .select()
        .single();

      if (error) throw error;

      debugAPI.response(`/categories/${categoryId}`, 200, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'categoriesService.updateCategory');
      return { data: null, error };
    }
  },

  // Delete category (Admin only)
  async deleteCategory(categoryId) {
    try {
      debugAPI.request(`/categories/${categoryId}`, 'DELETE');
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      debugAPI.response(`/categories/${categoryId}`, 200, 'Deleted');
      return { error: null };
    } catch (error) {
      debugError(error, 'categoriesService.deleteCategory');
      return { error };
    }
  }
};

// ============================================================================
// COMMENTS SERVICE
// ============================================================================

export const commentsService = {
  // Get comments for a post
  async getComments(postId) {
    try {
      debugAPI.request(`/posts/${postId}/comments`, 'GET');
      
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      debugAPI.response(`/posts/${postId}/comments`, 200, data);
      return { data: data || [], error: null };
    } catch (error) {
      debugError(error, 'commentsService.getComments');
      return { data: null, error };
    }
  },

  // Create comment
  async createComment(commentData) {
    try {
      debugAPI.request('/comments', 'POST', commentData);
      
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select('*')
        .single();

      if (error) throw error;

      debugAPI.response('/comments', 201, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'commentsService.createComment');
      return { data: null, error };
    }
  },

  // Update comment
  async updateComment(commentId, commentData) {
    try {
      debugAPI.request(`/comments/${commentId}`, 'PUT', commentData);
      
      const { data, error } = await supabase
        .from('comments')
        .update(commentData)
        .eq('id', commentId)
        .select(`
          *,
        `)
        .single();

      if (error) throw error;

      debugAPI.response(`/comments/${commentId}`, 200, data);
      return { data, error: null };
    } catch (error) {
      debugError(error, 'commentsService.updateComment');
      return { data: null, error };
    }
  },

  // Delete comment
  async deleteComment(commentId) {
    try {
      debugAPI.request(`/comments/${commentId}`, 'DELETE');
      
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      debugAPI.response(`/comments/${commentId}`, 200, 'Deleted');
      return { error: null };
    } catch (error) {
      debugError(error, 'commentsService.deleteComment');
      return { error };
    }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Check if user is admin
export const isAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role === 'admin';
  } catch (error) {
    debugError(error, 'isAdmin');
    return false;
  }
};

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  } catch (error) {
    debugError(error, 'getCurrentUserProfile');
    return null;
  }
};

// Initialize database with sample data
export const initializeDatabase = async () => {
  try {
    debugAPI.request('/init', 'POST');
    
    // Check if we already have data
    const { data: existingPosts } = await supabase
      .from('posts')
      .select('id')
      .limit(1);

    if (existingPosts && existingPosts.length > 0) {
      debugAPI.response('/init', 200, 'Database already initialized');
      return { data: 'Database already initialized', error: null };
    }

    // Get categories
    const { data: categories } = await categoriesService.getCategories();
    if (!categories || categories.length === 0) {
      throw new Error('No categories found');
    }

    // Sample blog posts data
    const samplePosts = [
      {
        title: "The Art of Mindfulness: Finding Peace in a Busy World",
        description: "Discover the transformative power of mindfulness and how it can help you navigate the challenges of modern life with greater ease and contentment.",
        content: "## 1. Understanding Mindfulness\n\nMindfulness is the practice of being fully present and engaged in the moment, aware of your thoughts and feelings without distraction or judgment.\n\n## 2. Benefits of Mindfulness\n\nRegular mindfulness practice can reduce stress, improve focus, enhance emotional regulation, and boost overall well-being.\n\n## 3. Simple Mindfulness Techniques\n\nLearn easy-to-implement mindfulness exercises, from deep breathing to body scans, that you can incorporate into your daily routine.\n\n## 4. Mindfulness in Daily Life\n\nDiscover how to bring mindfulness into everyday activities, from eating to working, to create a more balanced and fulfilling life.\n\n## 5. Overcoming Challenges\n\nAddress common obstacles to mindfulness practice and learn strategies to maintain consistency in your mindfulness journey.",
        image: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/e739huvlalbfz9eynysc.jpg",
        category_id: categories.find(c => c.name === 'General')?.id,
        likes: 321,
        views: 1250
      },
      {
        title: "The Secret Language of Cats: Decoding Feline Communication",
        description: "Unravel the mysteries of cat communication and learn how to better understand your feline friend's needs and desires.",
        content: "## 1. Vocal Communications\n\nExplore the various meows, purrs, and other vocalizations cats use to express themselves.\n\n## 2. Body Language\n\nLearn to read your cat's posture, tail position, and ear movements to understand their mood and intentions.\n\n## 3. Scent Marking\n\nDiscover why cats use scent to communicate and mark their territory.\n\n## 4. Facial Expressions\n\nUnderstand the subtle facial cues cats use to convey emotions and intentions.\n\n## 5. Interspecies Communication\n\nLearn how cats have adapted their communication methods to interact with humans and other animals.",
        image: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/gsutzgam24abrvgee9r4.jpg",
        category_id: categories.find(c => c.name === 'Cat')?.id,
        likes: 123,
        views: 890
      }
    ];

    // Create a default admin user profile for posts
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (!adminProfile) {
      throw new Error('No admin profile found');
    }

    // Insert sample posts
    const postsWithAuthor = samplePosts.map(post => ({
      ...post,
      author_id: adminProfile.id
    }));

    const { data: insertedPosts, error } = await supabase
      .from('posts')
      .insert(postsWithAuthor)
      .select();

    if (error) throw error;

    debugAPI.response('/init', 201, `Inserted ${insertedPosts.length} sample posts`);
    return { data: `Inserted ${insertedPosts.length} sample posts`, error: null };
  } catch (error) {
    debugError(error, 'initializeDatabase');
    return { data: null, error };
  }
};
