
import React from "react";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
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
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content).then(
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
        
        <div className="max-w-[85%]">
          <div
            className={cn(
              "rounded-2xl p-4 relative group mb-1",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-card border border-border shadow-sm rounded-tl-sm"
            )}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            
            <button 
              onClick={copyToClipboard}
              className={cn(
                "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full",
                isUser 
                  ? "hover:bg-primary-foreground/10 text-primary-foreground/70" 
                  : "hover:bg-muted text-muted-foreground"
              )}
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
