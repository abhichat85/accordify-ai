
import React, { useState } from "react";
import { Message } from "./MessageBubble";
import { cn } from "@/lib/utils";
import { AiMode } from "./AiModes";
import { ChatMessageArea } from "./ChatMessageArea";
import { ChatInputArea } from "./ChatInputArea";
import { useInputHandling } from "./hooks/useInputHandling";
import { useFileHandling } from "./hooks/useFileHandling";
import { useProactiveSuggestions } from "./hooks/useProactiveSuggestions";
import { useContextAwareness } from "./hooks/useContextAwareness";
import { useAgentCapabilities } from "./hooks/useAgentCapabilities";

interface ChatInterfaceProps {
  onSendMessage: (message: string, files?: File[]) => void;
  messages: Message[];
  isProcessing?: boolean;
  className?: string;
  defaultInputValue?: string;
  selectedModel?: string;
  onModelSelect?: (model: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isProcessing = false,
  className,
  defaultInputValue = "",
  selectedModel = "GPT-4o",
  onModelSelect
}) => {
  const { 
    inputValue, 
    setInputValue, 
    handleInputChange, 
    handleSuggestionClick 
  } = useInputHandling(defaultInputValue);
  
  const {
    files,
    setFiles,
    isDragging,
    setIsDragging,
    fileInputRef,
    handleFileDrop,
    handleDragOver,
    handleDragLeave,
    handleFileUpload,
    handleFileInputChange,
    handleRemoveFile
  } = useFileHandling();
  
  const { 
    showProactiveSuggestions, 
    setShowProactiveSuggestions, 
    proactiveSuggestions 
  } = useProactiveSuggestions();
  
  const contextAwareness = useContextAwareness(messages);
  const agentCapabilities = useAgentCapabilities();
  const [aiMode, setAiMode] = useState<AiMode>("normal");

  const handleSubmit = () => {
    if (inputValue.trim() || files.length > 0) {
      const messageWithMode = aiMode !== "normal" 
        ? `[${aiMode.toUpperCase()} MODE] ${inputValue}`
        : inputValue;
        
      onSendMessage(messageWithMode, files.length > 0 ? files : undefined);
      setInputValue("");
      setFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden bg-background/10", 
      className
    )}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-grow overflow-hidden flex flex-col">
          {/* Main chat area */}
          <ChatMessageArea 
            messages={messages}
            proactiveSuggestions={proactiveSuggestions}
            showProactiveSuggestions={showProactiveSuggestions}
            handleSuggestionClick={handleSuggestionClick}
            contextAwareness={contextAwareness}
          />
        </div>
      
        <div className="shrink-0 px-3 pb-1 pt-0.5">
          <AiModes activeMode={aiMode} onChange={setAiMode} />
        </div>

        <ChatInputArea
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          isProcessing={isProcessing}
          files={files}
          setFiles={setFiles}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
          onKeyDown={handleKeyDown}
          fileInputRef={fileInputRef}
          handleFileDrop={handleFileDrop}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleFileUpload={handleFileUpload}
          handleFileInputChange={handleFileInputChange}
          handleRemoveFile={handleRemoveFile}
        />
      </div>
    </div>
  );
};
