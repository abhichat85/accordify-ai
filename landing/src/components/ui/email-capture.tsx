import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface EmailCaptureProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => void;
  showSuccessMessage?: boolean;
  variant?: "default" | "embedded" | "inline";
}

export function EmailCapture({
  className,
  placeholder = "Enter your email",
  buttonText = "Join Waitlist",
  onSubmit,
  showSuccessMessage = true,
  variant = "default",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(email);
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
      
      if (showSuccessMessage) {
        toast({
          title: "Success!",
          description: "You've been added to our waitlist. We'll be in touch soon!",
        });
      }
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };
  
  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className={cn("flex w-full max-w-sm items-center space-x-2", className)}>
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          disabled={isSubmitting || isSubmitted}
        />
        <Button type="submit" disabled={isSubmitting || isSubmitted}>
          {isSubmitted ? <CheckCircle2 className="h-4 w-4 text-white" /> : buttonText}
        </Button>
      </form>
    );
  }
  
  if (variant === "embedded") {
    return (
      <form onSubmit={handleSubmit} className={cn("flex w-full flex-col space-y-3", className)}>
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          disabled={isSubmitting || isSubmitted}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting || isSubmitted}>
          {isSubmitting ? "Submitting..." : isSubmitted ? "Submitted!" : buttonText}
        </Button>
      </form>
    );
  }
  
  // Default variant
  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row sm:items-center gap-3", className)}>
      <div className="flex-1 relative">
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "w-full pr-9",
            isSubmitted && "border-green-500 focus-visible:ring-green-500 text-green-600"
          )}
          disabled={isSubmitting || isSubmitted}
        />
        {isSubmitted && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      <Button 
        type="submit" 
        size="lg" 
        className="gap-2"
        disabled={isSubmitting || isSubmitted}
      >
        {isSubmitting ? (
          "Submitting..."
        ) : isSubmitted ? (
          "Added to Waitlist!"
        ) : (
          <>
            {buttonText} <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
