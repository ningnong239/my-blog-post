/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { postsAPI, categoriesAPI } from "../config/api";
import { blogPosts } from "../data/blogPosts";
import { Search, Loader2 } from "lucide-react";
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
import { supabase } from "../lib/supabase";

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

  const navigate = useNavigate();

  // ฟังก์ชันสำหรับดึงข้อมูลโพสต์จาก Supabase
  const fetchPostsFromSupabase = async () => {
    try {
      console.log("🔄 [fetchPostsFromSupabase] กำลังดึงข้อมูลโพสต์จาก Supabase...");
      
      // ดึงข้อมูลหมวดหมู่ก่อน
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .order('id', { ascending: true });
      
      if (categoriesError) {
        console.error("❌ [fetchPostsFromSupabase] Categories error:", categoriesError);
        throw categoriesError;
      }
      
      console.log("✅ [fetchPostsFromSupabase] ข้อมูลหมวดหมู่:", categoriesData);
      
      // สร้าง mapping สำหรับหมวดหมู่
      const categoryMap = {};
      categoriesData?.forEach(cat => {
        categoryMap[cat.id] = cat.name;
      });
      
      // ดึงข้อมูลโพสต์
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          description,
          content,
          image,
          date,
          likes_count
        `)
        .order('date', { ascending: false });
      
      if (postsError) {
        console.error("❌ [fetchPostsFromSupabase] Supabase posts error:", postsError);
        throw postsError;
      }
      
      console.log("✅ [fetchPostsFromSupabase] ข้อมูลโพสต์จาก Supabase:", postsData);
      
      // แปลงข้อมูลให้ตรงกับรูปแบบที่ BlogCard ต้องการ
      const transformedPosts = postsData?.map((post, index) => {
        // กำหนดหมวดหมู่ตาม index (ชั่วคราว)
        let categoryName = 'General';
        if (index === 0) categoryName = 'Dev';
        else if (index === 1) categoryName = 'Liftstyle';
        else if (index === 2) categoryName = 'General';
        else if (index === 3) categoryName = 'Liftstyle';
        else categoryName = 'General';
        
        return {
          id: post.id,
          title: post.title,
          description: post.description,
          content: post.content,
          image: post.image,
          category: categoryName,
          author: 'Naiyana T.', // ตั้งค่าเริ่มต้น
          date: post.date,
          likes: post.likes_count || 0
        };
      }) || [];
      
      console.log("✅ [fetchPostsFromSupabase] ข้อมูลที่แปลงแล้ว:", transformedPosts);
      return transformedPosts;
      
    } catch (error) {
      console.error("💥 [fetchPostsFromSupabase] Error fetching posts from Supabase:", error);
      return [];
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลหมวดหมู่จาก Supabase
  const fetchCategoriesFromSupabase = async () => {
    try {
      console.log("🔄 [fetchCategoriesFromSupabase] กำลังดึงข้อมูลหมวดหมู่จาก Supabase...");
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });
      
      if (categoriesError) {
        console.error("❌ [fetchCategoriesFromSupabase] Supabase categories error:", categoriesError);
        throw categoriesError;
      }
      
      console.log("✅ [fetchCategoriesFromSupabase] ข้อมูลหมวดหมู่จาก Supabase:", categoriesData);
      return categoriesData || [];
      
    } catch (error) {
      console.error("💥 [fetchCategoriesFromSupabase] Error fetching categories from Supabase:", error);
      return [];
    }
  };

  useEffect(() => {
    // ดึงข้อมูลหมวดหมู่เมื่อเริ่มต้น
    if (isFirstTimeRender) {
      const fetchCategories = async () => {
        try {
          console.log("🔄 [fetchCategories] กำลังดึงข้อมูลหมวดหมู่...");
          
          // ลองใช้ Supabase ก่อน
          const supabaseCategories = await fetchCategoriesFromSupabase();
          
          if (supabaseCategories.length > 0) {
            console.log("✅ [fetchCategories] ใช้ข้อมูลจาก Supabase");
            setCategories(supabaseCategories);
          } else {
            // ถ้า Supabase ไม่มีข้อมูล ลองใช้ backend API
            console.log("🔄 [fetchCategories] Supabase ว่างเปล่า ลองใช้ backend API...");
            const responseCategories = await categoriesAPI.getAll();
            setCategories(responseCategories);
          }
          
          setIsFirstTimeRender(false);
        } catch (error) {
          console.log("❌ [fetchCategories] API error:", error);
          // ใช้ข้อมูล fallback ถ้า API ล้มเหลว
          const fallbackCategories = [
            { id: 1, name: "Dev" },
            { id: 2, name: "LifeStyle" },
            { id: 3, name: "General" }
          ];
          setCategories(fallbackCategories);
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
        console.log("🔄 [fetchPosts] กำลังดึงข้อมูลโพสต์...");
        
        // ลองใช้ Supabase ก่อน
        const supabasePosts = await fetchPostsFromSupabase();
        
        if (supabasePosts.length > 0) {
          console.log("✅ [fetchPosts] ใช้ข้อมูลจาก Supabase");
          
          // กรองตามหมวดหมู่ถ้าไม่ใช่ Highlight
          let filteredPosts = supabasePosts;
          if (category !== "Highlight") {
            filteredPosts = supabasePosts.filter(post => 
              post.category === category
            );
          }
          
          if (page === 1) {
            setPosts(filteredPosts); // แทนที่โพสต์ในหน้าแรก
          } else {
            setPosts((prevPosts) => [...prevPosts, ...filteredPosts]); // เพิ่มโพสต์ในหน้าถัดไป
          }
          
          // ตรวจสอบว่ามีโพสต์เพิ่มเติมหรือไม่
          if (filteredPosts.length < 10) { // สมมติว่าแต่ละหน้าแสดง 10 โพสต์
            setHasMore(false);
          }
        } else {
          // ถ้า Supabase ไม่มีข้อมูล ลองใช้ backend API
          console.log("🔄 [fetchPosts] Supabase ว่างเปล่า ลองใช้ backend API...");
          const response = await postsAPI.getAll();
          console.log("🔍 [fetchPosts] Backend API response:", response);
          console.log("🔍 [fetchPosts] Response type:", typeof response);
          console.log("🔍 [fetchPosts] Response keys:", response ? Object.keys(response) : "null");
          console.log("🔍 [fetchPosts] Response.posts:", response?.posts);
          console.log("🔍 [fetchPosts] Response is array:", Array.isArray(response));
          
          // ตรวจสอบว่า backend API มีข้อมูลหรือไม่
          const backendPosts = response.posts || response;
          if (backendPosts && backendPosts.length > 0) {
            console.log("✅ [fetchPosts] ใช้ข้อมูลจาก Backend API");
            if (page === 1) {
              console.log("🔍 [fetchPosts] Setting posts (page 1):", backendPosts);
              setPosts(backendPosts);
            } else {
              console.log("🔍 [fetchPosts] Adding posts (page > 1):", backendPosts);
              setPosts((prevPosts) => [...prevPosts, ...backendPosts]);
            }
            if (response.currentPage >= response.totalPages) {
              setHasMore(false);
            }
          } else {
            console.log("❌ [fetchPosts] Backend API ว่างเปล่า ใช้ข้อมูล mock");
            // ใช้ข้อมูล mock จาก blogPosts.js
            setPosts(blogPosts);
            setHasMore(false);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.log("❌ [fetchPosts] Posts API error:", error);
        // ใช้ข้อมูล fallback ถ้า API ล้มเหลว
        setPosts(blogPosts);
        setIsLoading(false);
      }
    };

    fetchPosts(); // เรียก fetchPosts เมื่อหน้า หรือหมวดหมู่เปลี่ยน
  }, [page, category]); // Effect ขึ้นอยู่กับ page และ category

  useEffect(() => {
    if (searchKeyword.length > 0) {
      setIsLoading(true);
      const fetchSuggestions = async () => {
        try {
          console.log("🔄 [fetchSuggestions] กำลังค้นหาโพสต์...");
          
          // ลองใช้ Supabase ก่อน
          const supabasePosts = await fetchPostsFromSupabase();
          
          if (supabasePosts.length > 0) {
            console.log("✅ [fetchSuggestions] ใช้ข้อมูลจาก Supabase");
            // กรองโพสต์ตามคำค้นหา
            const filteredPosts = supabasePosts.filter(post => 
              post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              post.description.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            setSuggestions(filteredPosts);
          } else {
            // ถ้า Supabase ไม่มีข้อมูล ลองใช้ backend API
            console.log("🔄 [fetchSuggestions] Supabase ว่างเปล่า ลองใช้ backend API...");
            const response = await postsAPI.getAll();
            setSuggestions(response.posts || response);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.log("❌ [fetchSuggestions] Search API error:", error);
          // ใช้ข้อมูล fallback สำหรับการค้นหา
          setSuggestions(blogPosts);
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

  return (
    <div className="w-full max-w-7xl mx-auto md:px-6 lg:px-8 mb-20">
      <h2 className="text-xl font-bold mb-4 px-4">Latest articles</h2>
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
            <p className="text-muted-foreground">ไม่พบข้อมูลโพสต์</p>
            <p className="text-sm text-muted-foreground mt-2">
              กำลังโหลดข้อมูลจาก Supabase และ Backend API...
            </p>
          </div>
        ) : (
          posts.map((blog, index) => {
            console.log("🔍 [ArticlesSection] Rendering blog:", blog);
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


