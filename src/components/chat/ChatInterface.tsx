
import React, { useState, useRef, useEffect } from "react";
import { MessageBubble, Message } from "./MessageBubble";
import { cn } from "@/lib/utils";
import { 
  FileText,
  Image,
  Sparkles,
  Lightbulb,
  Bot,
  BrainCircuit,
  Workflow,
  History,
  FileCheck,
  Hourglass,
  AlarmClock
} from "lucide-react";
import { nanoid } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiModes, AiMode } from "./AiModes";
import { ChatMessageArea } from "./ChatMessageArea";
import { ChatInputArea } from "./ChatInputArea";
import { ChatContextTab } from "./ChatContextTab";
import { ChatCapabilitiesTab } from "./ChatCapabilitiesTab";
import { AgentCapability } from "./types";

interface ChatInterfaceProps {
  onSendMessage: (message: string, files?: File[]) => void;
  messages: Message[];
  isProcessing?: boolean;
  className?: string;
  defaultInputValue?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isProcessing = false,
  className,
  defaultInputValue = ""
}) => {
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [aiMode, setAiMode] = useState<AiMode>("normal");
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [showProactiveSuggestions, setShowProactiveSuggestions] = useState(true);
  const [contextAwareness, setContextAwareness] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const agentCapabilities: AgentCapability[] = [
    { 
      id: "draft", 
      name: "Draft", 
      icon: FileText,
      description: "Generate new contracts and agreements",
      examples: ["Create an NDA for my startup", "Draft a consulting agreement"]
    },
    { 
      id: "review", 
      name: "Review", 
      icon: FileCheck,
      description: "Analyze and improve existing contracts",
      examples: ["Review this employment contract", "Check this NDA for issues"]
    },
    { 
      id: "negotiate", 
      name: "Negotiate", 
      icon: BrainCircuit,
      description: "Get negotiation guidance and suggestions",
      examples: ["Suggest negotiation points for this contract", "How should I counter these terms?"]
    },
    { 
      id: "compare", 
      name: "Compare", 
      icon: Workflow,
      description: "Compare different contract versions",
      examples: ["Compare these two contract versions", "What changed in this revision?"]
    },
    { 
      id: "remind", 
      name: "Calendar", 
      icon: AlarmClock,
      description: "Manage contract deadlines and renewals",
      examples: ["Track renewal dates for this contract", "Remind me of upcoming deadlines"]
    }
  ];

  const proactiveSuggestions = [
    "I noticed this contract is missing a confidentiality clause. Would you like me to suggest one?",
    "This agreement has payment terms of NET-60. Industry standard is NET-30. Consider negotiating this.",
    "The liability cap is unusually low for this type of agreement. Here's what I recommend...",
    "I noticed similar contracts in your history have included IP protection clauses. Add one?"
  ];

  useEffect(() => {
    if (messages.length > 3) {
      setContextAwareness([
        "Current document: Non-Disclosure Agreement (Draft)",
        "Related documents: 2 previous NDAs in your history",
        "Missing elements: Jurisdiction clause, Term definition",
        "Risk level: Medium (3 potential issues identified)"
      ]);
    }
  }, [messages]);

  // Effect to synchronize with defaultInputValue when it changes
  useEffect(() => {
    if (defaultInputValue && defaultInputValue !== inputValue) {
      setInputValue(defaultInputValue);
    }
  }, [defaultInputValue]);

  const handleSubmit = () => {
    if (inputValue.trim() || files.length > 0) {
      const messageWithMode = aiMode !== "normal" 
        ? `[${aiMode.toUpperCase()} MODE] ${inputValue}`
        : inputValue;
        
      onSendMessage(messageWithMode, files.length > 0 ? files : undefined);
      setInputValue("");
      setFiles([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleCapabilityClick = (example: string) => {
    setInputValue(example);
    setActiveTab("chat");
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden bg-background/10", 
      className
    )}>
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full overflow-hidden">
        <div className="border-b border-border/20 bg-background/10 px-2">
          <TabsList className="h-8 bg-muted/20 mt-1 mb-1 rounded-md w-full grid grid-cols-3 gap-1 p-0.5">
            <TabsTrigger value="chat" className="text-xs rounded-sm">Chat</TabsTrigger>
            <TabsTrigger value="capabilities" className="text-xs rounded-sm">Capabilities</TabsTrigger>
            <TabsTrigger value="context" className="text-xs rounded-sm">Context</TabsTrigger>
          </TabsList>
        </div>
      
        <div className="flex flex-col flex-grow overflow-hidden">
          <TabsContent value="chat" className="flex-grow m-0 p-0 data-[state=active]:flex flex-col">
            <ChatMessageArea 
              messages={messages}
              proactiveSuggestions={proactiveSuggestions}
              showProactiveSuggestions={showProactiveSuggestions}
              handleSuggestionClick={handleSuggestionClick}
            />
          </TabsContent>

          <TabsContent value="capabilities" className="m-0 p-3 max-h-[calc(100vh-240px)] overflow-y-auto">
            <ChatCapabilitiesTab 
              agentCapabilities={agentCapabilities}
              handleCapabilityClick={handleCapabilityClick}
            />
          </TabsContent>

          <TabsContent value="context" className="m-0 p-3 max-h-[calc(100vh-240px)] overflow-y-auto">
            <ChatContextTab 
              contextAwareness={contextAwareness}
              messages={messages}
            />
          </TabsContent>
        </div>
      </Tabs>

      <div className="shrink-0 px-3 pb-1 pt-0.5">
        <AiModes activeMode={aiMode} onChange={setAiMode} />
      </div>

      <ChatInputArea
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        isProcessing={isProcessing}
        files={files}
        setFiles={setFiles}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
    </div>
  );
};
