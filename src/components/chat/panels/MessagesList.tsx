
import React from "react";
import { Message } from "../MessageBubble";

interface MessagesListProps {
  regularMessages: Message[];
  isProcessing: boolean;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  regularMessages,
  isProcessing
}) => {
  return (
    <>
      {regularMessages.map((msg) => (
        <div key={msg.id} className={`mb-4 ${msg.type === 'user' ? 'bg-muted/5 p-3 rounded-lg border border-border/30' : 'bg-background'}`}>
          <div className="flex items-start">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${msg.type === 'user' ? 'bg-primary/20' : 'bg-primary text-primary-foreground'}`}>
              {msg.type === 'user' ? 'U' : 'AI'}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium mb-1">{msg.type === 'user' ? 'You' : 'Assistant'}</p>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 rounded-full border-2 border-t-primary animate-spin"></div>
        </div>
      )}
    </>
  );
};
