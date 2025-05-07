import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hoverEffect?: "lift" | "glow" | "border" | "scale" | "none";
    variant?: "default" | "muted" | "outline" | "ghost" | "elevated";
    animateIn?: boolean;
    delay?: number;
  }
>(({ className, hoverEffect = "none", variant = "default", animateIn = false, delay = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
      // Variants
      variant === "muted" && "bg-muted/50 border-muted/30",
      variant === "outline" && "bg-transparent shadow-none",
      variant === "ghost" && "border-transparent bg-transparent shadow-none",
      variant === "elevated" && "border-transparent shadow-md",
      // Hover effects
      hoverEffect === "lift" && "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
      hoverEffect === "glow" && "transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:border-primary/50",
      hoverEffect === "border" && "transition-all duration-300 hover:border-primary",
      hoverEffect === "scale" && "transition-all duration-300 hover:scale-[1.02]",
      // Animation
      animateIn && "animate-fade-in",
      delay > 0 && `delay-${delay}`,
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-tight tracking-tight font-poppins",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground font-inter", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
