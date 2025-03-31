
import React from "react";
import { Image, Paperclip } from "lucide-react";

interface FileChipsProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export const FileChips: React.FC<FileChipsProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-border/40">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 text-xs"
        >
          {file.type.startsWith("image/") ? (
            <Image size={12} />
          ) : (
            <Paperclip size={12} />
          )}
          <span className="truncate max-w-[120px]">{file.name}</span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onRemoveFile(index)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
