
import React from "react";

interface EditorContentProps {
  viewMode: 'edit' | 'preview';
  content: string;
  setContent: (content: string) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({ viewMode, content, setContent }) => {
  return (
    <div className="flex-grow p-0 overflow-y-auto">
      <div className="h-full">
        {viewMode === 'edit' ? (
          <textarea
            className="w-full h-full p-6 border-none text-sm leading-relaxed focus:outline-none focus:ring-0 bg-card font-mono resize-none styled-scrollbar"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter contract text here..."
          />
        ) : (
          <div className="w-full h-full p-6 overflow-auto styled-scrollbar">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 border border-border/20">
              <div className="prose prose-sm max-w-none">
                {content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 whitespace-pre-line">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
