
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
    <div className="flex h-full rounded-2xl overflow-hidden border border-border/40 shadow-md">
      {/* Main chat area - now taking full width */}
      <div className="flex-grow flex flex-col relative">
        {/* Top toolbar */}
        <div className="bg-muted/20 border-b border-border/40 p-2 flex items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
            <TabsList className="h-8 bg-background/40">
              <TabsTrigger value="chat" className="text-xs gap-1.5">
                <MessageSquare size={14} />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="contracts" className="text-xs gap-1.5">
                <FileText size={14} />
                <span className="hidden sm:inline">Contracts</span>
              </TabsTrigger>
              <TabsTrigger value="workflow" className="text-xs gap-1.5">
                <Workflow size={14} />
                <span className="hidden sm:inline">Workflow</span>
              </TabsTrigger>
              <TabsTrigger value="agent" className="text-xs gap-1.5">
                <Brain size={14} />
                <span className="hidden sm:inline">Agent</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <TooltipProvider>
            <div className="ml-auto flex items-center space-x-1">
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
        <div className="bg-muted/10 border-b border-border/30 py-1.5 px-3 flex items-center justify-between text-xs text-muted-foreground">
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
        
        {/* Tabs Content */}
        <div className="flex-grow flex">
          <Tabs value={activeTab} className="flex-grow">
            <TabsContent value="chat" className="flex-grow p-0 m-0 overflow-hidden h-full">
              <ChatInterface
                onSendMessage={onSendMessage}
                messages={messages}
                isProcessing={isProcessing}
                className="h-full rounded-none border-none shadow-none"
              />
            </TabsContent>
            
            <TabsContent value="contracts" className="flex-grow p-4 m-0 overflow-auto h-full">
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
            
            <TabsContent value="workflow" className="flex-grow p-4 m-0 overflow-auto h-full">
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
            
            <TabsContent value="agent" className="flex-grow p-4 m-0 overflow-auto h-full">
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};
