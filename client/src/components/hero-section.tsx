import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2, Zap } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { decodeHtmlEntities } from "@/lib/html-entities";
import type { Article } from "@shared/schema";

interface HeroSectionProps {
  article: Article;
}

export default function HeroSection({ article }: HeroSectionProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: trendingTags = [] } = useQuery({
    queryKey: ["/api/trending-tags"],
  });

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/articles/${article.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Article liked!",
        description: "Thank you for engaging with our content.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like article. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const articleDate = new Date(date);
    const diffMs = now.getTime() - articleDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    return articleDate.toLocaleDateString();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: article.url || window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(article.url);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to clipboard.",
      });
    }
  };

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Badge 
                className="bg-pride-pink text-white mb-4 hover:bg-pink-600"
                data-testid="badge-featured"
              >
                Featured
              </Badge>
              
              {article.imageUrl && (
                <img 
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-72 sm:h-96 object-cover rounded-xl shadow-lg"
                  data-testid="img-featured-article"
                />
              )}
              
              <div className="mt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2 flex-wrap">
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800"
                    data-testid="badge-category"
                  >
                    {article.category}
                  </Badge>
                  
                  {article.isLgbtqFocused && (
                    <Badge 
                      variant="secondary" 
                      className="bg-purple-100 text-purple-800"
                      data-testid="badge-lgbtq-focused"
                    >
                      LGBTQ+ Focused
                    </Badge>
                  )}
                  
                  <span>•</span>
                  <span data-testid="text-publish-time">
                    {formatTimeAgo(article.publishedAt)}
                  </span>
                </div>
                
                <h1 
                  className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight"
                  data-testid="text-featured-title"
                >
                  {decodeHtmlEntities(article.title)}
                </h1>
                
                <p 
                  className="text-lg text-gray-600 mb-6 leading-relaxed"
                  data-testid="text-featured-excerpt"
                >
                  {decodeHtmlEntities(article.excerpt)}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">
                        {article.author ? article.author[0]?.toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <p 
                        className="text-sm font-medium text-gray-900"
                        data-testid="text-author"
                      >
                        {article.author || "Unknown Author"}
                      </p>
                      <p 
                        className="text-xs text-gray-500"
                        data-testid="text-source"
                      >
                        {article.source}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likeMutation.mutate()}
                      disabled={likeMutation.isPending}
                      className="text-gray-400 hover:text-pride-pink transition-colors"
                      data-testid="button-like-article"
                    >
                      <Heart size={20} className={likeMutation.isPending ? "animate-pulse" : ""} />
                      <span className="ml-1">{article.likes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-pride-indigo transition-colors"
                      data-testid="button-bookmark-article"
                    >
                      <Bookmark size={20} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      data-testid="button-share-article"
                    >
                      <Share2 size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Breaking & Trending */}
          <div className="space-y-6">
            {/* Breaking News */}
            <section className="bg-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm" role="region" aria-label="Breaking News">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="text-gray-600" size={20} />
                <h3 className="text-lg font-bold text-gray-800" data-testid="text-breaking-news-title">
                  Breaking News
                </h3>
              </div>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">
                    Supreme Court to Hear Landmark LGBTQ+ Case
                  </h4>
                  <p className="text-xs text-gray-600">15 minutes ago</p>
                </div>
                <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">
                    Major Company Announces Trans-Inclusive Policy
                  </h4>
                  <p className="text-xs text-gray-600">32 minutes ago</p>
                </div>
              </div>
            </section>

            {/* Trending Topics */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4" data-testid="text-trending-title">
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {(trendingTags as any[]).slice(0, 6).map((item: any) => (
                  <Badge
                    key={item.tag}
                    variant="secondary"
                    className="bg-pride-indigo/10 text-pride-indigo hover:bg-pride-indigo/20 transition-colors cursor-pointer"
                    data-testid={`badge-trending-${item.tag}`}
                  >
                    #{item.tag}
                  </Badge>
                ))}
                
                {/* Fallback trending tags if API doesn't return data */}
                {(trendingTags as any[]).length === 0 && (
                  <>
                    <Badge className="bg-pride-indigo/10 text-pride-indigo">#PrideMonth</Badge>
                    <Badge className="bg-pride-pink/10 text-pride-pink">#TransRights</Badge>
                    <Badge className="bg-pride-emerald/10 text-pride-emerald">#Equality</Badge>
                    <Badge className="bg-purple-100 text-purple-700">#LGBTQ+</Badge>
                    <Badge className="bg-blue-100 text-blue-700">#Pride2024</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
