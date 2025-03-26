
import React from "react";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AnalysisResult,
  Risk 
} from "@/services/contractAnalysis";
import { cn } from "@/lib/utils";

interface RisksTabProps {
  analysisResult: AnalysisResult;
  searchQuery: string;
}

export const RisksTab: React.FC<RisksTabProps> = ({ 
  analysisResult,
  searchQuery
}) => {
  // Extract and filter risk data
  const riskData = analysisResult.type === "risk" 
    ? analysisResult.result as Risk[] 
    : [];
  
  // Apply search filter if a query exists
  const filteredRisks = searchQuery && riskData.length > 0
    ? riskData.filter(risk => 
        risk.clause.toLowerCase().includes(searchQuery.toLowerCase()) || 
        risk.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : riskData;
    
  if (filteredRisks.length === 0) {
    return (
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
    );
  }
    
  return (
    <div className="space-y-4">
      {filteredRisks.map((risk, index) => (
        <RiskItem key={index} risk={risk} />
      ))}
    </div>
  );
};

interface RiskItemProps {
  risk: Risk;
}

const RiskItem: React.FC<RiskItemProps> = ({ risk }) => {
  return (
    <Card 
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
  );
};
