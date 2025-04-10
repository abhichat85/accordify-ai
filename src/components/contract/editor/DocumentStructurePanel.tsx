import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText,
  Eye,
  EyeOff,
  AlignCenter,
  Heading1,
  Heading2,
  Heading3,
  Hash
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentSection {
  id: string;
  level: number;
  title: string;
  content?: string;
  children: DocumentSection[];
  collapsed?: boolean;
  startLine?: number;
  endLine?: number;
}

interface DocumentStructurePanelProps {
  content: string;
  onSectionClick: (sectionId: string) => void;
  className?: string;
}

export const DocumentStructurePanel: React.FC<DocumentStructurePanelProps> = ({
  content,
  onSectionClick,
  className = '',
}) => {
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [expandAllSections, setExpandAllSections] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Parse the document structure from the content
  useEffect(() => {
    const parsedSections = parseDocumentStructure(content);
    setSections(parsedSections);
  }, [content]);

  // Toggle section collapse
  const toggleSection = useCallback((sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Helper to get all section IDs recursively
  const getAllSectionIds = useCallback((sectionsList: DocumentSection[]): string[] => {
    let ids: string[] = [];
    sectionsList.forEach(section => {
      ids.push(section.id);
      if (section.children.length > 0) {
        ids = [...ids, ...getAllSectionIds(section.children)];
      }
    });
    return ids;
  }, []);

  // Toggle all sections collapse/expand
  const toggleAllSections = useCallback(() => {
    if (expandAllSections) {
      // Collapse all sections
      const allSectionIds = getAllSectionIds(sections);
      setCollapsedSections(new Set(allSectionIds));
    } else {
      // Expand all sections
      setCollapsedSections(new Set());
    }
    setExpandAllSections(!expandAllSections);
  }, [expandAllSections, sections, getAllSectionIds]);

  // Handle clicking on a section
  const handleSectionClick = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    onSectionClick(sectionId);
  }, [onSectionClick]);

  // Get section heading icon based on level
  const getSectionIcon = useCallback((level: number) => {
    switch (level) {
      case 1:
        return <Heading1 className="h-3 w-3 mr-1" />;
      case 2:
        return <Heading2 className="h-3 w-3 mr-1" />;
      case 3:
        return <Heading3 className="h-3 w-3 mr-1" />;
      default:
        return <Hash className="h-3 w-3 mr-1" />;
    }
  }, []);

  // Render a section and its children recursively
  const renderSection = useCallback((section: DocumentSection, depth = 0) => {
    const isCollapsed = collapsedSections.has(section.id);
    const hasChildren = section.children && section.children.length > 0;
    const isActive = activeSection === section.id;
    
    return (
      <div key={section.id} className="select-none">
        <div 
          className={`
            flex items-center py-1 px-2 rounded-md hover:bg-muted cursor-pointer text-sm
            ${depth > 0 ? 'ml-' + (depth * 3) : ''}
            ${isActive ? 'bg-primary/10 text-primary' : ''}
          `}
          onClick={() => handleSectionClick(section.id)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 mr-1"
              onClick={(e) => toggleSection(section.id, e)}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          ) : (
            getSectionIcon(section.level)
          )}
          <span className="truncate flex-1">{section.title}</span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant={isActive ? "default" : "outline"}
                  className="ml-2 text-xs py-0 h-4"
                >
                  H{section.level}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="right">
                Heading Level {section.level}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {!isCollapsed && hasChildren && (
          <div className="ml-2 border-l border-border pl-2">
            {section.children.map(child => renderSection(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }, [activeSection, collapsedSections, getSectionIcon, handleSectionClick, toggleSection]);

  return (
    <div className={`document-structure-panel ${className}`}>
      <div className="flex justify-between items-center p-2 border-b">
        <h3 className="text-sm font-medium">Document Outline</h3>
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={toggleAllSections}
                >
                  {expandAllSections ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {expandAllSections ? 'Collapse All' : 'Expand All'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="p-2">
          {sections.length > 0 ? (
            sections.map(section => renderSection(section))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No sections found</p>
              <p className="text-xs mt-1">Add headings to create document structure</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

// Parser function to extract document structure from markdown content
function parseDocumentStructure(content: string): DocumentSection[] {
  if (!content) return [];

  const lines = content.split('\n');
  const sections: DocumentSection[] = [];
  let currentSection: DocumentSection | null = null;
  let sectionIdCounter = 0;
  let lineNumber = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    
    // Check for headings
    if ((match = line.match(/^(#{1,6})\s+(.+)$/))) {
      // If we had a previous section, set its end line
      if (currentSection) {
        currentSection.endLine = lineNumber - 1;
      }
      
      const level = match[1].length;
      const title = match[2].trim();
      const newSection: DocumentSection = {
        id: `section-${sectionIdCounter++}`,
        level,
        title,
        children: [],
        startLine: lineNumber,
      };

      // Find the appropriate parent for this section
      if (level === 1 || !currentSection) {
        // This is a top-level section or the first section
        sections.push(newSection);
        currentSection = newSection;
      } else if (level > currentSection.level) {
        // This is a child of the current section
        currentSection.children.push(newSection);
        currentSection = newSection;
      } else {
        // This is a sibling or higher level than the current section
        // Go back up the tree to find the appropriate parent
        const parent = findParentForLevel(sections, level);
        if (parent) {
          parent.children.push(newSection);
        } else {
          // If no appropriate parent is found, add to the root
          sections.push(newSection);
        }
        currentSection = newSection;
      }
    }
    
    lineNumber++;
  }

  // Set end line for the last section
  if (currentSection) {
    currentSection.endLine = lineNumber - 1;
  }

  return sections;
}

// Helper function to find the parent for a given heading level
function findParentForLevel(sections: DocumentSection[], targetLevel: number): DocumentSection | null {
  // For simplicity, just find the last section with a level less than the target
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (section.level < targetLevel) {
      return section;
    }
    
    // Recursively check children
    const childParent = findParentForLevel(section.children, targetLevel);
    if (childParent) {
      return childParent;
    }
  }
  
  return null;
}
