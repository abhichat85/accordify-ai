
import React from "react";
import { CalendarDays, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  title: string;
  lastUpdated: string; // e.g., "23h", "2d", "8d"
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  activeConversationId?: string;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  onSelectConversation,
  activeConversationId
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/40">
        <h2 className="text-lg font-semibold">Past Conversations</h2>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between group hover:bg-muted/50 ${
                activeConversationId === conversation.id ? "bg-muted" : ""
              }`}
            >
              <div className="truncate flex-1">
                <p className="truncate font-medium">{conversation.title}</p>
              </div>
              <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap ml-2">
                <Clock size={12} className="mr-1 opacity-70" />
                {conversation.lastUpdated}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-border/40 flex justify-center">
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Show more...
        </button>
      </div>
    </div>
  );
};
