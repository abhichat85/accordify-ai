
import React, { useState } from "react";
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
  FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalysis } from "../contract/DocumentAnalysis";

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
  
  return (
    <div className="flex flex-col h-full overflow-hidden border border-border/40 shadow-sm bg-[#282828]">
      {/* Header styled like Cascade */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-[#1F1F1F]">
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
      
      {/* Chat/Document tabs */}
      <div className="bg-[#1F1F1F] border-b border-border/40 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent p-0 h-10 w-full flex justify-start gap-4 border-b-0">
            <TabsTrigger 
              value="chat" 
              className="h-10 px-4 rounded-none bg-transparent text-sm font-medium text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              <MessageSquare size={16} className="mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="h-10 px-4 rounded-none bg-transparent text-sm font-medium text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              <FileSearch size={16} className="mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Main content area with Cascade-like styling */}
      <div className="flex-grow flex flex-col h-full relative">
        <div className="flex-grow overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="chat" className="h-full m-0 p-0 data-[state=active]:flex flex-col">
              <div className="h-full m-0 p-0 flex flex-col">
                {messages.length === 0 && (
                  <>
                    {/* Cascade-like logo section */}
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-16 w-16 rounded-full bg-[#282828] border-4 border-[#3A3A3A] flex items-center justify-center mb-4">
                        <div className="h-10 w-10 rounded-full border-t-4 border-r-4 border-[#7c3aed] border-b-4 border-l-4 border-[#3A3A3A] animate-spin-slow"></div>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-1 text-center">Write with Accord AI</h2>
                      <p className="text-sm text-muted-foreground text-center px-6">
                        {activeMode === "write" 
                          ? "Draft, review, or analyze contracts with AI assistance" 
                          : "Ask questions about contracts or get legal guidance"}
                      </p>
                      
                      {/* <p className="text-sm text-muted-foreground mt-6 text-center">
                        Start a new conversation to see your messages here.
                      </p> */}
                    </div>
                  </>
                )}
                
                {/* Chat interface */}
                <ChatInterface
                  onSendMessage={onSendMessage}
                  messages={messages}
                  isProcessing={isProcessing}
                  className="h-full rounded-none border-none shadow-none"
                  defaultInputValue={activeMode === "write" ? "" : ""}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="h-full m-0 p-4 overflow-auto data-[state=active]:flex flex-col">
              <DocumentAnalysis className="h-full" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Simple GPT-4o dropdown footer */}
      <div className="px-4 py-3 border-t border-border/40 bg-[#1F1F1F] text-sm text-foreground flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span>GPT-4o</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="px-4 py-2 border-t border-border/40 bg-[#1F1F1F] text-xs text-muted-foreground">
        <p>AI may make mistakes. Double-check all generated code.</p>
      </div>
    </div>
  );
};
