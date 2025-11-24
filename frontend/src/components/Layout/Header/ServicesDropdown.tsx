import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ServicesDropdownProps {
  userRole: "USER" | "PANDIT" | "ADMIN" | "SUPER_ADMIN";
}

export default function ServicesDropdown({ userRole }: ServicesDropdownProps) {
  const isPandit = userRole === "PANDIT";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors">
        Services
        <ChevronDown className="w-3 h-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem asChild>
          <Link to="/services" className="w-full">
            All Services
          </Link>
        </DropdownMenuItem>

        {isPandit && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/services/my-services" className="w-full">
                My Services
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/services/availability" className="w-full">
                Set Availability
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/services/manage" className="w-full">
                Manage Services
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/services/analytics" className="w-full">
                Analytics
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

