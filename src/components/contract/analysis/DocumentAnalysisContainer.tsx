
import React from "react";
import { ModernContractEditor } from "../ModernContractEditor";
import { DocumentUploader } from "../DocumentUploader";
import { ContractAnalysisResults } from "../ContractAnalysisResults";
import { ContractReview } from "../ContractReview";
import { AnalysisToolbar } from "./AnalysisToolbar";
import { EmptyState } from "./EmptyState";
import { useContractAnalysis } from "./useContractAnalysis";
import { Button } from "@/components/ui/button";
import { FileUp, FileText, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

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
        <Card className="flex flex-col items-center justify-center h-full p-6">
          <div className="text-center mb-6 max-w-md">
            <FileText className="w-12 h-12 mx-auto mb-4 text-primary/60" />
            <h3 className="text-xl font-semibold mb-2">Contract Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Upload a contract document to analyze it for risks, compliance issues, and extract key clauses.
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => document.getElementById('document-upload')?.click()} 
              className="gap-2"
              size="lg"
            >
              <Upload size={18} />
              Upload Contract
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                // Set a sample document content
                setDocumentContent("SAMPLE CONTRACT\n\nThis Agreement is made on [DATE] between [PARTY A] and [PARTY B].\n\n1. DEFINITIONS\n\n2. TERM\nThis Agreement shall commence on [START DATE] and continue for a period of [DURATION].\n\n3. PAYMENT\n[PARTY B] shall pay [PARTY A] the sum of $[AMOUNT] within [TIMEFRAME].\n\n4. CONFIDENTIALITY\nBoth parties agree to keep all information confidential.\n\n5. TERMINATION\nThis Agreement may be terminated by either party with [NOTICE PERIOD] written notice.");
              }}
              className="gap-2"
              size="lg"
            >
              <FileText size={18} />
              Use Sample Contract
            </Button>
          </div>
          <input 
            id="document-upload" 
            type="file" 
            className="hidden" 
            accept=".txt,.doc,.docx,.pdf,.md,.rtf"
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
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-full">
          {/* Left column: Document editor/viewer - now takes 2/5 */}
          <div className="flex flex-col h-full lg:col-span-2 border border-border/40 rounded-xl overflow-hidden">
            <div className="py-2 px-3 bg-muted/30 border-b border-border/40 flex items-center justify-between">
              <h3 className="text-sm font-medium">Contract Document</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs" 
                onClick={() => setDocumentContent("")}
              >
                Change Document
              </Button>
            </div>
            <div className="flex-grow overflow-auto">
              <ModernContractEditor 
                title="" 
                className="h-full border-none shadow-none"
                initialContent={documentContent}
              />
            </div>
          </div>
          
          {/* Right column: Analysis tools & results - now takes 3/5 */}
          <div className="flex flex-col h-full lg:col-span-3 border border-border/40 rounded-xl overflow-hidden">
            <div className="py-2 px-3 bg-muted/30 border-b border-border/40">
              <h3 className="text-sm font-medium">Analysis Tools</h3>
            </div>
            <div className="p-3 border-b border-border/40">
              <AnalysisToolbar
                documentContent={documentContent}
                analysisType={analysisType}
                isAnalyzing={isAnalyzing}
                analysisResult={analysisResult}
                runAnalysis={runAnalysis}
                openReview={openReview}
              />
            </div>
            
            <div className="flex-1 overflow-auto p-3">
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
