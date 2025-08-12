import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, Menu, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import rmLogo from "@assets/rm_logo_1755024192058.png";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  sessionId: string;
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

export default function Header({ onSearch, searchQuery, sessionId, onCategoryChange, selectedCategory = "all" }: HeaderProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["/api/bookmarks", { sessionId }],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCategoryDropdown]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src={rmLogo} 
                alt="Rainbow Map News Logo" 
                className="w-8 h-8"
                data-testid="img-logo"
              />
              <span className="text-xl font-bold text-gray-900" data-testid="text-logo">
                Rainbow Map News
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className={`flex items-center space-x-1 font-medium transition-colors ${
                  showCategoryDropdown 
                    ? 'text-pride-indigo' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                data-testid="button-categories-dropdown"
              >
                <span>Categories</span>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform ${
                    showCategoryDropdown ? 'rotate-180' : ''
                  }`} 
                />
              </Button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] z-50">
                  <div className="py-2">
                    {(categories as any[]).map((category: any) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          if (onCategoryChange) {
                            onCategoryChange(category.slug);
                          }
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          selectedCategory === category.slug
                            ? 'bg-pride-indigo text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        data-testid={`button-category-${category.slug}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              {(bookmarks as any[]).length > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-pride-pink text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                  data-testid="text-bookmark-count"
                >
                  {(bookmarks as any[]).length}
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
