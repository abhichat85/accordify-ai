
import React from 'react';
import { cn } from "@/lib/utils";

interface PDFViewerProps {
  pdfUrl: string;
  className?: string;
}

// A simple PDF viewer component
export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, className }) => {
  // For security, validate that this is actually a PDF data URL or URL
  const isPdfUrl = pdfUrl.startsWith('data:application/pdf') || pdfUrl.endsWith('.pdf');
  
  if (!isPdfUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/20 rounded-md border">
        <p>Invalid PDF source</p>
      </div>
    );
  }
  
  return (
    <div className={cn("w-full h-full", className)}>
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0`}
        title="PDF Document Viewer"
        className="w-full h-full rounded-md border"
      />
    </div>
  );
};
