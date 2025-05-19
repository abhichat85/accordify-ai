import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  openWaitlistForm: () => void;
  isHeaderVisible: boolean;
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
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

const Header: React.FC<HeaderProps> = ({ isHeaderVisible }) => {
  // Enhanced navigation menu style with hover underline effect
  const enhancedNavigationMenuTriggerStyle = () => {
    return "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground hover:underline decoration-primary decoration-2 underline-offset-4 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";
  };

  return (
    <header className={`border-b border-border/20 backdrop-blur-md sticky top-0 z-50 bg-background/95 transition-all duration-300 shadow-md ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center max-w-[90%] xl:max-w-[1400px]">
        <div className="flex items-center space-x-2">
          <a href="#hero" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <FileText size={18} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
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
              <Link to="/blog" className={enhancedNavigationMenuTriggerStyle()}>
                Blog
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center space-x-4">
          <EnhancedButton 
            size="sm" 
            className="rounded-full font-medium"
            onClick={() => window.open('https://form.typeform.com/to/qBwMkuJw', '_blank')}
          >
            REQUEST DEMO
          </EnhancedButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
