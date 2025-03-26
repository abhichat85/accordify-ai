
import React from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AnalysisResult,
  Clause 
} from "@/services/contractAnalysis";
import { cn } from "@/lib/utils";

interface ClausesTabProps {
  analysisResult: AnalysisResult;
  searchQuery: string;
}

export const ClausesTab: React.FC<ClausesTabProps> = ({ 
  analysisResult,
  searchQuery
}) => {
  // Extract and filter clause data
  const clauseData = analysisResult.type === "clauses" 
    ? analysisResult.result as Clause[] 
    : [];
  
  // Apply search filter if a query exists
  const filteredClauses = searchQuery && clauseData.length > 0
    ? clauseData.filter(clause => 
        clause.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        clause.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clauseData;

  if (filteredClauses.length === 0) {
    return (
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
    );
  }
    
  return (
    <div className="space-y-4">
      {filteredClauses.map((clause, index) => (
        <ClauseItem key={index} clause={clause} />
      ))}
    </div>
  );
};

interface ClauseItemProps {
  clause: Clause;
}

const ClauseItem: React.FC<ClauseItemProps> = ({ clause }) => {
  return (
    <Card className="overflow-hidden shadow-sm">
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
  );
};
