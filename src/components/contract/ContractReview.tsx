
import React, { useState } from "react";
import { ContractPanel } from "./ContractPanel";
import { AlertCircle, CheckCircle, AlertTriangle, Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Risk {
  id: string;
  type: "high" | "medium" | "low";
  clause: string;
  description: string;
  suggestion?: string;
}

interface Clause {
  id: string;
  name: string;
  content: string;
  risk?: "high" | "medium" | "low";
}

interface ContractReviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  contractType: string;
}

export const ContractReview: React.FC<ContractReviewProps> = ({
  isOpen,
  onClose,
  title,
  contractType,
}) => {
  const [activeTab, setActiveTab] = useState<"summary" | "risks" | "clauses">("summary");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for demonstration
  const risks: Risk[] = [
    {
      id: "risk1",
      type: "high",
      clause: "Limitation of Liability",
      description: "Unlimited liability for your company while the other party's liability is capped at fees paid.",
      suggestion: "Modify to make liability caps mutual for both parties."
    },
    {
      id: "risk2",
      type: "medium",
      clause: "Intellectual Property",
      description: "Broad IP assignment without clear deliverables definition.",
      suggestion: "Narrow the scope to only deliverables specifically created for this project."
    },
    {
      id: "risk3",
      type: "low",
      clause: "Termination",
      description: "30-day notice period may be short for transitioning.",
      suggestion: "Consider extending to 60 days for adequate transition time."
    }
  ];

  const clauses: Clause[] = [
    {
      id: "clause1",
      name: "Confidentiality",
      content: "Each party agrees to maintain the confidentiality of the other's proprietary information for a period of 5 years.",
      risk: "low"
    },
    {
      id: "clause2",
      name: "Limitation of Liability",
      content: "Company's liability shall be capped at fees paid, while Recipient shall have unlimited liability for breaches.",
      risk: "high"
    },
    {
      id: "clause3",
      name: "Intellectual Property",
      content: "All work product created by Recipient shall be deemed work made for hire and all intellectual property rights shall vest in Company upon creation.",
      risk: "medium"
    },
    {
      id: "clause4",
      name: "Term",
      content: "This Agreement shall commence on the Effective Date and continue for a period of two (2) years.",
    },
    {
      id: "clause5",
      name: "Termination",
      content: "Either party may terminate this Agreement upon thirty (30) days prior written notice to the other party.",
      risk: "low"
    }
  ];

  const filteredClauses = searchQuery 
    ? clauses.filter(clause => 
        clause.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        clause.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clauses;

  const filteredRisks = searchQuery
    ? risks.filter(risk =>
        risk.clause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : risks;

  const riskCount = {
    high: risks.filter(r => r.type === "high").length,
    medium: risks.filter(r => r.type === "medium").length,
    low: risks.filter(r => r.type === "low").length
  };

  return (
    <ContractPanel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="review"
    >
      <div className="flex flex-col h-full">
        {/* Search bar */}
        <div className="px-4 py-3 border-b border-accord-mediumGray/30">
          <div className="relative">
            <input
              type="text"
              placeholder="Search within contract..."
              className="w-full pl-9 pr-4 py-2 bg-accord-lightGray/60 border border-accord-mediumGray/30 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accord-teal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-accord-darkGray/70" size={16} />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-accord-mediumGray/30">
          <button
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === "summary"
                ? "text-accord-teal border-b-2 border-accord-teal"
                : "text-accord-darkGray hover:text-accord-blue"
            )}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
          <button
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === "risks"
                ? "text-accord-teal border-b-2 border-accord-teal"
                : "text-accord-darkGray hover:text-accord-blue"
            )}
            onClick={() => setActiveTab("risks")}
          >
            Risks ({risks.length})
          </button>
          <button
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === "clauses"
                ? "text-accord-teal border-b-2 border-accord-teal"
                : "text-accord-darkGray hover:text-accord-blue"
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
              <div className="bg-white rounded-xl p-4 border border-accord-mediumGray/30 shadow-sm">
                <h3 className="text-sm font-semibold text-accord-blue mb-2">Contract Overview</h3>
                <p className="text-sm text-accord-darkGray mb-4">
                  This is a {contractType} between two parties that outlines confidentiality obligations, intellectual property rights, and terms of engagement. The contract appears to be fairly standard but contains several provisions that may require attention.
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-accord-lightGray rounded">
                    <span className="block text-accord-darkGray/70">Type:</span>
                    <span className="font-medium">{contractType}</span>
                  </div>
                  <div className="p-2 bg-accord-lightGray rounded">
                    <span className="block text-accord-darkGray/70">Term:</span>
                    <span className="font-medium">2 Years</span>
                  </div>
                  <div className="p-2 bg-accord-lightGray rounded">
                    <span className="block text-accord-darkGray/70">Governing Law:</span>
                    <span className="font-medium">California</span>
                  </div>
                  <div className="p-2 bg-accord-lightGray rounded">
                    <span className="block text-accord-darkGray/70">Execution Status:</span>
                    <span className="font-medium">Draft</span>
                  </div>
                </div>
              </div>
              
              {/* Risk assessment */}
              <div className="bg-white rounded-xl p-4 border border-accord-mediumGray/30 shadow-sm">
                <h3 className="text-sm font-semibold text-accord-blue mb-3">Risk Assessment</h3>
                
                <div className="flex items-center mb-5">
                  <div className="w-full bg-accord-lightGray rounded-full h-2.5">
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" style={{ width: '65%' }}></div>
                  </div>
                  <span className="ml-3 text-xs font-medium">6.5/10</span>
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
              </div>
              
              {/* Key issues */}
              <div className="bg-white rounded-xl p-4 border border-accord-mediumGray/30 shadow-sm">
                <h3 className="text-sm font-semibold text-accord-blue mb-3">Key Issues</h3>
                
                <div className="space-y-3">
                  {risks.filter(r => r.type === "high").map((risk) => (
                    <div key={risk.id} className="flex items-start p-2 bg-red-50 rounded border border-red-200">
                      <AlertCircle size={16} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-accord-blue">{risk.clause}</p>
                        <p className="text-xs text-accord-darkGray">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {riskCount.high === 0 && (
                    <div className="flex items-center justify-center p-3 bg-green-50 rounded border border-green-200">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <p className="text-xs text-green-700">No high-risk issues found</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="bg-white rounded-xl p-4 border border-accord-mediumGray/30 shadow-sm">
                <h3 className="text-sm font-semibold text-accord-blue mb-3">Recommendations</h3>
                
                <div className="space-y-2">
                  {risks.filter(risk => risk.suggestion).map((risk, index) => (
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
                        <p className="text-xs text-accord-darkGray">{risk.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "risks" && (
            <div className="space-y-4">
              {filteredRisks.length > 0 ? (
                filteredRisks.map((risk) => (
                  <div 
                    key={risk.id} 
                    className={cn(
                      "bg-white rounded-xl p-4 border shadow-sm transition-all hover:shadow-md",
                      risk.type === "high" ? "border-red-200" : 
                      risk.type === "medium" ? "border-yellow-200" : 
                      "border-green-200"
                    )}
                  >
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
                        <h4 className="text-sm font-medium text-accord-blue">{risk.clause}</h4>
                        <p className="text-xs text-accord-darkGray mt-1">{risk.description}</p>
                        
                        {risk.suggestion && (
                          <div className="mt-3 bg-accord-lightGray/70 rounded-lg p-3 text-xs border-l-2 border-accord-teal">
                            <span className="block font-medium text-accord-teal mb-1">Suggestion:</span>
                            <span>{risk.suggestion}</span>
                          </div>
                        )}
                      </div>
                      
                      <button className="ml-3 p-1.5 hover:bg-accord-lightGray rounded-full transition-colors flex-shrink-0">
                        <ArrowRight size={16} className="text-accord-blue" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-accord-lightGray flex items-center justify-center mb-3">
                    <Search size={20} className="text-accord-darkGray/70" />
                  </div>
                  <p className="text-accord-darkGray">No risks found for your search</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "clauses" && (
            <div className="space-y-4">
              {filteredClauses.length > 0 ? (
                filteredClauses.map((clause) => (
                  <div key={clause.id} className="bg-white rounded-xl p-4 border border-accord-mediumGray/30 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-accord-blue">{clause.name}</h4>
                      
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
                    
                    <p className="text-xs text-accord-darkGray">{clause.content}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-accord-lightGray flex items-center justify-center mb-3">
                    <Search size={20} className="text-accord-darkGray/70" />
                  </div>
                  <p className="text-accord-darkGray">No clauses found for your search</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ContractPanel>
  );
};
