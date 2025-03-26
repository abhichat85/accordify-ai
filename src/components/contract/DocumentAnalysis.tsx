
import React, { useState } from "react";
import { ModernContractEditor } from "./ModernContractEditor";
import { DocumentUploader } from "./DocumentUploader";
import { ContractAnalysisResults } from "./ContractAnalysisResults";
import { ContractReview } from "./ContractReview";
import { AnalysisType, analyzeContract, AnalysisResult } from "@/services/contractAnalysis";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle, Sparkles, Loader2, Search, FileText, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentAnalysisProps {
  className?: string;
}

export const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ className }) => {
  const [documentContent, setDocumentContent] = useState<string>("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("general");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDocumentContent = (content: string) => {
    setDocumentContent(content);
    // Reset analysis when new document is uploaded
    setAnalysisResult(null);
  };

  const runAnalysis = async (type: AnalysisType) => {
    if (!documentContent.trim()) {
      toast({
        title: "No document content",
        description: "Please upload a document first.",
        variant: "destructive",
      });
      return;
    }

    setAnalysisType(type);
    setIsAnalyzing(true);

    try {
      const result = await analyzeContract(documentContent, type);
      setAnalysisResult(result);
      
      if (result.type === "error") {
        toast({
          title: "Analysis failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis complete",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} analysis completed successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openReview = () => {
    if (analysisResult && analysisResult.type !== "error") {
      setIsReviewOpen(true);
    } else {
      toast({
        title: "Run analysis first",
        description: "Please run at least one analysis before viewing the full review.",
      });
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 h-full ${className}`}>
      {/* Left column: Document editor/viewer */}
      <div className="flex flex-col h-full">
        {!documentContent ? (
          <DocumentUploader onDocumentContent={handleDocumentContent} className="h-full" />
        ) : (
          <ModernContractEditor 
            title="Contract Document" 
            className="h-full"
          />
        )}
      </div>
      
      {/* Right column: Analysis tools & results */}
      <div className="flex flex-col h-full">
        {!documentContent ? (
          <Card className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">Contract Analysis</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Upload a contract document to get started with AI-powered analysis.
            </p>
            <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
              <div className="flex items-center p-4 bg-muted/40 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Document Understanding</h3>
                  <p className="text-xs text-muted-foreground">Extract key information and structure</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-muted/40 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Risk Assessment</h3>
                  <p className="text-xs text-muted-foreground">Identify potential legal issues and risks</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-muted/40 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Clause Extraction</h3>
                  <p className="text-xs text-muted-foreground">Break down and analyze contract structure</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => runAnalysis("general")}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing && analysisType === "general" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    General Analysis
                  </>
                )}
              </Button>
              <Button
                onClick={() => runAnalysis("risk")}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing && analysisType === "risk" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Risk Analysis
                  </>
                )}
              </Button>
              <Button
                onClick={() => runAnalysis("clauses")}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing && analysisType === "clauses" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scale className="mr-2 h-4 w-4" />
                    Extract Clauses
                  </>
                )}
              </Button>
            </div>
            
            {analysisResult && analysisResult.type !== "error" && (
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={openReview}
              >
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Full Contract Review
              </Button>
            )}
            
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
