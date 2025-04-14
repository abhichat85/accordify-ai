import React, { useState } from "react";
import { useContractEditor } from "@/hooks/useContractEditor";
import { useFormatting } from "@/hooks/useFormatting";
import { EditorContainer } from "./editor/EditorContainer";
import { cn } from "@/lib/utils";
import { SummaryModal } from "./SummaryModal";
import { ContractSummary, summarizeContract } from "@/services/contractAnalysis";
import { useToast } from "@/components/ui/use-toast";
import { TipTapEditor } from "./editor/TipTapEditor";
import { TipTapToolbar } from "./editor/TipTapToolbar";

interface ModernContractEditorProps {
  title: string;
  className?: string;
  initialContent?: string;
}

export const ModernContractEditor: React.FC<ModernContractEditorProps> = ({
  title,
  className,
  initialContent = ""
}) => {
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summarizationError, setSummarizationError] = useState<string | null>(null);
  const [contractSummary, setContractSummary] = useState<ContractSummary | null>(null);
  const { toast } = useToast();

  const {
    content,
    currentTitle,
    isSaving,
    lastSaved,
    viewMode,
    editorMode,
    status,
    setContent,
    setCurrentTitle,
    setViewMode,
    setEditorMode,
    setStatus,
    handleSave,
    setChatPrompt
  } = useContractEditor(title, initialContent);

  const {
    textSelection,
    setTextSelection,
    handleFormatting
  } = useFormatting(content, setContent, viewMode);

  // Handle text selection in the editor
  const handleTextSelection = (selection: { start: number; end: number; text: string }) => {
    setTextSelection(selection);
  };

  // Handle summarization request
  const handleSummarize = async () => {
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
      
      console.log("Summarization result:", result);
      
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

  // Use the TipTap editor in code mode, otherwise use the standard editor container
  return (
    <>
      {editorMode === 'code' ? (
        <EditorContainer
          title={title}
          currentTitle={currentTitle}
          setCurrentTitle={setCurrentTitle}
          content={content}
          viewMode={viewMode}
          editorMode={editorMode}
          showFormatting={true}
          status={status}
          isSaving={isSaving}
          lastSaved={lastSaved}
          setContent={setContent}
          setViewMode={setViewMode}
          setEditorMode={setEditorMode}
          setShowFormatting={() => {}} // Empty function as formatting is always shown
          setStatus={setStatus}
          handleSave={handleSave}
          setChatPrompt={setChatPrompt}
          handleFormatting={handleFormatting}
          textSelection={textSelection}
          onTextSelection={handleTextSelection}
          onSummarize={handleSummarize}
          className={cn(className, "font-jost")}
        />
      ) : (
        <div className={cn("flex flex-col h-full", className, "font-jost")}>
          <div className="flex-1 overflow-auto flex flex-col">
            <TipTapToolbar 
              editor={null} 
              currentTitle={currentTitle}
              setCurrentTitle={setCurrentTitle}
              handleSave={handleSave}
              isSaving={isSaving}
              lastSaved={lastSaved}
              content={content}
              status={status}
              onStatusChange={setStatus}
              setChatPrompt={setChatPrompt}
              onVersionsClick={() => {}}
              onSummarize={handleSummarize}
              viewMode={viewMode}
              setViewMode={setViewMode}
              editorMode={editorMode}
              setEditorMode={setEditorMode}
              showFormatting={true}
              setShowFormatting={() => {}}
            />
            <div className="flex-1 overflow-auto">
              <TipTapEditor 
                content={content} 
                setContent={setContent} 
                className="h-full"
                readOnly={viewMode === 'preview'}
                currentTitle={currentTitle}
                setCurrentTitle={setCurrentTitle}
                handleSave={handleSave}
                isSaving={isSaving}
                lastSaved={lastSaved}
                status={status}
                onStatusChange={setStatus}
                setChatPrompt={setChatPrompt}
                onVersionsClick={() => {}}
                onSummarize={handleSummarize}
              />
            </div>
          </div>
        </div>
      )}
      
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={contractSummary}
        isLoading={summaryLoading}
        error={summarizationError}
      />
    </>
  );
};
