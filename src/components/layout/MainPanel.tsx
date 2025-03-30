
import React from "react";
import { useLocation } from "react-router-dom";
import { ModernContractEditor } from "../contract/ModernContractEditor";
import { ContractReview } from "../contract/ContractReview";
import { TemplatesSection } from "../sections/TemplatesSection";
import { HistorySection } from "../sections/HistorySection";
import { WorkspacesSection } from "../sections/WorkspacesSection";
import { TeamSection } from "../sections/TeamSection";
import { SettingsSection } from "../sections/SettingsSection";
import { PricingSection } from "../sections/PricingSection";
import { BackgroundPaths } from "@/components/ui/background-paths";

interface MainPanelProps {
  isEditorOpen: boolean;
  isReviewOpen: boolean;
  currentContract: {
    title: string;
    type: string;
    content?: string;
  };
  setIsReviewOpen: (isOpen: boolean) => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({
  isEditorOpen,
  isReviewOpen,
  currentContract,
  setIsReviewOpen
}) => {
  const location = useLocation();
  const path = location.pathname;
  
  console.log("MainPanel rendering with currentContract:", {
    title: currentContract.title,
    type: currentContract.type,
    contentLength: currentContract.content ? currentContract.content.length : 0
  });
  
  // If we're on a specific route, render that content
  if (path.startsWith("/contracts") || path === "/app") {
    if (isEditorOpen) {
      return <ModernContractEditor 
        title={currentContract.title} 
        className="h-full" 
        initialContent={currentContract.content}
      />;
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
    <div className="flex items-center justify-center h-full relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BackgroundPaths title="Welcome" />
      </div>
      <div className="text-center max-w-lg p-6 relative z-10 bg-background/60 backdrop-blur-md rounded-xl">
        <h3 className="text-2xl font-bold mb-4">No Contract Open</h3>
        <p className="text-muted-foreground mb-6">
          Ask the AI assistant to create a new contract or upload an existing document to get started.
        </p>
      </div>
    </div>
  );
};
