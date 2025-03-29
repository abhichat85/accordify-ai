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
  className
}) => {
  return (
    <div className={`flex flex-col h-full bg-background border border-border/40 rounded-xl shadow-sm overflow-hidden ${className}`}>
      <EditorToolbar
        title={title}
        currentTitle={currentTitle}
        setCurrentTitle={setCurrentTitle}
        handleSave={handleSave}
        isSaving={isSaving}
        lastSaved={lastSaved}
        content={content}
        status={status}
        onStatusChange={setStatus}
        setChatPrompt={setChatPrompt}
      />
      
      <FormattingToolbar 
        showFormatting={showFormatting} 
        onFormat={handleFormatting}
        selection={textSelection}
      />
      
      <ViewModeSelector 
        viewMode={viewMode}
        setViewMode={setViewMode}
        editorMode={editorMode}
        setEditorMode={setEditorMode}
        showFormatting={showFormatting}
        setShowFormatting={setShowFormatting}
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
    </div>
  );
};
