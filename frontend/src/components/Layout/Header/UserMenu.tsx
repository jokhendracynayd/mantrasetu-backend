import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/store/slices/authSlice";
import type { AppDispatch } from "@/store/store";

interface UserMenuProps {
  isAuthenticated: boolean;
  userRole: "USER" | "PANDIT" | "ADMIN" | "SUPER_ADMIN";
}

export default function UserMenu({ isAuthenticated, userRole }: UserMenuProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isPandit = userRole === "PANDIT";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getProfileLink = () => {
    if (isPandit) return "/pandit/profile";
    if (isAdmin) return "/admin/profile";
    return "/profile";
  };

  const getRoleBadge = () => {
    if (isPandit) return "Pandit";
    if (isAdmin) return "Admin";
    return "User";
  };

  const handleScrollToSection = () => {
    // First navigate to home if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById('begin_your_spiritual_journey');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById('begin_your_spiritual_journey');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/login")}
          className="hidden md:flex"
        >
          Login
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate("/register")}
          className="hidden md:flex"
        >
          Sign Up
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/services")}
          className="hidden md:flex"
        >
          🕉️ Book Puja
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Profile Icon */}
      <Link
        to={getProfileLink()}
        className="hidden md:flex p-2 rounded-md hover:bg-accent transition-colors"
      >
        <User className="w-5 h-5 text-muted-foreground" />
      </Link>

      {/* Cart Icon - Only for regular users */}
      {!isPandit && !isAdmin && (
        <Link
          to="/cart"
          className="hidden md:flex p-2 rounded-md hover:bg-accent transition-colors relative"
        >
          <ShoppingCart className="w-5 h-5 text-muted-foreground" />
        </Link>
      )}

      {/* Role Badge */}
      <span className="hidden md:inline-block bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full uppercase">
        {getRoleBadge()}
      </span>

      {/* Logout Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="hidden md:flex gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
}

