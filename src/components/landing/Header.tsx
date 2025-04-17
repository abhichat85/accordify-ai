import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  openWaitlistForm: () => void;
  isHeaderVisible: boolean;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Header: React.FC<HeaderProps> = ({ openWaitlistForm, isHeaderVisible }) => {
  return (
    <header className={`border-b border-border/20 backdrop-blur-md sticky top-0 z-50 bg-background/95 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <a href="#hero" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText size={18} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Accord AI
            </span>
          </a>
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem
                    title="Contract Drafting"
                    href="#features"
                  >
                    Generate customized contracts from scratch with intelligent AI
                  </ListItem>
                  <ListItem
                    title="Contract Review"
                    href="#features"
                  >
                    Analyze and identify risks in any contract automatically
                  </ListItem>
                  <ListItem
                    title="Negotiation Advisor"
                    href="#features"
                  >
                    Get expert guidance on contract negotiation points
                  </ListItem>
                  <ListItem
                    title="AI Technology"
                    href="#tech"
                  >
                    Custom SLMs, LoRA fine-tuning, and RAG for superior performance
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem
                    title="Legal Teams"
                    href="#use-cases"
                  >
                    Streamline routine contract work and free your legal team
                  </ListItem>
                  <ListItem
                    title="Business Founders"
                    href="#use-cases"
                  >
                    Generate founder-friendly agreements instantly
                  </ListItem>
                  <ListItem
                    title="HR Departments"
                    href="#use-cases"
                  >
                    Standardize employee documents with compliance assurance
                  </ListItem>
                  <ListItem
                    title="Sales Teams"
                    href="#use-cases"
                  >
                    Close deals faster with quick contract generation
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/blog" className={navigationMenuTriggerStyle()}>
                Blog
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#documentation" className={navigationMenuTriggerStyle()}>
                Documentation
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center space-x-4">
          <Button size="sm" onClick={openWaitlistForm}>
            REQUEST DEMO
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
