import React from "react";
import { Message } from "../MessageBubble";

interface MessagesListProps {
  messages: Message[];
  isProcessing?: boolean;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isProcessing = false
}) => {
  return (
    <>
      {messages.map((msg, index) => (
        <div key={msg.id || `msg-${index}`} className={`mb-4 ${msg.type === 'user' ? 'bg-muted/5 p-3 rounded-lg border border-border/30' : 'bg-background'}`}>
          <div className="flex items-start">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${msg.type === 'user' ? 'bg-primary/20' : 'bg-primary text-primary-foreground'}`}>
              {msg.type === 'user' ? 'U' : 'AI'}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium mb-1">{msg.type === 'user' ? 'You' : 'Assistant'}</p>
              
              {/* Regular content */}
              {msg.content && (
                <p className="text-sm whitespace-pre-wrap mb-3">{msg.content}</p>
              )}
              
              {/* Sections for integrated message flow */}
              {msg.sections && msg.sections.length > 0 && (
                <div className="space-y-4">
                  {msg.sections.map((section, idx) => (
                    <div key={idx} className="text-sm">
                      {section.title && (
                        <h4 className="text-xs uppercase font-medium text-muted-foreground mb-1 flex items-center">
                          <span className="w-1 h-4 bg-primary/50 rounded mr-2"></span>
                          {section.title}
                        </h4>
                      )}
                      <div className={`whitespace-pre-wrap rounded-md ${
                        section.type === 'reasoning' ? 'text-muted-foreground/90' : 
                        section.type === 'actions' ? 'font-medium' : 
                        section.type === 'context' ? 'text-muted-foreground/80 bg-muted/5 p-2 rounded' : 
                        section.type === 'thinking' ? 'italic text-muted-foreground/80' : ''
                      }`}>
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
