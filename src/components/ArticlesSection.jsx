/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { postsAPI, categoriesAPI } from "../config/api";
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

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories only on the first render
    if (isFirstTimeRender) {
      const fetchCategories = async () => {
        try {
          const responseCategories = await categoriesAPI.getAll();
          setCategories(responseCategories);
          setIsFirstTimeRender(false); // Mark the first render logic as done
        } catch (error) {
          console.log("Categories API error:", error);
          // Use fallback categories if API fails
          const fallbackCategories = [
            { id: 1, name: "General" },
            { id: 2, name: "Technology" },
            { id: 3, name: "Lifestyle" }
          ];
          setCategories(fallbackCategories);
          setIsFirstTimeRender(false);
        }
      };

      fetchCategories();
    }
  }, [isFirstTimeRender]);

  useEffect(() => {
    // Fetch posts when page or category changes
    const fetchPosts = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await postsAPI.getAll();
        if (page === 1) {
          setPosts(response.posts || response); // Replace posts on the first page load
        } else {
          setPosts((prevPosts) => [...prevPosts, ...(response.posts || response)]); // Append on subsequent pages
        }
        setIsLoading(false); // Stop loading
        if (response.currentPage >= response.totalPages) {
          setHasMore(false); // No more posts to load
        }
      } catch (error) {
        console.log("Posts API error:", error);
        // Use fallback posts if API fails
        const fallbackPosts = [
          {
            id: 1,
            title: "Welcome to the Blog",
            description: "This is a sample post while the database is being fixed.",
            author: "Admin",
            date: new Date().toISOString(),
            category: "General",
            image: null
          }
        ];
        setPosts(fallbackPosts);
        setIsLoading(false); // Handle error and stop loading
      }
    };

    fetchPosts(); // Call fetchPosts when category or page changes
  }, [page, category]); // Effect depends on page and category

  useEffect(() => {
    if (searchKeyword.length > 0) {
      setIsLoading(true);
      const fetchSuggestions = async () => {
        try {
          const response = await postsAPI.getAll();
          setSuggestions(response.posts || response); // Set search suggestions
          setIsLoading(false);
        } catch {
          setIsLoading(false);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]); // Clear suggestions if keyword is empty
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
        {posts.map((blog, index) => {
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
        })}
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


