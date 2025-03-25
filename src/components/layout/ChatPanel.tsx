
import React, { useState } from "react";
import { ChatInterface } from "../chat/ChatInterface";
import { Message } from "../chat/MessageBubble";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  File,
  Edit,
  Eye,
  Wrench,
  Brain,
  FileText,
  Sparkles,
  Workflow,
  InfoIcon,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [activeTab, setActiveTab] = useState<string>("chat");
  
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-border/40 shadow-sm bg-card/50">
      {/* Main content area with improved layout */}
      <div className="flex-grow flex flex-col h-full relative">
        {/* Top tabs for main sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col h-full">
          <div className="flex items-center justify-between px-2 pt-2">
            <TabsList className="h-9 bg-background/40 p-1 rounded-lg">
              <TabsTrigger value="chat" className="text-xs gap-1.5 rounded-md">
                <MessageSquare size={14} />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="contracts" className="text-xs gap-1.5 rounded-md">
                <FileText size={14} />
                <span className="hidden sm:inline">Contracts</span>
              </TabsTrigger>
              <TabsTrigger value="workflow" className="text-xs gap-1.5 rounded-md">
                <Workflow size={14} />
                <span className="hidden sm:inline">Workflow</span>
              </TabsTrigger>
              <TabsTrigger value="agent" className="text-xs gap-1.5 rounded-md">
                <Brain size={14} />
                <span className="hidden sm:inline">Agent</span>
              </TabsTrigger>
            </TabsList>
            
            <TooltipProvider>
              <div className="flex items-center space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <File size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Documents</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Edit size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Mode</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Eye size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Preview</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Wrench size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tools</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Settings size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        
          {/* Agent Status Bar */}
          <div className="bg-muted/10 border-y border-border/30 py-1.5 px-3 mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <div className="h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></div>
                <span>AI Agent Active</span>
              </div>
              {messages.length > 0 && (
                <div className="flex items-center">
                  <Brain size={12} className="mr-1 text-primary" />
                  <span>Context: Contract Analysis</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <InfoIcon size={12} className="mr-1" />
              <span>Using gpt-4o model</span>
            </div>
          </div>
          
          {/* Content for each tab */}
          <div className="flex-grow overflow-hidden">
            <TabsContent value="chat" className="h-full m-0 p-0 data-[state=active]:flex flex-col">
              <ChatInterface
                onSendMessage={onSendMessage}
                messages={messages}
                isProcessing={isProcessing}
                className="h-full rounded-none border-none shadow-none"
              />
            </TabsContent>
            
            <TabsContent value="contracts" className="h-full m-0 p-4 overflow-auto data-[state=active]:flex flex-col">
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Contract Center</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  View, manage, and collaborate on all your contracts in one place. Enable this feature to access your document library.
                </p>
                <Button>
                  <Sparkles size={16} className="mr-2" />
                  Enable Contract Management
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="workflow" className="h-full m-0 p-4 overflow-auto data-[state=active]:flex flex-col">
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Workflow className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Contract Workflows</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Create custom workflows for contract review, approval, and e-signature processes.
                </p>
                <Button>
                  <Sparkles size={16} className="mr-2" />
                  Enable Workflow Management
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="agent" className="h-full m-0 p-4 overflow-auto data-[state=active]:flex flex-col">
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Advanced AI Agent Settings</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Configure your AI agent's behavior, preferences, and specialized knowledge for contract optimization.
                </p>
                <Button>
                  <Sparkles size={16} className="mr-2" />
                  Configure AI Agent
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
