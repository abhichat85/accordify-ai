
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";

interface LandingHeaderProps {
  openWaitlistForm: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  isHeaderVisible: boolean;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({
  openWaitlistForm,
  mobileMenuOpen,
  setMobileMenuOpen,
  isHeaderVisible
}) => {
  return (
    <header className={`border-b border-border/20 backdrop-blur-md sticky top-0 z-50 bg-background/95 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <FileText size={18} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
            Accord AI
          </span>
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <a href="#features" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#tech" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Technology
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#use-cases" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Use Cases
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#blog" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#documentation" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-3">
          <Link to="/app">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Sign In
            </Button>
          </Link>
          <Button 
            size="sm" 
            className="hidden md:flex gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={openWaitlistForm}
          >
            Join Waitlist <ArrowRight size={14} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-background border-t border-border/20 animate-fade-in">
          <div className="flex flex-col space-y-3">
            <a 
              href="#features" 
              className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#tech" 
              className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Technology
            </a>
            <a 
              href="#use-cases" 
              className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Use Cases
            </a>
            <a 
              href="#blog" 
              className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </a>
            <a 
              href="#documentation" 
              className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </a>
            <div className="pt-3 flex flex-col space-y-3">
              <Link to="/app" className="w-full">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Button className="w-full gap-1" onClick={openWaitlistForm}>
                Join Waitlist <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
