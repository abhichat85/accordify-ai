
import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Search, AlertCircle, Scale } from "lucide-react";

interface EmptyStateProps {
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ className }) => {
  return (
    <Card className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${className}`}>
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
  );
};
