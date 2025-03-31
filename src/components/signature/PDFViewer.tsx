
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string;
  className?: string;
  onLoad?: () => void;
}

// An enhanced PDF viewer component with loading state
export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, className, onLoad }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // For security, validate that this is actually a PDF data URL or URL
  const isPdfUrl = pdfUrl.startsWith('data:application/pdf') || pdfUrl.endsWith('.pdf');
  
  if (!isPdfUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/20 rounded-md border">
        <p className="text-muted-foreground">Invalid PDF source</p>
      </div>
    );
  }
  
  return (
    <div className={cn("w-full h-full relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Loading document...</p>
          </div>
        </div>
      )}
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0`}
        title="PDF Document Viewer"
        className="w-full h-full rounded-md border"
        onLoad={() => {
          setIsLoading(false);
          if (onLoad) onLoad();
        }}
      />
    </div>
  );
};
