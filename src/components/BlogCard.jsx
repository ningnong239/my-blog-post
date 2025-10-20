import authorImage from "../assets/ning.jpg";
import { useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";

/**
 * BlogCard with fallback to local data when API fails.
 * If any core field is missing, tries to use fallback data from blogPosts.js
 * before showing error state.
 *
 * - Uses fallback data from blogPosts.js when API data is incomplete
 * - Shows user-friendly Thai error only when no fallback data available
 * - If any field is missing, substitutes "ไม่มีข้อมูล" where practical.
 */
export function BlogCard({
  id,
  image,
  category,
  title,
  description,
  author,
  date,
  // Optionally allow parent to inject a general API error to surface
  apiError = null,
  debugInfo = null,
  // Fallback data from parent component
  fallbackData = null,
}) {
  const navigate = useNavigate();

  // Fields to check for missing data
  const missingFields = [];
  if (!id) missingFields.push("id");
  if (!image) missingFields.push("image");
  if (!category) missingFields.push("category");
  if (!title) missingFields.push("title");
  if (!description) missingFields.push("description");
  if (!author) missingFields.push("author");
  if (!date) missingFields.push("date");

  // Try to use fallback data if main data is missing
  const useFallbackData = missingFields.length > 0 || apiError;
  let fallbackPost = null;
  
  if (useFallbackData && fallbackData) {
    // Use provided fallback data
    fallbackPost = fallbackData;
  } else if (useFallbackData && id) {
    // Try to find matching post in blogPosts by id
    fallbackPost = blogPosts.find(post => post.id === id);
  }

  // If we have fallback data, use it instead of showing error
  if (useFallbackData && fallbackPost) {
    // Override missing fields with fallback data
    const finalId = id || fallbackPost.id;
    const finalImage = image || fallbackPost.image;
    const finalCategory = category || fallbackPost.category;
    const finalTitle = title || fallbackPost.title;
    const finalDescription = description || fallbackPost.description;
    const finalAuthor = author || fallbackPost.author;
    const finalDate = date || fallbackPost.date;

    // Use the fallback data for rendering
    const safeCategory = finalCategory || "ไม่มีข้อมูล";
    const safeImage = finalImage || "";
    const safeDescription = finalDescription || "ไม่มีข้อมูล";
    const safeAuthor = finalAuthor || "ไม่มีข้อมูล";
    const safeDate = finalDate && typeof finalDate === "string" && finalDate.length > 0 ? finalDate : "ไม่มีข้อมูล";
    const safeTitle = finalTitle || "ไม่มีข้อมูล";

    const handleClick = () => {
      if (!finalId) {
        alert("ไม่พบข้อมูลบทความนี้");
        return;
      }
      navigate(`/post/${finalId}`);
    };

    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={handleClick}
          className="relative h-[212px] sm:h-[360px]"
          disabled={!finalId}
          aria-label={safeTitle}
        >
          <img
            className="w-full h-full object-cover rounded-md"
            src={safeImage}
            alt={safeTitle}
            loading="lazy"
          />
        </button>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
              {safeCategory}
            </span>
          </div>
          <button onClick={handleClick} disabled={!finalId}>
            <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {safeTitle}
            </h2>
          </button>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
            {safeDescription}
          </p>
          <div className="flex items-center text-sm">
            <img
              className="w-8 h-8 object-cover rounded-full mr-2"
              src={authorImage}
              alt={safeAuthor}
            />
            <span>{safeAuthor}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{safeDate}</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error card only if no fallback data available
  if (apiError || missingFields.length) {
    return (
      <div className="flex flex-col items-center justify-center border rounded-md p-8 min-h-[340px] bg-gray-50 text-gray-400 font-semibold text-lg select-none">
        <div>
          ข้อมูลจาก supabase ไม่เข้า
        </div>
        <div className="mt-1 text-red-400 font-normal text-base text-center break-words">
          {apiError
            ? `API Error: ${apiError}`
            : null}
        </div>
        <div className="mt-2 text-base text-gray-300 font-normal">
          Missing: {missingFields.length ? missingFields.join(", ") : "none"}
        </div>
        {!!debugInfo && (
          <pre className="mt-1 text-xs text-gray-300 opacity-80 text-left w-full overflow-x-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  // Defensive fallback for fields (if data weirdly null/blank etc)
  const safeCategory = category || "ไม่มีข้อมูล";
  const safeImage = image || "";
  const safeDescription = description || "ไม่มีข้อมูล";
  const safeAuthor = author || "ไม่มีข้อมูล";
  const safeDate =
    date && typeof date === "string" && date.length > 0 ? date : "ไม่มีข้อมูล";
  const safeTitle = title || "ไม่มีข้อมูล";

  const handleClick = () => {
    if (!id) {
      alert("ไม่พบข้อมูลบทความนี้");
      return;
    }
    navigate(`/post/${id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleClick}
        className="relative h-[212px] sm:h-[360px]"
        disabled={!id}
        aria-label={safeTitle}
      >
        <img
          className="w-full h-full object-cover rounded-md"
          src={safeImage}
          alt={safeTitle}
          loading="lazy"
        />
      </button>
      <div className="flex flex-col">
        <div className="flex">
          <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
            {safeCategory}
          </span>
        </div>
        <button onClick={handleClick} disabled={!id}>
          <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
            {safeTitle}
          </h2>
        </button>
        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          {safeDescription}
        </p>
        <div className="flex items-center text-sm">
          <img
            className="w-8 h-8 object-cover rounded-full mr-2"
            src={authorImage}
            alt={safeAuthor}
          />
          <span>{safeAuthor}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{safeDate}</span>
        </div>
      </div>
    </div>
  );
}
