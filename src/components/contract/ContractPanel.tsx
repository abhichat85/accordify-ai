
import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContractPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "editor" | "review" | "diff";
  children: React.ReactNode;
}

export const ContractPanel: React.FC<ContractPanelProps> = ({
  isOpen,
  onClose,
  title,
  type,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getPanelWidth = () => {
    if (!isOpen) return "w-0";
    if (isCollapsed) return "w-16";
    
    switch (type) {
      case "editor": return "w-full md:w-3/5 lg:w-1/2";
      case "review": return "w-full md:w-2/5 lg:w-1/3";
      case "diff": return "w-full md:w-2/3";
      default: return "w-full md:w-1/2";
    }
  };

  return (
    <div
      className={cn(
        "panel-overlay top-0 bottom-0 right-0 overflow-hidden shadow-xl bg-white z-50 flex flex-col",
        getPanelWidth(),
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-accord-mediumGray/50">
        <div className="flex items-center">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 mr-2 hover:bg-accord-lightGray rounded transition-colors"
          >
            {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
          
          {!isCollapsed && (
            <h3 className="font-medium text-accord-blue">{title}</h3>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <button
              className="p-1.5 hover:bg-accord-lightGray rounded-full transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button
              className="p-1.5 hover:bg-accord-lightGray rounded-full transition-colors"
              title="Share"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-accord-lightGray rounded-full transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        {isCollapsed && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-accord-lightGray rounded-full transition-colors"
            title="Close"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className={cn(
        "flex-grow overflow-y-auto styled-scrollbar",
        isCollapsed ? "hidden" : "block"
      )}>
        {children}
      </div>
      
      {/* Collapsed view */}
      {isCollapsed && (
        <div className="flex flex-col items-center py-4 h-full">
          <div className="flex flex-col space-y-6 flex-grow">
            {type === "editor" && (
              <>
                <button className="p-2 hover:bg-accord-lightGray rounded transition-colors" title="Edit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 2.5C18.3284 1.67157 19.6716 1.67157 20.5 2.5C21.3284 3.32843 21.3284 4.67157 20.5 5.5L12 14L8 15L9 11L17.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="p-2 hover:bg-accord-lightGray rounded transition-colors" title="Format">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 6H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 14H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 18H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
            
            {type === "review" && (
              <>
                <button className="p-2 hover:bg-accord-lightGray rounded transition-colors" title="Risks">
                  <AlertCircle size={20} />
                </button>
                <button className="p-2 hover:bg-accord-lightGray rounded transition-colors" title="Summary">
                  <Info size={20} />
                </button>
                <button className="p-2 hover:bg-accord-lightGray rounded transition-colors" title="Approve">
                  <CheckCircle size={20} />
                </button>
              </>
            )}
            
            {type === "diff" && (
              <>
                <button className="p-2 hover:bg-accord-lightGray rounded transition-colors" title="View Changes">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 3H21V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 3H3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 16V21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21H21V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 4L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 6L3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12L21 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="p-2 hover:bg-accord-lightGray rounded transition-colors" title="Accept">
                  <CheckCircle size={20} />
                </button>
              </>
            )}
          </div>
          
          <div className="mt-auto">
            <button
              className="p-2 hover:bg-accord-lightGray rounded transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
