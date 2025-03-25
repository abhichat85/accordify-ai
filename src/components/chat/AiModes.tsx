
import React from "react";
import { cn } from "@/lib/utils";
import { 
  Brain, 
  Scale, 
  BarChart3, 
  Sparkles, 
  Lightbulb, 
  Search,
  BookText
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className={cn("flex overflow-x-auto py-3 px-1 gap-2 styled-scrollbar no-scrollbar", className)}>
      <TooltipProvider delayDuration={300}>
        {modes.map((mode) => (
          <Tooltip key={mode.id}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "mode-chip",
                  activeMode === mode.id ? "mode-chip-active" : "mode-chip-inactive"
                )}
                onClick={() => onChange(mode.id)}
              >
                <mode.icon size={16} />
                {mode.label}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{mode.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
