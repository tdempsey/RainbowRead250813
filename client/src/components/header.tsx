import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, Menu, Newspaper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  sessionId: string;
}

export default function Header({ onSearch, searchQuery, sessionId }: HeaderProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["/api/bookmarks", { sessionId }],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    if (!value.trim()) {
      onSearch("");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pride-indigo to-pride-pink rounded-lg flex items-center justify-center">
                <Newspaper className="text-white text-sm" size={16} />
              </div>
              <span className="text-xl font-bold text-gray-900" data-testid="text-logo">
                Pride News
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-gray-900 font-medium border-b-2 border-pride-indigo pb-4"
              data-testid="link-nav-latest"
            >
              Latest
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 font-medium pb-4 hover:border-b-2 hover:border-gray-300 transition-colors"
              data-testid="link-nav-politics"
            >
              Politics
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 font-medium pb-4 hover:border-b-2 hover:border-gray-300 transition-colors"
              data-testid="link-nav-culture"
            >
              Culture
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 font-medium pb-4 hover:border-b-2 hover:border-gray-300 transition-colors"
              data-testid="link-nav-health"
            >
              Health
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 font-medium pb-4 hover:border-b-2 hover:border-gray-300 transition-colors"
              data-testid="link-nav-community"
            >
              Community
            </a>
          </nav>

          {/* Search and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Icon (Mobile) */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              data-testid="button-mobile-search"
            >
              <Search size={20} />
            </Button>
            
            {/* Search Bar (Desktop) */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pride-indigo focus:border-transparent"
                  data-testid="input-search-desktop"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  data-testid="button-search-desktop"
                >
                  <Search size={16} />
                </Button>
              </div>
            </form>

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 relative"
              data-testid="button-bookmarks"
            >
              <Bookmark size={20} />
              {bookmarks.length > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-pride-pink text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                  data-testid="text-bookmark-count"
                >
                  {bookmarks.length}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-gray-900"
              data-testid="button-mobile-menu"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-100">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pride-indigo focus:border-transparent"
                data-testid="input-search-mobile"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                data-testid="button-search-mobile"
              >
                <Search size={16} />
              </Button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
