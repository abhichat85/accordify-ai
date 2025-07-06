import React, { useState, useEffect } from "react";
import { ChatInterface } from "../chat/ChatInterface";
import { Message } from "../chat/MessageBubble";
import { 
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocumentAnalysis } from "../contract/DocumentAnalysis";
import { AiMode } from "../chat/AiModes";
import { EmptyChatState } from "../chat/panels/EmptyChatState";
import { Textarea } from '../ui/textarea';
import { MessagesList } from '../chat/components/MessagesList';

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
  const [activeMode, setActiveMode] = useState<"write" | "chat">("write");
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [selectedModel, setSelectedModel] = useState<string>("GPT-4o");
  const [defaultInputValue, setDefaultInputValue] = useState<string>("");
  const [thoughtsExpanded, setThoughtsExpanded] = useState(true);
  const [actionsExpanded, setActionsExpanded] = useState(true);
  const [currentAiMode, setCurrentAiMode] = useState<AiMode>("normal");

  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.prompt) {
        setDefaultInputValue(event.detail.prompt);
      }
    };

    document.addEventListener('chat-prompt-update', handleCustomEvent as EventListener);

    return () => {
      document.removeEventListener('chat-prompt-update', handleCustomEvent as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleModeChange = (event: CustomEvent) => {
      if (event.detail && event.detail.mode) {
        setCurrentAiMode(event.detail.mode);
      }
    };
    
    document.addEventListener('ai-mode-change', handleModeChange as EventListener);
    
    return () => {
      document.removeEventListener('ai-mode-change', handleModeChange as EventListener);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-[450px] bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="#7C3AED"/>
          </svg>
          <span className="text-lg font-semibold">AI Agent</span>
        </div>
        <Button variant="ghost" className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16m-16 6h16" />
          </svg>
        </Button>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">Accord AI | Write mode</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-500 opacity-80 mb-6" style={{ 
          background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
          boxShadow: '0 0 40px rgba(124, 58, 237, 0.3)'
        }} />
        <h2 className="text-2xl font-semibold mb-2">Write with Accord AI</h2>
        <p className="text-gray-600 mb-1">Draft, review, or analyze contracts with AI assistance</p>
        <p className="text-gray-600">Start a new conversation to see your messages here.</p>
      </div>

      {/* AI Modes */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <Button className="flex items-center gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.2 4L6.6 15.6L12 20l5.4-4.4L12.8 4H11.2z" />
            </svg>
            Standard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 px-4 py-2 rounded-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" />
            </svg>
            Lawyer
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 px-4 py-2 rounded-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            Reasoning
          </Button>
        </div>

        {/* Message Input */}
        <div className="relative">
          <Textarea
            placeholder="Message Accord AI..."
            className="min-h-[100px] pr-24 resize-none"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5 5 5-5m-5 5V3" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </Button>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>GPT-4o</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <p className="text-sm text-gray-500 mt-4">
          AI may make mistakes. Double-check all generated code.
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
