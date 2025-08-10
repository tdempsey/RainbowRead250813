import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  sessionId: string;
}

export default function Sidebar({ sessionId }: SidebarProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const { data: sources = [] } = useQuery({
    queryKey: ["/api/sources"],
  });

  const { data: trendingTags = [] } = useQuery({
    queryKey: ["/api/trending-tags"],
  });

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    // Simulate newsletter signup
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive daily LGBTQ+ news updates.",
    });
    setEmail("");
  };

  const activeSources = (sources as any[]).filter((source: any) => source.isActive);

  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-pride-indigo to-pride-pink rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2" data-testid="text-newsletter-title">
          Stay Informed
        </h3>
        <p className="text-sm opacity-90 mb-4">
          Get daily LGBTQ+ news delivered to your inbox
        </p>
        <form onSubmit={handleNewsletterSignup} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            data-testid="input-newsletter-email"
          />
          <Button
            type="submit"
            className="w-full bg-white text-pride-indigo px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            data-testid="button-newsletter-subscribe"
          >
            Subscribe
          </Button>
        </form>
      </div>

      {/* Popular Tags */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4" data-testid="text-popular-tags-title">
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {(trendingTags as any[]).slice(0, 8).map((item: any) => (
            <Button
              key={item.tag}
              variant="ghost"
              size="sm"
              className="bg-pride-indigo/10 text-pride-indigo px-3 py-1 rounded-full text-sm font-medium hover:bg-pride-indigo/20 transition-colors"
              data-testid={`button-tag-${item.tag}`}
            >
              #{item.tag}
            </Button>
          ))}
          
          {/* Fallback tags if API doesn't return data */}
          {(trendingTags as any[]).length === 0 && (
            <>
              <Button variant="ghost" size="sm" className="bg-pride-indigo/10 text-pride-indigo px-3 py-1 rounded-full text-sm font-medium hover:bg-pride-indigo/20 transition-colors">
                #TransRights
              </Button>
              <Button variant="ghost" size="sm" className="bg-pride-pink/10 text-pride-pink px-3 py-1 rounded-full text-sm font-medium hover:bg-pride-pink/20 transition-colors">
                #Marriage
              </Button>
              <Button variant="ghost" size="sm" className="bg-pride-emerald/10 text-pride-emerald px-3 py-1 rounded-full text-sm font-medium hover:bg-pride-emerald/20 transition-colors">
                #Workplace
              </Button>
              <Button variant="ghost" size="sm" className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
                #Youth
              </Button>
              <Button variant="ghost" size="sm" className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                #Health
              </Button>
              <Button variant="ghost" size="sm" className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors">
                #Politics
              </Button>
            </>
          )}
        </div>
      </div>

      {/* RSS Sources */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4" data-testid="text-sources-title">
          Our Sources
        </h3>
        <div className="space-y-3">
          {activeSources.map((source: any) => (
            <div 
              key={source.id} 
              className="flex items-center justify-between"
              data-testid={`source-${source.id}`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{source.name}</span>
                {source.isLgbtqFocused && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    LGBTQ+
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-500">Active</span>
            </div>
          ))}
          
          {/* Fallback sources if no data */}
          {activeSources.length === 0 && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">GLAAD Media</span>
                </div>
                <span className="text-xs text-gray-500">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Out Magazine</span>
                </div>
                <span className="text-xs text-gray-500">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Queerty</span>
                </div>
                <span className="text-xs text-gray-500">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">NewsAPI</span>
                </div>
                <span className="text-xs text-gray-500">Active</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Featured Community */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4" data-testid="text-community-title">
          Community Spotlight
        </h3>
        <img 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
          alt="Diverse LGBTQ+ community group"
          className="w-full h-32 object-cover rounded-lg mb-3"
          data-testid="img-community-spotlight"
        />
        <h4 className="font-semibold text-gray-900 mb-2">
          Pride Center Northwest
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          Supporting LGBTQ+ individuals and families in the Pacific Northwest through advocacy, resources, and community.
        </p>
        <Button 
          variant="ghost" 
          className="text-pride-indigo font-medium text-sm hover:underline p-0"
          data-testid="button-community-learn-more"
        >
          Learn More →
        </Button>
      </div>
    </div>
  );
}
