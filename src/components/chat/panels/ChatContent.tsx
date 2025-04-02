
import React from "react";
import { Message } from "../MessageBubble";
import { ThoughtPanel } from "./ThoughtPanel";
import { ActionPanel } from "./ActionPanel";
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
  // Filter messages by type
  const thoughtMessages = messages.filter(msg => msg.type === "ai" && msg.messageType === "reasoning");
  const actionMessages = messages.filter(msg => msg.type === "ai" && msg.messageType === "actions");
  const regularMessages = messages.filter(msg => msg.messageType !== "reasoning" && msg.messageType !== "actions");

  if (messages.length === 0) {
    return <EmptyChatState activeMode={activeMode} currentAiMode={currentAiMode} />;
  }

  return (
    <div className="flex-grow overflow-y-auto px-4 py-3 h-full styled-scrollbar">
      <ThoughtPanel 
        thoughtMessages={thoughtMessages} 
        thoughtsExpanded={thoughtsExpanded} 
        setThoughtsExpanded={setThoughtsExpanded} 
      />
      
      <ActionPanel 
        actionMessages={actionMessages} 
        actionsExpanded={actionsExpanded} 
        setActionsExpanded={setActionsExpanded} 
      />
      
      <MessagesList messages={regularMessages} />
    </div>
  );
};
