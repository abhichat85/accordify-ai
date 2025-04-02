
import React from "react";
import { cn } from "@/lib/utils";
import { FileChips } from "./components/FileChips";
import { ChatTextArea } from "./components/ChatTextArea";
import { ActionButtons } from "./components/ActionButtons";
import { DragOverlay } from "./components/DragOverlay";

interface ChatInputAreaProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: () => void;
  isProcessing: boolean;
  files: File[];
  setFiles: (files: File[]) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  selectedModel?: string;
  onModelSelect?: (model: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleFileUpload: () => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputValue,
  setInputValue,
  handleSubmit,
  isProcessing,
  files,
  setFiles,
  isDragging,
  setIsDragging,
  selectedModel = "GPT-4o",
  onModelSelect,
  onKeyDown,
  fileInputRef,
  handleFileDrop,
  handleDragOver,
  handleDragLeave,
  handleFileUpload,
  handleFileInputChange,
  handleRemoveFile
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="p-3">
      <div
        className={cn(
          "relative rounded-xl border transition-colors focus-within:border-primary",
          isDragging ? "border-primary bg-primary/10" : "border-border/40"
        )}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* File chips display */}
        <FileChips files={files} onRemoveFile={handleRemoveFile} />
        
        {/* Drag overlay */}
        <DragOverlay isDragging={isDragging} />

        {/* Text input area */}
        <div className="flex items-end">
          <ChatTextArea 
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
          />
        </div>

        {/* Action buttons */}
        <ActionButtons 
          onFileUpload={handleFileUpload}
          onSubmit={handleSubmit}
          isDisabled={!inputValue.trim() && files.length === 0}
          isProcessing={isProcessing}
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
        />
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileInputChange}
      />
    </div>
  );
};
