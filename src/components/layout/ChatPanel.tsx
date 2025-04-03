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
    <div className="flex flex-col h-full overflow-hidden border border-border/40 shadow-sm bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background/90">
        <div className="flex items-center">
          <h2 className="text-base font-medium text-foreground">Accord AI | {activeMode === "write" ? "Write mode" : "Chat mode"} (⌘.)</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
            <RotateCcw size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
            <X size={16} />
          </Button>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col h-full relative">
        <div className="flex-grow overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="chat" className="h-full m-0 p-0 data-[state=active]:flex flex-col">
              <div className="h-full m-0 p-0 flex flex-col">
                {messages.length === 0 ? (
                  <div className="flex-grow">
                    <EmptyChatState activeMode={activeMode} currentAiMode={currentAiMode} />
                  </div>
                ) : null}
                
                <ChatInterface
                  onSendMessage={onSendMessage}
                  messages={messages}
                  isProcessing={isProcessing}
                  className="h-full rounded-none border-none shadow-none"
                  defaultInputValue={defaultInputValue}
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="h-full m-0 p-4 overflow-auto data-[state=active]:flex flex-col">
              <DocumentAnalysis className="h-full" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="px-4 py-2 border-t border-border/40 bg-background/90 text-xs text-muted-foreground">
        <p>AI may make mistakes. Double-check all generated code.</p>
      </div>
    </div>
  );
};
