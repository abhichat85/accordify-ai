
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnalysisType, analyzeContract, AnalysisResult } from "@/services/contractAnalysis";

export const useContractAnalysis = () => {
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

  return {
    documentContent,
    setDocumentContent: handleDocumentContent,
    analysisType,
    analysisResult,
    isAnalyzing,
    isReviewOpen,
    setIsReviewOpen,
    runAnalysis,
    openReview
  };
};
