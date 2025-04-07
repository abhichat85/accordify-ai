import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { 
  ChevronDown, ChevronRight, Printer, FileText, Plus, Minus, List, 
  Search, AlertCircle, Check, X, Edit2, Eye, Code, BookOpen, 
  Layers, Bookmark, Info, HelpCircle, GitBranch, Lock, Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Import the CSS styles for the editor
import "./EditorStyles.css";

// Types for legal document structure
interface LegalTerm {
  term: string;
  definition: string;
  occurrences: number[];
}

interface LegalClause {
  id: string;
  title: string;
  content: string;
  type: 'standard' | 'custom' | 'required' | 'optional';
  riskLevel?: 'low' | 'medium' | 'high';
  suggestions?: string[];
  references?: string[];
}

interface DocumentSection {
  id: number;
  level: number;
  title: string;
  content: string[];
  type: 'heading' | 'paragraph' | 'clause' | 'signature' | 'definition';
  parentId: number | null;
  metadata?: {
    clauseType?: 'standard' | 'custom' | 'required' | 'optional';
    riskLevel?: 'low' | 'medium' | 'high';
    hasWarnings?: boolean;
    hasDefinedTerms?: boolean;
    isEditable?: boolean;
    isRequired?: boolean;
  };
}

interface EditorContentProps {
  viewMode: 'edit' | 'preview';
  content: string;
  setContent: (content: string) => void;
  onTextSelection?: (selection: { start: number; end: number; text: string }) => void;
  applyFormatting?: (formattingType: string, params?: Record<string, unknown>) => void;
  contractType?: string;
  documentTitle?: string;
  readOnly?: boolean;
  onSectionChange?: (sectionId: number, newContent: string) => void;
  onDefinedTermClick?: (term: string) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({ 
  viewMode, 
  content, 
  setContent,
  onTextSelection,
  applyFormatting,
  contractType = "Agreement",
  documentTitle = "Legal Agreement",
  readOnly = false,
  onSectionChange,
  onDefinedTermClick
}) => {
  // Basic editor state
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showOutline, setShowOutline] = useState(true);
  const [foldedSections, setFoldedSections] = useState<number[]>([]);
  
  // Advanced editor state
  const [activeTab, setActiveTab] = useState<'document' | 'outline' | 'terms' | 'issues'>('document');
  const [definedTerms, setDefinedTerms] = useState<LegalTerm[]>([]);
  const [documentIssues, setDocumentIssues] = useState<{id: number, section: number, type: string, message: string, severity: 'low' | 'medium' | 'high'}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDefinedTerms, setShowDefinedTerms] = useState(true);
  const [showRiskHighlighting, setShowRiskHighlighting] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [editorMode, setEditorMode] = useState<'rich' | 'code'>('rich');
  const [isComparing, setIsComparing] = useState(false);
  const [showComments, setShowComments] = useState(true);
  
  // Regular expressions for legal document parsing - wrapped in useMemo to avoid dependency issues
  const DEFINED_TERM_REGEX = useMemo(() => 
    /\b([A-Z][A-Za-z]*(?:\s+[A-Z][A-Za-z]*)*)\b(?!\s*:)(?=\s|$|[.,;)])/g, 
  []);
  
  const DEFINITION_SECTION_REGEX = useMemo(() => 
    /^#+\s*(?:Definitions|Defined Terms|Interpretation)/i,
  []);
  
  const DEFINED_TERM_WITH_QUOTES_REGEX = useMemo(() => 
    /"([^"]+)"\s+(?:means|shall mean|refers to|is defined as)/g,
  []);
  
  const LEGAL_REFERENCE_REGEX = useMemo(() => 
    /(?:Section|Article|Clause|Paragraph|Schedule|Exhibit|Appendix)\s+\d+(?:\.\d+)*(?:\([a-z]\))?/g,
  []);
  
  const RISK_PHRASES = useMemo(() => [
    'shall not be liable', 'no liability', 'without limitation', 'to the fullest extent', 
    'in no event', 'sole discretion', 'notwithstanding anything', 'time is of the essence',
    'material breach', 'immediately terminate', 'indemnify and hold harmless'
  ], []);

  // Detect the type of section based on content
  const detectSectionType = useCallback((content: string, inDefinitionSection: boolean): DocumentSection['type'] => {
    if (inDefinitionSection && content.match(DEFINED_TERM_WITH_QUOTES_REGEX)) {
      return 'definition';
    }
    
    if (content.toLowerCase().includes('signature') || 
        content.toLowerCase().includes('executed') || 
        content.toLowerCase().includes('signed by')) {
      return 'signature';
    }
    
    // Check if it looks like a legal clause
    if (content.match(/^\d+\.\d+/) || // Numbered clause like 1.1
        content.match(/^\([a-z]\)/) || // Lettered clause like (a)
        content.match(/^[A-Z][A-Za-z\s]+\./) || // Capitalized sentence ending with period
        content.includes('shall') || 
        content.includes('agrees to') ||
        content.includes('represents and warrants')) {
      return 'clause';
    }
    
    return 'paragraph';
  }, [DEFINED_TERM_WITH_QUOTES_REGEX]);

  // Generate metadata for a section based on content and type
  const generateSectionMetadata = useCallback((content: string, type: DocumentSection['type']) => {
    const metadata: DocumentSection['metadata'] = {
      isEditable: !readOnly
    };
    
    // Detect risk level based on content
    if (type === 'clause') {
      const riskPhraseMatches = RISK_PHRASES.filter(phrase => 
        content.toLowerCase().includes(phrase.toLowerCase())
      );
      
      if (riskPhraseMatches.length > 2) {
        metadata.riskLevel = 'high';
      } else if (riskPhraseMatches.length > 0) {
        metadata.riskLevel = 'medium';
      } else {
        metadata.riskLevel = 'low';
      }
      
      // Determine if clause is standard or custom
      if (content.includes('standard') || content.includes('usual') || content.includes('customary')) {
        metadata.clauseType = 'standard';
      } else {
        metadata.clauseType = 'custom';
      }
      
      // Check if clause has defined terms
      metadata.hasDefinedTerms = DEFINED_TERM_REGEX.test(content);
      
      // Reset regex lastIndex
      DEFINED_TERM_REGEX.lastIndex = 0;
    }
    
    return metadata;
  }, [readOnly, RISK_PHRASES, DEFINED_TERM_REGEX]);

  // Parse content into structured sections with enhanced legal document awareness
  const parseContentStructure = useCallback((rawContent: string): DocumentSection[] => {
    const lines = rawContent.split('\n');
    const structure: DocumentSection[] = [];
    
    let currentSectionId = 0;
    let currentHeadingId: number | null = null;
    let buffer: string[] = [];
    let inDefinitionSection = false;
    
    // First pass: Create basic structure
    lines.forEach((line, index) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      // Check if we're entering a definitions section
      if (headingMatch && DEFINITION_SECTION_REGEX.test(line)) {
        inDefinitionSection = true;
      } else if (headingMatch && inDefinitionSection) {
        // If we find another heading after definitions, we're no longer in definitions
        inDefinitionSection = false;
      }
      
      if (headingMatch) {
        // If we have content in buffer, add it as a paragraph section
        if (buffer.length > 0) {
          const sectionType = detectSectionType(buffer.join('\n'), inDefinitionSection);
          const metadata = generateSectionMetadata(buffer.join('\n'), sectionType);
          
          structure.push({
            id: currentSectionId++,
            level: currentHeadingId !== null ? structure[currentHeadingId].level + 1 : 1,
            title: '',
            content: [...buffer],
            type: sectionType,
            parentId: currentHeadingId,
            metadata
          });
          buffer = [];
        }
        
        const level = headingMatch[1].length;
        const title = headingMatch[2];
        
        // Add the heading section
        structure.push({
          id: currentSectionId,
          level,
          title,
          content: [line],
          type: 'heading',
          parentId: null, // Will update parent relationships later
          metadata: {
            isRequired: true,
            isEditable: !readOnly
          }
        });
        
        currentHeadingId = currentSectionId;
        currentSectionId++;
      } else if (line.trim() === '') {
        if (buffer.length > 0) {
          buffer.push(line);
        }
      } else {
        buffer.push(line);
      }
    });
    
    // Add any remaining content in buffer
    if (buffer.length > 0) {
      const sectionType = detectSectionType(buffer.join('\n'), inDefinitionSection);
      const metadata = generateSectionMetadata(buffer.join('\n'), sectionType);
      
      structure.push({
        id: currentSectionId++,
        level: currentHeadingId !== null ? structure[currentHeadingId].level + 1 : 1,
        title: '',
        content: [...buffer],
        type: sectionType,
        parentId: currentHeadingId,
        metadata
      });
    }
    
    // Update parent relationships for headings
    const headingStack: number[] = [];
    structure.forEach((section) => {
      if (section.type === 'heading') {
        // Pop stack until we find a heading with level less than current
        while (
          headingStack.length > 0 && 
          structure[headingStack[headingStack.length - 1]].level >= section.level
        ) {
          headingStack.pop();
        }
        
        // Set parent to top of stack
        if (headingStack.length > 0) {
          section.parentId = headingStack[headingStack.length - 1];
        }
        
        // Push current heading to stack
        headingStack.push(section.id);
      }
    });
    
    return structure;
  }, [readOnly, DEFINITION_SECTION_REGEX, detectSectionType, generateSectionMetadata]);

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

  // Extract defined terms from the document
  const extractDefinedTerms = useCallback((structure: DocumentSection[]): LegalTerm[] => {
    const terms: LegalTerm[] = [];
    const definitionSections = structure.filter(section => 
      section.type === 'definition' || 
      (section.parentId !== null && 
       structure[section.parentId].title.match(/definitions|defined terms|interpretation/i))
    );
    
    // Extract terms from definition sections
    definitionSections.forEach(section => {
      const content = section.content.join('\n');
      let match;
      
      // Look for quoted terms with definitions
      DEFINED_TERM_WITH_QUOTES_REGEX.lastIndex = 0;
      while ((match = DEFINED_TERM_WITH_QUOTES_REGEX.exec(content)) !== null) {
        const term = match[1];
        const definition = content.substring(match.index + match[0].length).split('.')[0].trim() + '.';
        
        terms.push({
          term,
          definition,
          occurrences: []
        });
      }
      
      // Look for capitalized terms
      const capitalizedTerms = content.match(DEFINED_TERM_REGEX);
      if (capitalizedTerms) {
        capitalizedTerms.forEach(term => {
          if (!terms.some(t => t.term === term)) {
            const termIndex = content.indexOf(term);
            const followingText = content.substring(termIndex + term.length).split('.')[0].trim() + '.';
            
            terms.push({
              term,
              definition: followingText,
              occurrences: []
            });
          }
        });
      }
    });
    
    // Find occurrences of terms in the document
    structure.forEach(section => {
      if (section.type !== 'definition') {
        const content = section.content.join('\n');
        
        terms.forEach(term => {
          const regex = new RegExp(`\\b${term.term}\\b`, 'g');
          let match;
          
          while ((match = regex.exec(content)) !== null) {
            term.occurrences.push(match.index);
          }
        });
      }
    });
    
    return terms;
  }, [DEFINED_TERM_REGEX, DEFINED_TERM_WITH_QUOTES_REGEX]);

  // Identify potential issues in the document
  const identifyDocumentIssues = useCallback((structure: DocumentSection[], terms: LegalTerm[]): {id: number, section: number, type: string, message: string, severity: 'low' | 'medium' | 'high'}[] => {
    const issues: {id: number, section: number, type: string, message: string, severity: 'low' | 'medium' | 'high'}[] = [];
    let issueId = 0;
    
    // Check for undefined terms
    structure.forEach(section => {
      if (section.type === 'clause' || section.type === 'paragraph') {
        const content = section.content.join('\n');
        let match;
        
        // Find capitalized terms that might be defined terms
        DEFINED_TERM_REGEX.lastIndex = 0;
        while ((match = DEFINED_TERM_REGEX.exec(content)) !== null) {
          const potentialTerm = match[1];
          
          // Check if this term is in our defined terms list
          if (!terms.some(term => term.term === potentialTerm)) {
            issues.push({
              id: issueId++,
              section: section.id,
              type: 'undefined_term',
              message: `"${potentialTerm}" appears to be used as a defined term but is not defined in the document.`,
              severity: 'medium'
            });
          }
        }
        
        // Check for ambiguous language
        if (content.includes('reasonable') || 
            content.includes('promptly') || 
            content.includes('substantial') || 
            content.includes('material') ||
            content.includes('appropriate')) {
          issues.push({
            id: issueId++,
            section: section.id,
            type: 'ambiguous_language',
            message: 'This section contains potentially ambiguous language that could be clarified.',
            severity: 'low'
          });
        }
        
        // Check for high-risk language
        if (section.metadata?.riskLevel === 'high') {
          issues.push({
            id: issueId++,
            section: section.id,
            type: 'high_risk_clause',
            message: 'This clause contains high-risk language that may need review.',
            severity: 'high'
          });
        }
      }
    });
    
    return issues;
  }, [DEFINED_TERM_REGEX]);

  // Format a paragraph with enhanced legal syntax highlighting
  const formatParagraph = useCallback((paragraph: string) => {
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
    
    // Legal references: Section X.X, Article X, etc.
    if (showDefinedTerms) {
      formattedParagraph = formattedParagraph.replace(
        LEGAL_REFERENCE_REGEX,
        match => `<span class="legal-reference">${match}</span>`
      );
    }
    
    // Defined terms: Capitalized Terms
    if (showDefinedTerms) {
      // Reset regex lastIndex
      DEFINED_TERM_REGEX.lastIndex = 0;
      
      // Create a map of terms and their definitions
      const termMap = new Map(definedTerms.map(term => [term.term, term.definition]));
      
      // Replace defined terms with highlighted spans
      formattedParagraph = formattedParagraph.replace(
        DEFINED_TERM_REGEX,
        (match) => {
          if (termMap.has(match)) {
            return `<span class="defined-term" data-term="${match}" data-definition="${termMap.get(match)}">${match}</span>`;
          }
          return match;
        }
      );
    }
    
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
    
    // Risk phrases highlighting
    if (showRiskHighlighting) {
      RISK_PHRASES.forEach(phrase => {
        const phraseRegex = new RegExp(`(${phrase})`, 'gi');
        formattedParagraph = formattedParagraph.replace(
          phraseRegex,
          '<span class="risk-phrase">$1</span>'
        );
      });
    }
    
    // Headings: # Heading 1, ## Heading 2
    if (formattedParagraph.startsWith('# ')) {
      formattedParagraph = `<h1 class="text-2xl font-semibold mb-4 text-primary">${formattedParagraph.substring(2)}</h1>`;
    } else if (formattedParagraph.startsWith('## ')) {
      formattedParagraph = `<h2 class="text-xl font-semibold mb-3 text-primary-foreground">${formattedParagraph.substring(3)}</h2>`;
    } else if (formattedParagraph.startsWith('### ')) {
      formattedParagraph = `<h3 class="text-lg font-medium mb-2">${formattedParagraph.substring(4)}</h3>`;
    } else if (formattedParagraph.startsWith('#### ')) {
      formattedParagraph = `<h4 class="text-base font-medium mb-2">${formattedParagraph.substring(5)}</h4>`;
    }
    
    return formattedParagraph;
  }, [DEFINED_TERM_REGEX, LEGAL_REFERENCE_REGEX, RISK_PHRASES, definedTerms, showDefinedTerms, showRiskHighlighting]);

  // Handle editing a specific section
  const handleSectionEdit = (section: DocumentSection, newText: string) => {
    const newContent = [...parsedContent];
    newContent[section.id].content = newText.split('\n');
    
    // Reconstruct the content
    const updatedContent = newContent.map(section => section.content.join('\n')).join('\n');
    setContent(updatedContent);
    
    // Call the onSectionChange callback if provided
    if (onSectionChange) {
      onSectionChange(section.id, newText);
    }
  };

  // Toggle folding for a section
  const toggleFoldSection = (sectionId: number) => {
    setFoldedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Scroll to a specific section
  const scrollToSection = (sectionId: number) => {
    const sectionElement = document.getElementById(`section-${sectionId}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      
      // Expand all parent sections if they're folded
      let currentSection = parsedContent.find(s => s.id === sectionId);
      while (currentSection && currentSection.parentId !== null) {
        if (foldedSections.includes(currentSection.parentId)) {
          setFoldedSections(prev => prev.filter(id => id !== currentSection!.parentId));
        }
        currentSection = parsedContent.find(s => s.id === currentSection!.parentId);
      }
    }
  };

  // Find child sections for a given parent
  const getChildSections = (parentId: number | null) => {
    return parsedContent.filter(section => section.parentId === parentId);
  };

  // Check if a section has children
  const hasChildren = (sectionId: number) => {
    return parsedContent.some(section => section.parentId === sectionId);
  };

  // Handle clicking on a defined term
  const handleDefinedTermClick = (term: string) => {
    if (onDefinedTermClick) {
      onDefinedTermClick(term);
    } else {
      // Find the term in our list
      const termObj = definedTerms.find(t => t.term === term);
      if (termObj) {
        // Show a tooltip or popup with the definition
        alert(`${term}: ${termObj.definition}`);
      }
    }
  };

  // Handle search in document
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Find sections that contain the search query
    const matchingSections = parsedContent.filter(section => {
      const content = section.content.join('\n');
      return content.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    if (matchingSections.length > 0) {
      // Scroll to the first matching section
      scrollToSection(matchingSections[0].id);
      
      // Highlight the matching text (this would require more complex DOM manipulation)
      // For now, just focus on the section
    } else {
      alert('No matches found');
    }
  };

  // Render a section recursively with its children
  const renderSection = (section: DocumentSection) => {
    const isFolded = foldedSections.includes(section.id);
    const children = getChildSections(section.id);
    const hasIssues = documentIssues.some(issue => issue.section === section.id);
    const sectionRiskLevel = section.metadata?.riskLevel;
    
    return (
      <div 
        key={section.id}
        id={`section-${section.id}`}
        className={`mb-2 relative transition-all duration-200 ease-in-out text-left ${
          section.type === 'heading' ? 'mt-4' : ''
        }`}
      >
        <div 
          className={cn(
            `group relative p-2 rounded-md transition-all`,
            hoveredSection === section.id ? 'bg-muted/30' : '',
            activeSection === section.id ? 'bg-muted/50' : '',
            section.type === 'heading' ? 'font-semibold' : '',
            sectionRiskLevel === 'high' && showRiskHighlighting ? 'border-l-2 border-destructive' : '',
            sectionRiskLevel === 'medium' && showRiskHighlighting ? 'border-l-2 border-yellow-500' : '',
            hasIssues && showRiskHighlighting ? 'border-r-2 border-yellow-500' : ''
          )}
          onMouseEnter={() => setHoveredSection(section.id)}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => {
            if (section.type === 'heading' && hasChildren(section.id)) {
              toggleFoldSection(section.id);
            } else if (section.metadata?.isEditable && !readOnly) {
              setActiveSection(section.id);
            }
          }}
        >
          {section.type === 'heading' && hasChildren(section.id) && (
            <button
              className="absolute left-[-20px] top-3 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                toggleFoldSection(section.id);
              }}
            >
              {isFolded ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          
          {/* Risk level indicator */}
          {sectionRiskLevel && showRiskHighlighting && (
            <div className="absolute right-[-25px] top-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {sectionRiskLevel === 'high' && (
                        <AlertCircle size={16} className="text-destructive" />
                      )}
                      {sectionRiskLevel === 'medium' && (
                        <AlertCircle size={16} className="text-yellow-500" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {sectionRiskLevel === 'high' ? 'High risk clause' : 'Medium risk clause'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          {/* Section issues indicator */}
          {hasIssues && showRiskHighlighting && (
            <div className="absolute right-[-45px] top-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Info size={16} className="text-yellow-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="font-semibold mb-1">Issues in this section:</p>
                      <ul className="list-disc pl-4">
                        {documentIssues
                          .filter(issue => issue.section === section.id)
                          .map(issue => (
                            <li key={issue.id} className="text-xs">
                              {issue.message}
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          {activeSection === section.id && !readOnly ? (
            <textarea
              autoFocus
              className="w-full p-2 border border-primary/30 rounded bg-background/80 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary font-jost resize-none min-h-[100px] text-left"
              value={section.content.join('\n')}
              onChange={(e) => handleSectionEdit(section, e.target.value)}
              onBlur={() => setActiveSection(null)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setActiveSection(null);
                }
              }}
            />
          ) : (
            <div 
              className="whitespace-pre-line cursor-text text-left"
              dangerouslySetInnerHTML={{ 
                __html: section.content.map(line => formatParagraph(line)).join('<br/>') 
              }}
              onClick={(e) => {
                // Handle clicks on defined terms
                if ((e.target as HTMLElement).classList.contains('defined-term')) {
                  const term = (e.target as HTMLElement).getAttribute('data-term');
                  if (term) {
                    handleDefinedTermClick(term);
                  }
                }
              }}
            />
          )}
          
          {(hoveredSection === section.id || activeSection === section.id) && !readOnly && section.metadata?.isEditable && (
            <div className="absolute top-1 right-1 flex gap-1 bg-background/80 rounded-md shadow-sm">
              <button 
                className="p-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection(section.id);
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        
        {!isFolded && children.length > 0 && (
          <div className="pl-4 border-l border-border/30 ml-2 mt-1">
            {children.map(childSection => renderSection(childSection))}
          </div>
        )}
      </div>
    );
  };

  // Render the table of contents
  const renderTableOfContents = () => {
    return (
      <div className="contract-outline bg-muted/10 p-4 rounded-md mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
          <FileText size={16} className="mr-1" />
          Table of Contents
        </h3>
        <div className="text-sm">
          {parsedContent.filter(section => section.type === 'heading').map(heading => (
            <div
              key={heading.id}
              className={`
                pl-${(heading.level - 1) * 4} py-1 hover:bg-muted/30 rounded cursor-pointer
                ${heading.level === 1 ? 'font-medium' : ''}
              `}
              onClick={() => scrollToSection(heading.id)}
            >
              {heading.title}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the defined terms panel
  const renderDefinedTermsPanel = () => {
    return (
      <div className="defined-terms-panel bg-muted/10 p-4 rounded-md mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
          <Bookmark size={16} className="mr-1" />
          Defined Terms
        </h3>
        {definedTerms.length > 0 ? (
          <div className="text-sm">
            {definedTerms.map((term, index) => (
              <div 
                key={index} 
                className="mb-2 pb-2 border-b border-border/30 last:border-0"
              >
                <div className="font-medium">{term.term}</div>
                <div className="text-xs text-muted-foreground">{term.definition}</div>
                <div className="text-xs mt-1">
                  <span className="text-primary">
                    {term.occurrences.length} {term.occurrences.length === 1 ? 'occurrence' : 'occurrences'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No defined terms found in this document.</div>
        )}
      </div>
    );
  };

  // Render the issues panel
  const renderIssuesPanel = () => {
    return (
      <div className="issues-panel bg-muted/10 p-4 rounded-md mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
          <AlertCircle size={16} className="mr-1" />
          Document Issues
        </h3>
        {documentIssues.length > 0 ? (
          <div className="text-sm">
            {documentIssues.map(issue => (
              <div 
                key={issue.id} 
                className={`
                  mb-2 pb-2 border-b border-border/30 last:border-0 cursor-pointer
                  ${issue.severity === 'high' ? 'border-l-2 border-destructive pl-2' : ''}
                  ${issue.severity === 'medium' ? 'border-l-2 border-yellow-500 pl-2' : ''}
                  ${issue.severity === 'low' ? 'border-l-2 border-muted-foreground pl-2' : ''}
                `}
                onClick={() => scrollToSection(issue.section)}
              >
                <div className="font-medium flex items-center">
                  {issue.severity === 'high' && <AlertCircle size={12} className="text-destructive mr-1" />}
                  {issue.severity === 'medium' && <AlertCircle size={12} className="text-yellow-500 mr-1" />}
                  {issue.severity === 'low' && <AlertCircle size={12} className="text-muted-foreground mr-1" />}
                  {issue.type.replace('_', ' ')}
                </div>
                <div className="text-xs text-muted-foreground">{issue.message}</div>
                <div className="text-xs mt-1">
                  <span 
                    className="text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToSection(issue.section);
                    }}
                  >
                    Go to section
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No issues found in this document.</div>
        )}
      </div>
    );
  };

  // Parse content for structure
  const parsedContent = useMemo(() => parseContentStructure(content), [content, parseContentStructure]);
  
  // Extract defined terms
  const extractedTerms = useMemo(() => extractDefinedTerms(parsedContent), [parsedContent, extractDefinedTerms]);
  
  // Set defined terms in state
  useEffect(() => {
    setDefinedTerms(extractedTerms);
  }, [extractedTerms]);
  
  // Identify document issues
  useEffect(() => {
    const issues = identifyDocumentIssues(parsedContent, definedTerms);
    setDocumentIssues(issues);
  }, [parsedContent, definedTerms, identifyDocumentIssues]);

  // Get the root level sections (those with no parent)
  const rootSections = parsedContent.filter(section => section.parentId === null);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top toolbar */}
      <div className="flex justify-between items-center p-2 mb-2 border-b">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOutline(!showOutline)}
                >
                  <List size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showOutline ? 'Hide Sidebar' : 'Show Sidebar'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex items-center gap-1">
            <Button
              variant={editorMode === 'rich' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('rich')}
            >
              <Edit2 size={16} />
            </Button>
            <Button
              variant={editorMode === 'code' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('code')}
            >
              <Code size={16} />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search document..."
              className="h-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearch}
            >
              <Search size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.max(zoom - 10, 50))}
                >
                  <Minus size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <span className="text-xs text-muted-foreground">{zoom}%</span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.min(zoom + 10, 150))}
                >
                  <Plus size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Separator orientation="vertical" className="h-6" />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.print()}
                >
                  <Printer size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print Contract</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <HelpCircle size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Contract IDE Features</h4>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <ChevronDown size={12} />
                    <span>Expand/collapse sections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={12} className="text-destructive" />
                    <span>High risk clauses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">Term</span>
                    <span>Click on defined terms to see definitions</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-defined-terms" className="text-xs">Show defined terms</Label>
                  <Switch 
                    id="show-defined-terms" 
                    checked={showDefinedTerms}
                    onCheckedChange={setShowDefinedTerms}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-risk-highlighting" className="text-xs">Show risk highlighting</Label>
                  <Switch 
                    id="show-risk-highlighting" 
                    checked={showRiskHighlighting}
                    onCheckedChange={setShowRiskHighlighting}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-line-numbers" className="text-xs">Show line numbers</Label>
                  <Switch 
                    id="show-line-numbers" 
                    checked={showLineNumbers}
                    onCheckedChange={setShowLineNumbers}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-grow h-full overflow-hidden">
        {/* Sidebar */}
        {showOutline && (
          <div className="w-1/4 border-r pr-2 overflow-y-auto">
            <ScrollArea className="h-full">
              <Tabs defaultValue="outline" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="outline" className="flex-1">Outline</TabsTrigger>
                  <TabsTrigger value="terms" className="flex-1">Terms</TabsTrigger>
                  <TabsTrigger value="issues" className="flex-1">Issues</TabsTrigger>
                </TabsList>
                <TabsContent value="outline">
                  {renderTableOfContents()}
                </TabsContent>
                <TabsContent value="terms">
                  {renderDefinedTermsPanel()}
                </TabsContent>
                <TabsContent value="issues">
                  {renderIssuesPanel()}
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </div>
        )}
        
        {/* Document content */}
        <div className={`${showOutline ? 'w-3/4' : 'w-full'} h-full overflow-y-auto pl-2`}>
          <ScrollArea className="h-full">
            <div 
              className="max-w-4xl mx-auto contract-document" 
              style={{ zoom: `${zoom}%` }}
            >
              <div className="bg-white rounded-lg shadow-sm p-8 border border-border/20 min-h-[1100px]">
                {/* Document title */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-primary">{documentTitle}</h1>
                  <div className="text-sm text-muted-foreground mt-2">{contractType}</div>
                </div>
                
                {/* Document content */}
                <div className="prose prose-sm max-w-none contract-preview font-jost text-left">
                  {editorMode === 'rich' ? (
                    rootSections.map(section => renderSection(section))
                  ) : (
                    <textarea
                      className="w-full h-[calc(100vh-300px)] p-4 border border-border rounded font-mono text-sm"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      readOnly={readOnly}
                    />
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
