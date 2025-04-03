import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  Brain, 
  Scale, 
  BarChart3, 
  Sparkles, 
  Lightbulb, 
  Search,
  BookText,
  CircleCheckBig
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export type AiMode = "normal" | "lawyer" | "reasoning" | "creative" | "analyst" | "research" | "educator";

interface AiModesProps {
  activeMode: AiMode;
  onChange: (mode: AiMode) => void;
  className?: string;
}

interface ModeOption {
  id: AiMode;
  label: string;
  icon: React.ElementType;
  description: string;
}

export const AiModes: React.FC<AiModesProps> = ({ activeMode, onChange, className }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const modes: ModeOption[] = [
    {
      id: "normal",
      label: "Standard",
      icon: Sparkles,
      description: "General assistant for contract tasks"
    },
    {
      id: "lawyer",
      label: "Lawyer",
      icon: Scale,
      description: "You are a lawyer from Harvard Law School. You have worked with various law firms specializing in all vendor-to-vendor contracts, sales contracts, marketing agencies contracts, shareholding agreements, employee-employer contracts. You even have experience on M&A at KKR/Blackstone. You may have to dig into the Companies Acts of various countries, especially USA and India. Whenever an insight is asked of you from an agreement that the user uploads for you, you need to provide ideas from your knowledge, experiences, and industry practices. For e.g. ideas and suggestions around duration of vesting periods, prepayment terms to vendors etc. Act like Mr. Harvey Specter from Suits to answer Qs in the Lawyer mode of Accord AI."
    },
    {
      id: "reasoning",
      label: "Reasoning",
      icon: Brain,
      description: "Detailed reasoning and step-by-step analysis"
    },
    {
      id: "analyst",
      label: "Analyst",
      icon: BarChart3,
      description: "Data-focused contract analysis and trends"
    },
    {
      id: "creative",
      label: "Creative",
      icon: Lightbulb,
      description: "Creative approaches to contract drafting"
    },
    {
      id: "research",
      label: "Research",
      icon: Search,
      description: "In-depth research on legal topics"
    },
    {
      id: "educator",
      label: "Educator",
      icon: BookText,
      description: "Explain legal concepts and terms"
    }
  ];

  const handleModeChange = (mode: AiMode) => {
    onChange(mode);
    
    // Dispatch custom event for the orb to listen to
    const event = new CustomEvent('ai-mode-change', { 
      detail: { mode } 
    });
    document.dispatchEvent(event);
  };

  return (
    <div className={cn("relative", className)}>
      <ScrollArea className="w-full py-3 px-1">
        <div className="flex gap-2 min-w-full" ref={scrollContainerRef}>
          <TooltipProvider delayDuration={300}>
            {modes.map((mode) => (
              <Tooltip key={mode.id}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm whitespace-nowrap",
                      activeMode === mode.id 
                        ? "bg-primary/10 text-primary ring-1 ring-primary/20" 
                        : "bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:shadow-md"
                    )}
                    onClick={() => handleModeChange(mode.id)}
                  >
                    <mode.icon size={14} />
                    {mode.label}
                    {activeMode === mode.id && (
                      <CircleCheckBig size={14} className="ml-1 text-primary" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <p>{mode.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
