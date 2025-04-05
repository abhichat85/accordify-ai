import { supabase } from "@/integrations/supabase/client";

export type AnalysisType = "general" | "risk" | "clauses" | "generate" | "outline" | "section";

export interface Risk {
  type: "high" | "medium" | "low";
  clause: string;
  description: string;
  suggestion?: string;
}

export interface Clause {
  name: string;
  content: string;
  risk?: "high" | "medium" | "low" | null;
}

export interface GeneralAnalysis {
  documentType: string;
  purpose: string;
  mainClauses: string[];
  parties: string[];
  effectiveDate?: string;
  termDuration?: string;
  rawAnalysis?: string;
}

export interface ContractSection {
  id: string;
  title: string;
  content: string;
  subsections?: ContractSection[];
  clauseNumbers?: string[];
}

export interface ContractOutline {
  title: string;
  type: string;
  metadata: {
    parties: string[];
    effectiveDate?: string;
    jurisdiction?: string;
  };
  sections: ContractSection[];
}

export interface GeneratedContract {
  outline: ContractOutline;
  sections: ContractSection[];
  metadata: {
    generatedAt: string;
    version: string;
    type: string;
  };
}

export interface GenerationProgress {
  status: 'idle' | 'generating-outline' | 'generating-sections' | 'completed' | 'error';
  outlineCompleted: boolean;
  totalSections: number;
  completedSections: number;
  currentSectionTitle?: string;
  error?: string;
  startTime?: number;
  estimatedTimeRemaining?: number;
}

export type AnalysisResult = 
  | { type: "general"; result: GeneralAnalysis }
  | { type: "risk"; result: Risk[] }
  | { type: "clauses"; result: Clause[] }
  | { type: "generate"; result: GeneratedContract; formattedContract: string }
  | { type: "outline"; result: ContractOutline }
  | { type: "section"; result: ContractSection }
  | { type: "error"; error: string };

// Progress tracking state
let generationProgress: GenerationProgress = {
  status: 'idle',
  outlineCompleted: false,
  totalSections: 0,
  completedSections: 0
};

// Progress tracking callbacks
const progressCallbacks: ((progress: GenerationProgress) => void)[] = [];

export const subscribeToGenerationProgress = (
  callback: (progress: GenerationProgress) => void
): (() => void) => {
  progressCallbacks.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = progressCallbacks.indexOf(callback);
    if (index !== -1) {
      progressCallbacks.splice(index, 1);
    }
  };
};

const updateProgress = (progress: Partial<GenerationProgress>) => {
  generationProgress = { ...generationProgress, ...progress };
  
  // Calculate estimated time remaining if we have enough data
  if (generationProgress.status === 'generating-sections' && 
      generationProgress.startTime && 
      generationProgress.completedSections > 0 &&
      generationProgress.totalSections > 0) {
    
    const elapsedTime = Date.now() - generationProgress.startTime;
    const timePerSection = elapsedTime / generationProgress.completedSections;
    const remainingSections = generationProgress.totalSections - generationProgress.completedSections;
    generationProgress.estimatedTimeRemaining = timePerSection * remainingSections;
  }
  
  // Notify all subscribers
  progressCallbacks.forEach(callback => callback({ ...generationProgress }));
};

export const resetGenerationProgress = () => {
  generationProgress = {
    status: 'idle',
    outlineCompleted: false,
    totalSections: 0,
    completedSections: 0
  };
  updateProgress({});
};

export const getGenerationProgress = (): GenerationProgress => {
  return { ...generationProgress };
};

