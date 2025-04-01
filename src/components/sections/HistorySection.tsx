
import React, { useState } from "react";
import { PenTool, Eye, FileSignature, List, Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock contract data
const CONTRACT_DATA = [
  {
    id: 1,
    title: "NDA - ABC Company",
    date: "Today, 2:30 PM",
    action: "Created new contract",
    type: "NDA",
    status: "draft",
    icon: PenTool
  },
  {
    id: 2,
    title: "Services Agreement - XYZ Inc",
    date: "Yesterday, 10:15 AM",
    action: "Revised contract",
    type: "Service Agreement",
    status: "in-progress",
    icon: FileSignature
  },
  {
    id: 3,
    title: "Employment Agreement - Jane Smith",
    date: "Mar 15, 2024",
    action: "Viewed contract",
    type: "Employment",
    status: "draft",
    icon: Eye
  },
  {
    id: 4,
    title: "Licensing Agreement - Tech Partners",
    date: "Mar 12, 2024",
    action: "Created new contract",
    type: "License",
    status: "completed",
    icon: PenTool
  },
  {
    id: 5,
    title: "Consulting Agreement - Acme Consulting",
    date: "Mar 10, 2024",
    action: "Revised contract",
    type: "Consulting",
    status: "in-progress",
    icon: FileSignature
  }
];

// Contract Grid Item component
const ContractGridItem = ({ item }: { item: any }) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{item.title}</h3>
        <span className="text-xs text-muted-foreground">{item.date}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground mb-3">
        <item.icon size={14} className="mr-1" />
        <span>{item.action}</span>
      </div>
      <div className="flex items-center justify-between">
        <Badge variant={item.status === 'completed' ? "default" : "outline"} className="text-xs">
          {item.status === 'draft' ? 'Draft' : item.status === 'in-progress' ? 'In Progress' : 'Completed'}
        </Badge>
        <Button size="sm" variant="ghost" className="text-sm text-primary hover:underline">
          View
        </Button>
      </div>
    </div>
  );
};

// Contract Table Row component
const ContractTableRow = ({ item }: { item: any }) => {
  return (
    <tr className="hover:bg-muted/50">
      <td className="py-3 px-4">
        <div className="flex items-center">
          <item.icon size={16} className="mr-2 text-primary/80" />
          <span>{item.title}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-muted-foreground">{item.type}</td>
      <td className="py-3 px-4 text-muted-foreground">{item.date}</td>
      <td className="py-3 px-4">
        <Badge variant={item.status === 'completed' ? "default" : "outline"} className="text-xs">
          {item.status === 'draft' ? 'Draft' : item.status === 'in-progress' ? 'In Progress' : 'Completed'}
        </Badge>
      </td>
      <td className="py-3 px-4 text-right">
        <Button size="sm" variant="ghost" className="text-primary">
          View
        </Button>
      </td>
    </tr>
  );
};

// Recently modified contracts section
const RecentlyModifiedSection = () => {
  // Filter to get only recently modified drafts
  const recentDrafts = CONTRACT_DATA.filter(contract => 
    contract.status === 'draft' || contract.status === 'in-progress'
  ).slice(0, 3); // Limit to 3 items

  return (
    <div className="bg-card border border-border/50 rounded-lg p-4 mb-6">
      <h2 className="font-medium mb-3">Recently Modified Drafts</h2>
      <div className="space-y-2">
        {recentDrafts.map((draft) => (
          <div 
            key={draft.id} 
            className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer"
          >
            <div className="flex items-center">
              <draft.icon size={16} className="mr-2 text-primary/80" />
              <span className="font-medium">{draft.title}</span>
            </div>
            <span className="text-xs text-muted-foreground">{draft.date}</span>
          </div>
        ))}
      </div>
      <Button variant="link" className="p-0 h-auto mt-2 text-sm">Show all drafts</Button>
    </div>
  );
};

// All Contracts section component (formerly History section)
export const HistorySection = () => {
  const [viewType, setViewType] = useState<"grid" | "table">("grid");

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Contracts</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewType === "grid" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewType("grid")}
          >
            <Grid2X2 size={16} />
          </Button>
          <Button
            variant={viewType === "table" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewType("table")}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      <RecentlyModifiedSection />

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {viewType === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTRACT_DATA.map((item) => (
            <ContractGridItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/40 border-b border-border/50">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Contract Name</th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Last Modified</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACT_DATA.map((item) => (
                <ContractTableRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
