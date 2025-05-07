import React from "react";
import { cn } from "@/lib/utils";

interface TimelineStepProps {
  title: string;
  description?: string;
  step?: number;
  icon?: React.ReactNode;
  isActive?: boolean;
  isLast?: boolean;
  className?: string;
  userMessage?: string;
  aiResponse?: string;
  align?: "left" | "right";
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  title,
  description,
  step,
  icon,
  isActive = false,
  isLast = false,
  className,
  userMessage,
  aiResponse,
  align = "left",
}) => {
  // If we have userMessage and aiResponse, use those for the description
  const displayDescription = description || (userMessage && aiResponse ? 
    `User: "${userMessage}"\n\nAI: "${aiResponse}"` : 
    "");

  return (
    <div className={cn(
      "relative flex gap-4",
      align === "right" ? "flex-row-reverse" : "",
      className
    )}>
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
          {step ? <span className="font-semibold">{step}</span> : icon}
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
        <p className="text-muted-foreground whitespace-pre-line">{displayDescription}</p>
      </div>
    </div>
  );
};
