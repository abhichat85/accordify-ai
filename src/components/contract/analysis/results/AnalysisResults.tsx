
import React from "react";
import { Loader2 } from "lucide-react";
import { AnalysisResult } from "@/services/contractAnalysis";
import { SearchBar } from "./SearchBar";
import { ResultsTabs } from "./ResultsTabs";
import { SummaryTab } from "./SummaryTab";
import { RisksTab } from "./RisksTab";
import { ClausesTab } from "./ClausesTab";
import { EmptyResults } from "./EmptyResults";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  className?: string;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResult,
  isLoading,
  className
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("summary");
  const [searchQuery, setSearchQuery] = React.useState("");

  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium">Analyzing contract...</h3>
        <p className="text-sm text-muted-foreground">
          This may take a few moments depending on document size.
        </p>
      </div>
    );
  }

  if (!analysisResult) {
    return <EmptyResults className={className} />;
  }

  if (analysisResult.type === "error") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
        <EmptyResults isError error={analysisResult.error} className={className} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Tabs */}
      <ResultsTabs activeTab={activeTab} setActiveTab={setActiveTab} analysisResult={analysisResult} />
      
      {/* Content based on active tab */}
      <div className="flex-grow overflow-y-auto p-4 styled-scrollbar">
        {activeTab === "summary" && (
          <SummaryTab analysisResult={analysisResult} />
        )}
        
        {activeTab === "risks" && (
          <RisksTab analysisResult={analysisResult} searchQuery={searchQuery} />
        )}
        
        {activeTab === "clauses" && (
          <ClausesTab analysisResult={analysisResult} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
};
