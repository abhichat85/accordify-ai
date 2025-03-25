
import React, { useState, useRef, useEffect } from "react";
import { MessageBubble, Message } from "./MessageBubble";
import { cn } from "@/lib/utils";
import { 
  Mic, 
  Send, 
  Paperclip, 
  X, 
  Camera, 
  ScreenShare, 
  FileText,
  Image,
  Sparkles,
  Lightbulb,
  Bot
} from "lucide-react";
import { nanoid } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AiModes, AiMode } from "./AiModes";
import { Card, CardContent } from "@/components/ui/card";

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
  const [aiMode, setAiMode] = useState<AiMode>("normal");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenCaptureRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
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
      
      toast({
        title: "Files attached",
        description: `${newFiles.length} file(s) ready to send`,
      });
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
      
      toast({
        title: "Files dropped",
        description: `${newFiles.length} file(s) ready to send`,
      });
    }
  };

  // Handle message submit
  const handleSubmit = () => {
    if (inputValue.trim() || files.length > 0) {
      // Add AI mode as a tag to the message if not in normal mode
      const messageWithMode = aiMode !== "normal" 
        ? `[${aiMode.toUpperCase()} MODE] ${inputValue}`
        : inputValue;
        
      onSendMessage(messageWithMode, files.length > 0 ? files : undefined);
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

  // Handle screen capture
  const handleScreenCapture = () => {
    toast({
      title: "Screen capture",
      description: "Select the area of the screen you want to capture",
    });
    // In a real app, we would trigger screen capture here
  };

  // Handle camera capture
  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
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
    <Card className={cn(
      "flex flex-col h-full overflow-hidden rounded-2xl shadow-md border-border/40", 
      className
    )}>
      {/* Messages Area */}
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-240px)] px-4 py-6">
          {showWelcomeMessage ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 animate-scale-in shadow-lg">
                <Bot className="text-primary-foreground w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-foreground animate-fade-in bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome to Accord AI
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md animate-fade-in delay-100 text-lg">
                Your AI-powered contract assistant. Ask me to generate, review, or analyze any contract.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl animate-fade-in delay-200">
                <Card 
                  className="p-4 cursor-pointer hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/30"
                  onClick={() => {
                    setInputValue("Generate an NDA for my company");
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 100);
                  }}
                >
                  <div className="flex items-center mb-2">
                    <FileText className="text-primary mr-2" size={20} />
                    <p className="font-semibold text-foreground">Generate a new NDA</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Create a custom non-disclosure agreement</p>
                </Card>
                <Card 
                  className="p-4 cursor-pointer hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/30"
                  onClick={() => {
                    setInputValue("I need you to review a contract");
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 100);
                  }}
                >
                  <div className="flex items-center mb-2">
                    <FileText className="text-primary mr-2" size={20} />
                    <p className="font-semibold text-foreground">Review my contract</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Get analysis and risk assessment</p>
                </Card>
                <Card 
                  className="p-4 cursor-pointer hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/30"
                  onClick={() => {
                    setInputValue("Help me compare two contract versions");
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 100);
                  }}
                >
                  <div className="flex items-center mb-2">
                    <FileText className="text-primary mr-2" size={20} />
                    <p className="font-semibold text-foreground">Compare versions</p>
                  </div>
                  <p className="text-sm text-muted-foreground">See what's changed between drafts</p>
                </Card>
                <Card 
                  className="p-4 cursor-pointer hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/30"
                  onClick={() => {
                    setInputValue("I need a Statement of Work template");
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 100);
                  }}
                >
                  <div className="flex items-center mb-2">
                    <FileText className="text-primary mr-2" size={20} />
                    <p className="font-semibold text-foreground">Create SOW</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Draft a statement of work</p>
                </Card>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isLatest={index === messages.length - 1}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      {/* AI Modes */}
      <div className="px-4">
        <AiModes activeMode={aiMode} onChange={setAiMode} />
      </div>

      {/* File Upload Preview */}
      {files.length > 0 && (
        <div className="bg-muted/40 border-t border-border p-2 animate-slide-in-up">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-background rounded-lg px-3 py-1.5 text-sm border border-border"
              >
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-muted-foreground hover:text-destructive"
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
        "border-t border-border/40 p-4 bg-background/20 rounded-b-2xl",
        isDragging && "bg-primary/5"
      )}>
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl z-10">
            <p className="text-primary font-medium">Drop files here</p>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-2 relative">
            <div className="flex-grow relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "Listening..." : "Ask about contracts, upload, or start with a template..."}
                className={cn(
                  "w-full p-3 rounded-xl border border-border bg-background/80 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none overflow-hidden min-h-[52px] max-h-[150px]",
                  isRecording && "bg-primary/5 border-primary animate-pulse-subtle"
                )}
                disabled={isProcessing}
                rows={1}
              />
            </div>
            
            <Button
              onClick={handleToggleRecording}
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className={cn(
                "rounded-full h-10 w-10 shadow-sm",
                isRecording && "animate-pulse"
              )}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              <Mic size={18} />
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() && files.length === 0}
              variant="default"
              size="icon"
              className={cn(
                "rounded-full h-10 w-10 btn-glow shadow-sm",
                (!inputValue.trim() && files.length === 0) && "opacity-70"
              )}
            >
              <Send size={18} />
            </Button>
          </div>
          
          {/* Attachment options */}
          <div className="flex flex-wrap gap-2 mt-1">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1.5 h-8 shadow-sm"
            >
              <Paperclip size={14} />
              Attach files
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </Button>
            
            <Button
              onClick={handleScreenCapture}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1.5 h-8 shadow-sm"
            >
              <ScreenShare size={14} />
              Screenshot
              <input
                type="file"
                ref={screenCaptureRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </Button>
            
            <Button
              onClick={handleCameraCapture}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1.5 h-8 shadow-sm"
            >
              <Camera size={14} />
              Camera
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                capture="environment"
              />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1.5 h-8 ml-auto shadow-sm"
              onClick={() => {
                toast({
                  title: "AI Suggestions",
                  description: "Loading smart suggestions based on your history...",
                });
              }}
            >
              <Lightbulb size={14} className="text-primary" />
              Smart Suggestions
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
