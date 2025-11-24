import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { serviceAPI } from "@/services/api";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  basePrice: number | string;
  imageUrl?: string;
}

interface SearchBarProps {
  className?: string;
  onServiceSelect?: (service: Service) => void;
}

export default function SearchBar({ className, onServiceSelect }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await serviceAPI.getAllServices({
        search: query.trim(),
        limit: 8,
        isActive: true,
      });
      
      const services = response.data?.services || [];
      setSearchResults(services);
      setShowResults(services.length > 0);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchQuery.length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || searchResults.length === 0) {
      if (e.key === "Enter" && searchQuery.trim()) {
        handleSearchSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleServiceClick(searchResults[selectedIndex]);
        } else {
          handleSearchSubmit();
        }
        break;
      case "Escape":
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  const handleServiceClick = (service: Service) => {
    if (onServiceSelect) {
      onServiceSelect(service);
    } else {
      navigate(`/services?search=${encodeURIComponent(service.name)}`);
    }
    setSearchQuery("");
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getServiceIcon = (category: string) => {
    switch (category?.toUpperCase()) {
      case "POOJA":
        return "🕉️";
      case "ASTROLOGY":
        return "🔮";
      case "HAVAN":
        return "🔥";
      case "KATHA":
        return "📖";
      case "SPECIAL_OCCASION":
        return "🎉";
      case "CONSULTATION":
        return "💬";
      default:
        return "✨";
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₹${numPrice.toLocaleString("en-IN")}`;
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-sm", className)}>
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowResults(true);
              }
            }}
            className="pl-10 pr-10"
          />
          {isSearching && (
            <Loader2 className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
          )}
          {searchQuery && !isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto">
          <div className="p-2">
            {searchResults.map((service, index) => (
              <button
                key={service.id}
                type="button"
                onClick={() => handleServiceClick(service)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "flex items-start gap-3",
                  selectedIndex === index && "bg-accent text-accent-foreground"
                )}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {getServiceIcon(service.category)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {service.name}
                  </div>
                  {service.subcategory && (
                    <div className="text-xs text-muted-foreground truncate">
                      {service.subcategory}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {service.description}
                  </div>
                  <div className="text-xs font-semibold text-primary mt-1">
                    {formatPrice(service.basePrice)}
                  </div>
                </div>
              </button>
            ))}
            {searchResults.length >= 8 && (
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full text-center px-3 py-2 mt-1 rounded-md bg-accent hover:bg-accent/80 text-accent-foreground text-sm font-medium transition-colors"
              >
                View all results for "{searchQuery}"
              </button>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          No services found. Try different keywords.
        </div>
      )}
    </div>
  );
}