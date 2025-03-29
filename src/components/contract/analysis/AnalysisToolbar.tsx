import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Search, Scale, FileText, Sparkles } from "lucide-react";
import { AnalysisType } from "@/services/contractAnalysis";
import { useToast } from "@/hooks/use-toast";
import { setChatInputValue } from "@/utils/chatInputUtils";

interface AnalysisToolbarProps {
  documentContent: string;
  analysisType: AnalysisType;
  isAnalyzing: boolean;
  analysisResult: any;
  runAnalysis: (type: AnalysisType) => void;
  openReview: () => void;
}

export const AnalysisToolbar: React.FC<AnalysisToolbarProps> = ({
  documentContent,
  analysisType,
  isAnalyzing,
  analysisResult,
  runAnalysis,
  openReview,
}) => {
  const { toast } = useToast();

  const handleRunAnalysis = (type: AnalysisType) => {
    // Run the analysis
    runAnalysis(type);

    console.log("Running analysis type:", type);
    
    // Also populate the chat
    let prompt = "";
    switch (type) {
      case "general":
        prompt = "Please analyze this contract and provide a general overview of its structure, key terms, and any notable features.";
        break;
      case "risk":
        prompt = "Please perform a risk analysis on this contract. Identify any high, medium, or low risk clauses, explain why they pose a risk, and suggest mitigations.";
        break;
      case "clauses":
        prompt = "Please extract and categorize all important clauses from this contract, highlighting any unusual or missing standard clauses.";
        break;
    }

    if (prompt) {
      console.log("Setting prompt:", prompt);
      const success = setChatInputValue(prompt);
      
      if (success) {
        toast({
          title: "Analysis prompt ready",
          description: "Press Enter to send the prompt to the AI assistant.",
        });
      } else {
        toast({
          title: "Chat not available",
          description: "Please make sure the chat panel is visible.",
          variant: "destructive"
        });
      }
      
      console.log("Set prompt success:", success);
    }
  };

  const handleOpenReview = () => {
    openReview();
    
    // Also populate the chat with a full review prompt
    const prompt = "Based on the contract analysis results, please provide a comprehensive review highlighting key issues, risks, and suggesting specific improvements.";
    
    const success = setChatInputValue(prompt);
      
    if (success) {
      toast({
        title: "Review prompt ready",
        description: "Press Enter to send the prompt to the AI assistant.",
      });
    } else {
      toast({
        title: "Chat not available",
        description: "Please make sure the chat panel is visible.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <Button
          onClick={() => handleRunAnalysis("general")}
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
          onClick={() => handleRunAnalysis("risk")}
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
          onClick={() => handleRunAnalysis("clauses")}
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
          onClick={handleOpenReview}
        >
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          Full Contract Review
        </Button>
      )}
    </>
  );
};
