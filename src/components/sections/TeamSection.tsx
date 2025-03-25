
import React, { useState } from "react";
import { 
  Shield, 
  Users, 
  UserPlus, 
  MoreHorizontal,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleInfo, RoleSelect } from "../team/RoleManagement";
import { useToast } from "@/hooks/use-toast";

// Team member type
type Role = "Admin" | "Editor" | "Viewer";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Invited";
  initials: string;
}

// Team mock data
const INITIAL_TEAM_DATA: TeamMember[] = [
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
  const [teamData, setTeamData] = useState<TeamMember[]>(INITIAL_TEAM_DATA);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<Role>("Editor");
  const { toast } = useToast();

  const handleRoleChange = (memberId: number, newRole: Role) => {
    setTeamData(prevData => 
      prevData.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    
    toast({
      title: "Role updated",
      description: `Team member role has been updated to ${newRole}`,
    });
  };

  const handleInviteMember = () => {
    if (!newMemberEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send an invitation
    const newMember: TeamMember = {
      id: teamData.length + 1,
      name: newMemberEmail.split('@')[0], // Just for demo
      email: newMemberEmail,
      role: newMemberRole,
      status: "Invited",
      initials: newMemberEmail.substring(0, 2).toUpperCase(),
    };

    setTeamData([...teamData, newMember]);
    setInviteDialogOpen(false);
    setNewMemberEmail("");
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${newMemberEmail}`,
    });
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their access to your workspace</p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus size={16} />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a team member</DialogTitle>
              <DialogDescription>
                Team members will have access based on their assigned role.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <RoleSelect 
                  currentRole={newMemberRole} 
                  onChange={(role) => setNewMemberRole(role)} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember}>
                Send invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="p-4 bg-muted/30 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Users size={18} />
            <h2 className="text-base font-medium">Team Members</h2>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((member) => (
              <tr key={member.id} className="border-t border-border/50 hover:bg-muted/10">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center text-xs text-white mr-3">
                      {member.initials}
                    </div>
                    <span>{member.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{member.email}</td>
                <td className="p-4">
                  {member.id === 1 ? (
                    <div className="flex items-center">
                      <RoleInfo role="Admin" />
                      <div className="ml-2 text-xs text-muted-foreground">(Owner)</div>
                    </div>
                  ) : (
                    <RoleSelect
                      currentRole={member.role}
                      onChange={(role) => handleRoleChange(member.id, role)}
                      disabled={member.id === 1} // Can't change the owner's role
                    />
                  )}
                </td>
                <td className="p-4">
                  <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${
                    member.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {member.status === "Invited" && <AlertCircle size={12} className="mr-1" />}
                    {member.status}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit details</DropdownMenuItem>
                      <DropdownMenuItem>Reset password</DropdownMenuItem>
                      {member.status === "Invited" && (
                        <DropdownMenuItem>Resend invitation</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        {member.id === 1 ? "Leave workspace" : "Remove member"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
