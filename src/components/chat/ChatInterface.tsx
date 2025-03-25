
import React, { useState, useRef, useEffect } from "react";
import { MessageBubble, Message, MessageType } from "./MessageBubble";
import { cn } from "@/lib/utils";
import { Mic, Send, Paperclip, X } from "lucide-react";
import { nanoid } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  onSendMessage: (message: string, files?: File[]) => void;
  messages: Message[];
  isProcessing?: boolean;
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isProcessing = false,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Scroll to latest message on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Handle file drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Handle message submit
  const handleSubmit = () => {
    if (inputValue.trim() || files.length > 0) {
      onSendMessage(inputValue, files.length > 0 ? files : undefined);
      setInputValue("");
      setFiles([]);
    }
  };

  // Handle special keys (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle voice recording toggle
  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Your message is ready to send.",
      });
      // In a real app, we would process the audio here
    } else {
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak your message clearly.",
      });
      // In a real app, we would start recording here
    }
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-resize textarea height based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Welcome messages
  const hasMessages = messages.length > 0;
  const showWelcomeMessage = !hasMessages;

  return (
    <div 
      className={cn(
        "flex flex-col h-full", 
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto px-4 py-6 styled-scrollbar">
        {showWelcomeMessage && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-accord-teal text-white flex items-center justify-center mb-4 animate-scale-in">
              <span className="text-xl font-bold">AI</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-accord-blue animate-fade-in">
              Welcome to Accord AI
            </h2>
            <p className="text-accord-darkGray mb-6 max-w-md animate-fade-in delay-100">
              Your AI-powered contract assistant. Ask me to generate, review, or analyze any contract.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg animate-fade-in delay-200">
              <div className="glass p-3 rounded-xl cursor-pointer hover:shadow-md transition-all">
                <p className="font-medium text-accord-blue">Generate a new NDA</p>
                <p className="text-xs text-accord-darkGray/80">Create a custom non-disclosure agreement</p>
              </div>
              <div className="glass p-3 rounded-xl cursor-pointer hover:shadow-md transition-all">
                <p className="font-medium text-accord-blue">Review my contract</p>
                <p className="text-xs text-accord-darkGray/80">Get analysis and risk assessment</p>
              </div>
              <div className="glass p-3 rounded-xl cursor-pointer hover:shadow-md transition-all">
                <p className="font-medium text-accord-blue">Compare versions</p>
                <p className="text-xs text-accord-darkGray/80">See what's changed between drafts</p>
              </div>
              <div className="glass p-3 rounded-xl cursor-pointer hover:shadow-md transition-all">
                <p className="font-medium text-accord-blue">Create SOW</p>
                <p className="text-xs text-accord-darkGray/80">Draft a statement of work</p>
              </div>
            </div>
          </div>
        )}

        {hasMessages && messages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isLatest={index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Preview */}
      {files.length > 0 && (
        <div className="bg-accord-lightGray border-t border-accord-mediumGray/50 p-2 animate-slide-in-up">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-white rounded-lg px-3 py-1.5 text-sm border border-accord-mediumGray/50"
              >
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-accord-darkGray hover:text-accord-orange"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={cn(
        "border-t border-accord-mediumGray/50 p-3 transition-all",
        isDragging && "bg-accord-teal/10"
      )}>
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-accord-teal/5 border-2 border-dashed border-accord-teal/50 rounded-lg z-10">
            <p className="text-accord-teal font-medium">Drop files here</p>
          </div>
        )}
        
        <div className="flex items-end gap-2 relative">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-accord-darkGray hover:text-accord-teal transition-colors"
            title="Attach files"
          >
            <Paperclip size={20} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </button>
          
          <div className="flex-grow relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : "Ask about contracts, upload, or start with a template..."}
              className={cn(
                "w-full p-3 pr-10 rounded-xl border border-accord-mediumGray/50 text-sm focus:outline-none focus:ring-1 focus:ring-accord-teal resize-none overflow-hidden min-h-[44px] max-h-[120px]",
                isRecording && "bg-accord-teal/5 border-accord-teal animate-pulse-subtle"
              )}
              disabled={isProcessing}
              rows={1}
            />
          </div>
          
          <button
            onClick={handleToggleRecording}
            className={cn(
              "p-2 rounded-full transition-colors",
              isRecording 
                ? "bg-accord-orange text-white"
                : "text-accord-darkGray hover:text-accord-teal"
            )}
            title={isRecording ? "Stop recording" : "Start voice input"}
          >
            <Mic size={20} />
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() && files.length === 0}
            className={cn(
              "p-2 rounded-full transition-all",
              (inputValue.trim() || files.length > 0)
                ? "bg-accord-teal text-white shadow-sm hover:shadow"
                : "bg-accord-mediumGray/50 text-accord-darkGray/50 cursor-not-allowed"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
