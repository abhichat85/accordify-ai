
import React from "react";
import { PenTool, Eye, FileSignature } from "lucide-react";

// History mock data
const HISTORY_DATA = [
  {
    id: 1,
    title: "NDA - ABC Company",
    date: "Today, 2:30 PM",
    action: "Created new contract",
    type: "NDA",
    icon: PenTool
  },
  {
    id: 2,
    title: "Services Agreement - XYZ Inc",
    date: "Yesterday, 10:15 AM",
    action: "Revised contract",
    type: "Service Agreement",
    icon: FileSignature
  },
  {
    id: 3,
    title: "Employment Agreement - Jane Smith",
    date: "Mar 15, 2024",
    action: "Viewed contract",
    type: "Employment",
    icon: Eye
  },
  {
    id: 4,
    title: "Licensing Agreement - Tech Partners",
    date: "Mar 12, 2024",
    action: "Created new contract",
    type: "License",
    icon: PenTool
  },
  {
    id: 5,
    title: "Consulting Agreement - Acme Consulting",
    date: "Mar 10, 2024",
    action: "Revised contract",
    type: "Consulting",
    icon: FileSignature
  }
];

// History item component
const HistoryItem = ({ item }: { item: any }) => {
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
        <span className="text-xs bg-secondary px-2 py-1 rounded-full">{item.type}</span>
        <button className="text-sm text-primary hover:underline">View</button>
      </div>
    </div>
  );
};

// History section component
export const HistorySection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Contract History</h1>
      <div className="space-y-4">
        {HISTORY_DATA.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
