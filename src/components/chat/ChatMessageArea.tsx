
import React, { useRef, useEffect } from "react";
import { MessageBubble, Message } from "./MessageBubble";
import { Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessageAreaProps {
  messages: Message[];
  proactiveSuggestions: string[];
  showProactiveSuggestions: boolean;
  handleSuggestionClick: (suggestion: string) => void;
}

export const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({
  messages,
  proactiveSuggestions,
  showProactiveSuggestions,
  handleSuggestionClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-grow px-4 pt-2 pb-1 max-h-[calc(100vh-240px)] styled-scrollbar">
      <div className="pb-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center py-2 px-4 text-sm text-muted-foreground">
            Start a new conversation to see your messages here.
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isLatest={index === messages.length - 1}
              />
            ))}

            {showProactiveSuggestions && messages.length > 0 && messages.length % 3 === 0 && (
              <div className="mb-2 mt-2 animate-fade-in">
                <div className="bg-muted/40 rounded-lg p-3 border border-border/30 max-w-[85%] mx-auto">
                  <div className="flex items-center mb-2">
                    <Lightbulb size={16} className="text-primary mr-2" />
                    <span className="text-sm font-medium">Proactive Insights</span>
                  </div>
                  <ul className="space-y-2">
                    {proactiveSuggestions.slice(0, 2).map((suggestion, idx) => (
                      <li key={idx} 
                          className="text-sm hover:bg-muted/60 p-2 rounded-md cursor-pointer transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
