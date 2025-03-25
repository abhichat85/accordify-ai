
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle } from "lucide-react";

export type MessageType = "user" | "ai";
export type MessageStatus = "sending" | "sent" | "error";

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  status?: MessageStatus;
}

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLatest = false,
}) => {
  const isUser = message.type === "user";
  
  return (
    <div
      className={cn(
        "group flex mb-4 items-end",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-accord-teal text-white flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-xs font-semibold">AI</span>
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] p-4 rounded-2xl animate-fade-in shadow-sm",
          isUser
            ? "bg-accord-blue text-white rounded-br-none"
            : "bg-white rounded-bl-none border border-accord-mediumGray/70"
        )}
      >
        <div className="text-sm">{message.content}</div>
        
        <div className={cn(
          "text-[10px] mt-1 flex items-center",
          isUser ? "text-white/70 justify-end" : "text-accord-darkGray/70"
        )}>
          {isUser && message.status && (
            <span className="mr-1">
              {message.status === "sending" && (
                <span className="flex space-x-1">
                  <span className="pulse-dot delay-75"></span>
                  <span className="pulse-dot delay-150"></span>
                  <span className="pulse-dot delay-300"></span>
                </span>
              )}
              {message.status === "sent" && <CheckCircle size={10} />}
              {message.status === "error" && <AlertCircle size={10} />}
            </span>
          )}
          <time>
            {message.timestamp.toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit" 
            })}
          </time>
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-accord-mediumGray/80 text-accord-blue flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-xs font-semibold">You</span>
        </div>
      )}
    </div>
  );
};
