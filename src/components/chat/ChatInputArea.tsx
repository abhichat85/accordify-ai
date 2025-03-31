
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
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
  onModelSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...newFiles]);
      toast({
        title: "Files added",
        description: `${newFiles.length} file(s) added successfully.`,
      });
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      toast({
        title: "Files added",
        description: `${newFiles.length} file(s) added successfully.`,
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
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
            onKeyDown={handleKeyDown}
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
