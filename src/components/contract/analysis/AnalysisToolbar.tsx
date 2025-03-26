
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Search, Scale, FileText, Sparkles } from "lucide-react";
import { AnalysisType } from "@/services/contractAnalysis";

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
  return (
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
    </>
  );
};
