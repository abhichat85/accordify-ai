import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditorToolbar } from "./EditorToolbar";
import { FormattingToolbar } from "./FormattingToolbar";
import { EditorContent } from "./EditorContent";
import { StatusBar } from "./StatusBar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { SummaryModal } from "../SummaryModal";
import { ContractSummary, summarizeContract } from "@/services/contractAnalysis";
import { useToast } from "@/components/ui/use-toast";

interface EditorContainerProps {
  title: string;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  content: string;
  viewMode: 'edit' | 'preview';
  editorMode: 'rich' | 'code';
  showFormatting: boolean;
  status: 'draft' | 'submitted' | 'sent_for_signing';
  isSaving: boolean;
  lastSaved: Date | null;
  setContent: (content: string) => void;
  setViewMode: (viewMode: 'edit' | 'preview') => void;
  setEditorMode: (editorMode: 'rich' | 'code') => void;
  setShowFormatting: (showFormatting: boolean) => void;
  setStatus: (status: 'draft' | 'submitted' | 'sent_for_signing') => void;
  handleSave: () => void;
  setChatPrompt?: (prompt: string) => boolean;
  handleFormatting: (command: string) => void;
  textSelection: { start: number; end: number; text: string } | null;
  onTextSelection: (selection: { start: number; end: number; text: string }) => void;
  onVersionsClick?: () => void;
  onSummarize?: () => void;
  className?: string;
}

export const EditorContainer: React.FC<EditorContainerProps> = ({
  title,
  currentTitle,
  setCurrentTitle,
  content,
  viewMode,
  editorMode,
  showFormatting,
  status,
  isSaving,
  lastSaved,
  setContent,
  setViewMode,
  setEditorMode,
  setShowFormatting,
  setStatus,
  handleSave,
  setChatPrompt,
  handleFormatting,
  textSelection,
  onTextSelection,
  onVersionsClick,
  onSummarize,
  className
}) => {
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState([
    { id: 1, date: new Date(Date.now() - 86400000), title: 'Original draft' },
    { id: 2, date: new Date(Date.now() - 43200000), title: 'Clause additions' },
    { id: 3, date: new Date(Date.now() - 3600000), title: 'Latest changes' },
  ]);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summarizationError, setSummarizationError] = useState<string | null>(null);
  const [contractSummary, setContractSummary] = useState<ContractSummary | null>(null);
  const { toast } = useToast();

  const handleVersionHistory = () => {
    setHistoryDialogOpen(true);
  };

  const restoreVersion = (versionId: number) => {
    setHistoryDialogOpen(false);
  };

  const handleSummarizeContract = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty Contract",
        description: "There is no content to summarize.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Reset state before starting
      setContractSummary(null);
      setSummarizationError(null);
      setSummaryLoading(true);
      setIsSummaryModalOpen(true);
      
      console.log("Starting contract summarization for content length:", content.length);
      const result = await summarizeContract(content);
      
      if (result.type === "error") {
        console.error("Summarization error:", result.error);
        setSummarizationError(result.error);
        toast({
          title: "Summarization Failed",
          description: result.error,
          variant: "destructive"
        });
      } else if (result.type === "summary" && result.result) {
        console.log("Summary received:", result.result);
        setContractSummary(result.result);
      } else {
        // Unexpected result type or missing result
        const errorMsg = "Received invalid response from summarization service";
        console.error(errorMsg, result);
        setSummarizationError(errorMsg);
        toast({
          title: "Summarization Failed",
          description: errorMsg,
          variant: "destructive" 
        });
      }
    } catch (err) {
      console.error("Exception in handleSummarize:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setSummarizationError(errorMessage);
      toast({
        title: "Summarization Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-background border border-border/40 rounded-xl shadow-sm overflow-hidden ${className}`}>
      <EditorToolbar
        title={currentTitle || title}
        currentTitle={currentTitle}
        setCurrentTitle={setCurrentTitle}
        handleSave={handleSave}
        isSaving={isSaving}
        lastSaved={lastSaved}
        content={content}
        status={status}
        onStatusChange={setStatus}
        setChatPrompt={setChatPrompt}
        onVersionsClick={handleVersionHistory}
        onSummarize={handleSummarizeContract}
      />
      
      <FormattingToolbar 
        showFormatting={showFormatting} 
        onFormat={handleFormatting}
        selection={textSelection}
        onVersionsClick={handleVersionHistory}
      />
      
      <CardContent className="flex-grow p-0 overflow-y-auto">
        <EditorContent 
          viewMode={viewMode}
          content={content}
          setContent={setContent}
          onTextSelection={onTextSelection}
        />
      </CardContent>
      
      <StatusBar content={content} />

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
      <SummaryModal 
        isOpen={isSummaryModalOpen} 
        isLoading={summaryLoading} 
        error={summarizationError} 
        summary={contractSummary} 
        onClose={() => setIsSummaryModalOpen(false)} 
      />
    </div>
  );
};
