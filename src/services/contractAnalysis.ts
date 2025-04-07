import { supabase } from "@/integrations/supabase/client";

export type AnalysisType = "general" | "risk" | "clauses" | "generate" | "outline" | "section" | "summary";

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
  // For handling nested structures that might appear in API responses
  [key: string]: unknown;
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
  | { type: "summary"; result: ContractSummary }
  | { type: "error"; error: string; result?: GeneratedContract; formattedContract?: string };

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

export interface SummaryActionPoint {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'obligation' | 'right' | 'date' | 'payment' | 'condition' | 'restriction' | 'other';
}

export interface ContractSummary {
  title: string;
  overview: string;
  actionPoints: SummaryActionPoint[];
  keyTerms: { term: string; definition: string }[];
  dates: { title: string; date: string; description: string }[];
}

/**
 * Summarizes a contract and extracts action points
 * @param content The contract content to summarize
 * @returns The contract summary with action points
 */
export const summarizeContract = async (content: string): Promise<AnalysisResult> => {
  console.log('Summarizing contract...');
  try {
    const response = await supabase.functions.invoke('analyze-contract', {
      body: {
        contractText: content,
        analysisType: 'summary',
      },
    });

    console.log('Summary response:', response);

    if (response.error) {
      console.error('Error in contract summary:', response.error);
      return {
        type: 'error',
        error: response.error.message || 'Failed to summarize contract',
      };
    }

    // Ensure we have a valid summary with initialized arrays
    const summary = response.data || {};
    
    // Create a properly formatted summary with default values for all fields
    const formattedSummary: ContractSummary = {
      title: summary.title || 'Contract Summary',
      overview: summary.overview || 'This is a summary of the contract.',
      actionPoints: Array.isArray(summary.actionPoints) ? summary.actionPoints : [],
      keyTerms: Array.isArray(summary.keyTerms) ? summary.keyTerms : [],
      dates: Array.isArray(summary.dates) ? summary.dates : []
    };

    return {
      type: 'summary',
      result: formattedSummary
    };
  } catch (error) {
    console.error('Exception in contract summary:', error);
    return {
      type: 'error',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
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

      case "summary":
        return {
          type: "summary",
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
  try {
    console.log(`Generating contract outline for type: ${contractType}`);
    console.log(`Prompt length: ${prompt.length} characters`);
    console.log(`Prompt preview: ${prompt.substring(0, 100)}...`);
    
    // Call the Supabase function to generate the outline
    console.log(`Calling Supabase function 'analyze-contract' with analysisType: "outline"`);
    const { data, error } = await supabase.functions.invoke("analyze-contract", {
      body: {
        contractText: prompt,
        analysisType: "outline",
        contractType,
      },
    });
    
    console.log(`Response received from Supabase function:`, error ? `Error: ${error.message}` : 'Success');

    if (error) {
      console.error("Error generating contract outline:", error);
      console.error("Error details:", JSON.stringify(error));
      
      // Check for specific API key error messages
      if (error.message && (
        error.message.includes("API key") || 
        error.message.includes("OpenAI") ||
        error.message.includes("non-2xx status code")
      )) {
        return { 
          type: "error", 
          error: "OpenAI API key error: Please check that your OpenAI API key is correctly configured in Supabase."
        };
      }
      
      return { type: "error", error: error.message };
    }

    console.log("Outline generation response received:", data ? "Data present" : "No data");
    if (data && data.result) {
      console.log("Outline sections:", data.result.sections ? data.result.sections.length : "No sections");
    }

    if (!data || !data.result) {
      console.error("Invalid response from outline generation:", data);
      return {
        type: "error",
        error: "Invalid response from outline generation. Missing result data."
      };
    }

    return {
      type: "outline",
      result: data.result,
    };
  } catch (error) {
    console.error("Exception in contract outline generation:", error);
    return {
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred during outline generation",
    };
  }
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

    // Debug the API response structure
    console.log("Original outline structure:", JSON.stringify(outline, null, 2));
    
    // Fix for specific structure issues with NDAs - MUST RUN BEFORE OTHER VALIDATIONS
    let isNDA = false;
    if (contractType.toLowerCase().includes('non') && contractType.toLowerCase().includes('disclosure')) {
      isNDA = true;
      // If this is an NDA and there's a nested structure (API sometimes returns this)
      if (outline.NonDisclosureAgreement && typeof outline.NonDisclosureAgreement === 'object') {
        console.log("Found nested NDA structure, fixing...");
        
        // Extract the nested structure with proper type checking
        const nda = outline.NonDisclosureAgreement as Record<string, unknown>;
        
        // Force the correct title and type
        outline.title = "Non-Disclosure Agreement";
        if (outline.type === "legal agreement") {
          outline.type = "Non-Disclosure Agreement";
        }
        
        // Create proper sections from the NDA object structure
        console.log("Creating sections from NDA object structure");
        
        // Clear any existing sections that might be invalid
        outline.sections = [];
        
        // Create sections from the NDA object properties
        const ndaSections: ContractSection[] = [];
        
        // 1. Parties Section
        if (nda.Parties) {
          const partiesContent = formatNDAPartiesSection(nda.Parties as Record<string, unknown>);
          ndaSections.push({
            id: "section-parties",
            title: "Parties to the Agreement",
            content: partiesContent
          });
        }
        
        // 2. Definitions Section - Handle multiple possible property names
        const definitionsSection = nda.Definitions || nda.DefinitionOfConfidentialInformation;
        if (definitionsSection) {
          const definitionsContent = formatNDADefinitionsSection(definitionsSection as Record<string, unknown>);
          ndaSections.push({
            id: "section-definitions",
            title: "Definition of Confidential Information",
            content: definitionsContent
          });
        }
        
        // 3. Obligations Section - Handle multiple possible property names
        const obligationsSection = nda.Obligations || nda.ObligationsOfReceivingParty;
        if (obligationsSection) {
          const obligationsContent = formatNDAObligationsSection(obligationsSection as Record<string, unknown>);
          ndaSections.push({
            id: "section-obligations",
            title: "Obligations of Receiving Party",
            content: obligationsContent
          });
        }
        
        // 4. Exclusions Section - Handle multiple possible property names
        const exclusionsSection = nda.Exclusions || nda.ExclusionsFromConfidentialInformation;
        if (exclusionsSection) {
          const exclusionsContent = formatNDAExclusionsSection(exclusionsSection as Record<string, unknown>);
          ndaSections.push({
            id: "section-exclusions",
            title: "Exclusions from Confidential Information",
            content: exclusionsContent
          });
        }
        
        // 5. Term Section
        if (nda.Term) {
          const termContent = formatNDATermSection(nda.Term as Record<string, unknown>);
          ndaSections.push({
            id: "section-term",
            title: "Term and Termination",
            content: termContent
          });
        }
        
        // 6. Return of Materials Section - Handle multiple possible property names
        const returnSection = nda.ReturnOfMaterials || nda["Return of Materials"];
        if (returnSection) {
          const returnContent = formatNDAReturnSection(returnSection as Record<string, unknown>);
          ndaSections.push({
            id: "section-return",
            title: "Return of Confidential Information",
            content: returnContent
          });
        }
        
        // 7. Governing Law Section
        if (nda.GoverningLaw) {
          let govContent = "";
          if (typeof nda.GoverningLaw === 'string') {
            govContent = nda.GoverningLaw as string;
          } else if (typeof nda.GoverningLaw === 'object') {
            const govLaw = nda.GoverningLaw as Record<string, unknown>;
            govContent = govLaw.Jurisdiction ? govLaw.Jurisdiction.toString() : 
              "This Agreement shall be governed by and construed in accordance with the laws of India.";
          }
          
          ndaSections.push({
            id: "section-law",
            title: "Governing Law",
            content: govContent
          });
        }
        
        // 8. Dispute Resolution Section
        if (nda.DisputeResolution) {
          const disputeContent = formatNDADisputeSection(nda.DisputeResolution as Record<string, unknown>);
          ndaSections.push({
            id: "section-dispute",
            title: "Dispute Resolution",
            content: disputeContent
          });
        }
        
        // 9. Miscellaneous Section
        if (nda.Miscellaneous) {
          const miscContent = formatNDAMiscellaneousSection(nda.Miscellaneous as Record<string, unknown>);
          ndaSections.push({
            id: "section-misc",
            title: "Miscellaneous Provisions",
            content: miscContent
          });
        }
        
        // 10. Signatures Section
        if (nda.Signatures) {
          const signaturesContent = formatNDASignaturesSection(nda.Signatures as Record<string, unknown>);
          ndaSections.push({
            id: "section-signatures",
            title: "Signatures",
            content: signaturesContent
          });
        }
        
        // Set the sections in the outline
        outline.sections = ndaSections;
        console.log(`Created ${ndaSections.length} sections from NDA structure`);
        
        // Update metadata type to ensure it's consistent
        if (outline.metadata) {
          // Use type assertion with Record<string, unknown> instead of any
          (outline.metadata as Record<string, unknown>)["type"] = "Non-Disclosure Agreement";
        }
      }
    }
    
    // Validate outline structure - ONLY IF NOT ALREADY HANDLED BY NDA PROCESSING
    if (!outline.title || typeof outline.title !== 'string') {
      console.warn('Outline missing title, setting default title');
      outline.title = isNDA ? "Non-Disclosure Agreement" : (contractType || "Generated Agreement");
    }

    // Make sure sections exist and is an array
    if (!outline.sections || !Array.isArray(outline.sections)) {
      console.error('Generated outline is missing sections array');
      outline.sections = []; // Initialize to empty array to prevent further errors
    }

    // Ensure each section in the outline has a valid title and ID
    if (outline.sections.length === 0 && !isNDA) {
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
          // Use standard section titles for contracts
          const fallbackTitle = getStandardSectionTitle(contractType, index);
          console.log(`Section has invalid title: "${section.title}", using fallback: "${fallbackTitle}"`);
          section.title = fallbackTitle;
        }
        
        // Add fallback content ONLY if section is truly missing content
        if (!section.content || section.content.trim() === "") {
          console.log(`Section "${section.title}" has empty content, adding fallback content`);
          section.content = `This section should contain detailed information about ${section.title}.\n\nPlease add specific content here.`;
        } else {
          // Valid content exists, make sure we're using it
          console.log(`Using valid content for section "${section.title}" (${section.content.length} chars)`);
        }
        
        // Ensure subsections are properly handled
        if (section.subsections) {
          if (!Array.isArray(section.subsections)) {
            console.log(`Section "${section.title}" has invalid subsections (not an array), resetting to empty array`);
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
    
    // Create the final contract with the properly processed sections
    const contract: GeneratedContract = {
      outline,
      sections: generatedSections,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: "1.0",
        type: isNDA ? "Non-Disclosure Agreement" : (contractType || "Agreement")
      }
    };

    // Special handling for NDAs - use the sections we created directly from the NDA structure
    if (isNDA && outline.NonDisclosureAgreement && outline.sections && outline.sections.length > 0) {
      console.log("Using NDA-specific sections for the final contract");
      contract.sections = outline.sections;
      
      // Ensure the title is correctly set
      if (contract.outline.title !== "Non-Disclosure Agreement") {
        contract.outline.title = "Non-Disclosure Agreement";
      }
      
      // Ensure the type is correctly set
      if (contract.metadata.type !== "Non-Disclosure Agreement") {
        contract.metadata.type = "Non-Disclosure Agreement";
      }
    }

    // Ensure the metadata type is set correctly for NDAs
    if (contract.metadata && 
        (contract.metadata.type === "legal agreement" || !contract.metadata.type) && 
        contract.outline.title === "Non-Disclosure Agreement") {
      contract.metadata.type = "Non-Disclosure Agreement";
    }

    // Format the contract for display in the editor
    const formattedContract = formatContractForEditor(contract);

    // Debugging log for contract structure
    console.log("Final contract structure:", {
      title: contract.outline.title,
      type: contract.metadata.type,
      sectionCount: contract.sections.length,
      firstSectionTitle: contract.sections[0]?.title || "No sections"
    });

    return { type: "generate", result: contract, formattedContract };
  } catch (error) {
    console.error("Error in comprehensive contract generation:", error);
    updateProgress({ 
      status: 'error',
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    // Create a fallback contract with error information
    const fallbackContract: GeneratedContract = {
      outline: {
        title: `${contractType || "Contract"} (Error Recovery)`,
        type: contractType || "Agreement",
        metadata: {
          parties: [],
          effectiveDate: new Date().toISOString().split('T')[0]
        },
        sections: [{
          id: "error-section",
          title: "Error Information",
          content: `There was an error generating the contract: ${error instanceof Error ? error.message : "Unknown error occurred"}\n\nPlease try again or contact support if the issue persists.`
        }]
      },
      sections: [{
        id: "error-section",
        title: "Error Information",
        content: `There was an error generating the contract: ${error instanceof Error ? error.message : "Unknown error occurred"}\n\nPlease try again or contact support if the issue persists.`
      }],
      metadata: {
        generatedAt: new Date().toISOString(),
        version: "1.0",
        type: contractType || "Agreement"
      }
    };
    
    // Generate a fallback formatted contract
    const fallbackFormattedContract = formatContractForEditor(fallbackContract);
    
    return {
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
      result: fallbackContract,
      formattedContract: fallbackFormattedContract
    };
  }
};

// Define standard section titles for different contract types
const standardSectionTitles: Record<string, string[]> = {
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
  "Non-Disclosure Agreement": [
    "Parties to the Agreement",
    "Definitions",
    "Purpose of Disclosure",
    "Confidential Information",
    "Exclusions from Confidential Information",
    "Obligations of Receiving Party",
    "Term and Termination",
    "Return of Confidential Information",
    "Remedies",
    "Miscellaneous Provisions",
    "Governing Law",
    "Dispute Resolution"
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
  // Start with the contract title - ensure we use the proper title for NDAs
  let contractTitle = contract.outline.title || "Contract Agreement";
  
  // Override with a proper title for NDAs if needed
  if (contract.metadata.type?.toLowerCase().includes('non') && 
      contract.metadata.type?.toLowerCase().includes('disclosure')) {
    contractTitle = "Non-Disclosure Agreement";
  }
  
  let markdownContent = `# ${contractTitle}\n\n`;
  
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

// Helper functions to format NDA sections
const formatNDAPartiesSection = (parties: Record<string, unknown>): string => {
  let content = "## Parties to the Agreement\n\n";
  
  if (parties.DisclosingParty && typeof parties.DisclosingParty === 'object') {
    const disclosing = parties.DisclosingParty as Record<string, unknown>;
    content += "**Disclosing Party**: ";
    content += typeof disclosing.Name === 'string' ? disclosing.Name : "Disclosing Party";
    content += "\n";
    content += typeof disclosing.Address === 'string' ? `Address: ${disclosing.Address}` : "";
    content += "\n\n";
  }
  
  if (parties.ReceivingParty && typeof parties.ReceivingParty === 'object') {
    const receiving = parties.ReceivingParty as Record<string, unknown>;
    content += "**Receiving Party**: ";
    content += typeof receiving.Name === 'string' ? receiving.Name : "Receiving Party";
    content += "\n";
    content += typeof receiving.Address === 'string' ? `Address: ${receiving.Address}` : "";
    content += "\n\n";
  }
  
  content += "This Non-Disclosure Agreement (\"Agreement\") is entered into between the above-named parties on the Effective Date.\n\n";
  
  return content;
};

const formatNDADefinitionsSection = (definitions: Record<string, unknown>): string => {
  let content = "For the purposes of this Agreement, the following terms shall have the meanings set forth below:\n\n";
  
  // Handle the special case for DefinitionOfConfidentialInformation
  if (definitions.Description && typeof definitions.Description === 'string') {
    content += `**Confidential Information**: ${definitions.Description}\n\n`;
  } else {
    // Handle the general case for other definition structures
    for (const [key, value] of Object.entries(definitions)) {
      content += `**${key}**: ${value}\n\n`;
    }
  }
  
  return content;
};

const formatNDAObligationsSection = (obligations: Record<string, unknown>): string => {
  let content = "The Receiving Party agrees to:\n\n";
  
  // Handle array structure
  if (obligations.ReceivingPartyObligations && Array.isArray(obligations.ReceivingPartyObligations)) {
    obligations.ReceivingPartyObligations.forEach((obligation, index) => {
      content += `${index + 1}. ${obligation}\n\n`;
    });
  } 
  // Handle ReceivingParty object structure (from latest API response)
  else if (obligations.ReceivingParty && typeof obligations.ReceivingParty === 'object') {
    const receivingParty = obligations.ReceivingParty as Record<string, unknown>;
    let index = 1;
    for (const [key, value] of Object.entries(receivingParty)) {
      if (typeof value === 'string') {
        content += `${index}. ${value}\n\n`;
        index++;
      }
    }
  }
  // Handle direct object structure with specific obligation types
  else {
    let index = 1;
    for (const [key, value] of Object.entries(obligations)) {
      if (typeof value === 'string') {
        content += `${index}. ${value}\n\n`;
        index++;
      }
    }
  }
  
  return content;
};

const formatNDAExclusionsSection = (exclusions: Record<string, unknown>): string => {
  let content = "The obligations of confidentiality under this Agreement shall not apply to information that:\n\n";
  
  // Handle array structure for ExclusionsFromConfidentiality
  if (exclusions.ExclusionsFromConfidentiality && Array.isArray(exclusions.ExclusionsFromConfidentiality)) {
    exclusions.ExclusionsFromConfidentiality.forEach((exclusion, index) => {
      content += `${index + 1}. ${exclusion}\n\n`;
    });
  } 
  // Handle InformationNotConsideredConfidential array (from latest API response)
  else if (exclusions.InformationNotConsideredConfidential && Array.isArray(exclusions.InformationNotConsideredConfidential)) {
    exclusions.InformationNotConsideredConfidential.forEach((exclusion, index) => {
      content += `${index + 1}. ${exclusion}\n\n`;
    });
  }
  // Handle NotConfidential array (from latest API response)
  else if (exclusions.NotConfidential && Array.isArray(exclusions.NotConfidential)) {
    exclusions.NotConfidential.forEach((exclusion, index) => {
      content += `${index + 1}. ${exclusion}\n\n`;
    });
  }
  // Handle object structure with specific exclusion types
  else {
    let index = 1;
    for (const [key, value] of Object.entries(exclusions)) {
      if (typeof value === 'string') {
        content += `${index}. ${value}\n\n`;
        index++;
      }
    }
  }
  
  return content;
};

const formatNDATermSection = (term: Record<string, unknown>): string => {
  let content = "";
  
  if (term.Duration && typeof term.Duration === 'string') {
    content += term.Duration + "\n\n";
  }
  
  return content;
};

const formatNDAReturnSection = (returnMaterials: Record<string, unknown>): string => {
  let content = "";
  
  // Handle ReturnOrDestruction property
  if (returnMaterials.ReturnOrDestruction && typeof returnMaterials.ReturnOrDestruction === 'string') {
    content += returnMaterials.ReturnOrDestruction + "\n\n";
  }
  // Handle Obligation property
  else if (returnMaterials.Obligation && typeof returnMaterials.Obligation === 'string') {
    content += returnMaterials.Obligation + "\n\n";
  }
  // Handle any other string property
  else {
    for (const [key, value] of Object.entries(returnMaterials)) {
      if (typeof value === 'string') {
        content += value + "\n\n";
        break; // Just use the first string property
      }
    }
  }
  
  return content;
};

const formatNDADisputeSection = (dispute: Record<string, unknown>): string => {
  let content = "";
  
  if (dispute.Method && typeof dispute.Method === 'string') {
    content += dispute.Method + "\n\n";
  }
  
  if (dispute.Location && typeof dispute.Location === 'string') {
    content += dispute.Location + "\n\n";
  }
  
  return content;
};

const formatNDAMiscellaneousSection = (misc: Record<string, unknown>): string => {
  let content = "";
  
  for (const [key, value] of Object.entries(misc)) {
    if (typeof value === 'string') {
      content += `**${key}**: ${value}\n\n`;
    }
  }
  
  return content;
};

const formatNDASignaturesSection = (signatures: Record<string, unknown>): string => {
  let content = "IN WITNESS WHEREOF, the parties have executed this Non-Disclosure Agreement as of the Effective Date.\n\n";
  
  content += "Disclosing Party:\n\n";
  content += "Signature: ________________________\n\n";
  content += "Name: ________________________\n\n";
  content += "Date: ________________________\n\n";
  
  content += "Receiving Party:\n\n";
  content += "Signature: ________________________\n\n";
  content += "Name: ________________________\n\n";
  content += "Date: ________________________\n\n";
  
  return content;
};
