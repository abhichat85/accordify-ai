import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  glowOnHover?: boolean;
  scaleOnHover?: boolean;
  liftOnHover?: boolean;
  pulseOnHover?: boolean;
  animateIn?: boolean;
  delay?: number;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    glowOnHover = false, 
    scaleOnHover = false,
    liftOnHover = false,
    pulseOnHover = false,
    animateIn = false,
    delay = 0,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          glowOnHover && "hover:shadow-lg hover:shadow-primary/25 transition-shadow duration-300",
          scaleOnHover && "hover:scale-105 transition-transform duration-300",
          liftOnHover && "hover:-translate-y-1 transition-transform duration-300",
          pulseOnHover && "hover:animate-pulse-subtle",
          animateIn && "animate-fade-in",
          delay > 0 && `delay-${delay}`
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };
