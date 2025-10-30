/* eslint-disable react/prop-types */

// ส่วนนี้เป็น component ArticlesSection (หรือ Articles) สำหรับแสดงรวมบทความ blog
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
  // ------- State ต่างๆ ที่ใช้ในการจัดการ UI และ data -------
  // state category: ชื่อหมวดหมู่ปัจจุบัน (ค่าตั้งต้น = "Highlight")
  const [category, setCategory] = useState("Highlight");
  // state posts: รายการโพสต์ทั้งหมดที่จะแสดง
  const [posts, setPosts] = useState([]);
  // state page: เลขหน้าปัจจุบันของการแบ่งหน้า (pagination)
  const [page, setPage] = useState(1);
  // state hasMore: ตรวจสอบว่ามีโพสต์เหลือให้โหลดเพิ่มอีกหรือไม่
  const [hasMore, setHasMore] = useState(true);
  // state isLoading: เช็คสถานะระหว่างโหลดข้อมูล
  const [isLoading, setIsLoading] = useState(false);
  // state searchKeyword: คำค้นหาที่กรอกในช่องค้นหา
  const [searchKeyword, setSearchKeyword] = useState("");
  // state suggestions: suggestion เฉพาะเวลาค้นหา
  const [suggestions, setSuggestions] = useState([]);
  // state showDropdown: เปิด/ปิด dropdown คำค้นหา
  const [showDropdown, setShowDropdown] = useState(false);
  // state categories: รายการหมวดหมู่ทั้งหมด
  const [categories, setCategories] = useState([]);
  // state isFirstTimeRender: ใช้ควบคุมการโหลดข้อมูลในครั้งแรก
  const [isFirstTimeRender, setIsFirstTimeRender] = useState(true);
  // state apiError: สำหรับแจ้ง error เมื่อดึง API ล้มเหลว
  const [apiError, setApiError] = useState(false);
  // state useFallbackData: (ฟีเจอร์เดิม ใช้ทดสอบ fallback แต่ปิดทิ้งไว้)
  const [useFallbackData, setUseFallbackData] = useState(false);

  // react-router hook สำหรับเปลี่ยนหน้า
  const navigate = useNavigate();
  // refreshTrigger: state dummy สำหรับ trigger การ refresh บังคับ
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- ฟัง event update จากแอดมิน เพื่อ refresh ---
  // ถ้ามี event 'postsUpdated' จะ trigger การ fetch โพสต์ใหม่
  useEffect(() => {
    const handlePostsUpdated = (event) => {
      // พอรับ event จะ trigger ให้ refresh posts
      setRefreshTrigger(prev => prev + 1);
    };
    window.addEventListener('postsUpdated', handlePostsUpdated);
    return () => {
      window.removeEventListener('postsUpdated', handlePostsUpdated);
    };
  }, []);

  // --- โหลดรายการหมวดหมู่ครั้งแรก ---
  useEffect(() => {
    if (isFirstTimeRender) {
      const fetchCategories = async () => {
        try {
          const responseCategories = await categoriesAPI.getAll();
          // ถ้าดึงสำเร็จ setCategories ด้วยผลลัพธ์
          if (responseCategories && responseCategories.length > 0) {
            setCategories(responseCategories);
          } else {
            setCategories([]);
          }
          setIsFirstTimeRender(false);
        } catch (error) {
          setCategories([]);
          setApiError(true);
          setIsFirstTimeRender(false);
        }
      };
      fetchCategories();
    }
  }, [isFirstTimeRender]);

  // --- โหลดโพสต์บทความตาม page/หมวดหมู่/refresh ---
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // หา categoryId จากชื่อหมวดหมู่ (ถ้าเลือกจาก categories)
        let categoryId = null;
        if (category !== "Highlight") {
          const selectedCat = categories.find(cat => cat.name === category);
          categoryId = selectedCat?.id || null;
        }
        // เรียก API ดึงโพสต์ (postsAPI.getAll)
        const response = await postsAPI.getAll({
          page,
          limit: 6,
          categoryId: categoryId
        });
        if (response && response.posts) {
          // แปลงข้อมูลให้ BlogCard ใช้งานได้ง่าย (flatten)
          const transformedPosts = response.posts.map((post) => {
            const categoryName = post.categories?.name || 'General';
            return {
              id: post.id,
              title: post.title,
              description: post.description,
              content: post.content,
              image: post.image,
              category: categoryName,
              author: 'Naiyana T.', // กำหนดชื่อผู้เขียนค่าคงที่
              date: post.date || post.created_at,
              likes: post.likes_count || 0
            };
          });
          // ถ้าเป็นหน้าแรกใช้โพสต์ใหม่, ถ้ากดโหลดเพิ่มให้เติมโพสต์
          if (page === 1) {
            setPosts(transformedPosts);
          } else {
            setPosts((prevPosts) => [...prevPosts, ...transformedPosts]);
          }
          // มีโพสต์เหลือให้โหลดอีกหรือไม่
          setHasMore(response.hasMore || false);
        } else {
          setPosts([]);
          setHasMore(false);
        }
        setIsLoading(false);
      } catch (error) {
        setPosts([]);
        setApiError(true);
        setIsLoading(false);
      }
    };
    fetchPosts();
    // dependencies: เวลาที่ page, category, refreshTrigger หรือ categories เปลี่ยน
  }, [page, category, refreshTrigger, categories]);

  // --- เวลาพิมพ์ค้นหา จะ search โพสต์ และแสดง suggestion ---
  useEffect(() => {
    if (searchKeyword.length > 0) {
      setIsLoading(true);
      const fetchSuggestions = async () => {
        try {
          const response = await postsAPI.getAll({
            page: 1,
            limit: 10,
            keyword: searchKeyword
          });
          if (response && response.posts) {
            const transformedSuggestions = response.posts.map((post) => ({
              id: post.id,
              title: post.title,
              description: post.description,
              category: post.categories?.name || 'General',
            }));
            setSuggestions(transformedSuggestions);
          } else {
            setSuggestions([]);
          }
          setIsLoading(false);
        } catch (error) {
          setSuggestions([]);
          setIsLoading(false);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchKeyword]);

  // กดปุ่ม load more เพื่อเปลี่ยน page แล้วโหลดโพสต์เพิ่มเติม
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Retry การเชื่อมต่อกับ API
  const retryConnection = () => {
    setUseFallbackData(false);
    setApiError(false);
    setIsFirstTimeRender(true);
    setPage(1);
    setPosts([]);
    setHasMore(true);
  };

  // --------------------- Rendering UI หลักของ Section ------------------------
  return (
    <div className="w-full max-w-7xl mx-auto md:px-6 lg:px-8 mb-20">
      <h2 className="text-xl font-bold mb-4 px-4" style={{ color: "black" }}>Latest articles</h2>

      {/* แสดงแถบ error ถ้ามีปัญหาการเชื่อมต่อ API */}
      {apiError && (
        <div className="mx-4 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800" style={{ color: "black" }}>
                API Server Unavailable
              </p>
            </div>
          </div>
          <button
            onClick={retryConnection}
            className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
            style={{ color: "black" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ส่วนบนประกอบด้วย: ช่องค้นหา + ตัวเลือกหมวดหมู่ (Dropdown หรือปุ่มแนวนอน) */}
      <div className="bg-red-100 px-4 py-4 md:py-3 md:rounded-sm flex flex-col space-y-4 md:gap-16 md:flex-row-reverse md:items-center md:space-y-0 md:justify-between mb-10">
        {/* ------- ช่องค้นหา ------- */}
        <div className="w-full md:max-w-sm">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
            <Input
              type="text"
              placeholder="Search"
              className="py-3 rounded-sm placeholder:text-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black text-black"
              onChange={(e) => setSearchKeyword(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => {
                // delay dropdown close ป้องกันคลิกปุ่ม suggestion หลุดโฟกัสก่อน
                setTimeout(() => {
                  setShowDropdown(false);
                }, 200);
              }}
              style={{ color: "black" }}
            />
            {/* แสดง dropdown suggestions เฉพาะเวลาค้นหาแล้วมีผลลัพธ์ */}
            {!isLoading &&
              showDropdown &&
              searchKeyword &&
              suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-background rounded-sm shadow-lg p-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="text-start px-4 py-2 block w-full text-sm hover:bg-[#EFEEEB] hover:text-muted-foreground hover:rounded-sm cursor-pointer"
                      style={{ color: "black" }}
                      onClick={() => navigate(`/post/${suggestion.id}`)}
                    >
                      {suggestion.title}
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>
        {/* ตัวเลือกหมวดหมู่: Mobile แสดงเป็น Select dropdown */}
        <div className="md:hidden w-full">
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setPosts([]);
              setPage(1);
              setHasMore(true);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full py-3 rounded-sm focus:ring-0 focus:ring-offset-0 focus:border-black" style={{ color: "black" }}>
              <SelectValue placeholder="Select category" style={{ color: "black" }}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Highlight" className="text-black">Highlight</SelectItem>
              {categories.map((cat) => {
                return (
                  <SelectItem key={cat.id} value={cat.name} className="text-black">
                    {cat.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* ตัวเลือกหมวดหมู่: Desktop แสดงเป็นปุ่มแนวนอน */}
        {isFirstTimeRender ? (
          // Loading skeleton สำหรับปุ่มหมวดหมู่ระหว่างรอดึง categories
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
                setPosts([]);
                setPage(1);
                setHasMore(true);
              }}
              className={`px-4 py-3 transition-colors rounded-sm text-sm font-medium ${
                category === "Highlight" ? "bg-[#DAD6D1]" : "hover:bg-muted"
              }`}
              style={{
                color: "black"
              }}
            >
              Highlight
            </button>
            {categories.map((cat) => (
              <button
                disabled={category === cat.name}
                key={cat.id}
                onClick={() => {
                  setCategory(cat.name);
                  setPosts([]);
                  setPage(1);
                  setHasMore(true);
                }}
                className={`px-4 py-3 transition-colors rounded-sm text-sm font-medium ${
                  category === cat.name ? "bg-[#DAD6D1]" : "hover:bg-muted"
                }`}
                style={{
                  color: "black"
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* ------- Render บทความ (BlogCard) ------- */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        {posts.length === 0 ? (
          <div className="col-span-2 text-center py-8">
           
          </div>
        ) : (
          // แสดง BlogCard ตามโพสต์ที่ได้
          posts.map((blog, index) => (
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
              titleClassName="text-black"
              categoryClassName="text-black"
              descriptionClassName="text-black"
            />
          ))
        )}
      </article>
      {/* ปุ่มโหลดเพิ่ม -- จะปรากฏเฉพาะเมื่อยังมีบทความให้ดึงเพิ่ม */}
      {hasMore && (
        <div className="text-center mt-20">
          <button
            onClick={handleLoadMore}
            className={`font-medium ${
              !isLoading ? "underline hover:text-muted-foreground" : ""
            }`}
            style={{ color: "black" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex flex-col items-center min-h-lvh">
                <Loader2 className="w-12 h-12 animate-spin text-foreground" />
                <p className="mt-4" style={{ color: "black" }}>Loading...</p>
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

