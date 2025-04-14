import React, { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useTeam } from "@/contexts/TeamContext";
import { TeamRole } from "@/services/teamService";
import { supabase } from "@/integrations/supabase/client";

// Team member type for UI display
interface TeamMemberDisplay {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: "Active" | "Invited";
  initials: string;
}

// Team section component
export const TeamSection = () => {
  const { 
    currentTeam, 
    isLoading, 
    inviteMember, 
    updateMemberRole, 
    removeMember 
  } = useTeam();
  
  const [teamMembers, setTeamMembers] = useState<TeamMemberDisplay[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<TeamRole>("member");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUserId(data.user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  // Transform team members data for display
  useEffect(() => {
    if (currentTeam) {
      // In a real implementation, we would fetch user profiles
      // For now, we'll create display data from the team members
      const displayMembers: TeamMemberDisplay[] = currentTeam.members.map(member => {
        // In a real app, we'd get this from profiles
        const name = member.user_id;
        const email = `${name.substring(0, 6)}@example.com`;
        const initials = name.substring(0, 2).toUpperCase();
        
        return {
          id: member.user_id,
          name,
          email,
          role: member.role as TeamRole,
          status: "Active",
          initials
        };
      });
      
      setTeamMembers(displayMembers);
    } else {
      // If no team is selected, show demo data
      setTeamMembers(INITIAL_TEAM_DATA);
    }
  }, [currentTeam]);

  const handleRoleChange = async (memberId: string, newRole: TeamRole) => {
    try {
      await updateMemberRole(memberId, newRole);
      
      // Update local state for immediate UI feedback
      setTeamMembers(prevData => 
        prevData.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
    } catch (error) {
      // Error is already handled in the context
      console.error("Error updating role:", error);
    }
  };

  const handleInviteMember = async () => {
    if (!newMemberEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await inviteMember(newMemberEmail, newMemberRole);
      setInviteDialogOpen(false);
      setNewMemberEmail("");
      
      // The team context will refresh the members list
    } catch (error) {
      // Error is already handled in the context
      console.error("Error inviting member:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(memberId);
      
      // Update is handled by the context refreshTeams function
    } catch (error) {
      // Error is already handled in the context
      console.error("Error removing member:", error);
    }
  };

  // If loading, show a loading state
  if (isLoading) {
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Team Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

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
                <Label htmlFor="role">Role</Label>
                <RoleSelect
                  currentRole={newMemberRole}
                  onChange={(role) => setNewMemberRole(role as TeamRole)}
                  disabled={false}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This determines what actions they can perform in your workspace.
                </p>
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
            {teamMembers.map((member) => (
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
                  {member.role === "owner" || member.id === currentUserId ? (
                    <div className="flex items-center">
                      <RoleInfo role={member.role} />
                      {member.role === "owner" && (
                        <div className="ml-2 text-xs text-muted-foreground">(Owner)</div>
                      )}
                    </div>
                  ) : (
                    <RoleSelect
                      currentRole={member.role}
                      onChange={(role) => handleRoleChange(member.id, role as TeamRole)}
                      disabled={member.role === "owner"} // Can't change the owner's role
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
                      {member.id !== currentUserId && member.role !== "owner" && (
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove member
                        </DropdownMenuItem>
                      )}
                      {member.id === currentUserId && (
                        <DropdownMenuItem className="text-destructive">
                          Leave workspace
                        </DropdownMenuItem>
                      )}
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

// Fallback mock data when no team is selected
const INITIAL_TEAM_DATA: TeamMemberDisplay[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "owner",
    status: "Active",
    initials: "JD"
  },
  {
    id: "2",
    name: "Mary Smith",
    email: "mary.smith@example.com",
    role: "admin",
    status: "Active",
    initials: "MS"
  },
  {
    id: "3",
    name: "Robert Lewis",
    email: "robert.lewis@example.com",
    role: "member",
    status: "Active",
    initials: "RL"
  },
  {
    id: "4",
    name: "Kate Peterson",
    email: "kate.p@example.com",
    role: "admin",
    status: "Active",
    initials: "KP"
  },
  {
    id: "5",
    name: "Brian Hall",
    email: "brian.h@example.com",
    role: "member",
    status: "Invited",
    initials: "BH"
  }
];