export const analyzeContract = async (
  content: string,
  analysisType: AnalysisType,
  contractType?: string
): Promise<AnalysisResult> => {
  try {
    // For generate type, use the comprehensive approach
    if (analysisType === "generate") {
      return generateComprehensiveContract(contractType || "", content);
    }

    // For other analysis types, use the existing approach
    const { data, error } = await supabase.functions.invoke("analyze-contract", {
      body: {
        contractText: content,  
        analysisType,
        contractType,
      },
    });

    if (error) {
      console.error("Error analyzing contract:", error);
      return {
        type: "error",
        error: error.message,
      };
    }

    // Handle the response based on analysis type
    switch (data.type) {
      case "general":
        return {
          type: "general",
          result: data.result,
        };

      case "risk":
        return {
          type: "risk",
          result: data.result,
        };

      case "clauses":
        return {
          type: "clauses",
          result: data.result,
        };

      case "outline":
        return {
          type: "outline",
          result: data.result,
        };

      case "section":
        return {
          type: "section",
          result: data.result,
        };

      default:
        return {
          type: "error",
          error: "Invalid analysis type",
        };
    }
  } catch (error) {
    console.error("Error in contract analysis:", error);
    return {
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const generateContract = async (
  prompt: string,
  contractType?: string
): Promise<AnalysisResult> => {
  try {
    console.log(`Generating contract of type: ${contractType} with prompt: ${prompt.substring(0, 100)}...`);
    
    // Use the new comprehensive contract generation approach
    return generateComprehensiveContract(contractType || "", prompt);
  } catch (error) {
    console.error('Error in generateContract:', error);
    return { 
      type: "error", 
      error: error instanceof Error ? error.message : 'Unknown error during contract generation'
    };
  }
};

export const generateContractOutline = async (
  contractType: string,
  prompt: string
): Promise<AnalysisResult> => {
  const { data, error } = await supabase.functions.invoke("analyze-contract", {
    body: {
      analysisType: "outline",
      contractText: prompt,  
      contractType,
    },
  });

  if (error) {
    console.error("Error generating contract outline:", error);
    return { type: "error", error: error.message };
  }

  console.log("Outline generation response:", data);
  
  // Validate the outline structure
  if (!data.result) {
    console.error("Missing result in outline response");
    return { type: "error", error: "Invalid outline response: missing result" };
  }
  
  // Ensure the outline has a sections array
  const result = data.result;
  if (!result.sections) {
    console.log("Adding empty sections array to outline");
    result.sections = [
      {
        id: "section-1",
        title: "Introduction",
        content: "This agreement is made between the parties."
      }
    ];
  }
  
  return { type: "outline", result: data.result };
};

export const generateContractSection = async (
  section: ContractSection,
  contractType: string,
  metadata: ContractOutline["metadata"]
): Promise<AnalysisResult> => {
  const { data, error } = await supabase.functions.invoke("analyze-contract", {
    body: {
      analysisType: "section",
      contractText: " ",  
      contractType,
      section,
      metadata,
    },
  });

  if (error) {
    console.error("Error generating contract section:", error);
    return { type: "error", error: error.message };
  }

  return { type: "section", result: data.result };
};

// Define standard section titles for different contract types
const standardSectionTitles = {
  "Shareholder Agreement": [
    "Definitions and Interpretation",
    "Business of the Company",
    "Capital Structure and Contributions",
    "Issuance of Shares",
    "Transfer Restrictions",
    "Pre-emptive Rights",
    "Tag-Along and Drag-Along Rights",
    "Corporate Governance",
    "Shareholder Meetings and Voting",
    "Reserved Matters",
    "Information Rights and Reporting",
    "Dividend Policy",
    "Non-compete and Non-solicitation",
    "Confidentiality",
    "Representations and Warranties",
    "Default and Remedies",
    "Dispute Resolution",
    "Termination and Exit Provisions",
    "Valuation Methodology",
    "General Provisions"
  ],
  "Co-Founder Agreement": [
    "Definitions and Interpretation",
    "Business of the Company",
    "Roles and Responsibilities",
    "Equity Distribution",
    "Vesting Schedule",
    "Intellectual Property Rights",
    "Decision Making Process",
    "Compensation and Benefits",
    "Non-compete and Non-solicitation",
    "Confidentiality",
    "Dispute Resolution",
    "Exit Provisions",
    "General Provisions"
  ]
};

// Helper function to get a standard section title
const getStandardSectionTitle = (contractType: string, index: number): string => {
  const titles = standardSectionTitles[contractType as keyof typeof standardSectionTitles];
  if (titles && index < titles.length) {
    return titles[index];
  }
  return `Section ${index + 1}`;
};

// Helper function to format a contract for display in the editor
export const formatContractForEditor = (contract: GeneratedContract): string => {
  // Start with the contract title
  let markdownContent = `# ${contract.outline.title || "Contract Agreement"}\n\n`;
  
  // Add each section with its content
  contract.sections.forEach((section, index) => {
    // Add section heading
    markdownContent += `## ${section.title}\n\n`;
    
    // Add section content
    if (section.content) {
      markdownContent += `${section.content}\n\n`;
    }
    
    // Add any subsections
    if (section.subsections && Array.isArray(section.subsections) && section.subsections.length > 0) {
      section.subsections.forEach(subsection => {
        // Add subsection heading
        markdownContent += `### ${subsection.title}\n\n`;
        
        // Add subsection content
        if (subsection.content) {
          markdownContent += `${subsection.content}\n\n`;
        }
      });
    }
  });
  
  return markdownContent;
};

export const generateComprehensiveContract = async (
  contractType: string,
  prompt: string
): Promise<AnalysisResult> => {
  try {
    // Reset progress
    resetGenerationProgress();
    updateProgress({ 
      status: 'generating-outline',
      startTime: Date.now()
    });

    // Step 1: Generate the outline
    console.log('Generating contract outline for type:', contractType);
    const outlineResult = await generateContractOutline(contractType, prompt);
    if (outlineResult.type === "error") {
      console.error('Failed to generate outline:', outlineResult.error);
      updateProgress({ 
        status: 'error',
        error: outlineResult.type === "error" ? outlineResult.error : "Failed to generate outline"
      });
      return outlineResult;
    }
    
    const outline = outlineResult.type === "outline" ? outlineResult.result : null;
    if (!outline) {
      console.error('Generated outline is invalid or missing');
      updateProgress({ 
        status: 'error',
        error: "Failed to generate contract outline"
      });
      return { type: "error", error: "Failed to generate contract outline" };
    }

    // Validate outline structure
    if (!outline.title || typeof outline.title !== 'string') {
      console.warn('Outline missing title, setting default title');
      outline.title = contractType || "Generated Agreement";
    }

    // Make sure sections exist and is an array
    if (!outline.sections || !Array.isArray(outline.sections)) {
      console.error('Generated outline is missing sections array');
      outline.sections = []; // Initialize to empty array to prevent further errors
    }

    // Ensure each section in the outline has a valid title and ID
    if (outline.sections.length === 0) {
      console.warn('Outline has no sections, adding default sections');
      
      // Add default sections based on contract type
      if (contractType === "Shareholder Agreement") {
        const defaultSections = standardSectionTitles[contractType as keyof typeof standardSectionTitles];
        defaultSections.forEach((title, index) => {
          outline.sections.push({
            id: `section-${index + 1}`,
            title: title,
            content: `This section covers important aspects related to ${title}.`
          });
        });
      } else {
        // Generic default section
        outline.sections.push({
          id: "section-1",
          title: "Agreement Terms",
          content: "This section contains the terms and conditions of the agreement."
        });
      }
    } else {
      // Validate each section in the outline
      outline.sections = outline.sections.map((section, index) => {
        const validSection = { ...section };
        
        // Ensure section has a valid id
        if (!validSection.id || typeof validSection.id !== 'string') {
          validSection.id = `section-${index + 1}`;
        }
        
        // Ensure section has a valid title
        if (!validSection.title || typeof validSection.title !== 'string' || validSection.title.includes('undefined')) {
          validSection.title = getStandardSectionTitle(contractType, index);
        }
        
        // Ensure section has content (even if brief)
        if (!validSection.content || typeof validSection.content !== 'string') {
          validSection.content = `This section covers important aspects of the agreement.`;
        }
        
        return validSection;
      });
    }

    console.log('Outline generated successfully with', outline.sections.length, 'sections');
    
    // Update progress after outline is generated
    updateProgress({ 
      status: 'generating-sections',
      outlineCompleted: true,
      totalSections: outline.sections.length,
      completedSections: 0
    });

    // Step 2: Generate each section
    const sectionResults: AnalysisResult[] = [];
    const failedSections: string[] = [];
    
    // Generate sections sequentially to provide better progress updates
    for (let i = 0; i < outline.sections.length; i++) {
      const section = outline.sections[i];
      
      // Validate section before processing
      if (!section || typeof section !== 'object') {
        console.error(`Invalid section at index ${i}, skipping`);
        continue;
      }
      
      if (!section.title || typeof section.title !== 'string') {
        console.warn(`Section at index ${i} has invalid title, using default`);
        section.title = getStandardSectionTitle(contractType, i);
      }
      
      if (!section.id || typeof section.id !== 'string') {
        console.warn(`Section "${section.title}" has invalid id, generating new id`);
        section.id = `section-${i+1}`;
      }
      
      // Update progress with current section
      console.log(`Generating section ${i+1}/${outline.sections.length}: ${section.title}`);
      updateProgress({ 
        currentSectionTitle: section.title,
        completedSections: i
      });
      
      try {
        const sectionResult = await generateContractSection(section, contractType, outline.metadata);
        
        // Add additional validation and logging for section content
        if (sectionResult.type === "section") {
          const generatedSection = sectionResult.result;
          console.log(`Section ${i+1} generated with ${generatedSection.content ? generatedSection.content.length : 0} characters of content`);
          
          // Verify the section has substantial content
          if (!generatedSection.content || generatedSection.content.length < 50) {
            console.warn(`Section ${section.title} has insufficient content (${generatedSection.content ? generatedSection.content.length : 0} chars), attempting retry`);
            
            // Retry the section generation once
            try {
              const retryResult = await generateContractSection(section, contractType, outline.metadata);
              if (retryResult.type === "section" && retryResult.result.content && retryResult.result.content.length > 50) {
                // Use the retry result if it's better
                console.log(`Retry for section ${section.title} successful with ${retryResult.result.content.length} chars`);
                sectionResults.push(retryResult);
              } else {
                console.log(`Retry for section ${section.title} unsuccessful, using original result`);
                sectionResults.push(sectionResult);
              }
            } catch (retryError) {
              console.error(`Error in retry for section ${section.title}:`, retryError);
              sectionResults.push(sectionResult); // Fall back to original result
            }
          } else {
            // Section content is good, use it
            sectionResults.push(sectionResult);
          }
        } else {
          // Error result, add it to the results array
          sectionResults.push(sectionResult);
          failedSections.push(section.title);
        }
        
        // Check for error
        if (sectionResult.type === "error") {
          console.error(`Error generating section ${section.title}:`, sectionResult.error);
          updateProgress({ 
            status: 'error',
            error: `Failed to generate section: ${section.title}`
          });
        } else {
          console.log(`Section ${i+1} generated successfully: ${section.title}`);
        }
      } catch (err) {
        console.error(`Exception generating section ${section.title}:`, err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        sectionResults.push({ type: "error", error: errorMessage });
        failedSections.push(section.title);
        updateProgress({ 
          error: `Exception in section: ${section.title} - ${errorMessage}`
        });
      }
    }
    
    // Check for any section generation errors
    if (failedSections.length > 0) {
      console.error(`Failed to generate ${failedSections.length} sections out of ${outline.sections.length}`);
      
      // If all sections failed, return error
      if (failedSections.length === outline.sections.length) {
        updateProgress({ 
          status: 'error',
          error: `Failed to generate all ${failedSections.length} sections`
        });
        return {
          type: "error",
          error: `Failed to generate all ${failedSections.length} sections`
        };
      }
      
      // Otherwise, continue with the sections that succeeded
      console.log(`Continuing with ${outline.sections.length - failedSections.length} successful sections`);
      
      // Update progress to reflect failed sections
      updateProgress({ 
        completedSections: outline.sections.length - failedSections.length
      });
    }

    // Step 3: Combine all sections
    const generatedSections = sectionResults
      .filter((result): result is { type: "section"; result: ContractSection } => 
        result.type === "section"
      )
      .map((result, index) => {
        // Ensure content is properly formatted for display
        const section = { ...result.result }; // Create a copy to avoid mutating the original
        
        // Validate section has a valid ID
        if (!section.id || typeof section.id !== 'string') {
          const randomId = Math.random().toString(36).substring(2, 10);
          console.warn(`Section missing valid ID, generating new ID: ${randomId}`);
          section.id = `section-${randomId}`;
        }
        
        // Validate section has a valid title - CRITICAL FIX
        if (!section.title || typeof section.title !== 'string' || section.title.includes('undefined')) {
          // Use standard section titles for Shareholder Agreements
          const fallbackTitle = getStandardSectionTitle(contractType, index);
          console.warn(`Section has invalid title: "${section.title}", using fallback: "${fallbackTitle}"`);
          section.title = fallbackTitle;
        }
        
        // Add fallback content for any section that may be missing content
        if (!section.content || typeof section.content !== 'string' || section.content.trim() === "") {
          console.warn(`Section "${section.title}" has no content, adding fallback content`);
          section.content = `This section should contain detailed information about ${section.title}.\n\nPlease add specific content here.`;
        }
        
        // Ensure subsections are properly handled
        if (section.subsections) {
          if (!Array.isArray(section.subsections)) {
            console.warn(`Section "${section.title}" has invalid subsections (not an array), resetting to empty array`);
            section.subsections = [];
          } else {
            section.subsections = section.subsections.map((subsection, subIndex) => {
              const validSubsection = { ...subsection };
              
              // Validate subsection has a valid ID
              if (!validSubsection.id || typeof validSubsection.id !== 'string') {
                validSubsection.id = `${section.id}-sub-${subIndex + 1}`;
              }
              
              // Validate subsection has a valid title
              if (!validSubsection.title || typeof validSubsection.title !== 'string' || validSubsection.title.includes('undefined')) {
                validSubsection.title = `${section.title} - Subsection ${subIndex + 1}`;
              }
              
              // Validate subsection has valid content
              if (!validSubsection.content || typeof validSubsection.content !== 'string' || validSubsection.content.trim() === "") {
                validSubsection.content = `This subsection should contain detailed information about ${validSubsection.title}.\n\nPlease add specific content here.`;
              }
              
              return validSubsection;
            });
          }
        } else {
          section.subsections = [];
        }
        
        return section;
      });

    // Make sure we have at least one section
    if (generatedSections.length === 0) {
      console.error('No sections were successfully generated, adding default section');
      generatedSections.push({
        id: 'fallback-section-1',
        title: 'Agreement Terms',
        content: 'This agreement contains the terms and conditions that govern the relationship between the parties.\n\nAdditional sections should be added to complete this agreement.',
        subsections: []
      });
    }

    // Update progress to completed
    updateProgress({ 
      status: 'completed',
      completedSections: outline.sections.length
    });

    console.log(`Contract generation completed with ${generatedSections.length} sections`);
    
    // Step 4: Create the final contract
    const contract: GeneratedContract = {
      outline,
      sections: generatedSections,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: "1.0",
        type: contractType
      }
    };

    // Format the contract for display in the editor
    const formattedContract = formatContractForEditor(contract);

    return { type: "generate", result: contract, formattedContract };
  } catch (error) {
    console.error("Error in comprehensive contract generation:", error);
    updateProgress({ 
      status: 'error',
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return {
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
