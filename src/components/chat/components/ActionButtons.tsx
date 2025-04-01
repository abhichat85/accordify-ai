
import React, { useRef } from "react";
import { Paperclip, Image, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonsProps {
  onFileUpload: () => void;
  onImageUpload?: () => void;
  onSubmit: () => void;
  isDisabled: boolean;
  isProcessing: boolean;
  selectedModel?: string;
  onModelSelect?: (model: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFileUpload,
  onImageUpload,
  onSubmit,
  isDisabled,
  isProcessing,
  selectedModel = "GPT-4o",
  onModelSelect
}) => {
  const availableModels = [
    "GPT-4o",
    "Claude 3 Opus",
    "Claude 3 Sonnet",
    "GPT-4",
    "GPT-3.5 Turbo"
  ];

  const handleModelSelect = (model: string) => {
    if (onModelSelect) {
      onModelSelect(model);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border-t border-border/40">
      <div className="flex items-center gap-2">
        {/* File upload button with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={onFileUpload}
                aria-label="Attach file"
              >
                <Paperclip size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Upload document</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Image upload button with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                aria-label="Attach image"
                onClick={onImageUpload}
              >
                <Image size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Upload image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Model selection dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground ml-2"
            >
              {selectedModel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-popover">
            {availableModels.map((model) => (
              <DropdownMenuItem 
                key={model} 
                onClick={() => handleModelSelect(model)}
                className={cn(
                  "cursor-pointer",
                  model === selectedModel && "font-medium bg-muted"
                )}
              >
                {model}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Send button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 rounded-full",
                isDisabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
              )}
              disabled={isDisabled || isProcessing}
              onClick={onSubmit}
            >
              <ArrowUp size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Send message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
