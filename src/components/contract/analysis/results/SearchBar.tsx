
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
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
  );
};
