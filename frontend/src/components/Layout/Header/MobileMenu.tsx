import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  userRole: "USER" | "PANDIT" | "ADMIN" | "SUPER_ADMIN";
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  isAuthenticated,
  userRole,
  onClose,
}: MobileMenuProps) {
  const navigate = useNavigate();

  const isPandit = userRole === "PANDIT";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleScrollToSection = () => {
    onClose();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t border-border bg-background"
        >
          <nav className="container px-4 py-4 flex flex-col gap-4">
            {/* Search Bar */}
            <div className="pb-4 border-b border-border">
              <SearchBar />
            </div>

            {/* Main Navigation Links */}
            <Link
              to="/"
              onClick={onClose}
              className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
            >
              Home
            </Link>

            <Link
              to="/services"
              onClick={onClose}
              className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
            >
              Services
            </Link>

            {/* Spiritual Tools Section */}
            <div className="py-3 border-b border-border">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Spiritual Tools</p>
              <div className="flex flex-col gap-2 pl-4">
                <Link
                  to="/panchang"
                  onClick={onClose}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  Panchang
                </Link>
                <Link
                  to="/muhurat"
                  onClick={onClose}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  Muhurat Finder
                </Link>
                <Link
                  to="/rashifal"
                  onClick={onClose}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  Rashifal
                </Link>
                <Link
                  to="/kundali"
                  onClick={onClose}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  Kundali Creation
                </Link>
                <Link
                  to="/gemstone-guide"
                  onClick={onClose}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  Gemstone Guide
                </Link>
                <Link
                  to="/choghadiya"
                  onClick={onClose}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  Choghadiya
                </Link>
              </div>
            </div>

            {/* Authenticated User Links */}
            {isAuthenticated && (
              <>
                <Link
                  to="/bookings"
                  onClick={onClose}
                  className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
                >
                  My Bookings
                </Link>

                {/* Pandit-specific Links */}
                {isPandit && (
                  <>
                    <Link
                      to="/pandit/dashboard"
                      onClick={onClose}
                      className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
                    >
                      Pandit Dashboard
                    </Link>
                    <Link
                      to="/pandit/bookings"
                      onClick={onClose}
                      className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
                    >
                      Manage Bookings
                    </Link>
                    <Link
                      to="/pandit/earnings"
                      onClick={onClose}
                      className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
                    >
                      Earnings
                    </Link>
                  </>
                )}

                {/* Admin-specific Links */}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={onClose}
                      className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      onClick={onClose}
                      className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
                    >
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/pandits"
                      onClick={onClose}
                      className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
                    >
                      Manage Pandits
                    </Link>
                    <Link
                      to="/admin/analytics"
                      onClick={onClose}
                      className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
                    >
                      Analytics
                    </Link>
                  </>
                )}
              </>
            )}

            <Link
              to="/contact"
              onClick={onClose}
              className="py-3 font-medium text-foreground hover:text-primary transition-colors border-b border-border"
            >
              Contact Us
            </Link>

            {/* Auth Buttons for Non-authenticated Users */}
            {!isAuthenticated && (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="default"
                  className="w-full"
                  onClick={() => handleNavigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="default"
                  className="w-full"
                  onClick={() => handleNavigate("/register")}
                >
                  Sign Up
                </Button>
                <Button
                  variant="secondary"
                  size="default"
                  className="w-full"
                  onClick={() => handleNavigate("/services")}
                >
                  🕉️ Book Puja
                </Button>
              </div>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

