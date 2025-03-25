
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ChatInterface } from "../chat/ChatInterface";
import { Message } from "../chat/MessageBubble";
import { nanoid } from "@/lib/utils";
import { ModernContractEditor } from "../contract/ModernContractEditor";
import { ContractReview } from "../contract/ContractReview";
import { useToast } from "@/hooks/use-toast";
import { TriPanelLayout } from "./TriPanelLayout";

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
  const location = useLocation();

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
            setIsReviewOpen(false);
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

  // Render primary content area based on current state and route
  const renderCenterPanel = () => {
    const path = location.pathname;
    
    // If we're on a specific route, render that content
    if (path.startsWith("/contracts") || path === "/") {
      if (isEditorOpen) {
        return <ModernContractEditor title={currentContract.title} className="h-full" />;
      }
      
      if (isReviewOpen) {
        return (
          <ContractReview 
            isOpen={true} 
            onClose={() => setIsReviewOpen(false)} 
            title={currentContract.title} 
            contractType={currentContract.type} 
          />
        );
      }
    }

    // Handle other specific routes
    if (path === "/templates") {
      return <TemplatesSection />;
    }
    
    if (path === "/history") {
      return <HistorySection />;
    }

    if (path === "/workspaces") {
      return <WorkspacesSection />;
    }

    if (path === "/team") {
      return <TeamSection />;
    }

    if (path === "/settings") {
      return <SettingsSection />;
    }

    if (path === "/pricing") {
      return <PricingSection />;
    }
    
    // Default view when no contract is open
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-lg p-6">
          <h3 className="text-2xl font-bold mb-4">No Contract Open</h3>
          <p className="text-muted-foreground mb-6">
            Ask the AI assistant to create a new contract or upload an existing document to get started.
          </p>
        </div>
      </div>
    );
  };
  
  // Right panel with chat interface
  const renderChatPanel = () => {
    return (
      <ChatInterface
        onSendMessage={handleSendMessage}
        messages={messages}
        isProcessing={isProcessing}
        className="h-full"
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

// Template list component
const TemplatesSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Templates Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATE_DATA.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};

// Template card component
const TemplateCard = ({ template }) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <template.icon size={20} className="text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1">{template.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs bg-secondary px-2 py-1 rounded-full">{template.category}</span>
        <button className="text-sm text-primary hover:underline">Use Template</button>
      </div>
    </div>
  );
};

// History section component
const HistorySection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Contract History</h1>
      <div className="space-y-4">
        {HISTORY_DATA.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

// History item component
const HistoryItem = ({ item }) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{item.title}</h3>
        <span className="text-xs text-muted-foreground">{item.date}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground mb-3">
        <item.icon size={14} className="mr-1" />
        <span>{item.action}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs bg-secondary px-2 py-1 rounded-full">{item.type}</span>
        <button className="text-sm text-primary hover:underline">View</button>
      </div>
    </div>
  );
};

// Workspaces section component
const WorkspacesSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Create Workspace
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WORKSPACE_DATA.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
    </div>
  );
};

// Workspace card component
const WorkspaceCard = ({ workspace }) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <workspace.icon size={20} className="text-primary" />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          workspace.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}>
          {workspace.status}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{workspace.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{workspace.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {workspace.members.map((member, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-primary/80 flex items-center justify-center text-[10px] text-white ring-2 ring-background">
              {member.initials}
            </div>
          ))}
        </div>
        <button className="text-sm text-primary hover:underline">Open</button>
      </div>
    </div>
  );
};

