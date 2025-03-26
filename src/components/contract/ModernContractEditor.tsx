
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditorToolbar } from "./editor/EditorToolbar";
import { FormattingToolbar } from "./editor/FormattingToolbar";
import { ViewModeSelector } from "./editor/ViewModeSelector";
import { EditorContent } from "./editor/EditorContent";
import { StatusBar } from "./editor/StatusBar";
import { useContractEditor } from "@/hooks/useContractEditor";

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
    showFormatting,
    setContent,
    setCurrentTitle,
    setViewMode,
    setEditorMode,
    setShowFormatting,
    handleSave
  } = useContractEditor(title, initialContent);

  return (
    <Card className={cn("flex flex-col h-full shadow-md border-border/40 rounded-xl overflow-hidden", className)}>
      {/* Editor toolbar */}
      <CardHeader className="p-0">
        <EditorToolbar 
          title={title}
          currentTitle={currentTitle}
          setCurrentTitle={setCurrentTitle}
          handleSave={handleSave}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
      </CardHeader>
      
      {/* Formatting toolbar */}
      <FormattingToolbar showFormatting={showFormatting} />
      
      {/* View/Mode Selection */}
      <ViewModeSelector 
        viewMode={viewMode}
        setViewMode={setViewMode}
        editorMode={editorMode}
        setEditorMode={setEditorMode}
        showFormatting={showFormatting}
        setShowFormatting={setShowFormatting}
      />
      
      {/* Editor content */}
      <CardContent className="flex-grow p-0 overflow-y-auto">
        <EditorContent 
          viewMode={viewMode}
          content={content}
          setContent={setContent}
        />
      </CardContent>
      
      {/* Status bar */}
      <StatusBar content={content} />
    </Card>
  );
};
