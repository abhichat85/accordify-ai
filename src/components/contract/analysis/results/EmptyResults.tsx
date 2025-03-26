
import React from "react";
import { FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyResultsProps {
  isError?: boolean;
  error?: string;
  className?: string;
}

export const EmptyResults: React.FC<EmptyResultsProps> = ({ isError, error, className }) => {
  if (isError) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Analysis Error</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
          {error || "An error occurred during analysis"}
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No Analysis Results</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Upload a contract and run analysis to see insights, risks, and a breakdown of clauses.
      </p>
    </div>
  );
};
