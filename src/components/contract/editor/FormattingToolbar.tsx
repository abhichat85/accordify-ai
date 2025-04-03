import React from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1, 
  Heading2,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormattingToolbarProps {
  showFormatting: boolean;
  onFormat: (formatType: string, value?: Record<string, unknown>) => void;
  selection: { start: number; end: number; text: string } | null;
  onVersionsClick?: () => void;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  showFormatting,
  onFormat,
  selection,
  onVersionsClick
}) => {
  if (!showFormatting) return null;

  const hasSelection = selection && selection.start !== selection.end;

  return (
    <div className={cn(
      "border-b border-border/40 bg-muted/30 transition-all overflow-hidden",
      showFormatting ? "py-2 px-4 h-auto opacity-100" : "h-0 py-0 opacity-0"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <div className="flex items-center space-x-1 mr-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded" 
                    onClick={() => onFormat('heading1')}
                    disabled={!hasSelection}
                  >
                    <Heading1 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 1</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded" 
                    onClick={() => onFormat('heading2')}
                    disabled={!hasSelection}
                  >
                    <Heading2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 2</TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center space-x-1 mr-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded" 
                    onClick={() => onFormat('bold')}
                    disabled={!hasSelection}
                  >
                    <Bold size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded" 
                    onClick={() => onFormat('italic')}
                    disabled={!hasSelection}
                  >
                    <Italic size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded" 
                    onClick={() => onFormat('underline')}
                    disabled={!hasSelection}
                  >
                    <Underline size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Underline</TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded" 
                    onClick={() => onFormat('alignLeft')}
                    disabled={!hasSelection}
                  >
                    <AlignLeft size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded" 
                    onClick={() => onFormat('alignCenter')}
                    disabled={!hasSelection}
                  >
                    <AlignCenter size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded"
                    onClick={() => onFormat('alignRight')}
                    disabled={!hasSelection}
                  >
                    <AlignRight size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
        
        {onVersionsClick && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 rounded-lg shadow-sm"
                  onClick={onVersionsClick}
                >
                  <History size={14} className="mr-1" />
                  Versions
                </Button>
              </TooltipTrigger>
              <TooltipContent>Document Versions</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
