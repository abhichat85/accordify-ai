import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TechBackgroundProps {
  children: ReactNode;
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
      <div className="relative z-10">{children}</div>
    </div>
  );
};

interface TechCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export const TechCard: React.FC<TechCardProps> = ({
  title,
  description,
  icon,
  className,
}) => {
  return (
    <div className={cn(
      "group relative p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
      className
    )}>
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
