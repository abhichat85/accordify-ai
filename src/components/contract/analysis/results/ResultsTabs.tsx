
import React from "react";
import { cn } from "@/lib/utils";
import { AnalysisResult } from "@/services/contractAnalysis";

interface ResultsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  analysisResult: AnalysisResult;
}

export const ResultsTabs: React.FC<ResultsTabsProps> = ({ 
  activeTab, 
  setActiveTab,
  analysisResult
}) => {
  // Get risk counts for the badge
  const riskCount = {
    high: analysisResult.type === "risk" ? analysisResult.result.filter(r => r.type === "high").length : 0,
    medium: analysisResult.type === "risk" ? analysisResult.result.filter(r => r.type === "medium").length : 0,
    low: analysisResult.type === "risk" ? analysisResult.result.filter(r => r.type === "low").length : 0
  };
  
  const totalRisks = riskCount.high + riskCount.medium + riskCount.low;
  
  return (
    <div className="flex border-b border-border/30">
      <button
        className={cn(
          "flex-1 py-3 text-sm font-medium transition-colors",
          activeTab === "summary"
            ? "text-primary border-b-2 border-primary"
            : "text-foreground hover:text-primary"
        )}
        onClick={() => setActiveTab("summary")}
      >
        Summary
      </button>
      <button
        className={cn(
          "flex-1 py-3 text-sm font-medium transition-colors",
          activeTab === "risks"
            ? "text-primary border-b-2 border-primary"
            : "text-foreground hover:text-primary"
        )}
        onClick={() => setActiveTab("risks")}
      >
        Risks ({totalRisks})
      </button>
      <button
        className={cn(
          "flex-1 py-3 text-sm font-medium transition-colors",
          activeTab === "clauses"
            ? "text-primary border-b-2 border-primary"
            : "text-foreground hover:text-primary"
        )}
        onClick={() => setActiveTab("clauses")}
      >
        Clauses
      </button>
    </div>
  );
};
