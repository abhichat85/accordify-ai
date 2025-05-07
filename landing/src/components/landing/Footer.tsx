import * as React from "react";
import { Link } from "react-router-dom";
import { FileText, Twitter, Linkedin, Github } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";

interface FooterProps {
  openWaitlistForm?: () => void;
}

const Footer: React.FC<FooterProps> = ({ openWaitlistForm }) => {
  return (
    <footer className="border-t border-border/20 py-12 px-4 md:px-8 lg:px-0 bg-card/50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2 mb-8 lg:mb-0 animate-fade-in">
            <div className="flex items-center space-x-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <FileText size={18} className="text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold font-poppins bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                Accord AI
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs font-inter">
              AI-powered contract intelligence platform for legal teams and business professionals. Simplify contract drafting, review, and negotiation with cutting-edge AI technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div className="animate-fade-in animate-delay-100">
            <h3 className="font-semibold mb-4 text-sm font-poppins">Product</h3>
            <ul className="space-y-2 text-sm font-inter">
              <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors duration-200">Features</a></li>
              <li><a href="#tech" className="text-muted-foreground hover:text-primary transition-colors duration-200">Technology</a></li>
              <li><a href="#use-cases" className="text-muted-foreground hover:text-primary transition-colors duration-200">Use Cases</a></li>
              <li><a href="#documentation" className="text-muted-foreground hover:text-primary transition-colors duration-200">Documentation</a></li>
            </ul>
          </div>
          
          <div className="animate-fade-in animate-delay-200">
            <h3 className="font-semibold mb-4 text-sm font-poppins">Resources</h3>
            <ul className="space-y-2 text-sm font-inter">
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors duration-200">Blog</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Community</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">API</a></li>
            </ul>
          </div>
          
          <div className="animate-fade-in animate-delay-300">
            <h3 className="font-semibold mb-4 text-sm font-poppins">Company</h3>
            <ul className="space-y-2 text-sm font-inter">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Legal</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/40 text-sm text-muted-foreground font-inter">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} Accord AI, Inc. All rights reserved.</p>
            <div className="mt-4 sm:mt-0 flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors duration-200">Cookies</a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <p className="text-sm text-muted-foreground font-inter">Ready to transform your contract workflow?</p>
          <EnhancedButton 
            size="sm" 
            variant="subtle"
            className="rounded-full font-medium"
            onClick={openWaitlistForm}
            glowOnHover
          >
            Join Waitlist
          </EnhancedButton>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
