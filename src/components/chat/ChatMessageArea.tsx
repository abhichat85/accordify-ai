
import React, { useRef, useEffect } from "react";
import { Message } from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProactiveSuggestions } from "./components/ProactiveSuggestions";
import { ContextAwarenessPanel } from "./components/ContextAwarenessPanel";
import { MessagesList } from "./components/MessagesList";
import { EmptyChat } from "./components/EmptyChat";

interface ChatMessageAreaProps {
  messages: Message[];
  proactiveSuggestions: string[];
  showProactiveSuggestions: boolean;
  handleSuggestionClick: (suggestion: string) => void;
  contextAwareness: string[];
}

export const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({
  messages,
  proactiveSuggestions,
  showProactiveSuggestions,
  handleSuggestionClick,
  contextAwareness
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter out reasoning and action messages when displaying in the normal chat flow
  // as they'll be shown in their own sections
  const visibleMessages = messages.filter(
    msg => msg.messageType !== "reasoning" && msg.messageType !== "actions"
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-grow px-4 pt-2 pb-1 max-h-[calc(100vh-240px)] styled-scrollbar">
      <div className="pb-2">
        {messages.length === 0 ? (
          <EmptyChat />
        ) : (
          <>
            <MessagesList messages={visibleMessages} />

            {showProactiveSuggestions && messages.length > 0 && messages.length % 3 === 0 && (
              <ProactiveSuggestions 
                suggestions={proactiveSuggestions}
                onClick={handleSuggestionClick}
              />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {messages.length > 0 && contextAwareness.length > 0 && (
        <ContextAwarenessPanel contextItems={contextAwareness} />
      )}
    </ScrollArea>
  );
};
