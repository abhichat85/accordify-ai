
import React from "react";

// Team mock data
const TEAM_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    initials: "JD"
  },
  {
    id: 2,
    name: "Mary Smith",
    email: "mary.smith@example.com",
    role: "Editor",
    status: "Active",
    initials: "MS"
  },
  {
    id: 3,
    name: "Robert Lewis",
    email: "robert.lewis@example.com",
    role: "Viewer",
    status: "Active",
    initials: "RL"
  },
  {
    id: 4,
    name: "Kate Peterson",
    email: "kate.p@example.com",
    role: "Editor",
    status: "Active",
    initials: "KP"
  },
  {
    id: 5,
    name: "Brian Hall",
    email: "brian.h@example.com",
    role: "Viewer",
    status: "Invited",
    initials: "BH"
  }
];

// Team section component
export const TeamSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Invite Member
        </button>
      </div>
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {TEAM_DATA.map((member) => (
              <tr key={member.id} className="border-t border-border/50 hover:bg-muted/20">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-xs text-white mr-3">
                      {member.initials}
                    </div>
                    <span>{member.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{member.email}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.role === "Admin" ? "bg-purple-100 text-purple-700" : 
                    member.role === "Editor" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-sm text-primary hover:underline mr-3">Edit</button>
                  <button className="text-sm text-destructive hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
