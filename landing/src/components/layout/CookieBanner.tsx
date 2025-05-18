import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem("cookie-consent");
    if (!hasAcceptedCookies) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border",
      "animate-slide-in-up transition-all duration-300 shadow-lg"
    )}>
      <div className="container mx-auto py-4 px-6 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium mb-1">Cookie Consent</h3>
          <p className="text-xs text-muted-foreground">
            We use cookies to enhance your experience, analyze site traffic, and personalize content. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={declineCookies}
            className="text-xs h-8"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={acceptCookies}
            className="text-xs h-8"
          >
            Accept All
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8"
            aria-label="Close cookie banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
