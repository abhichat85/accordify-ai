
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, FileText, LayoutGrid, FileCode, RotateCcw, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState([
    { id: 1, date: new Date(Date.now() - 86400000), title: 'Original draft' },
    { id: 2, date: new Date(Date.now() - 43200000), title: 'Clause additions' },
    { id: 3, date: new Date(Date.now() - 3600000), title: 'Latest changes' },
  ]);

  const handleVersionHistory = () => {
    setHistoryDialogOpen(true);
  };

  const restoreVersion = (versionId: number) => {
    toast({
      title: "Version restored",
      description: `Contract version #${versionId} has been restored.`,
    });
    setHistoryDialogOpen(false);
  };

  return (
    <>
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
            <History size={14} className="mr-1" />
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

      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Version History</DialogTitle>
            <DialogDescription>
              Select a version to restore your document to that point.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2 max-h-60 overflow-y-auto styled-scrollbar">
              {versionHistory.map((version) => (
                <div 
                  key={version.id}
                  className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted cursor-pointer"
                  onClick={() => restoreVersion(version.id)}
                >
                  <div>
                    <p className="font-medium">{version.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {version.date.toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <RotateCcw size={14} className="mr-1" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
