import authorImage from "../assets/ning.jpg";
import { useNavigate } from "react-router-dom";

/**
 * BlogCard component that only uses data from Supabase/API.
 * No fallback to mock data - shows error if data is missing.
 */
export function BlogCard({
  id,
  image,
  category,
  title,
  description,
  author,
  date,
  // Optional debug info
  debugInfo = null,
}) {
  const navigate = useNavigate();

  // Check for missing required fields
  const missingFields = [];
  if (!id) missingFields.push("id");
  if (!image) missingFields.push("image");
  if (!category) missingFields.push("category");
  if (!title) missingFields.push("title");
  if (!description) missingFields.push("description");
  if (!author) missingFields.push("author");
  if (!date) missingFields.push("date");

  // Show error card if any required data is missing
  if (missingFields.length > 0) {
    console.log("❌ [BlogCard] Missing fields:", missingFields);
    console.log("❌ [BlogCard] Card data:", { id, title, category, author, date });
    
    return (
      <div className="flex flex-col items-center justify-center border rounded-md p-8 min-h-[340px] bg-red-50 text-red-400 font-semibold text-lg select-none">
        <div className="text-center">
          <div className="mb-2">❌ ข้อมูลไม่ครบถ้วน</div>
          <div className="text-sm font-normal text-red-300">
            Missing: {missingFields.join(", ")}
          </div>
          {debugInfo && (
            <pre className="mt-2 text-xs text-red-200 opacity-80 text-left w-full overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  // Use data directly from Supabase/API (no fallbacks)
  const safeCategory = category;
  const safeImage = image;
  const safeDescription = description;
  const safeAuthor = author;
  const safeDate = date;
  const safeTitle = title;

  const handleClick = () => {
    console.log("🔍 [BlogCard] Navigating to post:", id);
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
