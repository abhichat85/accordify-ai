
import React from "react";
import { AnalysisResult } from "@/services/contractAnalysis";
import { AnalysisResults } from "./analysis/results/AnalysisResults";

interface ContractAnalysisResultsProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  className?: string;
}

export const ContractAnalysisResults: React.FC<ContractAnalysisResultsProps> = ({
  analysisResult,
  isLoading,
  className
}) => {
  return (
    <AnalysisResults 
      analysisResult={analysisResult}
      isLoading={isLoading}
      className={className}
    />
  );
};
