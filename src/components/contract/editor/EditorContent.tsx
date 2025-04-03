import React, { useRef, useEffect, useState } from "react";

interface EditorContentProps {
  viewMode: 'edit' | 'preview';
  content: string;
  setContent: (content: string) => void;
  onTextSelection?: (selection: { start: number; end: number; text: string }) => void;
  applyFormatting?: (formattingType: string, params?: Record<string, unknown>) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({ 
  viewMode, 
  content, 
  setContent,
  onTextSelection,
  applyFormatting
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  // Handle text selection in the editor
  const handleTextSelection = () => {
    if (!textareaRef.current || !onTextSelection) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = content.substring(start, end);
    
    onTextSelection({ start, end, text });
  };

  // Focus method to be called from parent
  const focusEditor = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Expose the focus method to the parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Window & typeof globalThis & { focusContractEditor: () => void }).focusContractEditor = focusEditor;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as Window & typeof globalThis & { focusContractEditor?: () => void }).focusContractEditor;
      }
    };
  }, []);

  // Split content into paragraphs
  const paragraphs = content.split('\n\n');

  // Format a paragraph with markdown-like syntax
  const formatParagraph = (paragraph: string) => {
    let formattedParagraph = paragraph;
    
    // Bold: **text** or __text__
    formattedParagraph = formattedParagraph.replace(
      /(\*\*|__)(.*?)\1/g, 
      '<strong>$2</strong>'
    );
    
    // Italic: *text* or _text_
    formattedParagraph = formattedParagraph.replace(
      /(\*|_)(.*?)\1/g, 
      '<em>$2</em>'
    );
    
    // Underline: ++text++
    formattedParagraph = formattedParagraph.replace(
      /\+\+(.*?)\+\+/g, 
      '<u>$1</u>'
    );
    
    // Variables: [VARIABLE_NAME] - enhanced with theme-specific purple highlight
    formattedParagraph = formattedParagraph.replace(
      /\[(.*?)\]/g, 
      '<span class="variable-highlight">[$1]</span>'
    );
    
    // Variables: {{variable}} - enhanced with theme-specific purple highlight
    formattedParagraph = formattedParagraph.replace(
      /\{\{([^{}]+)\}\}/g, 
      '<span class="variable-highlight">{{$1}}</span>'
    );
    
    // Headings: # Heading 1, ## Heading 2
    if (formattedParagraph.startsWith('# ')) {
      formattedParagraph = `<h1>${formattedParagraph.substring(2)}</h1>`;
    } else if (formattedParagraph.startsWith('## ')) {
      formattedParagraph = `<h2>${formattedParagraph.substring(3)}</h2>`;
    }
    
    return formattedParagraph;
  };

  // Handle editing a specific section
  const handleSectionEdit = (index: number, newText: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = newText;
    setContent(newParagraphs.join('\n\n'));
  };

  // Combined editing and preview experience
  return (
    <div className="flex-grow h-full overflow-y-auto">
      <div className="w-full h-full px-[60px] overflow-auto styled-scrollbar">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 border border-border/20">
          <div className="prose prose-sm max-w-none contract-preview font-jost text-left">
            {paragraphs.map((paragraph, index) => (
              <div 
                key={index}
                className={`mb-4 relative transition-all duration-200 ease-in-out text-left
                  ${hoveredSection === index ? 'bg-muted/30 rounded' : ''}
                  ${activeSection === index ? 'bg-muted/50 rounded' : ''}`}
                onMouseEnter={() => setHoveredSection(index)}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={() => setActiveSection(index)}
              >
                {activeSection === index ? (
                  <textarea
                    autoFocus
                    className="w-full p-2 border border-primary/30 rounded bg-background/80 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary font-jost resize-none min-h-[100px] text-left"
                    value={paragraph}
                    onChange={(e) => handleSectionEdit(index, e.target.value)}
                    onBlur={() => setActiveSection(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setActiveSection(null);
                      }
                    }}
                  />
                ) : (
                  <div 
                    className="whitespace-pre-line p-2 cursor-text text-left"
                    dangerouslySetInnerHTML={{ __html: formatParagraph(paragraph) }}
                  />
                )}
                {hoveredSection === index && activeSection !== index && (
                  <div className="absolute top-1 right-1 bg-background/80 rounded-md shadow-sm">
                    <button 
                      className="p-1 text-xs text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSection(index);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
            {/* Add new paragraph button */}
            <button
              className="w-full py-2 border border-dashed border-border hover:border-primary/50 rounded-md text-muted-foreground hover:text-primary text-sm transition-colors"
              onClick={() => {
                const newParagraphs = [...paragraphs, ''];
                setContent(newParagraphs.join('\n\n'));
                setActiveSection(newParagraphs.length - 1);
              }}
            >
              + Add new paragraph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
