
import React from "react";
import { useContractEditor } from "@/hooks/useContractEditor";
import { useFormatting } from "@/hooks/useFormatting";
import { EditorContainer } from "./editor/EditorContainer";
import { cn } from "@/lib/utils";

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

  return (
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
      className={cn(className, "font-jost")}
    />
  );
};
