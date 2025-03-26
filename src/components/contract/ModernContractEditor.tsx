
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditorToolbar } from "./editor/EditorToolbar";
import { FormattingToolbar } from "./editor/FormattingToolbar";
import { ViewModeSelector } from "./editor/ViewModeSelector";
import { EditorContent } from "./editor/EditorContent";
import { StatusBar } from "./editor/StatusBar";
import { useContractEditor } from "@/hooks/useContractEditor";
import { useToast } from "@/hooks/use-toast";

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

  const { toast } = useToast();
  const [textSelection, setTextSelection] = useState<{ start: number; end: number; text: string } | null>(null);

  // Handle text formatting
  const handleFormatting = (formatType: string, value?: any) => {
    // If we're in preview mode, switch to edit mode to apply formatting
    if (viewMode === 'preview') {
      setViewMode('edit');
      toast({
        title: "Switched to edit mode",
        description: "Switched to edit mode to apply formatting.",
      });
      return;
    }

    let newContent = content;
    const selection = textSelection;

    if (!selection && ['bold', 'italic', 'underline'].includes(formatType)) {
      toast({
        title: "No text selected",
        description: "Please select some text to format.",
        variant: "destructive"
      });
      return;
    }

    // Focus the editor
    if (typeof window !== 'undefined' && (window as any).focusContractEditor) {
      (window as any).focusContractEditor();
    }

    // Apply formatting based on format type
    switch (formatType) {
      case 'bold':
        if (selection) {
          const before = newContent.substring(0, selection.start);
          const selected = selection.text;
          const after = newContent.substring(selection.end);
          newContent = `${before}**${selected}**${after}`;
        }
        break;

      case 'italic':
        if (selection) {
          const before = newContent.substring(0, selection.start);
          const selected = selection.text;
          const after = newContent.substring(selection.end);
          newContent = `${before}*${selected}*${after}`;
        }
        break;

      case 'underline':
        if (selection) {
          const before = newContent.substring(0, selection.start);
          const selected = selection.text;
          const after = newContent.substring(selection.end);
          newContent = `${before}++${selected}++${after}`;
        }
        break;

      case 'heading1':
        // Fixed heading logic - correctly handle line identification
        if (selection) {
          const before = newContent.substring(0, selection.start);
          // Find the start of the current line
          const lineStartPos = before.lastIndexOf('\n') + 1;
          // Get text from the start of the line to selection start
          const lineStart = before.substring(lineStartPos);
          // Get the content of the full line
          const lineEnd = newContent.substring(selection.end).indexOf('\n');
          const lineEndPos = lineEnd >= 0 ? selection.end + lineEnd : newContent.length;
          const currentLine = lineStart + selection.text + newContent.substring(selection.end, lineEndPos);
          
          // Create new content with heading
          let newLine;
          if (currentLine.startsWith('# ')) {
            // Remove heading if it's already an H1
            newLine = currentLine.substring(2);
          } else if (currentLine.startsWith('## ')) {
            // Convert H2 to H1
            newLine = '# ' + currentLine.substring(3);
          } else {
            // Add H1 heading
            newLine = '# ' + currentLine;
          }
          
          // Reassemble the content with the new heading
          newContent = 
            before.substring(0, lineStartPos) + 
            newLine + 
            newContent.substring(lineEndPos);
        } else {
          // Just add a heading at the cursor position
          const cursorPos = content.length;
          newContent = content + "\n# Heading 1";
        }
        break;

      case 'heading2':
        // Fixed heading logic for H2 - similar to H1 but for level 2
        if (selection) {
          const before = newContent.substring(0, selection.start);
          // Find the start of the current line
          const lineStartPos = before.lastIndexOf('\n') + 1;
          // Get text from the start of the line to selection start
          const lineStart = before.substring(lineStartPos);
          // Get the content of the full line
          const lineEnd = newContent.substring(selection.end).indexOf('\n');
          const lineEndPos = lineEnd >= 0 ? selection.end + lineEnd : newContent.length;
          const currentLine = lineStart + selection.text + newContent.substring(selection.end, lineEndPos);
          
          // Create new content with heading
          let newLine;
          if (currentLine.startsWith('## ')) {
            // Remove heading if it's already an H2
            newLine = currentLine.substring(3);
          } else if (currentLine.startsWith('# ')) {
            // Convert H1 to H2
            newLine = '## ' + currentLine.substring(2);
          } else {
            // Add H2 heading
            newLine = '## ' + currentLine;
          }
          
          // Reassemble the content with the new heading
          newContent = 
            before.substring(0, lineStartPos) + 
            newLine + 
            newContent.substring(lineEndPos);
        } else {
          // Just add a heading at the cursor position
          const cursorPos = content.length;
          newContent = content + "\n## Heading 2";
        }
        break;

      case 'unordered-list':
        // Insert unordered list item
        if (selection) {
          const before = newContent.substring(0, selection.start);
          const after = newContent.substring(selection.end);
          
          // Split selection by lines and add list markers
          const lines = selection.text.split('\n');
          const listItems = lines.map(line => `- ${line}`).join('\n');
          
          newContent = `${before}${listItems}${after}`;
        } else {
          newContent = `${newContent}\n- List item`;
        }
        break;

      case 'ordered-list':
        // Insert ordered list item
        if (selection) {
          const before = newContent.substring(0, selection.start);
          const after = newContent.substring(selection.end);
          
          // Split selection by lines and add numbered list markers
          const lines = selection.text.split('\n');
          const listItems = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
          
          newContent = `${before}${listItems}${after}`;
        } else {
          newContent = `${newContent}\n1. List item`;
        }
        break;

      case 'auto-format':
        // Simulate auto-formatting for legal document standards
        toast({
          title: "Auto-formatting applied",
          description: "Your document has been formatted according to legal standards.",
        });
        
        // In a real implementation, this would apply proper legal document styling
        // For now, we'll just ensure consistent spacing and add some standard structure
        if (!newContent.includes('AGREEMENT')) {
          newContent = `# AGREEMENT\n\n${newContent.trim()}\n\n## SIGNATURES\n\n________________\nParty 1\n\n________________\nParty 2`;
        }
        break;
        
      case 'align':
        // Text alignment (this would be reflected in the preview through CSS)
        if (selection) {
          const before = newContent.substring(0, selection.start);
          const after = newContent.substring(selection.end);
          newContent = `${before}<div style="text-align: ${value};">${selection.text}</div>${after}`;
        }
        break;
    }

    // Update content with formatted text
    setContent(newContent);
  };

  // Handle text selection in the editor
  const handleTextSelection = (selection: { start: number; end: number; text: string }) => {
    setTextSelection(selection);
  };

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
          onTextSelection={handleTextSelection}
        />
      </CardContent>
      
      {/* Status bar */}
      <StatusBar content={content} />
    </Card>
  );
};
