
import React from "react";
import { cn } from "@/lib/utils";
import { FileText, Settings, User } from "lucide-react";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("border-b border-accord-mediumGray/50 bg-white/80 backdrop-blur-sm z-10", className)}>
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div className="w-8 h-8 rounded-full bg-accord-teal flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <h1 className="ml-2 text-lg font-medium text-accord-blue">Accord AI</h1>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <div className="px-3 py-1.5 text-sm text-accord-darkGray hover:bg-accord-lightGray rounded-lg transition-colors">
              Contracts
            </div>
            <div className="px-3 py-1.5 text-sm text-accord-darkGray hover:bg-accord-lightGray rounded-lg transition-colors">
              Templates
            </div>
            <div className="px-3 py-1.5 text-sm text-accord-darkGray hover:bg-accord-lightGray rounded-lg transition-colors">
              History
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-accord-darkGray hover:bg-accord-lightGray rounded-full transition-colors">
            <Settings size={18} />
          </button>
          <button className="p-2 text-accord-darkGray hover:bg-accord-lightGray rounded-full transition-colors">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
