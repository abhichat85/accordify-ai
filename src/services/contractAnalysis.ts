
import { supabase } from "@/integrations/supabase/client";

export type AnalysisType = "general" | "risk" | "clauses" | "generate";

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

export interface GeneratedContract {
  title: string;
  content: string;
  type: string;
}

export type AnalysisResult = 
  | { type: "general"; result: GeneralAnalysis }
  | { type: "risk"; result: Risk[] }
  | { type: "clauses"; result: Clause[] }
  | { type: "generate"; result: GeneratedContract }
  | { type: "error"; error: string };

export const analyzeContract = async (
  contractText: string,
  analysisType: AnalysisType
): Promise<AnalysisResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-contract', {
      body: { contractText, analysisType }
    });

    if (error) {
      console.error('Error analyzing contract:', error);
      return { 
        type: "error", 
        error: error.message || 'Failed to analyze contract' 
      };
    }

    // Return the properly typed result
    if (data.type === analysisType) {
      return {
        type: analysisType,
        result: data.result
      } as AnalysisResult;
    } else {
      return {
        type: "error",
        error: 'Analysis type mismatch in response'
      };
    }
  } catch (error) {
    console.error('Exception in analyzeContract:', error);
    return { 
      type: "error", 
      error: error instanceof Error ? error.message : 'Unknown error during contract analysis'
    };
  }
};

export const generateContract = async (
  prompt: string,
  contractType?: string
): Promise<AnalysisResult> => {
  try {
    console.log(`Generating contract of type: ${contractType} with prompt: ${prompt.substring(0, 100)}...`);
    
    const { data, error } = await supabase.functions.invoke('analyze-contract', {
      body: { 
        contractText: prompt, 
        analysisType: "generate",
        contractType 
      }
    });

    if (error) {
      console.error('Error generating contract:', error);
      return { 
        type: "error", 
        error: error.message || 'Failed to generate contract' 
      };
    }

    console.log('Contract generation response received:', data);

    // Return the properly typed result
    if (data.type === "generate") {
      console.log('Successfully generated contract:', data.result.title);
      return {
        type: "generate",
        result: data.result
      } as AnalysisResult;
    } else {
      console.error('Analysis type mismatch in response:', data);
      return {
        type: "error",
        error: 'Analysis type mismatch in response'
      };
    }
  } catch (error) {
    console.error('Exception in generateContract:', error);
    return { 
      type: "error", 
      error: error instanceof Error ? error.message : 'Unknown error during contract generation'
    };
  }
};
