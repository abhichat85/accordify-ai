
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
  AlarmClock,
  Brain
} from "lucide-react";
import { nanoid } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AiModes, AiMode } from "./AiModes";
import { ChatMessageArea } from "./ChatMessageArea";
import { ChatInputArea } from "./ChatInputArea";
import { AgentCapability } from "./types";

interface ChatInterfaceProps {
  onSendMessage: (message: string, files?: File[]) => void;
  messages: Message[];
  isProcessing?: boolean;
  className?: string;
  defaultInputValue?: string;
  selectedModel?: string;
  onModelSelect?: (model: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isProcessing = false,
  className,
  defaultInputValue = "",
  selectedModel = "GPT-4o",
  onModelSelect
}) => {
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [aiMode, setAiMode] = useState<AiMode>("normal");
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

  // Listen for custom events from setChatInputValue
  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.prompt) {
        setInputValue(event.detail.prompt);
      }
    };

    document.addEventListener('chat-prompt-update', handleCustomEvent as EventListener);

    return () => {
      document.removeEventListener('chat-prompt-update', handleCustomEvent as EventListener);
    };
  }, []);

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden bg-background/10", 
      className
    )}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-grow overflow-hidden flex flex-col">
          {/* Main chat area */}
          <ChatMessageArea 
            messages={messages}
            proactiveSuggestions={proactiveSuggestions}
            showProactiveSuggestions={showProactiveSuggestions}
            handleSuggestionClick={handleSuggestionClick}
          />
          
          {/* Contextual information panel (collapsed by default) */}
          {messages.length > 0 && contextAwareness.length > 0 && (
            <div className="px-3 py-2 border-t border-border/20 bg-muted/5 text-xs text-muted-foreground">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Brain size={12} className="mr-1 text-primary" />
                  <span className="font-medium">Context</span>
                </div>
              </div>
              <div className="space-y-1">
                {contextAwareness.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-1 h-1 rounded-full bg-primary/70 mt-1.5 mr-1.5"></span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      
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
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
        />
      </div>
    </div>
  );
};
