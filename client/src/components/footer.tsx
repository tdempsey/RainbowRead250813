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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pride-indigo to-pride-pink rounded-lg flex items-center justify-center">
                <Newspaper className="text-white text-sm" size={16} />
              </div>
              <span className="text-xl font-bold" data-testid="text-footer-logo">
                Pride News
              </span>
            </div>
            <p className="text-gray-400 text-sm" data-testid="text-footer-description">
              Your trusted source for LGBTQ+ news, stories, and community updates. 
              Amplifying diverse voices and promoting equality.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-social-twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-social-facebook"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-social-instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-social-youtube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="text-categories-title">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-politics"
                >
                  Politics
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-culture"
                >
                  Culture & Arts
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-health"
                >
                  Health & Wellness
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-business"
                >
                  Business
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-community"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="text-resources-title">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-about"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-contact"
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-terms"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-footer-rss"
                >
                  RSS Feeds
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="text-newsletter-footer-title">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest LGBTQ+ news and updates.
            </p>
            <form onSubmit={handleNewsletterSignup} className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pride-indigo focus:border-transparent"
                data-testid="input-footer-newsletter"
              />
              <Button
                type="submit"
                className="w-full bg-pride-indigo text-white px-3 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                data-testid="button-footer-subscribe"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm" data-testid="text-copyright">
            © 2024 Pride News. All rights reserved. Built with ❤️ for the LGBTQ+ community.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-xs text-gray-500">Powered by RSS & NewsAPI</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-400" data-testid="text-system-status">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
