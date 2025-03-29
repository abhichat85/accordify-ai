
import React, { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  Send, 
  Paperclip, 
  X, 
  Camera, 
  ScreenShare,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ChatInputAreaProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: () => void;
  isProcessing?: boolean;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputValue,
  setInputValue,
  handleSubmit,
  isProcessing = false,
  files,
  setFiles,
  isDragging,
  setIsDragging
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenCaptureRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Effect to auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Add a special effect to make the textarea accessible to the chatInputUtils
  useEffect(() => {
    // Add a special data attribute to make this textarea more easily findable
    if (inputRef.current) {
      inputRef.current.setAttribute('data-chat-input', 'true');
      inputRef.current.setAttribute('aria-label', 'chat-input');
    }
  }, []);

  // Effect to synchronize external inputValue changes
  useEffect(() => {
    // This makes the component respond to external value updates
    if (inputRef.current && inputRef.current.value !== inputValue) {
      setInputValue(inputRef.current.value);
    }
  }, []);
  
  // Special effect to listen for external programmatic changes
  useEffect(() => {
    if (!inputRef.current) return;
    
    // This creates a MutationObserver to watch for direct DOM mutations
    // which might happen when other code directly modifies the value
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
          const newValue = (mutation.target as HTMLTextAreaElement).value;
          if (newValue !== inputValue) {
            console.log("External value change detected:", newValue);
            setInputValue(newValue);
          }
        }
      }
    });
    
    observer.observe(inputRef.current, { 
      attributes: true,
      attributeFilter: ['value'] 
    });
    
    return () => observer.disconnect();
  }, [inputValue, setInputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

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

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Your message is ready to send.",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak your message clearly.",
      });
    }
  };

  const handleScreenCapture = () => {
    toast({
      title: "Screen capture",
      description: "Select the area of the screen you want to capture",
    });
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
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

      <div 
        className={cn(
          "border-t border-border/40 p-3 bg-background/60 rounded-b-xl",
          isDragging && "bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl z-10">
            <p className="text-primary font-medium">Drop files here</p>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2 relative">
            <div className="flex-grow relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "Listening..." : "Ask about contracts, upload, or start with a template..."}
                className={cn(
                  "w-full p-3 rounded-xl border border-border bg-background/80 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none overflow-hidden min-h-[48px] max-h-[120px]",
                  isRecording && "bg-primary/5 border-primary animate-pulse-subtle"
                )}
                disabled={isProcessing}
                rows={1}
                data-chat-input="true"
                aria-label="chat-input"
              />
            </div>
            
            <Button
              onClick={handleToggleRecording}
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className={cn(
                "rounded-full h-9 w-9 shadow-sm",
                isRecording && "animate-pulse"
              )}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              <Mic size={16} />
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() && files.length === 0}
              variant="default"
              size="icon"
              className={cn(
                "rounded-full h-9 w-9 shadow-sm",
                (!inputValue.trim() && files.length === 0) && "opacity-70"
              )}
            >
              <Send size={16} />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1 h-7 shadow-sm"
            >
              <Paperclip size={12} />
              Attach
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
              className="rounded-lg text-xs gap-1 h-7 shadow-sm"
            >
              <ScreenShare size={12} />
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
              className="rounded-lg text-xs gap-1 h-7 shadow-sm"
            >
              <Camera size={12} />
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
              className="rounded-lg text-xs gap-1 h-7 ml-auto shadow-sm"
              onClick={() => {
                toast({
                  title: "AI Suggestions",
                  description: "Loading smart suggestions based on your history...",
                });
              }}
            >
              <Lightbulb size={12} className="text-primary" />
              Suggestions
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
