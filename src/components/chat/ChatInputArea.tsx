import React from "react";
import { cn } from "@/lib/utils";
import { FileChips } from "./components/FileChips";
import { ChatTextArea } from "./components/ChatTextArea";
import { ActionButtons } from "./components/ActionButtons";
import { DragOverlay } from "./components/DragOverlay";
import { Paperclip, Camera, ScreenShare } from "lucide-react";

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
          "relative rounded-xl border shadow-sm transition-all duration-200 focus-within:border-primary focus-within:shadow-md",
          isDragging 
            ? "border-primary/70 bg-primary/5 shadow-primary/10" 
            : "border-border/40 hover:border-border/70"
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
            placeholder={`Message Accord AI${files.length > 0 ? ' with attachments' : ''}...`}
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
      
      {/* Status indicator */}
      <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground px-2">
        <div className="flex items-center gap-1">
          {isProcessing && (
            <span className="flex items-center">
              <span className="animate-pulse mr-1">•</span>
              Accord AI is thinking...
            </span>
          )}
        </div>
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