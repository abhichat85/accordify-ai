
import React from "react";
import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";

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
  
  return (
    <div
      className={cn(
        "mb-4",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4",
          isUser
            ? "bg-accord-blue text-white"
            : "bg-white border border-accord-mediumGray/50 shadow-sm"
        )}
      >
        <div className="flex flex-col">
          <p className="text-sm mb-1">{message.content}</p>
          <div className="flex items-center justify-end mt-1">
            <span className="text-xs opacity-70">
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
                  <Check size={12} className="opacity-70" />
                ) : (
                  <span className="text-red-400 text-xs">!</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
