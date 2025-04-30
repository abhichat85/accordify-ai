import React, { useRef, useEffect, useState } from "react";
import { Message } from "./MessageBubble";
import { ProactiveSuggestions } from "./components/ProactiveSuggestions";
import { ContextAwarenessPanel } from "./components/ContextAwarenessPanel";
import { MessagesList } from "./components/MessagesList";
import { EmptyChat } from "./components/EmptyChat";
import { ContractGenerationProgress } from "../contract/ContractGenerationProgress";
import { getGenerationProgress } from "@/services/contractAnalysis";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [lastMessageId, setLastMessageId] = useState("");
  const [showProgressTracker, setShowProgressTracker] = useState(false);

  // Process messages to create an integrated flow
  const processedMessages = processMessagesForIntegratedFlow(messages);
  
  // Detect if user has scrolled up (to disable auto-scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      
      // Only update if changing from false to true or true to false
      if (autoScroll !== isNearBottom) {
        setAutoScroll(isNearBottom);
      }
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [autoScroll]);
  
  // Track message changes to trigger scrolling
  useEffect(() => {
    // Check if we have new messages or content has changed
    const hasNewMessages = messages.length !== lastMessageCount;
    const lastMessage = messages[messages.length - 1];
    const hasContentChanged = lastMessage && lastMessage.id !== lastMessageId;
    
    if (hasNewMessages || hasContentChanged) {
      // Update our tracking state
      setLastMessageCount(messages.length);
      if (lastMessage) {
        setLastMessageId(lastMessage.id);
      }
      
      // Only auto-scroll if we're already at the bottom or if it's a new message
      if (autoScroll || hasNewMessages) {
        scrollToBottom();
      }
    }
  }, [messages, lastMessageCount, lastMessageId, autoScroll]);
  
  // Check if we should show the contract generation progress tracker
  useEffect(() => {
    const progress = getGenerationProgress();
    setShowProgressTracker(progress.status !== 'idle' && progress.status !== 'completed');
  }, [messages]); // Re-check when messages change
  
  // Scroll to bottom helper function with smooth animation
  const scrollToBottom = () => {
    // Use requestAnimationFrame for more natural scrolling
    requestAnimationFrame(() => {
      if (messagesEndRef.current && scrollContainerRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
    });
  };
  
  // Force scroll check on resize
  useEffect(() => {
    const handleResize = () => {
      if (autoScroll) {
        scrollToBottom();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [autoScroll]);
  
  // Handle manual scroll to bottom
  const handleScrollToBottom = () => {
    setAutoScroll(true);
    scrollToBottom();
  };

  return (
    <div className="flex-grow flex flex-col relative overflow-hidden p-0 m-0 w-full">
      {/* Main scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="flex flex-col overflow-y-auto h-full w-full p-0 m-0"
      >
        <div className="px-4 pt-2 pb-1">
          {messages.length === 0 ? (
            <EmptyChat />
          ) : (
            <>
              {/* Contract Generation Progress Tracker */}
              {showProgressTracker && (
                <ContractGenerationProgress />
              )}
            
              <MessagesList messages={processedMessages} />

              {showProactiveSuggestions && messages.length > 0 && messages.length % 3 === 0 && (
                <ProactiveSuggestions 
                  suggestions={proactiveSuggestions}
                  onClick={handleSuggestionClick}
                />
              )}
              
              {messages.length > 0 && contextAwareness.length > 0 && (
                <ContextAwarenessPanel contextItems={contextAwareness} />
              )}
              
              {/* Invisible element for scrolling to bottom */}
              <div 
                ref={messagesEndRef} 
                style={{ height: "1px", width: "100%", marginTop: "16px", marginBottom: "16px" }} 
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </div>
      
      {/* Scroll to bottom button - only visible when not at bottom */}
      {!autoScroll && (
        <button
          onClick={handleScrollToBottom}
          className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/90 transition-all z-10"
          aria-label="Scroll to bottom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};

// Group related messages together to create a flowing experience
function processMessagesForIntegratedFlow(messages: Message[]): Message[] {
  if (!messages.length) return [];
  
  const processedMessages: Message[] = [];
  
  // Group by conversation turns
  let currentUserMessage: Message | null = null;
  let aiResponseSections: {
    type: "reasoning" | "actions" | "context" | "thinking" | "default";
    title?: string;
    content: string;
  }[] = [];
  
  // Temporary storage for AI main response
  let mainAiResponse: Message | null = null;
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    
    if (message.type === "user") {
      // If we have a previous AI response with sections, add it to processed messages
      if (mainAiResponse && aiResponseSections.length > 0) {
        mainAiResponse.sections = [...aiResponseSections];
        processedMessages.push(mainAiResponse);
        aiResponseSections = [];
        mainAiResponse = null;
      } else if (mainAiResponse) {
        // If we only have a main response without sections
        processedMessages.push(mainAiResponse);
        mainAiResponse = null;
      }
      
      // Add the user message directly
      processedMessages.push(message);
      currentUserMessage = message;
    } else {
      // For AI messages, organize by type
      if (message.messageType === "reasoning" || message.messageType === "actions" || message.messageType === "context" || message.messageType === "thinking") {
        // Add as a section to the current AI response
        aiResponseSections.push({
          type: message.messageType,
          title: message.messageType === "reasoning" ? "Thinking Process" : 
                 message.messageType === "actions" ? "Actions" : 
                 message.messageType === "context" ? "Context" : "Thinking",
          content: message.content
        });
      } else {
        // If this is the main AI response
        if (!mainAiResponse) {
          mainAiResponse = { ...message };
        } else {
          // If we already have a main response, treat as a section
          aiResponseSections.push({
            type: "default",
            content: message.content
          });
        }
      }
      
      // If this is the last message or next message is a user message,
      // finalize the current AI response
      if (i === messages.length - 1 || messages[i + 1]?.type === "user") {
        if (mainAiResponse) {
          if (aiResponseSections.length > 0) {
            mainAiResponse.sections = [...aiResponseSections];
          }
          processedMessages.push(mainAiResponse);
          aiResponseSections = [];
          mainAiResponse = null;
        } else if (aiResponseSections.length > 0) {
          // If we only have sections but no main response, create one
          const newAiMessage: Message = {
            id: `synthetic-${Date.now()}`,
            type: "ai",
            content: "",
            timestamp: new Date(),
            sections: [...aiResponseSections]
          };
          processedMessages.push(newAiMessage);
          aiResponseSections = [];
        }
      }
    }
  }
  
  return processedMessages;
}
