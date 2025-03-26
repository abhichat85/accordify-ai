
import React from "react";
import { ModernContractEditor } from "../ModernContractEditor";
import { DocumentUploader } from "../DocumentUploader";
import { ContractAnalysisResults } from "../ContractAnalysisResults";
import { ContractReview } from "../ContractReview";
import { AnalysisToolbar } from "./AnalysisToolbar";
import { EmptyState } from "./EmptyState";
import { useContractAnalysis } from "./useContractAnalysis";

interface DocumentAnalysisContainerProps {
  className?: string;
}

export const DocumentAnalysisContainer: React.FC<DocumentAnalysisContainerProps> = ({ className }) => {
  const {
    documentContent,
    setDocumentContent,
    analysisType,
    analysisResult,
    isAnalyzing,
    isReviewOpen,
    setIsReviewOpen,
    runAnalysis,
    openReview
  } = useContractAnalysis();

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 h-full ${className}`}>
      {/* Left column: Document editor/viewer */}
      <div className="flex flex-col h-full">
        {!documentContent ? (
          <DocumentUploader onDocumentContent={setDocumentContent} className="h-full" />
        ) : (
          <ModernContractEditor 
            title="Contract Document" 
            className="h-full"
            initialContent={documentContent}
          />
        )}
      </div>
      
      {/* Right column: Analysis tools & results */}
      <div className="flex flex-col h-full">
        {!documentContent ? (
          <EmptyState />
        ) : (
          <>
            <AnalysisToolbar
              documentContent={documentContent}
              analysisType={analysisType}
              isAnalyzing={isAnalyzing}
              analysisResult={analysisResult}
              runAnalysis={runAnalysis}
              openReview={openReview}
            />
            
            <div className="flex-1 overflow-hidden border border-border/40 rounded-xl">
              <ContractAnalysisResults 
                analysisResult={analysisResult} 
                isLoading={isAnalyzing}
              />
            </div>
          </>
        )}
      </div>
      
      {/* Full contract review modal */}
      {analysisResult && (
        <ContractReview
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          title="Contract Review"
          contractType={analysisResult.type === "general" 
            ? analysisResult.result.documentType || "Contract" 
            : "Contract"}
        />
      )}
    </div>
  );
};
