
import React, { useState, useRef, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Loader2, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  pdfUrl: string;
  className?: string;
  onLoad?: () => void;
}

// An enhanced PDF viewer component with loading state, zoom controls and rotation
export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, className, onLoad }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // For security, validate that this is actually a PDF data URL or URL
  const isPdfUrl = pdfUrl.startsWith('data:application/pdf') || pdfUrl.endsWith('.pdf');
  
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 20, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 20, 60));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);
  
  if (!isPdfUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/20 rounded-md border">
        <p className="text-muted-foreground">Invalid PDF source</p>
      </div>
    );
  }
  
  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {/* PDF controls */}
      <div className="flex items-center justify-between bg-muted/10 p-2 border-b rounded-t-md">
        <div>
          {!isLoading && (
            <div className="text-sm text-muted-foreground">
              {zoom}%
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom out</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom in</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RotateCw className="h-4 w-4" />
            <span className="sr-only">Rotate</span>
          </Button>
        </div>
      </div>
      
      {/* PDF document wrapper */}
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading document...</p>
            </div>
          </div>
        )}
        <div 
          className="w-full h-full overflow-auto"
          style={{
            transform: rotation ? `rotate(${rotation}deg)` : 'none',
            transition: 'transform 0.3s ease'
          }}
        >
          <div 
            style={{ 
              width: zoom !== 100 ? `${zoom}%` : '100%',
              height: zoom !== 100 ? `${zoom}%` : '100%',
              transition: 'width 0.3s ease, height 0.3s ease',
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              title="PDF Document Viewer"
              className="w-full h-full rounded-md border"
              onLoad={() => {
                setIsLoading(false);
                if (onLoad) onLoad();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
