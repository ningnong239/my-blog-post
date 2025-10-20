/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { BlogCard } from "./BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { debugAPI, debugComponent, debugError } from "@/utils/debug";
import { postsService, categoriesService, initializeDatabase } from "@/services/supabaseService";

export default function Articles() {
  // const categories = ["Highlight", "Cat", "Inspiration", "General"];
  const [category, setCategory] = useState("Highlight");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // Current page state
  const [hasMore, setHasMore] = useState(true); // To track if there are more posts to load
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isFirstTimeRender, setIsFirstTimeRender] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [useFallbackData, setUseFallbackData] = useState(true); // Start with fallback data

  const navigate = useNavigate();

  // Fallback categories from blogPosts data
  const getFallbackCategories = () => {
    const uniqueCategories = [...new Set(blogPosts.map(post => post.category))];
    return uniqueCategories.map((cat, index) => ({ id: index + 1, name: cat }));
  };

  // Try to fetch real data from Supabase after initial fallback load
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        console.log("🔄 Trying to fetch real data from Supabase");
        const [categoriesResult, postsResult] = await Promise.all([
          categoriesService.getCategories(),
          postsService.getPosts({ page: 1, limit: 6, category: category !== "Highlight" ? category : null })
        ]);
        
        if (!categoriesResult.error && !postsResult.error) {
          // Only switch to real data if there are actual posts
          if (postsResult.data.posts && postsResult.data.posts.length > 0) {
            console.log("✅ Real data fetched successfully, switching from fallback");
            setCategories(categoriesResult.data);
            setPosts(postsResult.data.posts);
            setHasMore(postsResult.data.hasMore);
            setApiError(false);
            setUseFallbackData(false);
          } else {
            console.log("⚠️ Real data fetched but no posts found, keeping fallback");
            // Keep using fallback data
          }
        }
      } catch (error) {
        console.log("❌ Failed to fetch real data, keeping fallback:", error);
        // Keep fallback data
      }
    };

    // Try to fetch real data after a short delay
    const timer = setTimeout(fetchRealData, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load fallback data immediately on mount
  useEffect(() => {
    console.log("🚀 Initial load - using fallback data");
    const fallbackData = getFallbackPosts(1, 6, category);
    setPosts(fallbackData.posts);
    setHasMore(fallbackData.hasMore);
    setCategories(getFallbackCategories());
    setApiError(true); // Show that we're using fallback
  }, []); // Run only once on mount

  // Fallback posts from blogPosts data
  const getFallbackPosts = (currentPage = 1, limit = 6, selectedCategory = "Highlight") => {
    let filteredPosts = blogPosts;
    
    // Filter by category if not "Highlight"
    if (selectedCategory !== "Highlight") {
      filteredPosts = blogPosts.filter(post => post.category === selectedCategory);
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      currentPage,
      totalPages: Math.ceil(filteredPosts.length / limit),
      hasMore: endIndex < filteredPosts.length
    };
  };

  // Handle page and category changes
  useEffect(() => {
    if (useFallbackData) {
      console.log("🔄 Category/page changed, using fallback data");
      const fallbackData = getFallbackPosts(page, 6, category);
      if (page === 1) {
        setPosts(fallbackData.posts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...fallbackData.posts]);
      }
      setHasMore(fallbackData.hasMore);
    } else {
      // Try to fetch from Supabase
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          const result = await postsService.getPosts({
            page,
            limit: 6,
            category: category !== "Highlight" ? category : null
          });
          
          if (result.error) throw result.error;
          
          // Check if we have posts, if not switch to fallback
          if (!result.data.posts || result.data.posts.length === 0) {
            console.log("❌ No posts found in Supabase, switching to fallback");
            setUseFallbackData(true);
            const fallbackData = getFallbackPosts(page, 6, category);
            if (page === 1) {
              setPosts(fallbackData.posts);
            } else {
              setPosts((prevPosts) => [...prevPosts, ...fallbackData.posts]);
            }
            setHasMore(fallbackData.hasMore);
            setApiError(true);
          } else {
            if (page === 1) {
              setPosts(result.data.posts);
            } else {
              setPosts((prevPosts) => [...prevPosts, ...result.data.posts]);
            }
            setHasMore(result.data.hasMore);
            setApiError(false);
          }
        } catch (error) {
          console.log("❌ Failed to fetch posts, switching to fallback");
          setUseFallbackData(true);
          const fallbackData = getFallbackPosts(page, 6, category);
          if (page === 1) {
            setPosts(fallbackData.posts);
          } else {
            setPosts((prevPosts) => [...prevPosts, ...fallbackData.posts]);
          }
          setHasMore(fallbackData.hasMore);
          setApiError(true);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPosts();
    }
  }, [page, category, useFallbackData]);

  useEffect(() => {
    if (searchKeyword.length > 0) {
      setIsLoading(true);
      
      // If using fallback data, search locally
      if (useFallbackData) {
        debugComponent("ArticlesSection", "Searching in fallback data");
        const filteredPosts = blogPosts.filter(post => 
          post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          post.description.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setSuggestions(filteredPosts);
        setIsLoading(false);
        return;
      }
      
      const fetchSuggestions = async () => {
        try {
          debugComponent("ArticlesSection", "Searching posts in Supabase");
          const result = await postsService.getPosts({
            keyword: searchKeyword,
            limit: 10
          });
          
          if (result.error) {
            throw result.error;
          }
          
          setSuggestions(result.data.posts); // Set search suggestions
          setIsLoading(false);
        } catch (error) {
          debugError(error, "fetchSuggestions");
          debugComponent("ArticlesSection", "Using fallback search");
          
          // Fallback to local search
          const filteredPosts = blogPosts.filter(post => 
            post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            post.description.toLowerCase().includes(searchKeyword.toLowerCase())
          );
          setSuggestions(filteredPosts);
          setIsLoading(false);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]); // Clear suggestions if keyword is empty
    }
  }, [searchKeyword, useFallbackData]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment page number to load more posts
  };

  // Retry API connection
  const retryConnection = () => {
    debugComponent("ArticlesSection", "Retrying API connection");
    setUseFallbackData(false);
    setApiError(false);
    setIsFirstTimeRender(true);
    setPage(1);
    setPosts([]);
    setHasMore(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:px-6 lg:px-8 mb-20">
      <h2 className="text-xl font-bold mb-4 px-4">Latest articles</h2>
      
      {/* API Error Notification */}
      {apiError && (
        <div className="mx-4 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                API Server Unavailable
              </p>
              <p className="text-xs text-yellow-700">
                Using offline data. Some features may be limited.
              </p>
            </div>
          </div>
          <button
            onClick={retryConnection}
            className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      <div className="bg-red-500 px-4 py-4 md:py-3 md:rounded-sm flex flex-col space-y-4 md:gap-16 md:flex-row-reverse md:items-center md:space-y-0 md:justify-between mb-10">
        <div className="w-full md:max-w-sm">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              onChange={(e) => setSearchKeyword(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowDropdown(false);
                }, 200);
              }}
            />
            {!isLoading &&
              showDropdown &&
              searchKeyword &&
              suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-background rounded-sm shadow-lg p-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="text-start px-4 py-2 block w-full text-sm text-foreground hover:bg-[#EFEEEB] hover:text-muted-foreground hover:rounded-sm cursor-pointer"
                      onClick={() => navigate(`/post/${suggestion.id}`)}
                    >
                      {suggestion.title}
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>
        <div className="md:hidden w-full">
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setPosts([]); // Clear posts when category changes
              setPage(1); // Reset page to 1
              setHasMore(true); // Reset "has more" state
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full py-3 rounded-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:border-muted-foreground">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Highlight">Highlight</SelectItem>
              {categories.map((cat) => {
                return (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {isFirstTimeRender ? (
          <div className="hidden md:flex space-x-2">
            <Skeleton className="w-24 h-10 rounded-sm" />
            <Skeleton className="w-20 h-10 rounded-sm" />
            <Skeleton className="w-24 h-10 rounded-sm" />
            <Skeleton className="w-20 h-10 rounded-sm" />
          </div>
        ) : (
          <div className="hidden md:flex space-x-2">
            <button
              disabled={category === "Highlight"}
              onClick={() => {
                setCategory("Highlight");
                setPosts([]); // Clear posts when category changes
                setPage(1); // Reset page to 1
                setHasMore(true); // Reset "has more" state
              }}
              className={`px-4 py-3 transition-colors rounded-sm text-sm text-muted-foreground font-medium ${
                category === "Highlight" ? "bg-[#DAD6D1]" : "hover:bg-muted"
              }`}
            >
              Highlight
            </button>
            {categories.map((cat) => (
              <button
                disabled={category === cat.name}
                key={cat.id}
                onClick={() => {
                  setCategory(cat.name);
                  setPosts([]); // Clear posts when category changes
                  setPage(1); // Reset page to 1
                  setHasMore(true); // Reset "has more" state
                }}
                className={`px-4 py-3 transition-colors rounded-sm text-sm text-muted-foreground font-medium ${
                  category === cat.name ? "bg-[#DAD6D1]" : "hover:bg-muted"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        {console.log("🎯 Rendering posts:", { postsLength: posts.length, posts, isLoading, apiError, useFallbackData })}
        {posts.length === 0 && !isLoading ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p>ไม่พบข้อมูลบทความ</p>
            <p className="text-sm mt-2">API Error: {apiError ? 'Yes' : 'No'}, Using Fallback: {useFallbackData ? 'Yes' : 'No'}</p>
          </div>
        ) : (
          posts.map((blog, index) => {
            console.log(`📊 Blog ${index}:`, blog);
            
            // Find corresponding fallback data from blogPosts
            const fallbackPost = blogPosts.find(post => post.id === blog.id);
            
            return (
              <BlogCard
                key={index}
                id={blog.id}
                image={blog.image}
                category={blog.categories?.name || 'General'}
                title={blog.title}
                description={blog.description}
                author={blog.author || 'Unknown Author'}
                date={new Date(blog.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                debugInfo={blog}
                fallbackData={fallbackPost}
                apiError={apiError}
              />
            );
          })
        )}
      </article>
      {hasMore && (
        <div className="text-center mt-20">
          <button
            onClick={handleLoadMore}
            className={`font-medium ${
              !isLoading ? "underline hover:text-muted-foreground" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex flex-col items-center min-h-lvh">
                <Loader2 className="w-12 h-12 animate-spin text-foreground" />
                <p className="mt-4">Loading...</p>
              </div>
            ) : (
              "View more"
            )}
          </button>
        </div>
      )}
    </div>
  );
}


