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
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
      // Reset height to auto to get the correct scrollHeight
      inputRef.current.style.height = "auto";
      
      // Calculate new height (capped at max-height CSS value)
      const newHeight = Math.min(inputRef.current.scrollHeight, 200);
      
      // Set the height
      inputRef.current.style.height = `${newHeight}px`;
      
      // Enable scrolling if content exceeds the max height
      if (inputRef.current.scrollHeight > 200) {
        inputRef.current.style.overflowY = "auto";
      } else {
        inputRef.current.style.overflowY = "hidden";
      }
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
  }, [inputValue, setInputValue]);
  
  // Listen for the custom chat-prompt-update event
  useEffect(() => {
    if (!inputRef.current) return;
    
    const inputElement = inputRef.current; // Store ref in a variable for cleanup
    
    const handleCustomPromptUpdate = (event: CustomEvent) => {
      const { prompt } = event.detail;
      console.log("Received custom prompt update event:", prompt);
      setInputValue(prompt);
      
      // Auto-focus the input after setting the value
      setTimeout(() => {
        if (inputRef.current) {
          // Reset height to auto to get the correct scrollHeight
          inputRef.current.style.height = "auto";
          
          // Calculate new height (capped at max-height CSS value)
          const newHeight = Math.min(inputRef.current.scrollHeight, 200);
          
          // Set the height
          inputRef.current.style.height = `${newHeight}px`;
          
          // Enable scrolling if content exceeds the max height
          if (inputRef.current.scrollHeight > 200) {
            inputRef.current.style.overflowY = "auto";
          } else {
            inputRef.current.style.overflowY = "hidden";
          }
          
          inputRef.current.focus();
        }
      }, 10);
    };
    
    // Add event listener for our custom event
    inputElement.addEventListener('chat-prompt-update', handleCustomPromptUpdate as EventListener);
    
    return () => {
      // Use the stored variable in cleanup to avoid stale ref
      inputElement.removeEventListener('chat-prompt-update', handleCustomPromptUpdate as EventListener);
    };
  }, [setInputValue, inputValue]);
  
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
          "border-t border-border/40 p-3 bg-[#1F1F1F]",
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
          {/* Full-width chatbox with contextual buttons */}
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : "Ask about contracts, upload, or start with a template..."}
              className={cn(
                "w-full p-3 pr-20 rounded-md border border-[#7c3aed]/30 bg-[#333333] text-sm focus:outline-none focus:ring-1 focus:ring-[#7c3aed] resize-none overflow-y-auto min-h-[48px] max-h-[200px]",
                isRecording && "bg-primary/5 border-primary animate-pulse-subtle"
              )}
              disabled={isProcessing}
              rows={1}
              data-chat-input="true"
              aria-label="chat-input"
            />
            
            {/* Contextual buttons inside the textarea */}
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-full text-muted-foreground hover:text-foreground",
                  isRecording && "text-primary"
                )}
                onClick={handleToggleRecording}
              >
                <Mic size={16} />
              </Button>
              
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isProcessing || (!inputValue.trim() && files.length === 0)}
                className={cn(
                  "h-7 w-7 rounded-full bg-[#7c3aed] hover:bg-[#7c3aed]/90 flex items-center justify-center p-0",
                  (isProcessing || (!inputValue.trim() && files.length === 0)) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Send size={14} className="text-white" />
              </Button>
            </div>
          </div>
          
          {/* File attachment options */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={14} />
              </Button>
              
              <input
                type="file"
                accept="image/*"
                ref={cameraInputRef}
                onChange={handleCameraCapture}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={handleCameraCapture}
              >
                <Camera size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={handleScreenCapture}
              >
                <ScreenShare size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
