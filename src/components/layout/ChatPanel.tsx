import React, { useState } from "react";
import { ChatInterface } from "../chat/ChatInterface";
import { Message } from "../chat/MessageBubble";
import { ConversationHistory } from "../chat/ConversationHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  Clock, 
  Settings,
  File,
  Edit,
  Eye,
  Wrench 
} from "lucide-react";

// Sample conversation data - in a real app, this would come from your Supabase database
const sampleConversations = [
  { id: "1", title: "Completing Contract Creation Flow", lastUpdated: "23h" },
  { id: "2", title: "Enhancing the Hero Section", lastUpdated: "2d" },
  { id: "3", title: "Code Review and Feature Listing", lastUpdated: "8d" },
  { id: "4", title: "Client Agreement Draft", lastUpdated: "3d" },
  { id: "5", title: "NDA Template Customization", lastUpdated: "1w" },
  { id: "6", title: "Partnership Contract Review", lastUpdated: "1w" },
  { id: "7", title: "Employment Agreement", lastUpdated: "2w" },
  { id: "8", title: "Software License Template", lastUpdated: "3w" },
];

interface ChatPanelProps {
  messages: Message[];
  isProcessing: boolean;
  onSendMessage: (content: string, files?: File[]) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  messages, 
  isProcessing, 
  onSendMessage 
}) => {
  const [showConversations, setShowConversations] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  
  // Toggle conversation history sidebar
  const toggleConversations = () => {
    setShowConversations(!showConversations);
  };
  
  // Select a conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    // In a real app, you would fetch the messages for this conversation
  };
  
  return (
    <div className="flex h-full rounded-2xl overflow-hidden border border-border/40 shadow-md">
      {/* Left sidebar - Conversation history */}
      <div 
        className={`bg-card w-64 flex-shrink-0 border-r border-border/40 transition-all duration-300 ${
          showConversations ? "translate-x-0" : "-translate-x-full hidden md:block md:translate-x-0"
        }`}
      >
        <ConversationHistory 
          conversations={sampleConversations}
          onSelectConversation={handleSelectConversation}
          activeConversationId={activeConversationId}
        />
      </div>
      
      {/* Main chat area */}
      <div className="flex-grow flex flex-col relative">
        {/* Top toolbar */}
        <div className="bg-muted/20 border-b border-border/40 p-2 flex items-center">
          <button 
            onClick={toggleConversations}
            className="p-1.5 rounded-md hover:bg-muted mr-2 md:hidden"
            aria-label="Toggle conversation history"
          >
            {showConversations ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
          
          <div className="flex items-center space-x-3 px-2">
            <span className="font-medium">Cascade | Write mode</span>
            <span className="text-muted-foreground opacity-60 text-sm">(⌘.)</span>
          </div>
          
          <div className="ml-auto flex items-center space-x-1">
            <button className="p-1.5 rounded-md hover:bg-muted">
              <File size={18} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted">
              <Edit size={18} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted">
              <Eye size={18} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted">
              <Wrench size={18} />
            </button>
          </div>
        </div>
        
        {/* Chat interface */}
        <div className="flex-grow">
          <ChatInterface
            onSendMessage={onSendMessage}
            messages={messages}
            isProcessing={isProcessing}
            className="h-full rounded-none border-none shadow-none"
          />
        </div>
      </div>
    </div>
  );
};
