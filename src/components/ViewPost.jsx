/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Facebook,
  Linkedin,
  Twitter,
  SmilePlus,
  Copy,
  Loader2,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import authorImage from "../assets/ning.jpg";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authentication";
import { postsAPI } from "@/config/api";
import { postsService } from "@/services/supabaseService";
import { blogPosts } from "../data/blogPosts";

export default function ViewPost() {
  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [useFallbackData, setUseFallbackData] = useState(false);

  const param = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  const user = state.user;

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param.postId]); // Re-fetch when postId changes

  const getPost = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 [ViewPost] Fetching post data for ID:", param.postId);
      
      // Get post data from Supabase
      const postsResponse = await postsAPI.getById(param.postId);
      console.log("✅ [ViewPost] Post data received:", postsResponse);
      
      setImg(postsResponse.image);
      setTitle(postsResponse.title);
      setDate(postsResponse.date);
      setDescription(postsResponse.description);
      setCategory(postsResponse.category);
      setContent(postsResponse.content);
      
      // Use likes_count (the actual field in Supabase)
      const currentLikes = postsResponse.likes_count || postsResponse.likes || 0;
      console.log("👍 [ViewPost] Current likes count:", currentLikes);
      setLikes(currentLikes);
      
      // Get comments from Supabase
      const commentsResult = await postsService.getComments?.(param.postId);
      if (commentsResult?.data) {
        setComments(commentsResult.data);
      } else {
        // Fallback to external API if Supabase comments service not available
        const commentsResponse = await axios.get(
          `https://myblogpostserver.vercel.app/posts/${param.postId}/comments`
        );
        setComments(commentsResponse.data);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("💥 [ViewPost] Post API error:", error);
      // Use fallback post from mock data if API fails
      const fallbackPost = blogPosts.find(post => post.id === parseInt(param.postId)) || blogPosts[0];
      setImg(fallbackPost.image);
      setTitle(fallbackPost.title);
      setDate(fallbackPost.date);
      setDescription(fallbackPost.description);
      setCategory(fallbackPost.category);
      setContent(fallbackPost.content);
      setLikes(fallbackPost.likes || 0);
      setComments([]); // No comments for fallback data
      setUseFallbackData(true); // Set fallback data flag
      setIsLoading(false);
    }
  };

  // Function to refresh only likes count (without reloading entire post)
  const refreshLikesCount = async () => {
    try {
      console.log("🔄 [ViewPost] Refreshing likes count for post:", param.postId);
      // Force refresh to get the latest value from database
      const postsResponse = await postsAPI.getById(param.postId, true);
      const currentLikes = postsResponse.likes_count || postsResponse.likes || 0;
      console.log("✅ [ViewPost] Refreshed likes count:", currentLikes);
      setLikes(currentLikes);
      return currentLikes;
    } catch (error) {
      console.error("💥 [ViewPost] Failed to refresh likes:", error);
      return null;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className="max-w-7xl mx-auto space-y-8 container md:px-8 pb-20 md:pb-28 md:pt-8 lg:pt-16">
      
      <div className="space-y-4 md:px-4">
        <img
          src={img}
          alt={title}
          className="md:rounded-lg object-cover w-full h-[260px] sm:h-[340px] md:h-[587px]"
        />
      </div>
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="xl:w-3/4 space-y-8">
          <article className="px-4">
            <div className="flex">
              <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
                {category}
              </span>
              <span className="px-3 py-1 text-sm font-normal text-muted-foreground">
                {new Date(date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-4 mb-10">{description}</p>
            <div className="markdown">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </article>

          <div className="xl:hidden px-4">
            <AuthorBio />
          </div>

          <Share
            likesAmount={likes}
            setDialogState={setIsDialogOpen}
            user={user}
            setLikes={setLikes}
            refreshLikesCount={refreshLikesCount}
          />
          <Comment
            setDialogState={setIsDialogOpen}
            commentList={comments}
            user={user}
            setComments={setComments}
            useFallbackData={useFallbackData}
          />
        </div>

        <div className="hidden xl:block xl:w-1/4">
          <div className="sticky top-4">
            <AuthorBio />
          </div>
        </div>
      </div>
      <CreateAccountModal
        dialogState={isDialogOpen}
        setDialogState={setIsDialogOpen}
      />
    </div>
  );
}

function Share({ likesAmount, setDialogState, user, setLikes, refreshLikesCount }) {
  const shareLink = encodeURI(window.location.href);
  const param = useParams();
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = async () => {
    if (!user) {
      return setDialogState(true);
    }

    setIsLiking(true);
    try {
      console.log("👍 [ViewPost] User clicked like button for post:", param.postId);
      
      // Try to like the post using Supabase
      const likeResult = await postsService.likePost(param.postId);
      
      if (likeResult.error) {
        console.error("❌ [ViewPost] Like error:", likeResult.error);
        throw likeResult.error;
      }

      console.log("✅ [ViewPost] Like successful! Result:", likeResult.data);

      // Refresh likes count from database to get the actual current value
      if (refreshLikesCount) {
        await refreshLikesCount();
      } else if (likeResult.data && likeResult.data.likes_count !== undefined) {
        // Fallback: Update from result
        console.log("✅ [ViewPost] Updated likes from result:", likeResult.data.likes_count);
        setLikes(likeResult.data.likes_count);
      }
      
      // Show success toast
      toast.success("Liked! 👍");
    } catch (error) {
      console.error("💥 [ViewPost] Error handling like:", error);
      // Show error toast
      toast.error("Failed to like post. Please try again.");
      
      // If Supabase fails, try external API as fallback
      try {
        await axios.post(
          `https://myblogpostserver.vercel.app/posts/${param.postId}/likes`
        );
        const likesResponse = await axios.get(
          `https://myblogpostserver.vercel.app/posts/${param.postId}/likes`
        );
        setLikes(likesResponse.data.like_count);
      } catch (apiError) {
        console.error("💥 [ViewPost] External API also failed:", apiError);
        // If all APIs fail, just increment locally
        setLikes(prevLikes => prevLikes + 1);
      }
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <div className="md:px-4">
      <div className="bg-[#EFEEEB] py-4 px-4 md:rounded-sm flex flex-col space-y-4 md:gap-16 md:flex-row md:items-center md:space-y-0 md:justify-between mb-10">
        <button
          onClick={handleLikeClick}
          disabled={isLiking}
          className={`flex items-center justify-center space-x-2 px-11 py-3 rounded-full text-foreground border border-foreground transition-colors group ${
            isLiking
              ? "bg-gray-200 cursor-not-allowed text-gray-500 border-gray-300"
              : "bg-white hover:border-muted-foreground hover:text-muted-foreground"
          }`}
        >
          <SmilePlus className="w-5 h-5 text-foreground group-hover:text-muted-foreground transition-colors" />
          <span className="text-foreground group-hover:text-muted-foreground font-medium transition-colors">
            {likesAmount}
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
              toast.custom((t) => (
                <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start max-w-md w-full">
                  <div>
                    <h2 className="font-bold text-lg mb-1">Copied!</h2>
                    <p className="text-sm">
                      This article has been copied to your clipboard.
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
            }}
            className="bg-white flex flex-1 items-center justify-center space-x-2 px-11 py-3 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors group"
          >
            <Copy className="w-5 h-5 text-foreground transition-colors group-hover:text-muted-foreground" />
            <span className="text-foreground font-medium transition-colors group-hover:text-muted-foreground">
              Copy
            </span>
          </button>
          <a
            href={`https://www.facebook.com/share.php?u=${shareLink}`}
            target="_blank"
            className="bg-white p-3 rounded-full border text-foreground border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
          >
            <Facebook className="h-6 w-6" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`}
            target="_blank"
            className="bg-white p-3 rounded-full border text-foreground border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a
            href={`https://www.twitter.com/share?&url=${shareLink}`}
            target="_blank"
            className="bg-white p-3 rounded-full border text-foreground border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
          >
            <Twitter className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Comment({ setDialogState, commentList, setComments, user, useFallbackData }) {
  const [commentText, setCommentText] = useState("");
  const [isError, setIsError] = useState(false);
  const param = useParams();
  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setIsError(true);
    } else {
      // Submit the comment
      setIsError(false);
      const commentToSubmit = commentText;
      setCommentText("");
      
      if (useFallbackData) {
        // For fallback data, just add comment locally
        const newComment = {
          id: Date.now(),
          comment_text: commentToSubmit,
          name: user?.user_metadata?.full_name || "Anonymous",
          profile_pic: user?.user_metadata?.avatar_url || "https://via.placeholder.com/40",
          created_at: new Date().toISOString()
        };
        setComments(prev => [...prev, newComment]);
        toast.custom((t) => (
          <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start max-w-md w-full">
            <div>
              <h2 className="font-bold text-lg mb-1">Comment Posted!</h2>
              <p className="text-sm">
                Your comment has been added locally (offline mode).
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
      } else {
        // For normal API mode - try Supabase first
        try {
          const commentData = {
            post_id: parseInt(param.postId),
            comment_text: commentToSubmit,
            user_id: user.id,
            name: user.user_metadata?.full_name || "Anonymous",
            profile_pic: user.user_metadata?.avatar_url || "https://via.placeholder.com/40"
          };

          const result = await postsService.createComment?.(commentData);
          if (result?.data) {
            // Get updated comments from Supabase
            const commentsResult = await postsService.getComments?.(param.postId);
            if (commentsResult?.data) {
              setComments(commentsResult.data);
            }
          } else {
            // Fallback to external API
            await axios.post(
              `https://myblogpostserver.vercel.app/posts/${param.postId}/comments`,
              { comment: commentText }
            );
            const commentsResponse = await axios.get(
              `https://myblogpostserver.vercel.app/posts/${param.postId}/comments`
            );
            setComments(commentsResponse.data);
          }

          toast.custom((t) => (
            <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start max-w-md w-full">
              <div>
                <h2 className="font-bold text-lg mb-1">Comment Posted!</h2>
                <p className="text-sm">
                  Your comment has been successfully added to this post.
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
        } catch (error) {
          console.error("Error posting comment:", error);
          toast.custom((t) => (
            <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start max-w-md w-full">
              <div>
                <h2 className="font-bold text-lg mb-1">Error!</h2>
                <p className="text-sm">
                  Failed to post comment. Please try again.
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
        }
      }
    }
  };

  return (
    <div>
      <div className="space-y-4 px-4 mb-16">
        <h3 className="text-lg font-semibold">Comment</h3>
        <form className="space-y-2 relative" onSubmit={handleSendComment}>
          <Textarea
            value={commentText}
            onFocus={() => {
              setIsError(false);
              if (!user) {
                return setDialogState(true);
              }
            }}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="What are your thoughts?"
            className={`w-full p-4 h-24 resize-none py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground ${
              isError ? "border-red-500" : ""
            }`}
          />
          {isError && (
            <p className="text-red-500 text-sm absolute">
              Please type something before sending.
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-2 bg-foreground text-white rounded-full hover:bg-muted-foreground transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
      <div className="space-y-6 px-4">
        {commentList.map((comment, index) => (
          <div key={index} className="flex flex-col gap-2 mb-4">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={comment.profile_pic}
                  alt={comment.name}
                  className="rounded-full w-12 h-12 object-cover"
                />
              </div>
              <div className="flex-grow">
                <div className="flex flex-col items-start justify-between">
                  <h4 className="font-semibold">{comment.name}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at)
                      .toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                      .replace(", ", " at ")}
                  </span>
                </div>
              </div>
            </div>
            <p className=" text-gray-600">{comment.comment_text}</p>
            {index < commentList.length - 1 && (
              <hr className="border-gray-300 my-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthorBio() {
  return (
    <div className="bg-[#EFEEEB] rounded-3xl p-6">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img
            src={authorImage}
            alt="Thompson P."
            className="object-cover w-16 h-16"
          />
        </div>
        <div>
          <p className="text-sm">Author</p>
          <h3 className="text-2xl font-bold">Naiyana T.</h3>
        </div>
      </div>
      <hr className="border-gray-300 mb-4" />
      <div className="text-muted-foreground space-y-4">
        <p>
          👨‍💻 I'm a developer who loves coding, cooking, and creativity.<br /><br />
          🍳 When I'm not debugging, you'll probably find me experimenting in the kitchen.<br /><br />
          🎬 Movies and games are my favorite ways to unwind and get inspired.
        </p>
        <p>
          When I'm not coding, I love cooking, watching movies, and playing games.
        </p>
      </div>
    </div>
  );
}

function CreateAccountModal({ dialogState, setDialogState }) {
  const navigate = useNavigate();
  return (
    <AlertDialog open={dialogState} onOpenChange={setDialogState}>
      <AlertDialogContent className="bg-white rounded-md pt-16 pb-6 max-w-[22rem] sm:max-w-lg flex flex-col items-center">
        <AlertDialogTitle className="text-3xl font-semibold pb-2 text-center">
          Create an account to continue
        </AlertDialogTitle>
          <button
            onClick={() => {
              console.log("🔄 [CreateAccountModal] Navigating to signup page");
              navigate("/signup");
              setDialogState(false);
            }}
            className="rounded-full text-white bg-foreground hover:bg-muted-foreground transition-colors py-4 text-lg w-52"
          >
          Create account
        </button>
        <AlertDialogDescription className="flex flex-row gap-1 justify-center font-medium text-center pt-2 text-muted-foreground">
          Already have an account?
          <a
            onClick={() => {
              console.log("🔄 [CreateAccountModal] Navigating to login page");
              navigate("/login");
              setDialogState(false);
            }}
            className="text-foreground hover:text-muted-foreground transition-colors underline font-semibold cursor-pointer"
          >
            Log in
          </a>
        </AlertDialogDescription>
        <AlertDialogCancel className="absolute right-4 top-2 sm:top-4 p-1 border-none">
          <X className="h-6 w-6" />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="w-16 h-16 animate-spin text-foreground" />
        <p className="mt-4 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}
