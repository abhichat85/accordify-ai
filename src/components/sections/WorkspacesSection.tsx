
import React from "react";
import { Scale, Briefcase, Users } from "lucide-react";

// Workspace mock data
const WORKSPACE_DATA = [
  {
    id: 1,
    name: "Legal Department",
    description: "Contracts and agreements for the legal team",
    members: [
      { id: 1, initials: "JD" },
      { id: 2, initials: "MS" },
      { id: 3, initials: "RL" }
    ],
    status: "active",
    icon: Scale
  },
  {
    id: 2,
    name: "Sales Team",
    description: "Client agreements and sales contracts",
    members: [
      { id: 1, initials: "JD" },
      { id: 4, initials: "KP" },
      { id: 5, initials: "BH" },
      { id: 6, initials: "TM" }
    ],
    status: "active",
    icon: Briefcase
  },
  {
    id: 3,
    name: "HR Department",
    description: "Employment contracts and policies",
    members: [
      { id: 7, initials: "LN" },
      { id: 8, initials: "PQ" }
    ],
    status: "pending",
    icon: Users
  }
];

// Workspace card component
const WorkspaceCard = ({ workspace }: { workspace: any }) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <workspace.icon size={20} className="text-primary" />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          workspace.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}>
          {workspace.status}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{workspace.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{workspace.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {workspace.members.map((member: any, i: number) => (
            <div key={i} className="w-6 h-6 rounded-full bg-primary/80 flex items-center justify-center text-[10px] text-white ring-2 ring-background">
              {member.initials}
            </div>
          ))}
        </div>
        <button className="text-sm text-primary hover:underline">Open</button>
      </div>
    </div>
  );
};

// Workspaces section component
export const WorkspacesSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Create Workspace
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WORKSPACE_DATA.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
    </div>
  );
};
