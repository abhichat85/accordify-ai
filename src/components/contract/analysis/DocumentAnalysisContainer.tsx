
import React from "react";
import { ModernContractEditor } from "../ModernContractEditor";
import { DocumentUploader } from "../DocumentUploader";
import { ContractAnalysisResults } from "../ContractAnalysisResults";
import { ContractReview } from "../ContractReview";
import { AnalysisToolbar } from "./AnalysisToolbar";
import { EmptyState } from "./EmptyState";
import { useContractAnalysis } from "./useContractAnalysis";
import { Button } from "@/components/ui/button";
import { FileUp, FileText } from "lucide-react";

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
    <div className={`flex flex-col h-full ${className}`}>
      {!documentContent ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="text-center mb-4 max-w-md">
            <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Contract Analysis</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Upload a contract document to analyze it for risks, compliance issues, and more.
            </p>
          </div>
          <Button onClick={() => document.getElementById('document-upload')?.click()} className="gap-2">
            <FileUp size={16} />
            Upload Contract
          </Button>
          <input 
            id="document-upload" 
            type="file" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    setDocumentContent(event.target.result.toString());
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* Left column: Document editor/viewer - now takes 40% */}
          <div className="flex flex-col h-full md:col-span-1">
            <ModernContractEditor 
              title="Contract Document" 
              className="h-full"
              initialContent={documentContent}
            />
          </div>
          
          {/* Right column: Analysis tools & results - now takes 60% */}
          <div className="flex flex-col h-full md:col-span-1">
            <AnalysisToolbar
              documentContent={documentContent}
              analysisType={analysisType}
              isAnalyzing={isAnalyzing}
              analysisResult={analysisResult}
              runAnalysis={runAnalysis}
              openReview={openReview}
            />
            
            <div className="flex-1 overflow-auto border border-border/40 rounded-xl">
              <ContractAnalysisResults 
                analysisResult={analysisResult} 
                isLoading={isAnalyzing}
              />
            </div>
          </div>
        </div>
      )}
      
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
