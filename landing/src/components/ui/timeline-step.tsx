import React from "react";
import { cn } from "@/lib/utils";

interface TimelineStepProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isLast?: boolean;
  className?: string;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  title,
  description,
  icon,
  isActive = false,
  isLast = false,
  className,
}) => {
  return (
    <div className={cn("relative flex gap-4", className)}>
      {/* Timeline connector line */}
      {!isLast && (
        <div className="absolute left-6 top-10 bottom-0 w-px bg-border/50 -translate-x-1/2" />
      )}
      
      {/* Icon container */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isActive
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "bg-muted text-muted-foreground"
          )}
        >
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 pt-1 pb-8">
        <h3 className={cn(
          "text-lg font-semibold mb-2",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}>
          {title}
        </h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
