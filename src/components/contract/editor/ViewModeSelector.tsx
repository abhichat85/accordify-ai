
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit3, FileText, LayoutGrid, FileCode, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViewModeSelectorProps {
  viewMode: 'edit' | 'preview';
  setViewMode: (mode: 'edit' | 'preview') => void;
  editorMode: 'rich' | 'code';
  setEditorMode: (mode: 'rich' | 'code') => void;
  showFormatting: boolean;
  setShowFormatting: (show: boolean) => void;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  setViewMode,
  editorMode,
  setEditorMode,
  showFormatting,
  setShowFormatting,
}) => {
  const { toast } = useToast();

  const handleVersionHistory = () => {
    toast({
      title: "Version history",
      description: "Loading previous versions of this document...",
    });
    // In a real app, this would show version history
  };

  return (
    <div className="flex items-center px-4 py-2 border-b border-border/40 bg-muted/30">
      <div className="flex items-center space-x-1 mr-4">
        <Button 
          variant={viewMode === 'edit' ? "secondary" : "ghost"} 
          size="sm" 
          className="h-7 text-xs rounded-lg"
          onClick={() => setViewMode('edit')}
        >
          <Edit3 size={14} className="mr-1" />
          Edit
        </Button>
        <Button 
          variant={viewMode === 'preview' ? "secondary" : "ghost"} 
          size="sm" 
          className="h-7 text-xs rounded-lg"
          onClick={() => setViewMode('preview')}
        >
          <FileText size={14} className="mr-1" />
          Preview
        </Button>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant={editorMode === 'rich' ? "secondary" : "ghost"} 
          size="sm" 
          className="h-7 text-xs rounded-lg"
          onClick={() => {
            setEditorMode('rich');
            setShowFormatting(true);
          }}
        >
          <LayoutGrid size={14} className="mr-1" />
          Rich Text
        </Button>
        <Button 
          variant={editorMode === 'code' ? "secondary" : "ghost"} 
          size="sm" 
          className="h-7 text-xs rounded-lg"
          onClick={() => {
            setEditorMode('code');
            setShowFormatting(false);
          }}
        >
          <FileCode size={14} className="mr-1" />
          Markdown
        </Button>
      </div>
      
      <div className="ml-auto flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs rounded-lg" 
          onClick={handleVersionHistory}
        >
          <RotateCcw size={14} className="mr-1" />
          History
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs rounded-lg"
          onClick={() => setShowFormatting(!showFormatting)}
        >
          {showFormatting ? "Hide Formatting" : "Show Formatting"}
        </Button>
      </div>
    </div>
  );
};
