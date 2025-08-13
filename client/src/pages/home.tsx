import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/article-card";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { Article, SearchParams } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);

  const pageSize = 20;

  // Build search params
  const searchParams: SearchParams = {
    query: searchQuery || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    limit: pageSize,
    offset: currentPage * pageSize,
    // Don't filter by lgbtqFocused by default, show all articles
  };

  const { data: articles = [], isLoading, refetch } = useQuery<Article[]>({
    queryKey: ["/api/articles", searchParams],
    enabled: true,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const featuredArticle = articles.find(a => a.isLgbtqFocused) || articles[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch} 
        searchQuery={searchQuery}
      />
      
      {/* Category Navigation */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-1 overflow-x-auto pb-2">
              {(categories as any[]).map((category: any) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`whitespace-nowrap ${
                    selectedCategory === category.slug
                      ? "bg-pride-indigo text-white hover:bg-pride-indigo/90"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  data-testid={`button-category-${category.slug}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {featuredArticle && (
        <HeroSection article={featuredArticle} />
      )}



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Grid */}
          <div className="lg:col-span-3">
            {isLoading && currentPage === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-pride-indigo" />
                <span className="ml-2 text-gray-600">Loading articles...</span>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600" data-testid="text-no-articles">
                  {searchQuery ? "No articles found matching your search." : "No articles available."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {articles.slice(1).map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      sessionId={sessionId}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {articles.length >= pageSize && (
                  <div className="text-center py-8">
                    <Button
                      onClick={loadMore}
                      disabled={isLoading}
                      className="bg-pride-indigo text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                      data-testid="button-load-more"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        "Load More Articles"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar sessionId={sessionId} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
