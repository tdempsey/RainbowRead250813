import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive the latest LGBTQ+ news and updates.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo and Description */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-pride-indigo to-pride-pink rounded-lg flex items-center justify-center">
                <Newspaper className="text-white text-sm" size={12} />
              </div>
              <span className="text-lg font-bold" data-testid="text-footer-logo">
                Rainbow Map News
              </span>
            </div>
            <p className="text-gray-400 text-xs" data-testid="text-footer-description">
              Your trusted source for LGBTQ+ news and community updates.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold mb-2" data-testid="text-categories-title">
              Categories
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-politics">Politics</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-culture">Culture</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-health">Health</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-business">Business</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-community">Community</a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-2" data-testid="text-resources-title">
              Resources
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-about">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-contact">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-privacy">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-terms">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-rss">RSS</a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold mb-2" data-testid="text-newsletter-footer-title">
              Newsletter
            </h4>
            <form onSubmit={handleNewsletterSignup} className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-pride-indigo focus:border-transparent"
                data-testid="input-footer-newsletter"
              />
              <Button
                type="submit"
                size="sm"
                className="w-full bg-pride-indigo text-white text-xs hover:bg-indigo-700 transition-colors"
                data-testid="button-footer-subscribe"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-4 pt-3 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="text-gray-400" data-testid="text-copyright">
            © 2024 Rainbow Map News. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <span className="text-gray-500">RSS & NewsAPI</span>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-gray-400" data-testid="text-system-status">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
