import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedButtonProps extends ButtonProps {
  glowOnHover?: boolean;
  scaleOnHover?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, glowOnHover = true, scaleOnHover = true, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "transition-all duration-300 relative",
          glowOnHover && "hover:shadow-[0_0_15px_3px_rgba(124,58,237,0.4)]",
          scaleOnHover && "hover:translate-y-[-2px] hover:scale-[1.02] active:translate-y-0 active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };
