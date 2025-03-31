
import React, { useState, useEffect } from "react";
import { ChatInterface } from "../chat/ChatInterface";
import { Message } from "../chat/MessageBubble";
import { 
  MessageSquare, 
  FileText,
  Brain,
  Sparkles,
  Send,
  RotateCcw,
  X,
  FileSearch,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalysis } from "../contract/DocumentAnalysis";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Filter messages to get thoughts and actions
  const thoughtMessages = messages.filter(msg => msg.type === "ai" && msg.messageType === "reasoning");
  const actionMessages = messages.filter(msg => msg.type === "ai" && msg.messageType === "actions");
  const regularMessages = messages.filter(msg => msg.messageType !== "reasoning" && msg.messageType !== "actions");

  // Listen for custom events from setChatInputValue
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
  
  return (
    <div className="flex flex-col h-full overflow-hidden border border-border/40 shadow-sm bg-background">
      {/* Header */}
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
      
      {/* Main content area */}
      <div className="flex-grow flex flex-col h-full relative">
        <div className="flex-grow overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="chat" className="h-full m-0 p-0 data-[state=active]:flex flex-col">
              <div className="h-full m-0 p-0 flex flex-col">
                {messages.length === 0 && (
                  <>
                    {/* Logo section */}
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-16 w-16 rounded-full bg-secondary border-4 border-muted flex items-center justify-center mb-4">
                        <div className="h-10 w-10 rounded-full border-t-4 border-r-4 border-primary border-b-4 border-l-4 border-muted animate-spin-slow"></div>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-1 text-center">Write with Accord AI</h2>
                      <p className="text-sm text-muted-foreground text-center px-6">
                        {activeMode === "write" 
                          ? "Draft, review, or analyze contracts with AI assistance" 
                          : "Ask questions about contracts or get legal guidance"}
                      </p>
                    </div>
                  </>
                )}
                
                {messages.length > 0 && (
                  <div className="flex-grow overflow-y-auto px-4 py-3 h-full styled-scrollbar">
                    {/* Thought section */}
                    {thoughtMessages.length > 0 && (
                      <div className="mb-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer p-2 bg-muted/30 rounded-t-lg border-x border-t border-border/30"
                          onClick={() => setThoughtsExpanded(!thoughtsExpanded)}
                        >
                          <div className="flex items-center">
                            <Brain size={16} className="text-primary mr-2" />
                            <h3 className="text-sm font-medium">Thinking process</h3>
                          </div>
                          <ChevronDown size={16} className={`transition-transform ${thoughtsExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {thoughtsExpanded && (
                          <div className="p-3 bg-muted/10 border-x border-b border-border/30 rounded-b-lg mb-2">
                            <div className="text-sm text-muted-foreground space-y-2">
                              {thoughtMessages.map((thought, index) => (
                                <div key={index} className="p-2 bg-muted/5 rounded">
                                  <p className="whitespace-pre-wrap">{thought.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Actions section */}
                    {actionMessages.length > 0 && (
                      <div className="mb-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer p-2 bg-muted/30 rounded-t-lg border-x border-t border-border/30"
                          onClick={() => setActionsExpanded(!actionsExpanded)}
                        >
                          <div className="flex items-center">
                            <FileText size={16} className="text-primary mr-2" />
                            <h3 className="text-sm font-medium">Actions</h3>
                          </div>
                          <ChevronDown size={16} className={`transition-transform ${actionsExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {actionsExpanded && (
                          <div className="p-3 bg-muted/10 border-x border-b border-border/30 rounded-b-lg">
                            <div className="text-sm space-y-2">
                              {actionMessages.map((action, index) => (
                                <div key={index} className="p-2 bg-primary/5 rounded border border-primary/10">
                                  <p className="whitespace-pre-wrap">{action.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Regular conversation */}
                    {regularMessages.map((msg, index) => (
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
                  </div>
                )}
                
                {/* Chat interface with input */}
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
      
      {/* Disclaimer */}
      <div className="px-4 py-2 border-t border-border/40 bg-background/90 text-xs text-muted-foreground">
        <p>AI may make mistakes. Double-check all generated code.</p>
      </div>
    </div>
  );
};
