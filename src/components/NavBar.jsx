/**
 * โค้ดนี้คือคอมโพเนนต์ NavBar สำหรับ React ซึ่งทำหน้าที่เป็นแถบนำทางหลักของเว็บไซต์
 * 
 * เปลี่ยนธีมสีของ NavBar และองค์ประกอบใหม่:
 * - พื้นหลัง nav bar: bg-[#4F46E5] (indigo-700)
 * - สีปุ่ม Sign up (หลัก): bg-[#F59E42] (orange-400), hover:bg-[#FDE68A] (yellow-200), text-[#1E293B]
 * - สีปุ่ม Log in: border-[#E0E7FF] (indigo-100), text-white, hover:text-[#F59E42]
 * - Text primary: text-white
 * - เมนู ดรอปดาวน์: bg-[#EEF2FF] (indigo-50), border-[#6366F1] (indigo-500), shadow-indigo
 * - hover highlight: bg-[#F1F5F9] (slate-100), hover:text-[#4F46E5]
 */

import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  Key,
  LogOut,
  SquareArrowOutUpRight,
} from "lucide-react";
import { useAuth } from "@/contexts/authentication";
import { Skeleton } from "@/components/ui/skeleton";
import logoImage from "../assets/ning.jpg"; // รูปโลโก้
import ntLogo from "../assets/NT.png"; // รูปโลโก้ NT

