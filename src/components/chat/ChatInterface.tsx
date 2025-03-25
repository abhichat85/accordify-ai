
import React, { useState, useRef, useEffect } from "react";
import { MessageBubble, Message } from "./MessageBubble";
import { cn } from "@/lib/utils";
import { 
  Mic, 
  Send, 
  Paperclip, 
  X, 
  Camera, 
  ScreenShare, 
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AiModes, AiMode } from "./AiModes";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatInterfaceProps {
  onSendMessage: (message: string, files?: File[]) => void;
  messages: Message[];
  isProcessing?: boolean;
  className?: string;
}

const agentCapabilities = [
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

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isProcessing = false,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [aiMode, setAiMode] = useState<AiMode>("normal");
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [showProactiveSuggestions, setShowProactiveSuggestions] = useState(true);
  const [contextAwareness, setContextAwareness] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenCaptureRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      
      toast({
        title: "Files attached",
        description: `${newFiles.length} file(s) ready to send`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
      
      toast({
        title: "Files dropped",
        description: `${newFiles.length} file(s) ready to send`,
      });
    }
  };

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Your message is ready to send.",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak your message clearly.",
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScreenCapture = () => {
    toast({
      title: "Screen capture",
      description: "Select the area of the screen you want to capture",
    });
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

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

  const hasMessages = messages.length > 0;
  const showWelcomeMessage = !hasMessages;

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden bg-background/10", 
      className
    )}>
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full overflow-hidden">
        <div className="border-b border-border/20 bg-background/10 px-2">
          <TabsList className="h-8 bg-muted/20 mt-2 mb-1 rounded-md w-full grid grid-cols-3 gap-1 p-0.5">
            <TabsTrigger value="chat" className="text-xs rounded-sm">Chat</TabsTrigger>
            <TabsTrigger value="capabilities" className="text-xs rounded-sm">Capabilities</TabsTrigger>
            <TabsTrigger value="context" className="text-xs rounded-sm">Context</TabsTrigger>
          </TabsList>
        </div>
      
        <div className="flex flex-col flex-grow overflow-hidden">
          <TabsContent value="chat" className="flex-grow m-0 p-0 data-[state=active]:flex flex-col">
            <ScrollArea className="h-[calc(100vh-280px)] px-4 py-4">
              {showWelcomeMessage ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 animate-scale-in shadow-lg">
                    <Bot className="text-primary-foreground w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground animate-fade-in bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Welcome to Accord AI
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md animate-fade-in delay-100">
                    Your AI-powered contract assistant. Ask me to generate, review, or analyze any contract.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md animate-fade-in delay-200">
                    <Card 
                      className="p-3 cursor-pointer hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/30"
                      onClick={() => {
                        setInputValue("Generate an NDA for my company");
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }, 100);
                      }}
                    >
                      <div className="flex items-center mb-2">
                        <FileText className="text-primary mr-2" size={18} />
                        <p className="font-semibold text-foreground">Generate a new NDA</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Create a custom non-disclosure agreement</p>
                    </Card>
                    <Card 
                      className="p-3 cursor-pointer hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/30"
                      onClick={() => {
                        setInputValue("I need you to review a contract");
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }, 100);
                      }}
                    >
                      <div className="flex items-center mb-2">
                        <FileCheck className="text-primary mr-2" size={18} />
                        <p className="font-semibold text-foreground">Review my contract</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Get analysis and risk assessment</p>
                    </Card>
                    <Card 
                      className="p-3 cursor-pointer hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/30"
                      onClick={() => {
                        setInputValue("Help me compare two contract versions");
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }, 100);
                      }}
                    >
                      <div className="flex items-center mb-2">
                        <Workflow className="text-primary mr-2" size={18} />
                        <p className="font-semibold text-foreground">Compare versions</p>
                      </div>
                      <p className="text-sm text-muted-foreground">See what's changed between drafts</p>
                    </Card>
                    <Card 
                      className="p-3 cursor-pointer hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/30"
                      onClick={() => {
                        setInputValue("I need a Statement of Work template");
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }, 100);
                      }}
                    >
                      <div className="flex items-center mb-2">
                        <FileText className="text-primary mr-2" size={18} />
                        <p className="font-semibold text-foreground">Create SOW</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Draft a statement of work</p>
                    </Card>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isLatest={index === messages.length - 1}
                    />
                  ))}

                  {showProactiveSuggestions && messages.length > 0 && messages.length % 3 === 0 && (
                    <div className="mb-4 mt-2 animate-fade-in">
                      <div className="bg-muted/40 rounded-lg p-3 border border-border/30 max-w-[85%] mx-auto">
                        <div className="flex items-center mb-2">
                          <Lightbulb size={16} className="text-primary mr-2" />
                          <span className="text-sm font-medium">Proactive Insights</span>
                        </div>
                        <ul className="space-y-2">
                          {proactiveSuggestions.slice(0, 2).map((suggestion, idx) => (
                            <li key={idx} 
                                className="text-sm hover:bg-muted/60 p-2 rounded-md cursor-pointer transition-colors"
                                onClick={() => handleSuggestionClick(suggestion)}>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="capabilities" className="m-0 p-3 h-[calc(100vh-280px)] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium mb-1">Agent Capabilities</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Your contract AI assistant can help with the following tasks:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {agentCapabilities.map((capability) => (
                  <Card key={capability.id} className="overflow-hidden">
                    <div className="p-2 border-b border-border/40 bg-muted/20 flex items-center">
                      <capability.icon className="h-4 w-4 mr-2 text-primary" />
                      <h4 className="font-medium text-sm">{capability.name}</h4>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-muted-foreground mb-2">{capability.description}</p>
                      <div className="space-y-1">
                        {capability.examples.map((example, idx) => (
                          <div 
                            key={idx}
                            className="text-xs bg-muted/30 hover:bg-muted/60 p-2 rounded-md cursor-pointer transition-colors flex items-center"
                            onClick={() => handleCapabilityClick(example)}
                          >
                            <span className="mr-1">›</span> {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="context" className="m-0 p-3 h-[calc(100vh-280px)] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium mb-1">Conversation Context</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  The AI assistant is tracking these contextual elements:
                </p>
              </div>

              {contextAwareness.length > 0 ? (
                <Card className="divide-y divide-border/40">
                  {contextAwareness.map((item, idx) => (
                    <div key={idx} className="p-2 flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </Card>
              ) : (
                <div className="text-center p-4 border border-dashed border-border rounded-lg">
                  <History className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No active context yet. Start a conversation about a contract to build context.
                  </p>
                </div>
              )}

              <Card className="p-3">
                <h4 className="text-sm font-medium mb-1">Conversation Memory</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Your assistant remembers these key discussion points:
                </p>
                <div className="space-y-2">
                  {messages.length > 0 ? (
                    <ul className="space-y-1">
                      {messages.slice(-3).map((msg, idx) => (
                        <li key={idx} className="text-xs bg-muted/20 p-2 rounded">
                          <span className={`font-medium ${msg.type === 'user' ? 'text-primary' : ''}`}>
                            {msg.type === 'user' ? 'You: ' : 'Assistant: '}
                          </span>
                          {msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Start a conversation to build memory</p>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="shrink-0 px-3 pb-1 pt-2">
        <AiModes activeMode={aiMode} onChange={setAiMode} />
      </div>

      {files.length > 0 && (
        <div className="bg-muted/40 border-t border-border p-2 animate-slide-in-up">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-background rounded-lg px-3 py-1.5 text-sm border border-border"
              >
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-muted-foreground hover:text-destructive"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div 
        className={cn(
          "border-t border-border/40 p-3 bg-background/60 rounded-b-xl",
          isDragging && "bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl z-10">
            <p className="text-primary font-medium">Drop files here</p>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2 relative">
            <div className="flex-grow relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "Listening..." : "Ask about contracts, upload, or start with a template..."}
                className={cn(
                  "w-full p-3 rounded-xl border border-border bg-background/80 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none overflow-hidden min-h-[48px] max-h-[120px]",
                  isRecording && "bg-primary/5 border-primary animate-pulse-subtle"
                )}
                disabled={isProcessing}
                rows={1}
              />
            </div>
            
            <Button
              onClick={handleToggleRecording}
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className={cn(
                "rounded-full h-9 w-9 shadow-sm",
                isRecording && "animate-pulse"
              )}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              <Mic size={16} />
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() && files.length === 0}
              variant="default"
              size="icon"
              className={cn(
                "rounded-full h-9 w-9 shadow-sm",
                (!inputValue.trim() && files.length === 0) && "opacity-70"
              )}
            >
              <Send size={16} />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1 h-7 shadow-sm"
            >
              <Paperclip size={12} />
              Attach
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </Button>
            
            <Button
              onClick={handleScreenCapture}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1 h-7 shadow-sm"
            >
              <ScreenShare size={12} />
              Screenshot
              <input
                type="file"
                ref={screenCaptureRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </Button>
            
            <Button
              onClick={handleCameraCapture}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1 h-7 shadow-sm"
            >
              <Camera size={12} />
              Camera
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                capture="environment"
              />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1 h-7 ml-auto shadow-sm"
              onClick={() => {
                toast({
                  title: "AI Suggestions",
                  description: "Loading smart suggestions based on your history...",
                });
              }}
            >
              <Lightbulb size={12} className="text-primary" />
              Suggestions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
