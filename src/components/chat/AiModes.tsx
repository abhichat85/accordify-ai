
import React from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
      description: "Legal expertise and contract analysis"
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

  return (
    <ScrollArea className={cn("py-3 px-1", className)}>
      <div className="flex gap-2 styled-scrollbar">
        <TooltipProvider delayDuration={300}>
          {modes.map((mode) => (
            <Tooltip key={mode.id}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm",
                    activeMode === mode.id 
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20" 
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:shadow-md"
                  )}
                  onClick={() => onChange(mode.id)}
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
    </ScrollArea>
  );
};