// Team section component
const TeamSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Invite Member
        </button>
      </div>
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {TEAM_DATA.map((member) => (
              <tr key={member.id} className="border-t border-border/50 hover:bg-muted/20">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-xs text-white mr-3">
                      {member.initials}
                    </div>
                    <span>{member.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{member.email}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.role === "Admin" ? "bg-purple-100 text-purple-700" : 
                    member.role === "Editor" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-sm text-primary hover:underline mr-3">Edit</button>
                  <button className="text-sm text-destructive hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Settings section component
const SettingsSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" className="w-full p-2 border border-input rounded-lg" defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input type="email" className="w-full p-2 border border-input rounded-lg" defaultValue="john.doe@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input type="text" className="w-full p-2 border border-input rounded-lg" defaultValue="Acme Inc." />
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
        
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input type="password" className="w-full p-2 border border-input rounded-lg" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" className="w-full p-2 border border-input rounded-lg" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input type="password" className="w-full p-2 border border-input rounded-lg" placeholder="••••••••" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Update Password
            </button>
          </div>
        </div>
        
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email notifications</span>
              <div className="w-10 h-5 bg-primary rounded-full relative">
                <div className="absolute right-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Push notifications</span>
              <div className="w-10 h-5 bg-muted rounded-full relative">
                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Contract update alerts</span>
              <div className="w-10 h-5 bg-primary rounded-full relative">
                <div className="absolute right-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pricing section component
const PricingSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Pricing & Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Free Plan */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all">
          <div className="p-6">
            <h3 className="text-xl font-bold">Free</h3>
            <div className="mt-2 flex items-end">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">50 credits included</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Basic document creation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Standard templates (5)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Email support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">5 team members</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-muted/20">
            <button className="w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors">
              Current Plan
            </button>
          </div>
        </div>
        
        {/* Pro Alpha Plan */}
        <div className="bg-card rounded-xl border border-primary/30 overflow-hidden hover:shadow-lg transition-all relative">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
            Popular
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold">Pro Alpha</h3>
            <div className="mt-2 flex items-end">
              <span className="text-3xl font-bold">$20</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">300 credits included</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Advanced document creation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Premium templates (20)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Priority support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Unlimited team members</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-muted/20">
            <button className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
              Upgrade to Pro Alpha
            </button>
          </div>
        </div>
        
        {/* Pro Beta Plan */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all">
          <div className="p-6">
            <h3 className="text-xl font-bold">Pro Beta</h3>
            <div className="mt-2 flex items-end">
              <span className="text-3xl font-bold">$50</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">700 credits included</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Everything in Pro Alpha</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Advanced workflow automation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Custom integrations</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Dedicated support</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-muted/20">
            <button className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
              Upgrade to Pro Beta
            </button>
          </div>
        </div>
        
        {/* Pro Gamma Plan */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all">
          <div className="p-6">
            <h3 className="text-xl font-bold">Pro Gamma</h3>
            <div className="mt-2 flex items-end">
              <span className="text-3xl font-bold">$100</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">1300 credits included</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Everything in Pro Beta</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Enterprise-grade security</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Custom development support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">SLA guarantees</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-muted/20">
            <button className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
              Upgrade to Pro Gamma
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="text-xl font-semibold mb-4">Credit Usage</h2>
        <div className="h-64 mb-6">
          {/* This is a placeholder for the chart - in a real app, use recharts or another charting library */}
          <div className="w-full h-full bg-muted/20 rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">Credit usage chart</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Credits Used</h3>
            <p className="text-3xl font-bold">210</p>
          </div>
          <div className="bg-muted/20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Credits Remaining</h3>
            <p className="text-3xl font-bold">90</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template mock data
import { FileText, Shield, Briefcase, Scale, Users, Building, Handshake, Brain } from "lucide-react";

const TEMPLATE_DATA = [
  {
    id: 1,
    title: "Non-Disclosure Agreement",
    description: "Standard confidentiality agreement to protect your business information",
    category: "Legal Protection",
    icon: Shield
  },
  {
    id: 2,
    title: "Employment Contract",
    description: "Comprehensive agreement for hiring new team members",
    category: "HR",
    icon: Users
  },
  {
    id: 3,
    title: "Service Agreement",
    description: "Define the terms for providing services to clients",
    category: "Business",
    icon: Briefcase
  },
  {
    id: 4,
    title: "Contractor Agreement",
    description: "Agreement for working with independent contractors",
    category: "HR",
    icon: Building
  },
  {
    id: 5,
    title: "Partnership Agreement",
    description: "Structure the legal framework for business partnerships",
    category: "Business",
    icon: Handshake
  },
  {
    id: 6,
    title: "License Agreement",
    description: "Control how your intellectual property can be used",
    category: "Legal Protection",
    icon: Scale
  }
];

// History mock data
import { PenTool, Eye, FileSignature } from "lucide-react";

const HISTORY_DATA = [
  {
    id: 1,
    title: "NDA - ABC Company",
    date: "Today, 2:30 PM",
    action: "Created new contract",
    type: "NDA",
    icon: PenTool
  },
  {
    id: 2,
    title: "Services Agreement - XYZ Inc",
    date: "Yesterday, 10:15 AM",
    action: "Revised contract",
    type: "Service Agreement",
    icon: FileSignature
  },
  {
    id: 3,
    title: "Employment Agreement - Jane Smith",
    date: "Mar 15, 2024",
    action: "Viewed contract",
    type: "Employment",
    icon: Eye
  },
  {
    id: 4,
    title: "Licensing Agreement - Tech Partners",
    date: "Mar 12, 2024",
    action: "Created new contract",
    type: "License",
    icon: PenTool
  },
  {
    id: 5,
    title: "Consulting Agreement - Acme Consulting",
    date: "Mar 10, 2024",
    action: "Revised contract",
    type: "Consulting",
    icon: FileSignature
  }
];

// Workspace mock data
const WORKSPACE_DATA = [
  {
    id: 1,
    name: "Legal Department",
    description: "Contracts and agreements for the legal team",
    members: [
      { id: 1, initials: "JD" },
      { id: 2, initials: "MS" },
      { id: 3, initials: "RL" }
    ],
    status: "active",
    icon: Scale
  },
  {
    id: 2,
    name: "Sales Team",
    description: "Client agreements and sales contracts",
    members: [
      { id: 1, initials: "JD" },
      { id: 4, initials: "KP" },
      { id: 5, initials: "BH" },
      { id: 6, initials: "TM" }
    ],
    status: "active",
    icon: Briefcase
  },
  {
    id: 3,
    name: "HR Department",
    description: "Employment contracts and policies",
    members: [
      { id: 7, initials: "LN" },
      { id: 8, initials: "PQ" }
    ],
    status: "pending",
    icon: Users
  }
];

// Team mock data
const TEAM_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    initials: "JD"
  },
  {
    id: 2,
    name: "Mary Smith",
    email: "mary.smith@example.com",
    role: "Editor",
    status: "Active",
    initials: "MS"
  },
  {
    id: 3,
    name: "Robert Lewis",
    email: "robert.lewis@example.com",
    role: "Viewer",
    status: "Active",
    initials: "RL"
  },
  {
    id: 4,
    name: "Kate Peterson",
    email: "kate.p@example.com",
    role: "Editor",
    status: "Active",
    initials: "KP"
  },
  {
    id: 5,
    name: "Brian Hall",
    email: "brian.h@example.com",
    role: "Viewer",
    status: "Invited",
    initials: "BH"
  }
];
