import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TechBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export const TechBackground: React.FC<TechBackgroundProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
      
      {/* Glow effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};
