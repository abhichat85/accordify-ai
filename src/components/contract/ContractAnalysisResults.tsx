
import React from "react";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Users, 
  Calendar, 
  Clock, 
  Search,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GeneralAnalysis, 
  Risk, 
  Clause, 
  AnalysisResult 
} from "@/services/contractAnalysis";
import { cn } from "@/lib/utils";

interface ContractAnalysisResultsProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  className?: string;
}

export const ContractAnalysisResults: React.FC<ContractAnalysisResultsProps> = ({
  analysisResult,
  isLoading,
  className
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("summary");
  const [searchQuery, setSearchQuery] = React.useState("");

  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium">Analyzing contract...</h3>
        <p className="text-sm text-muted-foreground">
          This may take a few moments depending on document size.
        </p>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Analysis Results</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Upload a contract and run analysis to see insights, risks, and a breakdown of clauses.
        </p>
      </div>
    );
  }

  if (analysisResult.type === "error") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Analysis Error</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
          {analysisResult.error}
        </p>
      </div>
    );
  }

  // Extract and transform data based on the result type
  const generalData = analysisResult.type === "general" ? analysisResult.result as GeneralAnalysis : null;
  
  const riskData = analysisResult.type === "risk" 
    ? analysisResult.result as Risk[] 
    : [];
  
  const clauseData = analysisResult.type === "clauses" 
    ? analysisResult.result as Clause[] 
    : [];

  // Apply search filter if a query exists
  const filteredRisks = searchQuery && riskData.length > 0
    ? riskData.filter(risk => 
        risk.clause.toLowerCase().includes(searchQuery.toLowerCase()) || 
        risk.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : riskData;

  const filteredClauses = searchQuery && clauseData.length > 0
    ? clauseData.filter(clause => 
        clause.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        clause.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clauseData;

  // Count risks by severity
  const riskCount = {
    high: riskData.filter(r => r.type === "high").length,
    medium: riskData.filter(r => r.type === "medium").length,
    low: riskData.filter(r => r.type === "low").length
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-border/30">
        <div className="relative">
          <input
            type="text"
            placeholder="Search within analysis..."
            className="w-full pl-9 pr-4 py-2 bg-muted/60 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-border/30">
        <button
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === "summary"
              ? "text-primary border-b-2 border-primary"
              : "text-foreground hover:text-primary"
          )}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
        <button
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === "risks"
              ? "text-primary border-b-2 border-primary"
              : "text-foreground hover:text-primary"
          )}
          onClick={() => setActiveTab("risks")}
        >
          Risks ({riskCount.high + riskCount.medium + riskCount.low})
        </button>
        <button
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === "clauses"
              ? "text-primary border-b-2 border-primary"
              : "text-foreground hover:text-primary"
          )}
          onClick={() => setActiveTab("clauses")}
        >
          Clauses
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="flex-grow overflow-y-auto p-4 styled-scrollbar">
        {activeTab === "summary" && (
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
            
            {/* Key issues */}
            <Card className="overflow-hidden shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-primary mb-3">Key Issues</h3>
                
                {riskData.filter(r => r.type === "high").length > 0 ? (
                  <div className="space-y-3">
                    {riskData.filter(r => r.type === "high").map((risk, index) => (
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
            
            {/* Recommendations */}
            <Card className="overflow-hidden shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-primary mb-3">Recommendations</h3>
                
                {riskData.filter(risk => risk.suggestion).length > 0 ? (
                  <div className="space-y-2">
                    {riskData.filter(risk => risk.suggestion).map((risk, index) => (
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
          </div>
        )}
        
        {activeTab === "risks" && (
          <div className="space-y-4">
            {filteredRisks.length > 0 ? (
              filteredRisks.map((risk, index) => (
                <Card 
                  key={index} 
                  className={cn(
                    "overflow-hidden shadow-sm transition-all hover:shadow",
                    risk.type === "high" ? "border-red-200" : 
                    risk.type === "medium" ? "border-yellow-200" : 
                    "border-green-200"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className={cn(
                        "p-1.5 rounded-lg mr-3 flex-shrink-0",
                        risk.type === "high" ? "bg-red-100" : 
                        risk.type === "medium" ? "bg-yellow-100" : 
                        "bg-green-100"
                      )}>
                        {risk.type === "high" ? (
                          <AlertCircle size={18} className="text-red-500" />
                        ) : risk.type === "medium" ? (
                          <AlertTriangle size={18} className="text-yellow-600" />
                        ) : (
                          <CheckCircle size={18} className="text-green-500" />
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium text-foreground">{risk.clause}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                        
                        {risk.suggestion && (
                          <div className="mt-3 bg-muted/50 rounded-lg p-3 text-xs border-l-2 border-primary">
                            <span className="block font-medium text-primary mb-1">Suggestion:</span>
                            <span>{risk.suggestion}</span>
                          </div>
                        )}
                      </div>
                      
                      <button className="ml-3 p-1.5 hover:bg-muted rounded-full transition-colors flex-shrink-0">
                        <ArrowRight size={16} className="text-primary" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Search size={20} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  {riskData.length > 0 
                    ? "No risks found for your search" 
                    : "Run risk analysis to see potential issues"}
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "clauses" && (
          <div className="space-y-4">
            {filteredClauses.length > 0 ? (
              filteredClauses.map((clause, index) => (
                <Card key={index} className="overflow-hidden shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">{clause.name}</h4>
                      
                      {clause.risk && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          clause.risk === "high" ? "bg-red-100 text-red-700" : 
                          clause.risk === "medium" ? "bg-yellow-100 text-yellow-700" : 
                          "bg-green-100 text-green-700"
                        )}>
                          {clause.risk} risk
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">{clause.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Search size={20} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  {clauseData.length > 0 
                    ? "No clauses found for your search" 
                    : "Run clause analysis to see contract structure"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
