import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  messageType?: "reasoning" | "actions" | "context" | "thinking" | "default";
  sections?: {
    type: "reasoning" | "actions" | "context" | "thinking" | "default";
    title?: string;
    content: string;
  }[];
}

export type MessageType = "user" | "ai";

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLatest = false,
}) => {
  const isUser = message.type === "user";
  const { toast } = useToast();
  const [sectionsExpanded, setSectionsExpanded] = useState(false);
  const hasExpandableSections = message.sections && message.sections.length > 0;
  
  const copyToClipboard = () => {
    // Get all content including sections
    let contentToCopy = message.content;
    
    if (message.sections && message.sections.length > 0) {
      contentToCopy += "\n\n" + message.sections.map(section => 
        (section.title ? `${section.title}:\n` : "") + section.content
      ).join("\n\n");
    }
    
    navigator.clipboard.writeText(contentToCopy.trim()).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Message content copied successfully",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };
  
  // Format AI message content with proper section styling
  const renderAIContent = () => {
    // If the message has pre-defined sections, render them
    if (hasExpandableSections) {
      const mainContent = (
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
      );
      
      // Determine which sections to show based on expanded state
      const visibleSections = sectionsExpanded 
        ? message.sections 
        : message.sections?.filter(s => s.type === "default" || s.type === "thinking");
      
      return (
        <div className="space-y-2">
          {/* Main content always visible */}
          {message.content && mainContent}
          
          {/* Sections */}
          <div className={cn(
            "space-y-3 transition-all duration-300",
            sectionsExpanded ? "opacity-100" : "opacity-90"
          )}>
            {visibleSections?.map((section, index) => (
              <div 
                key={index} 
                className={cn(
                  getSectionStyles(section.type),
                  "transition-all duration-200 ease-in-out",
                  sectionsExpanded ? "max-h-[500px] overflow-y-auto" : "max-h-[150px] overflow-hidden"
                )}
              >
                {section.title && (
                  <h4 className="text-sm font-medium mb-1">{section.title}</h4>
                )}
                <div className="text-sm whitespace-pre-wrap break-words">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
          
          {/* Toggle button for sections */}
          {hasExpandableSections && message.sections!.length > 1 && (
            <button 
              onClick={() => setSectionsExpanded(!sectionsExpanded)}
              className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
            >
              {sectionsExpanded ? (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  Show thinking process
                </>
              )}
            </button>
          )}
        </div>
      );
    }
    
    // If content contains specific markers for reasoning, actions, etc., we could parse them here
    // For now, just return the plain content
    return (
      <div className="text-sm whitespace-pre-wrap break-words">
        {message.content}
      </div>
    );
  };
  
  // Get styles for different section types
  const getSectionStyles = (type: string) => {
    switch (type) {
      case "reasoning":
        return "text-muted-foreground text-sm bg-muted/30 p-2 rounded-md";
      case "actions":
        return "text-foreground text-sm font-medium bg-primary/5 p-2 rounded-md";
      case "context":
        return "text-muted-foreground/90 text-sm bg-muted/20 p-2 rounded-md";
      case "thinking":
        return "text-muted-foreground/80 text-sm italic bg-muted/10 p-2 rounded-md";
      default:
        return "text-foreground text-sm";
    }
  };
  
  // Get message bubble styles based on message type
  const getMessageStyles = () => {
    if (!isUser && message.messageType) {
      switch (message.messageType) {
        case "reasoning":
          return "bg-muted/50 border-dashed border-muted-foreground/30 text-muted-foreground";
        case "actions":
          return "bg-muted/30 border-primary/20 text-primary-foreground/90";
        case "context":
          return "bg-muted/20 border-muted-foreground/20";
        case "thinking":
          return "bg-muted/10 border-dashed border-muted-foreground/20 text-muted-foreground/90";
        default:
          return "";
      }
    }
    return "";
  };
  
  // Determine if this is a thinking message
  const isThinking = message.messageType === "thinking" || 
                    (message.sections && message.sections.some(s => s.type === "thinking"));
  
  return (
    <div className={cn(
      "mb-6 group",
      isUser ? "flex flex-row-reverse" : "flex"
    )}>
      <div className={cn(
        "flex",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <Avatar className={cn(
          "h-8 w-8 mt-1",
          isUser ? "ml-3" : "mr-3"
        )}>
          {isUser ? (
            <>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="" alt="AI" />
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </>
          )}
        </Avatar>
        
        <div className={cn(
          "max-w-[85%]",
          isThinking && "animate-pulse"
        )}>
          <div
            className={cn(
              "rounded-2xl p-4 relative group mb-1 transition-all duration-200",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-card border border-border shadow-sm rounded-tl-sm",
              getMessageStyles()
            )}
          >
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              renderAIContent()
            )}
            
            <button 
              onClick={copyToClipboard}
              className={cn(
                "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full",
                isUser 
                  ? "hover:bg-primary-foreground/10 text-primary-foreground/70" 
                  : "hover:bg-muted text-muted-foreground"
              )}
              aria-label="Copy message"
            >
              <Copy size={14} />
            </button>
          </div>
          
          <div className={cn(
            "flex text-xs text-muted-foreground",
            isUser ? "justify-end mr-1" : "justify-start ml-1"
          )}>
            <span className="opacity-70">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            
            {isUser && message.status && (
              <span className="ml-1">
                {message.status === "sending" ? (
                  <Clock size={12} className="opacity-70" />
                ) : message.status === "sent" ? (
                  <CheckCheck size={12} className="opacity-70" />
                ) : (
                  <span className="text-destructive text-xs">!</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
