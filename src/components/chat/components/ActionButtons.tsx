import React, { useRef } from "react";
import { Paperclip, Image, ArrowUp, Loader2 } from "lucide-react";
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
    <div className="flex items-center justify-between p-2 border-t border-border/40 bg-muted/10 rounded-b-xl">
      <div className="flex items-center gap-2">
        {/* File upload button with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-muted/70 transition-all hover:scale-105 active:scale-95"
                onClick={onFileUpload}
                aria-label="Attach file"
              >
                <Paperclip size={18} className="text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-popover border border-border/40 text-xs">
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
                className="h-8 w-8 p-0 rounded-full hover:bg-muted/70 transition-all hover:scale-105 active:scale-95"
                aria-label="Attach image"
                onClick={onImageUpload}
              >
                <Image size={18} className="text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-popover border border-border/40 text-xs">
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
              className="h-8 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground hover:bg-muted/70 ml-2 rounded-md transition-colors"
            >
              <span className="max-w-24 truncate">{selectedModel}</span>
              <span className="ml-1 opacity-60">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-popover border border-border/40 p-1 rounded-md shadow-md">
            {availableModels.map((model) => (
              <DropdownMenuItem 
                key={model} 
                onClick={() => handleModelSelect(model)}
                className={cn(
                  "cursor-pointer rounded-sm text-sm px-2 py-1.5 mb-1 transition-colors",
                  model === selectedModel 
                    ? "font-medium bg-primary/10 text-primary" 
                    : "hover:bg-muted"
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
                "h-8 w-8 p-0 rounded-full transition-all",
                isDisabled || isProcessing
                  ? "opacity-50 cursor-not-allowed bg-muted"
                  : "opacity-100 bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95"
              )}
              disabled={isDisabled || isProcessing}
              onClick={onSubmit}
            >
              {isProcessing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={18} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-popover border border-border/40 text-xs">
            <p>Send message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
