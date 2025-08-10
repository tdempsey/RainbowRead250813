import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  sessionId: string;
}

export default function ArticleCard({ article, sessionId }: ArticleCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["/api/bookmarks", { sessionId }],
  });

  const isBookmarked = bookmarks.some((b: any) => b.articleId === article.id);

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

  const bookmarkMutation = useMutation({
    mutationFn: () => {
      if (isBookmarked) {
        return apiRequest("DELETE", `/api/bookmarks/${article.id}?sessionId=${sessionId}`);
      } else {
        return apiRequest("POST", "/api/bookmarks", {
          articleId: article.id,
          sessionId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: isBookmarked ? "Bookmark removed" : "Article bookmarked!",
        description: isBookmarked 
          ? "Article removed from your bookmarks." 
          : "Article saved to your bookmarks.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'politics': return 'bg-blue-100 text-blue-800';
      case 'culture': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-emerald-100 text-emerald-800';
      case 'business': return 'bg-orange-100 text-orange-800';
      case 'community': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const handleArticleClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article 
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      data-testid={`card-article-${article.id}`}
    >
      {article.imageUrl && (
        <img 
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
          onClick={handleArticleClick}
          data-testid={`img-article-${article.id}`}
        />
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3 flex-wrap">
          <Badge 
            variant="secondary" 
            className={getCategoryColor(article.category)}
            data-testid={`badge-category-${article.id}`}
          >
            {article.category}
          </Badge>
          
          <span>•</span>
          <span data-testid={`text-time-${article.id}`}>
            {formatTimeAgo(article.publishedAt)}
          </span>
          
          <span>•</span>
          <Badge 
            variant="outline" 
            className="text-xs bg-gray-100 text-gray-600"
            data-testid={`badge-source-${article.id}`}
          >
            {article.sourceType === 'rss' ? 'RSS' : 'NewsAPI'}: {article.source}
          </Badge>
        </div>
        
        <h3 
          className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-pride-indigo transition-colors"
          onClick={handleArticleClick}
          data-testid={`text-title-${article.id}`}
        >
          {article.title}
        </h3>
        
        <p 
          className="text-gray-600 mb-4 line-clamp-3"
          data-testid={`text-excerpt-${article.id}`}
        >
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">
                {article.author ? article.author[0]?.toUpperCase() : "?"}
              </span>
            </div>
            <span 
              className="text-sm text-gray-600"
              data-testid={`text-author-${article.id}`}
            >
              {article.author || "Unknown Author"}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className="text-gray-400 hover:text-pride-pink transition-colors text-sm"
              data-testid={`button-like-${article.id}`}
            >
              <Heart size={16} className={likeMutation.isPending ? "animate-pulse" : ""} />
              <span className="ml-1">{article.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => bookmarkMutation.mutate()}
              disabled={bookmarkMutation.isPending}
              className={`transition-colors text-sm ${
                isBookmarked 
                  ? "text-pride-indigo" 
                  : "text-gray-400 hover:text-pride-indigo"
              }`}
              data-testid={`button-bookmark-${article.id}`}
            >
              <Bookmark 
                size={16} 
                className={`${bookmarkMutation.isPending ? "animate-pulse" : ""} ${
                  isBookmarked ? "fill-current" : ""
                }`} 
              />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
              data-testid={`button-share-${article.id}`}
            >
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
