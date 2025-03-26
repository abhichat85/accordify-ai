
import React from "react";
import { 
  AlertCircle, 
  CheckCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AnalysisResult,
  GeneralAnalysis,
  Risk
} from "@/services/contractAnalysis";
import { cn } from "@/lib/utils";

interface SummaryTabProps {
  analysisResult: AnalysisResult;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ analysisResult }) => {
  // Extract and transform data based on the result type
  const generalData = analysisResult.type === "general" ? analysisResult.result as GeneralAnalysis : null;
  
  const riskData = analysisResult.type === "risk" 
    ? analysisResult.result as Risk[] 
    : [];
  
  // Count risks by severity
  const riskCount = {
    high: riskData.filter(r => r.type === "high").length,
    medium: riskData.filter(r => r.type === "medium").length,
    low: riskData.filter(r => r.type === "low").length
  };
  
  return (
    <div className="space-y-6">
      {/* Contract overview */}
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-primary mb-2">Contract Overview</h3>
            
            {generalData ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {generalData.purpose || 'This is a contract between two parties that outlines terms and conditions for a business relationship.'}
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="block text-muted-foreground">Type:</span>
                    <span className="font-medium">{generalData.documentType || 'Contract'}</span>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="block text-muted-foreground">Term:</span>
                    <span className="font-medium">{generalData.termDuration || 'Not specified'}</span>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="block text-muted-foreground">Effective Date:</span>
                    <span className="font-medium">{generalData.effectiveDate || 'Not specified'}</span>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="block text-muted-foreground">Parties:</span>
                    <span className="font-medium">{generalData.parties?.join(', ') || 'Multiple parties'}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Run general analysis to see contract overview
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Risk assessment */}
      <RiskSummary riskData={riskData} riskCount={riskCount} />
      
      {/* Key issues */}
      <KeyIssues riskData={riskData} />
      
      {/* Recommendations */}
      <Recommendations riskData={riskData} />
    </div>
  );
};

interface RiskSummaryProps {
  riskData: Risk[];
  riskCount: {
    high: number;
    medium: number;
    low: number;
  };
}

const RiskSummary: React.FC<RiskSummaryProps> = ({ riskData, riskCount }) => {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-primary mb-3">Risk Assessment</h3>
        
        {riskData.length > 0 ? (
          <>
            <div className="flex items-center mb-5">
              <div className="w-full bg-muted/60 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" 
                  style={{ 
                    width: `${Math.min(100, (
                      (riskCount.high * 30 + riskCount.medium * 15 + riskCount.low * 5) / 
                      Math.max(1, riskData.length * 10) * 100
                    ))}%` 
                  }}
                ></div>
              </div>
              <span className="ml-3 text-xs font-medium">
                {((riskCount.high * 3 + riskCount.medium * 2 + riskCount.low) / 
                  Math.max(1, riskData.length * 0.6)).toFixed(1)}/10
              </span>
            </div>
            
            <div className="flex space-x-3 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>{riskCount.high} High</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span>{riskCount.medium} Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>{riskCount.low} Low</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Run risk analysis to see contract risk assessment
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface KeyIssuesProps {
  riskData: Risk[];
}

const KeyIssues: React.FC<KeyIssuesProps> = ({ riskData }) => {
  const highRisks = riskData.filter(r => r.type === "high");
  
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-primary mb-3">Key Issues</h3>
        
        {highRisks.length > 0 ? (
          <div className="space-y-3">
            {highRisks.map((risk, index) => (
              <div key={index} className="flex items-start p-2 bg-red-50 rounded border border-red-200">
                <AlertCircle size={16} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">{risk.clause}</p>
                  <p className="text-xs text-muted-foreground">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : riskData.length > 0 ? (
          <div className="flex items-center justify-center p-3 bg-green-50 rounded border border-green-200">
            <CheckCircle size={16} className="text-green-500 mr-2" />
            <p className="text-xs text-green-700">No high-risk issues found</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Run risk analysis to identify key issues
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface RecommendationsProps {
  riskData: Risk[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ riskData }) => {
  const risksWithSuggestions = riskData.filter(risk => risk.suggestion);
  
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-primary mb-3">Recommendations</h3>
        
        {risksWithSuggestions.length > 0 ? (
          <div className="space-y-2">
            {risksWithSuggestions.map((risk, index) => (
              <div key={index} className="flex items-start">
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5",
                  risk.type === "high" ? "bg-red-100 text-red-500" : 
                  risk.type === "medium" ? "bg-yellow-100 text-yellow-600" : 
                  "bg-green-100 text-green-500"
                )}>
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{risk.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Run risk analysis to get recommendations
          </p>
        )}
      </CardContent>
    </Card>
  );
};
