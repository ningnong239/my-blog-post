/* eslint-disable react/prop-types */
import { PenSquare, Trash2, X, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { postsService, categoriesService } from "@/services/supabaseService";
import { debugComponent, debugError } from "@/utils/debug";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function AdminArticleManagementPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        console.log("🔄 [AdminArticlePage] Fetching posts from Supabase...");
        console.log("🔧 [AdminArticlePage] Supabase client:", supabase);
        console.log("🔧 [AdminArticlePage] Supabase URL:", supabase.supabaseUrl);
        
        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("❌ [AdminArticlePage] Auth error:", authError);
          throw authError;
        }
        console.log("👤 [AdminArticlePage] Current user:", user);
        
        // Fetch posts from Supabase using postsService with all posts
        console.log("🔄 [AdminArticlePage] Attempting to fetch from posts table using postsService...");
        const { data: postsData, error: postsError } = await postsService.getPosts({
          page: 1,
          limit: 100, // Get more posts for admin
          category: null,
          keyword: null
        });

        console.log("🔍 [AdminArticlePage] Raw posts response:", { postsData, postsError });
        console.log("🔍 [AdminArticlePage] Posts data type:", typeof postsData);
        console.log("🔍 [AdminArticlePage] Posts data is array:", Array.isArray(postsData));
        console.log("🔍 [AdminArticlePage] Posts error details:", postsError);

        if (postsError) {
          console.error("❌ [AdminArticlePage] Posts error:", postsError);
          throw postsError;
        }

        console.log("✅ [AdminArticlePage] Posts service response:", postsData);
        
        // Extract posts from service response and transform data
        const actualPosts = postsData?.posts || [];
        console.log("📊 [AdminArticlePage] Posts count:", actualPosts?.length || 0);
        console.log("📊 [AdminArticlePage] Total count:", postsData?.totalCount || 0);
        
        if (actualPosts && actualPosts.length > 0) {
          console.log("📝 [AdminArticlePage] First post:", actualPosts[0]);
          
          // Transform posts data to match expected format
          const transformedPosts = actualPosts.map(post => ({
            id: post.id,
            title: post.title,
            description: post.description,
            content: post.content,
            image: post.image,
            category: post.categories?.name || 'General',
            status: post.status_id === 2 ? 'published' : 'draft',
            author: post.author_id || 'Admin',
            date: post.date,
            likes_count: post.likes_count || 0
          }));
          
          console.log("🔄 [AdminArticlePage] Transformed posts:", transformedPosts);
          setPosts(transformedPosts);
          setFilteredPosts(transformedPosts);
        } else {
          console.log("⚠️ [AdminArticlePage] No posts found in database, using mock data");
          
          // Mock data fallback
          const mockPosts = [
            {
              id: 1,
              title: "Getting Started as a Developer: Your First Steps into the Programming World",
              description: "A beginner-friendly guide for those interested in becoming a developer—covering the essentials, must-have skills, and practical tips to kickstart your dev career.",
              content: "## 1. What is a Developer?\n\nA developer, or programmer, is someone who builds and creates software, websites, or applications to fulfill user needs and solve problems.",
              image: "https://wallpaperaccess.com/full/1947431.jpg",
              category: "Dev",
              status: "published",
              author: "Naiyana T.",
              date: "2025-10-18T09:20:47.225Z",
              likes_count: 199
            },
            {
              id: 2,
              title: "Cooking in English: Essential Vocabulary and Phrases for the Kitchen",
              description: "Expand your English skills with must-know vocabulary, phrases, and conversations for cooking and following recipes.",
              content: "## 1. Common Cooking Verbs\n\n- **Boil** (ต้ม)\n- **Chop** (หั่น)\n- **Stir** (คน)",
              image: "https://th.bing.com/th/id/R.f1e57c17c4c4bfd213a606cfbc892ad5",
              category: "LifeStyle",
              status: "published",
              author: "Naiyana T.",
              date: "2024-08-21T09:20:47.225Z",
              likes_count: 123
            },
            {
              id: 3,
              title: "Movie Night: Learning English While Watching Films",
              description: "Unlock effective ways to improve your English skills by watching movies, including tips for active viewing and vocabulary building.",
              content: "## 1. Benefits of Watching Movies to Learn English\n\nWatching movies is an enjoyable way to enhance your listening skills, expand your vocabulary, and get familiar with different accents.",
              image: "https://tse3.mm.bing.net/th/id/OIP.BIWltfRDERVV4TThY3CWBwHaE8",
              category: "LifeStyle",
              status: "published",
              author: "Naiyana T.",
              date: "2025-10-18T09:20:47.225Z",
              likes_count: 21
            },
            {
              id: 4,
              title: "Level Up! The Benefits of Playing Games",
              description: "Discover how playing games can improve your skills, creativity, and English vocabulary, along with tips for balanced gaming.",
              content: "## 1. Skills Gained from Gaming\n\nPlaying games helps build focus, quick problem-solving, and decision-making abilities.",
              image: "https://i.ytimg.com/vi/X1tBEKFYKJg/maxresdefault.jpg",
              category: "General",
              status: "published",
              author: "Naiyana T",
              date: "2025-10-18T09:20:47.225Z",
              likes_count: 32
            },
           
          ];
          
          console.log("🔄 [AdminArticlePage] Using mock data:", mockPosts);
          console.log("📊 [AdminArticlePage] Mock posts count:", mockPosts.length);
          setPosts(mockPosts);
          setFilteredPosts(mockPosts);
        }

        // Fetch categories from Supabase using categoriesService
        console.log("🔄 [AdminArticlePage] Fetching categories from Supabase...");
        const { data: categoriesData, error: categoriesError } = await categoriesService.getCategories();

        console.log("🔍 [AdminArticlePage] Raw categories response:", { categoriesData, categoriesError });

        if (categoriesError) {
          console.error("❌ [AdminArticlePage] Categories error:", categoriesError);
          throw categoriesError;
        }

        console.log("✅ [AdminArticlePage] Categories data:", categoriesData);
        console.log("📊 [AdminArticlePage] Categories count:", categoriesData?.length || 0);
        
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          console.log("⚠️ [AdminArticlePage] No categories found in database, using mock data");
          
          // Mock categories fallback
          const mockCategories = [
            { id: 1, name: "Dev", created_at: new Date().toISOString() },
            { id: 2, name: "LifeStyle", created_at: new Date().toISOString() },
            { id: 3, name: "General", created_at: new Date().toISOString() }
          ];
          
          console.log("🔄 [AdminArticlePage] Using mock categories:", mockCategories);
          setCategories(mockCategories);
        }
      } catch (error) {
        debugError(error, "fetchPosts");
        console.error("💥 [AdminArticlePage] Error fetching data:", error);
        console.error("💥 [AdminArticlePage] Error message:", error.message);
        console.error("💥 [AdminArticlePage] Error details:", error);
        
        console.log("🔄 [AdminArticlePage] Using fallback data due to error");
        
        // Fallback data when error occurs
        const fallbackPosts = [
          {
            id: 1,
            title: "Getting Started as a Developer: Your First Steps into the Programming World",
            description: "A beginner-friendly guide for those interested in becoming a developer—covering the essentials, must-have skills, and practical tips to kickstart your dev career.",
            content: "## 1. What is a Developer?\n\nA developer, or programmer, is someone who builds and creates software, websites, or applications to fulfill user needs and solve problems.",
            image: "https://wallpaperaccess.com/full/1947431.jpg",
            category: "Dev",
            status: "published",
            author: "Naiyana T.",
            date: "2025-10-18T09:20:47.225Z",
            likes_count: 199
          },
          {
            id: 2,
            title: "Cooking in English: Essential Vocabulary and Phrases for the Kitchen",
            description: "Expand your English skills with must-know vocabulary, phrases, and conversations for cooking and following recipes.",
            content: "## 1. Common Cooking Verbs\n\n- **Boil** (ต้ม)\n- **Chop** (หั่น)\n- **Stir** (คน)",
            image: "https://th.bing.com/th/id/R.f1e57c17c4c4bfd213a606cfbc892ad5",
            category: "LifeStyle",
            status: "published",
            author: "Naiyana T.",
            date: "2024-08-21T09:20:47.225Z",
            likes_count: 123
          },
          {
            id: 3,
            title: "Movie Night: Learning English While Watching Films",
            description: "Unlock effective ways to improve your English skills by watching movies, including tips for active viewing and vocabulary building.",
            content: "## 1. Benefits of Watching Movies to Learn English\n\nWatching movies is an enjoyable way to enhance your listening skills, expand your vocabulary, and get familiar with different accents.",
            image: "https://tse3.mm.bing.net/th/id/OIP.BIWltfRDERVV4TThY3CWBwHaE8",
            category: "LifeStyle",
            status: "published",
            author: "Naiyana T.",
            date: "2025-10-18T09:20:47.225Z",
            likes_count: 21
          }
        ];
        
        const fallbackCategories = [
          { id: 1, name: "Dev", created_at: new Date().toISOString() },
          { id: 2, name: "LifeStyle", created_at: new Date().toISOString() },
          { id: 3, name: "General", created_at: new Date().toISOString() }
        ];
        
        console.log("🔄 [AdminArticlePage] Using fallback posts:", fallbackPosts);
        console.log("🔄 [AdminArticlePage] Using fallback categories:", fallbackCategories);
        
        setPosts(fallbackPosts);
        setFilteredPosts(fallbackPosts);
        setCategories(fallbackCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    console.log("🔍 [AdminArticlePage] Filtering posts...");
    console.log("🔍 [AdminArticlePage] Original posts:", posts);
    console.log("🔍 [AdminArticlePage] Search keyword:", searchKeyword);
    console.log("🔍 [AdminArticlePage] Selected category:", selectedCategory);
    console.log("🔍 [AdminArticlePage] Selected status:", selectedStatus);
    
    let filtered = posts;

    if (searchKeyword) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          post.description
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          post.content.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      console.log("🔍 [AdminArticlePage] After search filter:", filtered);
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        post.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
      console.log("🔍 [AdminArticlePage] After category filter:", filtered);
    }

    if (selectedStatus) {
      filtered = filtered.filter((post) =>
        post.status.toLowerCase().includes(selectedStatus.toLowerCase())
      );
      console.log("🔍 [AdminArticlePage] After status filter:", filtered);
    }

    console.log("🔍 [AdminArticlePage] Final filtered posts:", filtered);
    console.log("🔍 [AdminArticlePage] Filtered count:", filtered.length);
    setFilteredPosts(filtered);
  }, [searchKeyword, selectedCategory, selectedStatus, posts]);

  const handleDelete = async (postId) => {
    try {
      setIsLoading(true);
      console.log("🔄 [AdminArticlePage] Deleting post from Supabase:", postId);
      
      const { error } = await postsService.deletePost(postId);

      if (error) {
        console.error("❌ [AdminArticlePage] Delete error:", error);
        throw error;
      }

      console.log("✅ [AdminArticlePage] Post deleted successfully");
      
      // Dispatch event เพื่อบอก components อื่นว่ามีการลบข้อมูล
      window.dispatchEvent(new CustomEvent('postsUpdated', { 
        detail: { postId, action: 'delete' } 
      }));
      console.log("📡 [AdminArticlePage] Dispatched postsUpdated event (delete)");
      
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Deleted article successfully
            </h2>
            <p className="text-sm">The article has been removed.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      setPosts(posts.filter((post) => post.id !== postId));
    } catch {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Failed to delete article</h2>
            <p className="text-sm">
              Something went wrong. Please try again later.
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
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Article management</h2>
          <div className="flex space-x-4">
            <Button
              className="px-8 py-2 rounded-full"
              onClick={() => navigate("/admin/category-management")}
            >
              <FolderOpen className="mr-2 h-4 w-4" /> Category management
            </Button>
            <Button
              className="px-8 py-2 rounded-full"
              onClick={() => navigate("/admin/create-article")}
            >
              <PenSquare className="mr-2 h-4 w-4" /> Create article
            </Button>
          </div>
        </div>
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            />
          </div>
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-[180px] py-3 rounded-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:border-muted-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-[180px] py-3 rounded-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:border-muted-foreground">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Article title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {console.log("🔍 [AdminArticlePage] Rendering table - isLoading:", isLoading, "filteredPosts:", filteredPosts, "posts:", posts)}
            {isLoading ? (
              Array(9)
                .fill()
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-[250px] bg-[#EFEEEB]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[150px] bg-[#EFEEEB]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[100px] bg-[#EFEEEB]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[50px] bg-[#EFEEEB]" />
                    </TableCell>
                  </TableRow>
                ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex capitalize items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        article.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {article.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/edit-article/${article.id}`)
                      }
                    >
                      <PenSquare className="h-4 w-4 hover:text-muted-foreground" />
                    </Button>
                    <DeletePostDialog
                      onDelete={() => handleDelete(article.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center font-medium pt-8">
                  No posts found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}

function DeletePostDialog({ onDelete }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 hover:text-muted-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-md pt-16 pb-6 max-w-[22rem] sm:max-w-md flex flex-col items-center">
        <AlertDialogTitle className="text-3xl font-semibold pb-2 text-center">
          Delete Post
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-row mb-2 justify-center font-medium text-center text-muted-foreground">
          Do you want to delete this post?
        </AlertDialogDescription>
        <div className="flex flex-row gap-4">
          <AlertDialogCancel className="bg-background px-10 py-6 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={onDelete}
            className="rounded-full text-white bg-foreground hover:bg-muted-foreground transition-colors py-6 text-lg px-10"
          >
            Delete
          </Button>
        </div>
        <AlertDialogCancel className="absolute right-4 top-2 sm:top-4 p-1 border-none">
          <X className="h-6 w-6" />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
