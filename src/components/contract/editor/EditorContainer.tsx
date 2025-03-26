
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditorToolbar } from "./EditorToolbar";
import { FormattingToolbar } from "./FormattingToolbar";
import { ViewModeSelector } from "./ViewModeSelector";
import { EditorContent } from "./EditorContent";
import { StatusBar } from "./StatusBar";

interface EditorContainerProps {
  title: string;
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  content: string;
  viewMode: 'edit' | 'preview';
  editorMode: 'rich' | 'code';
  showFormatting: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  setContent: (content: string) => void;
  setViewMode: (mode: 'edit' | 'preview') => void;
  setEditorMode: (mode: 'rich' | 'code') => void;
  setShowFormatting: (show: boolean) => void;
  handleSave: () => void;
  handleFormatting: (formatType: string, value?: any) => void;
  textSelection: { start: number; end: number; text: string } | null;
  onTextSelection: (selection: { start: number; end: number; text: string }) => void;
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
  isSaving,
  lastSaved,
  setContent,
  setViewMode,
  setEditorMode,
  setShowFormatting,
  handleSave,
  handleFormatting,
  textSelection,
  onTextSelection,
  className
}) => {
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
          content={content}
        />
      </CardHeader>
      
      {/* Formatting toolbar */}
      <FormattingToolbar 
        showFormatting={showFormatting} 
        onFormat={handleFormatting}
        selection={textSelection}
      />
      
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
          onTextSelection={onTextSelection}
        />
      </CardContent>
      
      {/* Status bar */}
      <StatusBar content={content} />
    </Card>
  );
};
