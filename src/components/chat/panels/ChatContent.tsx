import React from "react";
import { Message } from "../MessageBubble";
import { MessagesList } from "../components/MessagesList";
import { EmptyChatState } from "./EmptyChatState";
import { AiMode } from "../AiModes";

interface ChatContentProps {
  messages: Message[];
  isProcessing: boolean;
  thoughtsExpanded: boolean;
  setThoughtsExpanded: (expanded: boolean) => void;
  actionsExpanded: boolean;
  setActionsExpanded: (expanded: boolean) => void;
  activeMode: "write" | "chat";
  currentAiMode: AiMode;
}

export const ChatContent: React.FC<ChatContentProps> = ({
  messages,
  isProcessing,
  thoughtsExpanded,
  setThoughtsExpanded,
  actionsExpanded,
  setActionsExpanded,
  activeMode,
  currentAiMode
}) => {
  // Process messages to create an integrated flow
  const processedMessages = processMessagesForIntegratedFlow(messages);

  if (messages.length === 0) {
    return <EmptyChatState activeMode={activeMode} currentAiMode={currentAiMode} />;
  }

  return (
    <div className="flex-grow overflow-y-auto px-4 py-3 h-full styled-scrollbar">
      <MessagesList messages={processedMessages} />
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
