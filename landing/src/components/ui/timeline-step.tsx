import React from "react";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

interface TimelineStepProps {
  step: number;
  title: string;
  userMessage: string;
  aiResponse: string;
  icon: React.ElementType;
  isLast?: boolean;
  align?: "left" | "right";
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  step,
  title,
  userMessage,
  aiResponse,
  icon: Icon,
  isLast = false,
  align = "left"
}) => {
  return (
    <div className={cn(
      "relative flex items-start mb-12",
      align === "right" ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Step number with connector line */}
      <div className="flex flex-col items-center mx-8">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center z-10 text-primary font-bold">
          {step}
        </div>
        {!isLast && (
          <div className="h-full w-0.5 bg-primary/20 mt-4 relative">
            <div className="absolute w-0.5 bg-primary/60 animate-pulse h-full transform origin-top scale-y-0" 
                style={{ animation: `growDown 2s ${step * 0.5}s forwards ease-out` }} />
          </div>
        )}
      </div>

      {/* Content card */}
      <div className={cn(
        "bg-card border border-border/50 rounded-xl shadow-md p-6 space-y-6 w-full max-w-lg transition-all duration-300 hover:shadow-lg",
        align === "right" ? "mr-4" : "ml-4",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${step * 0.2}s` }}>
        {/* Card header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center relative z-10">
            <Icon size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
        </div>
        
        {/* Messages */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              ME
            </div>
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-full md:max-w-[200px] lg:max-w-[250px] break-words">
              <p className="typing-step">{userMessage}</p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-full md:max-w-[200px] lg:max-w-[250px] break-words">
              <p>{aiResponse}</p>
            </div>
            <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
              <Bot size={16} className="text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
