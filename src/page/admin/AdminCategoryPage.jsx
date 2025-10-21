
import { PenSquare, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { categoriesService } from "@/services/supabaseService";
import { debugComponent, debugError } from "@/utils/debug";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminCategoryManagementPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data: categoriesData, error: categoriesError } = await categoriesService.getCategories();
        
        if (categoriesError) {
          console.error("❌ [AdminCategoryPage] Categories error:", categoriesError);
          throw categoriesError;
        }

        console.log("✅ [AdminCategoryPage] Categories data:", categoriesData);
        setCategories(categoriesData || []);
      } catch (error) {
        debugError(error, "fetchCategories");
        console.error("Error fetching categories data:", error);
        navigate("*");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchKeyword]);

  const handleDelete = async (categoryId) => {
    try {
      setIsLoading(true);
      console.log("🔄 [AdminCategoryPage] Deleting category from Supabase...");
      console.log("📤 [AdminCategoryPage] Category ID:", categoryId);
      
      const { error } = await categoriesService.deleteCategory(categoryId);

      if (error) {
        console.error("❌ [AdminCategoryPage] Delete error:", error);
        throw error;
      }

      console.log("✅ [AdminCategoryPage] Category deleted successfully");
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Deleted Category successfully
            </h2>
            <p className="text-sm">The category has been removed.</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } catch {
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">
              Failed to delete category
            </h2>
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
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Category management</h2>
          <Button
            className="px-8 py-2 rounded-full"
            onClick={() => navigate("/admin/create-category")}
          >
            <PenSquare className="mr-2 h-4 w-4" /> Create category
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full max-w-md py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Category</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(9)
                .fill()
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-[200px] bg-[#EFEEEB]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[75px] bg-[#EFEEEB]" />
                    </TableCell>
                  </TableRow>
                ))
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right flex">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(
                          `/admin/edit-category/${category.id}`
                        );
                      }}
                    >
                      <PenSquare className="h-4 w-4 hover:text-muted-foreground" />
                    </Button>
                    <DeleteCategoryDialog
                      onDelete={() => handleDelete(category.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center font-medium pt-8">
                  No categories found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}

function DeleteCategoryDialog({ onDelete }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 hover:text-muted-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-md pt-16 pb-6 max-w-[22rem] sm:max-w-md flex flex-col items-center">
        <AlertDialogTitle className="text-3xl font-semibold pb-2 text-center">
          Delete Category
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-row mb-2 justify-center font-medium text-center text-muted-foreground">
          Do you want to delete this Category?
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
