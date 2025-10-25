/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { postsAPI, categoriesAPI } from "../config/api";
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

export default function Articles() {
 
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
  const [useFallbackData, setUseFallbackData] = useState(false); // Disable fallback data to test API

  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ไม่ต้องใช้ fetchPostsFromSupabase() และ fetchCategoriesFromSupabase() อีกต่อไป 
  // ใช้ postsAPI.getAll() และ categoriesAPI.getAll() แทน

  // ฟัง event จาก Admin Edit Page เมื่อมีการอัพเดทโพสต์
  useEffect(() => {
    const handlePostsUpdated = (event) => {
      console.log("📡 [ArticlesSection] Received postsUpdated event:", event.detail);
      console.log("🔄 [ArticlesSection] Triggering data refresh...");
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('postsUpdated', handlePostsUpdated);
    
    return () => {
      window.removeEventListener('postsUpdated', handlePostsUpdated);
    };
  }, []);

  useEffect(() => {
    // ดึงข้อมูลหมวดหมู่เมื่อเริ่มต้น
    if (isFirstTimeRender) {
      const fetchCategories = async () => {
        try {
          console.log("🔄 [ArticlesSection.fetchCategories] กำลังดึงข้อมูลหมวดหมู่...");
          
          // ใช้ categoriesAPI.getAll() ซึ่งจะเรียก Supabase service และมี console.log ครบถ้วน
          const responseCategories = await categoriesAPI.getAll();
          console.log("📊 [ArticlesSection.fetchCategories] Categories response:", responseCategories);
          console.log("📈 [ArticlesSection.fetchCategories] Categories count:", responseCategories?.length || 0);
          
          if (responseCategories && responseCategories.length > 0) {
            console.log("✅ [ArticlesSection.fetchCategories] Successfully fetched categories");
            setCategories(responseCategories);
          } else {
            console.log("❌ [ArticlesSection.fetchCategories] No categories found");
            setCategories([]);
          }
          
          setIsFirstTimeRender(false);
        } catch (error) {
          console.log("❌ [ArticlesSection.fetchCategories] API error:", error);
          console.log("💥 [ArticlesSection.fetchCategories] Error stack:", error.stack);
          setCategories([]);
          setApiError(true);
          setIsFirstTimeRender(false);
        }
      };

      fetchCategories();
    }
  }, [isFirstTimeRender]);

  useEffect(() => {
    // ดึงข้อมูลโพสต์เมื่อหน้า หรือหมวดหมู่เปลี่ยน
    const fetchPosts = async () => {
      setIsLoading(true); // เริ่มโหลด
      try {
        console.log("🔄 [ArticlesSection.fetchPosts] กำลังดึงข้อมูลโพสต์...");
        console.log("📋 [ArticlesSection.fetchPosts] Parameters:", { page, category });
        
        // หา category_id จาก category name
        let categoryId = null;
        if (category !== "Highlight") {
          const selectedCat = categories.find(cat => cat.name === category);
          categoryId = selectedCat?.id || null;
          console.log("📁 [ArticlesSection.fetchPosts] Selected category:", { name: category, id: categoryId });
        }
        
        // ใช้ postsAPI.getAll() ซึ่งจะเรียก Supabase service และมี console.log ครบถ้วน
        const response = await postsAPI.getAll({ 
          page, 
          limit: 6,
          categoryId: categoryId 
        });
        
        console.log("📊 [ArticlesSection.fetchPosts] API Response:", response);
        console.log("📈 [ArticlesSection.fetchPosts] Posts count:", response?.posts?.length || 0);
        console.log("📈 [ArticlesSection.fetchPosts] Total count:", response?.totalCount || 0);
        
        if (response && response.posts) {
          console.log("✅ [ArticlesSection.fetchPosts] Successfully got posts from API");
          console.log("🔍 [ArticlesSection.fetchPosts] First post sample:", response.posts[0]);
          
          // แปลงข้อมูลให้ตรงกับรูปแบบที่ BlogCard ต้องการ
          const transformedPosts = response.posts.map((post) => {
            // ดึงชื่อ category จาก nested object
            const categoryName = post.categories?.name || 'General';
            
            return {
              id: post.id,
              title: post.title,
              description: post.description,
              content: post.content,
              image: post.image,
              category: categoryName,
              author: 'Naiyana T.', // ตั้งค่าเริ่มต้น
              date: post.date || post.created_at,
              likes: post.likes_count || 0
            };
          });
          
          console.log("🔄 [ArticlesSection.fetchPosts] Transformed posts:", transformedPosts);
          
          if (page === 1) {
            setPosts(transformedPosts); // แทนที่โพสต์ในหน้าแรก
          } else {
            setPosts((prevPosts) => [...prevPosts, ...transformedPosts]); // เพิ่มโพสต์ในหน้าถัดไป
          }
          
          // ตรวจสอบว่ามีโพสต์เพิ่มเติมหรือไม่
          setHasMore(response.hasMore || false);
        } else {
          console.log("❌ [ArticlesSection.fetchPosts] No posts data in response");
          setPosts([]);
          setHasMore(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.log("❌ [ArticlesSection.fetchPosts] Posts API error:", error);
        console.log("💥 [ArticlesSection.fetchPosts] Error stack:", error.stack);
        setPosts([]);
        setApiError(true);
        setIsLoading(false);
      }
    };

    fetchPosts(); // เรียก fetchPosts เมื่อหน้า หรือหมวดหมู่เปลี่ยน
  }, [page, category, refreshTrigger, categories]); // Effect ขึ้นอยู่กับ page, category, refreshTrigger และ categories

  useEffect(() => {
    if (searchKeyword.length > 0) {
      setIsLoading(true);
      
      const fetchSuggestions = async () => {
        try {
          console.log("🔄 [ArticlesSection.fetchSuggestions] กำลังค้นหาโพสต์:", searchKeyword);
          
          // ใช้ postsAPI.getAll() พร้อมกับ keyword parameter
          const response = await postsAPI.getAll({ 
            page: 1, 
            limit: 10,
            keyword: searchKeyword 
          });
          
          console.log("📊 [ArticlesSection.fetchSuggestions] Search response:", response);
          
          if (response && response.posts) {
            console.log("✅ [ArticlesSection.fetchSuggestions] Found posts:", response.posts.length);
            // แปลงข้อมูลให้ตรงกับรูปแบบที่ใช้
            const transformedSuggestions = response.posts.map((post) => ({
              id: post.id,
              title: post.title,
              description: post.description,
              category: post.categories?.name || 'General',
            }));
            setSuggestions(transformedSuggestions);
          } else {
            console.log("❌ [ArticlesSection.fetchSuggestions] No results");
            setSuggestions([]);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.log("❌ [ArticlesSection.fetchSuggestions] Search API error:", error);
          setSuggestions([]);
          setIsLoading(false);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]); // ล้างคำแนะนำถ้าคำค้นหาว่าง
    }
  }, [searchKeyword]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment page number to load more posts
  };

  // Retry API connection
  const retryConnection = () => {
    console.log("🔄 [ArticlesSection.retryConnection] Retrying API connection");
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
        {console.log("🔍 [ArticlesSection] Posts to render:", posts)}
        {console.log("🔍 [ArticlesSection] Posts length:", posts.length)}
        {console.log("🔍 [ArticlesSection] Posts type:", typeof posts)}
        {console.log("🔍 [ArticlesSection] Posts is array:", Array.isArray(posts))}
        {posts.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  กำลังโหลดข้อมูลจาก Supabase และ Backend API...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  ไม่พบข้อมูลโพสต์
                </p>
                <p className="text-sm text-muted-foreground">
                  กรุณาตรวจสอบการเชื่อมต่อ API หรือ Supabase
                </p>
              </div>
            )}
          </div>
        ) : (
          posts.map((blog, index) => {
            console.log("🔍 [ArticlesSection] Rendering blog:", blog);
            console.log("📊 [ArticlesSection] Blog data details:", {
              id: blog.id,
              title: blog.title,
              category: blog.category,
              author: blog.author,
              date: blog.date,
              hasImage: !!blog.image,
              hasDescription: !!blog.description
            });
            
            return (
              <BlogCard
                key={index}
                id={blog.id}
                image={blog.image}
                category={blog.category}
                title={blog.title}
                description={blog.description}
                author={blog.author}
                date={new Date(blog.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                debugInfo={{
                  originalData: blog,
                  transformedDate: new Date(blog.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                }}
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


