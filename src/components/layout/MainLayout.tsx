
import React, { useState } from "react";
import { nanoid } from "@/lib/utils";
import { Message } from "../chat/MessageBubble";
import { useToast } from "@/hooks/use-toast";
import { TriPanelLayout } from "./TriPanelLayout";
import { MainPanel } from "./MainPanel";
import { ChatPanel } from "./ChatPanel";

export const MainLayout: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(true);
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
          setIsEditorOpen(false);
          setCurrentContract({
            title: files[0].name.replace(/\.[^/.]+$/, ""),
            type: "Uploaded Document"
          });
        }, 1500);
      }
    }
    
    // Enhanced agentic response handling
    handleAgentResponse(content);
  };

  // Simulate agentic AI response with reasoning and multi-step actions
  const handleAgentResponse = (content: string) => {
    const lowerContent = content.toLowerCase();
    let responseContent = "";
    let actions = [];
    let reasoning = "";
    
    // Detect if this is a request that requires contract generation
    const isContractGeneration = lowerContent.includes("generate") || 
                                 lowerContent.includes("create") || 
                                 lowerContent.includes("draft");
    
    // Detect request for contract analysis
    const isContractAnalysis = lowerContent.includes("review") || 
                               lowerContent.includes("analyze") || 
                               lowerContent.includes("check");
    
    // Detect requests for comparison
    const isComparisonRequest = lowerContent.includes("compare") || 
                                lowerContent.includes("difference") || 
                                lowerContent.includes("changes");
    
    // Detect greeting
    const isGreeting = lowerContent.includes("hello") || 
                       lowerContent.includes("hi") || 
                       lowerContent.startsWith("hey");
    
    // Add reasoning step to show agentic thinking
    if (isContractGeneration) {
      reasoning = "I'm analyzing your request to generate a new contract. I'll determine the contract type, required clauses, and customize it based on your specifications.";
      
      // If it's about an NDA, open the editor with reasoning
      if (lowerContent.includes("nda") || lowerContent.includes("non-disclosure")) {
        actions.push("Opening contract editor for NDA");
        actions.push("Analyzing standard NDA requirements");
        actions.push("Generating customized clauses");
        
        setTimeout(() => {
          setIsEditorOpen(true);
          setIsReviewOpen(false);
          setCurrentContract({
            title: "Non-Disclosure Agreement",
            type: "NDA"
          });
        }, 500);
        
        responseContent = "I've created a draft Non-Disclosure Agreement based on your requirements. The document includes standard confidentiality provisions, but I've also customized the following sections:\n\n1. Term length adjusted to industry standards\n2. Added specific intellectual property protections\n3. Included jurisdiction clause for your location\n\nYou can now review and edit it in the editor. Would you like me to explain any specific section in more detail?";
      } else {
        responseContent = "I'd be happy to generate that contract for you. To create the most appropriate document, could you please provide more details about:\n\n1. The parties involved\n2. Key terms and conditions\n3. Any specific clauses you want to include\n4. Applicable jurisdiction\n\nThis will help me customize the contract to your specific needs.";
      }
    } else if (isContractAnalysis) {
      reasoning = "I'll need to analyze the contract structure, identify key clauses, and assess potential risks or missing elements.";
      
      actions.push("Scanning document for standard clauses");
      actions.push("Checking for risk factors");
      actions.push("Comparing against industry standards");
      
      responseContent = "I'd be happy to review a contract for you. You can upload your document, and I'll perform a comprehensive analysis including:\n\n• Risk assessment of key provisions\n• Identification of missing standard clauses\n• Comparison against industry norms\n• Suggestions for negotiation points\n\nWould you like to upload a document now, or would you prefer me to explain my review process in more detail?";
    } else if (isComparisonRequest) {
      reasoning = "For comparison, I need to identify structural similarities and differences, analyze changes in language, and assess the impact of modifications.";
      
      actions.push("Preparing document comparison framework");
      actions.push("Setting up side-by-side analysis");
      
      responseContent = "I can help you compare contract versions. To perform the most accurate comparison, please upload both document versions. I'll analyze them and provide:\n\n• A side-by-side comparison of changed clauses\n• Summary of key modifications\n• Risk assessment of the changes\n• Visualization of additions and deletions\n\nWould you like to proceed with uploading the documents?";
    } else if (isGreeting) {
      reasoning = "This appears to be an initial greeting. I'll provide a helpful introduction to my capabilities.";
      
      responseContent = "Hello! I'm Accord AI, your contract assistant. I can help you with a wide range of contract-related tasks:\n\n• Generating custom contracts and agreements\n• Reviewing existing documents for risks and opportunities\n• Comparing different versions of contracts\n• Answering questions about legal terms and concepts\n• Managing your document workflow\n\nWhat type of contract assistance do you need today?";
    } else {
      reasoning = "I need to understand the general intent of this message to provide the most helpful response.";
      
      responseContent = "I understand you're asking about contracts. To help you more effectively, could you provide more specific details about what you need? I can:\n\n• Create new contracts from scratch\n• Review existing agreements\n• Answer questions about legal terms\n• Compare document versions\n• Help with negotiation strategies\n\nJust let me know which of these services would be most helpful.";
    }
    
    // First, update user message status
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
      
      // Then add reasoning message to show AI thinking process
      if (reasoning) {
        const reasoningMessage: Message = {
          id: nanoid(),
          content: reasoning,
          type: "ai",
          timestamp: new Date(),
          messageType: "reasoning"
        };
        
        setMessages((prev) => [...prev, reasoningMessage]);
      }
      
      // If there are actions, show them
      if (actions.length > 0) {
        setTimeout(() => {
          const actionsMessage: Message = {
            id: nanoid(),
            content: "**Actions:**\n• " + actions.join("\n• "),
            type: "ai",
            timestamp: new Date(),
            messageType: "actions"
          };
          
          setMessages((prev) => [...prev, actionsMessage]);
          
          // Finally add the main response
          setTimeout(() => {
            const aiMessage: Message = {
              id: nanoid(),
              content: responseContent,
              type: "ai",
              timestamp: new Date()
            };
            
            setMessages((prev) => [...prev, aiMessage]);
            setIsProcessing(false);
          }, 800);
        }, 800);
      } else {
        // If no actions, just add the main response
        setTimeout(() => {
          const aiMessage: Message = {
            id: nanoid(),
            content: responseContent,
            type: "ai",
            timestamp: new Date()
          };
          
          setMessages((prev) => [...prev, aiMessage]);
          setIsProcessing(false);
        }, 800);
      }
    }, 1000);
  };

  // Define user message for the component props
  const userMessage: Message = {
    id: "",
    content: "",
    type: "user",
    timestamp: new Date(),
    status: "sending"
  };

  // Render main content panel
  const renderCenterPanel = () => {
    return (
      <MainPanel
        isEditorOpen={isEditorOpen}
        isReviewOpen={isReviewOpen}
        currentContract={currentContract}
        setIsReviewOpen={setIsReviewOpen}
      />
    );
  };
  
  // Render chat panel
  const renderChatPanel = () => {
    return (
      <ChatPanel
        messages={messages}
        isProcessing={isProcessing}
        onSendMessage={handleSendMessage}
      />
    );
  };

  return (
    <TriPanelLayout
      leftPanel={null} // Left panel is built into TriPanelLayout
      centerPanel={renderCenterPanel()}
      rightPanel={renderChatPanel()}
    />
  );
};
