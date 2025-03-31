
import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowUp, 
  Paperclip, 
  Image,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const availableModels = [
    "GPT-4o",
    "Claude 3 Opus",
    "Claude 3 Sonnet",
    "GPT-4",
    "GPT-3.5 Turbo"
  ];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      
      // Auto-resize the textarea based on content
      adjustTextareaHeight();
    }
  }, [inputValue]);

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  };

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

  const handleModelSelect = (model: string) => {
    if (onModelSelect) {
      onModelSelect(model);
    }
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
        {/* File chips display if files are selected */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 border-b border-border/40">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 text-xs"
              >
                {file.type.startsWith("image/") ? (
                  <Image size={12} />
                ) : (
                  <Paperclip size={12} />
                )}
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setFiles(files.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 border-2 border-dashed border-primary z-10">
            <div className="text-center">
              <Paperclip className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-sm font-medium text-primary">Drop files to upload</p>
            </div>
          </div>
        )}

        {/* Text input area */}
        <div className="flex items-end">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Accord AI..."
            className="min-h-[60px] max-h-[200px] py-4 px-4 flex-1 bg-transparent border-0 focus-visible:ring-0 resize-none overflow-hidden"
            data-chat-input="true"
            aria-label="chat-input"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between p-2 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            {/* File upload button */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileInputChange}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={handleFileUpload}
            >
              <Paperclip size={16} />
              <span className="hidden sm:inline">Attach</span>
            </Button>
            
            {/* Image upload button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
            >
              <Image size={16} />
              <span className="hidden sm:inline">Image</span>
            </Button>
            
            {/* Suggestions button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">Suggest</span>
            </Button>
            
            {/* Model selection dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground ml-2"
                >
                  {selectedModel}
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-popover">
                {availableModels.map((model) => (
                  <DropdownMenuItem 
                    key={model} 
                    onClick={() => handleModelSelect(model)}
                    className={cn(
                      "cursor-pointer",
                      model === selectedModel && "font-medium bg-muted"
                    )}
                  >
                    {model}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Send button */}
          <Button
            type="button"
            size="sm"
            className={cn(
              "h-8 gap-1.5",
              !inputValue.trim() && files.length === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"
            )}
            disabled={!inputValue.trim() && files.length === 0 || isProcessing}
            onClick={handleSubmit}
          >
            <ArrowUp size={16} />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
