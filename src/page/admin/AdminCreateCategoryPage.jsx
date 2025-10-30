import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminSidebar } from "@/components/AdminSidebar";
import axios from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { postsService } from "@/services/supabaseService";

export default function AdminCreateCategoryPage() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState(""); // To hold category name input
  const [isSaving, setIsSaving] = useState(false); // To manage saving state
  const [errorMessage, setErrorMessage] = useState("");
  const [allPosts, setAllPosts] = useState([]); // เก็บ posts ทั้งหมด
  const [isLoadingPosts, setIsLoadingPosts] = useState(false); // สถานะการโหลด posts

  // ===== เพิ่ม useEffect เพื่อดึง Posts ทั้งหมด =====
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setIsLoadingPosts(true);
        console.log("🔄 [AdminCreateCategory] Fetching all posts from Supabase...");
        console.log("📡 [AdminCreateCategory] Calling postsService.getPosts()...");
        
        const postsResult = await postsService.getPosts({
          page: 1,
          limit: 100, // ดึงมาเยอะๆ เพื่อดูทั้งหมด
        });

        console.log("📦 [AdminCreateCategory] ===== GET ALL POSTS RESULT =====");
        console.log("✅ [AdminCreateCategory] Posts API connected successfully!");
        console.log("📊 [AdminCreateCategory] Full result:", postsResult);
        
        if (postsResult.error) {
          console.error("❌ [AdminCreateCategory] Posts error:", postsResult.error);
        } else if (postsResult.data) {
          console.log("📝 [AdminCreateCategory] Posts data:", postsResult.data);
          console.log("📈 [AdminCreateCategory] Total posts count:", postsResult.data.posts?.length || 0);
          console.log("📈 [AdminCreateCategory] Total pages:", postsResult.data.totalPages);
          console.log("📈 [AdminCreateCategory] Current page:", postsResult.data.currentPage);
          console.log("📈 [AdminCreateCategory] Has more:", postsResult.data.hasMore);
          
          // แสดงโพสต์แต่ละตัว
          if (postsResult.data.posts && postsResult.data.posts.length > 0) {
            console.log("📋 [AdminCreateCategory] ===== LIST OF ALL POSTS =====");
            postsResult.data.posts.forEach((post, index) => {
              console.log(`📄 [AdminCreateCategory] Post #${index + 1}:`, {
                id: post.id,
                title: post.title,
                category: post.categories?.name,
                category_id: post.category_id,
                status_id: post.status_id,
                likes_count: post.likes_count,
                date: post.date,
                description: post.description?.substring(0, 50) + "...",
              });
            });
            console.log("📋 [AdminCreateCategory] ===== END OF POSTS LIST =====");
          } else {
            console.log("⚠️ [AdminCreateCategory] No posts found in database");
          }
          
          setAllPosts(postsResult.data.posts || []);
        }
        console.log("🎉 [AdminCreateCategory] ===== FETCH COMPLETED =====");

      } catch (error) {
        console.error("💥 [AdminCreateCategory] Error fetching posts:", error);
        console.error("💥 [AdminCreateCategory] Error details:", {
          message: error.message,
          stack: error.stack,
        });
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchAllPosts();
  }, []); // Run once on component mount

  const handleSave = async () => {
    if (!categoryName) {
      // Handle validation for empty category name
      setErrorMessage("Category name is required.");
      return;
    }

    setIsSaving(true);

    try {
      console.log("🔄 [AdminCreateCategory] Creating category in Supabase...");
      console.log("📤 [AdminCreateCategory] Category name:", categoryName);
      
      // Create category in Supabase
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryName
        });

      if (error) {
        console.error("❌ [AdminCreateCategory] Create error:", error);
        console.error("❌ [AdminCreateCategory] Error details:", {
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details,
        });
        throw error;
      }

      console.log("✅ [AdminCreateCategory] Category created successfully:", data);

      // Show success toast
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Created category successfully
            </h2>
            <p className="text-sm">
              Your category has been successfully created.
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));

      // Optionally reset the form and show a success message
      setCategoryName(""); // Clear the input after saving
      navigate("/admin/category-management");
    } catch {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Failed to create category
            </h2>
            <p className="text-sm">
              Something went wrong while creating the category. Please try again
              later.
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create Category</h2>
          <Button
            className="px-8 py-2 rounded-full"
            onClick={handleSave} // Trigger the save function when clicked
            disabled={isSaving} // Disable button while saving
          >
            Save
          </Button>
        </div>
        <div className="space-y-7 max-w-md">
          <div className="relative space-y-1">
            <label
              htmlFor="category-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name
            </label>
            <Input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)} // Bind input value to state
              placeholder="Category name"
              className={`mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground ${
                errorMessage ? "border-red-500" : ""
              }`}
            />
            {errorMessage && (
              <p className="text-red-500 text-xs absolute">{errorMessage}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
