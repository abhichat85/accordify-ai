import React from "react";
import { Image, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileChipsProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export const FileChips: React.FC<FileChipsProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-border/40 bg-muted/5 rounded-t-xl">
      {files.map((file, index) => {
        const isImage = file.type.startsWith("image/");
        const fileSize = formatFileSize(file.size);
        
        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md",
              "bg-muted/40 hover:bg-muted/60 text-xs",
              "border border-border/30 shadow-sm",
              "transition-all duration-200",
              isImage && "bg-primary/5 hover:bg-primary/10 border-primary/20"
            )}
          >
            <span className={cn(
              "flex items-center justify-center h-4 w-4 rounded-sm",
              isImage ? "text-primary" : "text-muted-foreground"
            )}>
              {isImage ? (
                <Image size={12} strokeWidth={2.5} />
              ) : (
                <Paperclip size={12} strokeWidth={2.5} />
              )}
            </span>
            <span className="truncate max-w-[120px] font-medium">{file.name}</span>
            <span className="text-muted-foreground/60 text-[10px]">{fileSize}</span>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground ml-1 hover:bg-muted/80 rounded-full h-4 w-4 flex items-center justify-center transition-colors"
              onClick={() => onRemoveFile(index)}
              aria-label={`Remove file ${file.name}`}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}
