
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Loader2, ZoomIn, ZoomOut, RotateCw, Download, Fullscreen, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  pdfUrl: string;
  className?: string;
  onLoad?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
}

// An enhanced PDF viewer component with loading state, zoom controls, rotation and fullscreen
export const PDFViewer: React.FC<PDFViewerProps> = ({ 
  pdfUrl, 
  className, 
  onLoad,
  onMaximize,
  isMaximized = false 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // For security, validate that this is actually a PDF data URL or URL
  const isPdfUrl = pdfUrl.startsWith('data:application/pdf') || pdfUrl.endsWith('.pdf');

  useEffect(() => {
    // Reset zoom and rotation when PDF changes
    setZoom(100);
    setRotation(0);
    setIsLoading(true);
  }, [pdfUrl]);
  
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 20, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 20, 60));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);
  
  const handleMaximize = useCallback(() => {
    if (onMaximize) onMaximize();
  }, [onMaximize]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    if (onLoad) onLoad();
  }, [onLoad]);
  
  if (!isPdfUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/20 rounded-md border">
        <p className="text-muted-foreground">Invalid PDF source</p>
      </div>
    );
  }
  
  return (
    <div className={cn("w-full h-full flex flex-col", className)} ref={containerRef}>
      {/* PDF controls */}
      <div className="flex items-center justify-between bg-muted/10 px-3 py-2 border-b rounded-t-md">
        <div className="flex items-center">
          {!isLoading && (
            <div className="text-sm text-muted-foreground font-medium px-2">
              {zoom}%
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
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
          {onMaximize && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMaximize}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              {isMaximized ? <Maximize2 className="h-4 w-4 transform rotate-180" /> : <Maximize2 className="h-4 w-4" />}
              <span className="sr-only">{isMaximized ? "Exit Fullscreen" : "Fullscreen"}</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* PDF document wrapper with improved layout */}
      <div className="relative flex-1 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading document...</p>
            </div>
          </div>
        )}
        
        {/* Main PDF display container with improved styling */}
        <div 
          className="w-full h-full overflow-auto bg-muted/10"
          style={{
            transform: rotation ? `rotate(${rotation}deg)` : 'none',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* PDF content with proper scaling */}
          <div 
            className={cn(
              "min-h-full", 
              rotation === 90 || rotation === 270 ? "flex items-center justify-center" : ""
            )}
            style={{ 
              width: zoom !== 100 ? `${zoom}%` : '100%',
              minWidth: '100%', // Ensure it's at least 100% to avoid shrinking smaller than container
              height: rotation === 90 || rotation === 270 ? 'auto' : (zoom !== 100 ? `${zoom}%` : '100%'),
              transition: 'width 0.3s ease, height 0.3s ease',
            }}
          >
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              title="PDF Document Viewer"
              className="w-full h-full bg-white rounded-md border shadow-md"
              style={{ 
                minHeight: '100%',
                display: 'block'
              }}
              onLoad={handleIframeLoad}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