export function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, state, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between py-4 px-4 md:px-8 bg-[#4F46E5] border-b border-[#6366F1]">
      {/* โลโก้เว็บไซต์ กดแล้วไปหน้าหลัก */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center space-x-2"
        style={{ minWidth: 0 }}
      >
        <img
          src={ntLogo}
          alt="Logo NT"
          className="h-10 w-10 object-cover rounded-full shadow-lg shadow-indigo-200"
          style={{ minWidth: 40, minHeight: 40 }}
        />
      </button>
      <button
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-white text-start"
        style={{ minWidth: 0 }}
      >
        Naiyana T<span className="text-white">.</span>  
      </button>
      {/* ถ้ายังโหลดข้อมูลผู้ใช้ แสดง Skeleton */}
      {state.getUserLoading ? (
        <div className="hidden sm:flex items-center ">
          <Skeleton className="h-12 w-12 rounded-full bg-[#C7D2FE]" />
          <Skeleton className="ml-3 h-6 w-32 bg-[#C7D2FE]" />
        </div>
      ) : !isAuthenticated ? (
        // ถ้ายังไม่ได้ล็อกอิน แสดงปุ่ม Log in และ Sign up
        <div className="hidden sm:flex space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-2 rounded-full text-white border border-[#E0E7FF] hover:border-[#F59E42] hover:text-[#F59E42] transition-colors font-semibold"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-2 bg-[#F59E42] text-[#1E293B] rounded-full hover:bg-[#FDE68A] hover:text-[#1E293B] transition-colors font-semibold shadow-md"
          >
            Sign up
          </button>
        </div>
      ) : (
        // ถ้าล็อกอินแล้ว แสดง Avatar + เมนู Dropdown
        <div className="hidden sm:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 rounded-md text-sm font-medium text-white hover:text-[#F59E42] focus:outline-none">
                <Avatar className="h-12 w-12 border-2 border-[#F59E42] shadow-inner shadow-orange-100">
                  <AvatarImage
                    src={state.user.profilePic}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span>{state.user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#EEF2FF] border border-[#6366F1] rounded-sm shadow-lg shadow-indigo-100 p-1"
            >
              {/* Profile */}
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    state.user.role === "admin" ? "/admin/profile" : "/profile"
                  )
                }
                className="text-sm text-[#1E293B] hover:bg-[#F1F5F9] hover:text-[#4F46E5] hover:rounded-sm cursor-pointer font-medium"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              {/* Reset password */}
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    state.user.role === "admin"
                      ? "/admin/reset-password"
                      : "/reset-password"
                  )
                }
                className="text-sm text-[#1E293B] hover:bg-[#F1F5F9] hover:text-[#4F46E5] hover:rounded-sm cursor-pointer font-medium"
              >
                <Key className="mr-2 h-4 w-4" />
                <span>Reset password</span>
              </DropdownMenuItem>
              {/* Admin panel เฉพาะ role admin */}
              {state.user?.role === "admin" && (
                <DropdownMenuItem
                  onClick={() => navigate("/admin")}
                  className="text-sm text-[#1E293B] hover:bg-[#F1F5F9] hover:text-[#F59E42] hover:rounded-sm cursor-pointer font-medium"
                >
                  <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                  <span>Admin panel</span>
                </DropdownMenuItem>
              )}
              <div className="border-t border-[#6366F1] m-1"></div>
              {/* Log out */}
              <DropdownMenuItem
                onClick={() => {
                  logout();
                }}
                className="text-sm text-[#E11D48] hover:bg-[#F1F5F9] hover:text-[#DC2626] hover:rounded-sm cursor-pointer font-medium"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {/* Hamburger Menu สำหรับมือถือ */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="sm:hidden focus:outline-none text-white"
          disabled={state.getUserLoading}
        >
          <Menu />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sm:hidden w-screen rounded-none mt-4 flex flex-col gap-6 py-6 px-6 bg-[#EEF2FF] border-t-2 border-[#6366F1]">
          {!isAuthenticated ? (
            // ยังไม่ได้ล็อกอิน
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-full text-center text-[#1E293B] border border-[#E0E7FF] hover:border-[#F59E42] hover:text-[#F59E42] transition-colors font-semibold bg-white"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-[#F59E42] text-center text-[#1E293B] rounded-full hover:bg-[#FDE68A] hover:text-[#1E293B] transition-colors font-semibold shadow"
              >
                Sign up
              </button>
            </>
          ) : (
            // กรณีล็อกอินแล้ว
            <div className="sm:hidden">
              <div className="space-y-2">
                <div className="flex items-center py-2">
                  <Avatar className="h-16 w-16 border-2 border-[#F59E42] shadow-inner shadow-orange-100">
                    <AvatarImage
                      src={state.user.profilePic}
                      className="object-cover"
                      alt="Profile"
                    />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-3 text-base font-semibold text-[#1E293B]">
                    {state.user.name}
                  </span>
                </div>
                {/* Profile */}
                <a
                  onClick={() =>
                    navigate(
                      state.user.role === "admin"
                        ? "/admin/profile"
                        : "/profile"
                    )
                  }
                  className="flex items-center justify-between px-4 py-2 text-base font-medium text-[#1E293B] hover:bg-[#F1F5F9] hover:text-[#4F46E5] rounded-sm cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <User className="mr-4 h-5 w-5 " />
                    Profile
                  </div>
                </a>
                {/* Reset password */}
                <a
                  onClick={() =>
                    navigate(
                      state.user.role === "admin"
                        ? "/admin/reset-password"
                        : "/reset-password"
                    )
                  }
                  className="flex items-center justify-between px-4 py-2 text-base font-medium text-[#1E293B] hover:bg-[#F1F5F9] hover:text-[#4F46E5] rounded-sm cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <Key className="mr-4 h-5 w-5" />
                    Reset password
                  </div>
                </a>
                {/* Admin panel (เฉพาะแอดมิน) */}
                {state.user?.role === "admin" && (
                  <a
                    onClick={() => navigate("/admin")}
                    className="flex items-center justify-between px-4 py-2 text-base font-medium text-[#1E293B] hover:bg-[#F1F5F9] hover:text-[#F59E42] rounded-sm cursor-pointer transition-colors"
                  >
                    <div className="flex items-center">
                      <SquareArrowOutUpRight className="mr-4 h-5 w-5" />
                      Admin panel
                    </div>
                  </a>
                )}
                <div className="border-t border-[#6366F1]"></div>
                {/* Log out */}
                <a
                  onClick={() => {
                    logout();
                  }}
                  className="flex items-center px-4 py-2 text-base font-medium text-[#E11D48] hover:bg-[#F1F5F9] hover:text-[#DC2626] rounded-sm cursor-pointer transition-colors"
                >
                  <LogOut className="mr-4 h-5 w-5" />
                  Log out
                </a>
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
