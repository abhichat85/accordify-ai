
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChatInterface } from "../chat/ChatInterface";
import { Message } from "../chat/MessageBubble";
import { nanoid } from "@/lib/utils";
import { ContractEditor } from "../contract/ContractEditor";
import { ContractReview } from "../contract/ContractReview";
import { useToast } from "@/hooks/use-toast";
import { Header } from "./Header";

export const MainLayout: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [currentContract, setCurrentContract] = useState({
    title: "Non-Disclosure Agreement",
    type: "NDA"
  });
  const { toast } = useToast();

  const handleSendMessage = (content: string, files?: File[]) => {
    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      content,
      type: "user",
      timestamp: new Date(),
      status: "sending"
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Handle file upload if present
    if (files && files.length > 0) {
      toast({
        title: "Files received",
        description: `Processing ${files.length} file(s)`,
      });
      
      // In a real app, this would upload files to the server
      if (files.some(file => file.name.includes("contract") || file.name.endsWith(".pdf") || file.name.endsWith(".docx"))) {
        // Simulate processing
        setTimeout(() => {
          setIsReviewOpen(true);
          setCurrentContract({
            title: files[0].name.replace(/\.[^/.]+$/, ""),
            type: "Uploaded Document"
          });
        }, 1500);
      }
    }
    
    // Detect special modes from the message
    let responseContent = "";
    const lowerContent = content.toLowerCase();
    
    // Check if the message is a mode-specific request
    const isLawyerMode = lowerContent.includes("[lawyer mode]");
    const isReasoningMode = lowerContent.includes("[reasoning mode]");
    const isAnalystMode = lowerContent.includes("[analyst mode]");
    
    // Simulate AI response after a delay
    setTimeout(() => {
      // Update user message status
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
      
      // Add AI response based on user message content
      if (lowerContent.includes("generate") || lowerContent.includes("create") || lowerContent.includes("draft")) {
        responseContent = "I'd be happy to generate that contract for you. What specific terms would you like to include?";
        
        // If it's about an NDA, open the editor
        if (lowerContent.includes("nda") || lowerContent.includes("non-disclosure")) {
          setTimeout(() => {
            setIsEditorOpen(true);
            setCurrentContract({
              title: "Non-Disclosure Agreement",
              type: "NDA"
            });
          }, 500);
          
          responseContent = "I've created a draft Non-Disclosure Agreement for you. Feel free to review and edit it in the editor. Is there anything specific you'd like me to change?";
        }
      } else if (lowerContent.includes("review") || lowerContent.includes("analyze")) {
        responseContent = "I'd be happy to review a contract for you. Please upload the document you'd like me to analyze.";
      } else if (lowerContent.includes("hello") || lowerContent.includes("hi")) {
        responseContent = "Hello! I'm Accord AI, your contract assistant. How can I help you today? I can generate new contracts, review existing ones, or answer questions about legal terms.";
      } else {
        responseContent = "I understand you're asking about contracts. Could you provide more details about what you need help with? I can generate, review, or answer questions about contracts.";
      }
      
      // Add mode-specific content
      if (isLawyerMode) {
        responseContent = "From a legal perspective: " + responseContent;
      } else if (isReasoningMode) {
        responseContent = "Let me think through this step by step:\n\n1. First, let's consider the legal context.\n2. Next, we should examine the specific terms.\n3. Finally, I'll provide recommendations based on legal precedent.\n\n" + responseContent;
      } else if (isAnalystMode) {
        responseContent = "Based on data analysis of similar contracts:\n\n" + responseContent + "\n\nStatistically, 78% of similar contracts include additional indemnification clauses.";
      }
      
      const aiMessage: Message = {
        id: nanoid(),
        content: responseContent,
        type: "ai",
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex-grow overflow-hidden p-4 md:p-6 relative">
        {/* Main chat interface */}
        <div className="mx-auto max-w-5xl h-full relative">
          <ChatInterface
            onSendMessage={handleSendMessage}
            messages={messages}
            isProcessing={isProcessing}
            className="h-full"
          />
        </div>
        
        {/* Contract panels */}
        <ContractEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={currentContract.title}
        />
        
        <ContractReview
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          title={currentContract.title}
          contractType={currentContract.type}
        />
      </div>
      
      <Outlet />
    </div>
  );
};
