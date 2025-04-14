import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { teamService, TeamWithMembers, TeamMember, TeamRole } from '@/services/teamService';
import { useToast } from '@/components/ui/use-toast';

interface TeamContextType {
  teams: TeamWithMembers[];
  currentTeam: TeamWithMembers | null;
  isLoading: boolean;
  error: string | null;
  setCurrentTeam: (team: TeamWithMembers | null) => void;
  refreshTeams: () => Promise<void>;
  createTeam: (name: string, description: string) => Promise<TeamWithMembers>;
  updateTeam: (teamId: string, name: string, description: string) => Promise<TeamWithMembers>;
  deleteTeam: (teamId: string) => Promise<void>;
  inviteMember: (email: string, role: TeamRole) => Promise<void>;
  updateMemberRole: (userId: string, role: TeamRole) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  hasRole: (userId: string, roles: TeamRole[]) => boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Custom hook to use the team context
export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}

interface TeamProviderProps {
  children: ReactNode;
  userId?: string;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children, userId }) => {
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [currentTeam, setCurrentTeam] = useState<TeamWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Define refreshTeams with useCallback to avoid dependency cycles
  const refreshTeams = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedTeams = await teamService.getUserTeams(userId);
      setTeams(fetchedTeams);
      
      // If current team exists, refresh it with updated data
      if (currentTeam) {
        const updatedCurrentTeam = fetchedTeams.find(team => team.id === currentTeam.id);
        if (updatedCurrentTeam) {
          setCurrentTeam(updatedCurrentTeam);
        } else if (fetchedTeams.length > 0) {
          // If current team no longer exists, set the first available team
          setCurrentTeam(fetchedTeams[0]);
        } else {
          setCurrentTeam(null);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load teams';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentTeam, toast]);

  // Load teams when userId changes
  useEffect(() => {
    if (userId) {
      refreshTeams();
    } else {
      setTeams([]);
      setCurrentTeam(null);
      setIsLoading(false);
    }
  }, [userId, refreshTeams]);

  // Set the first team as current team if none is selected
  useEffect(() => {
    if (teams.length > 0 && !currentTeam) {
      setCurrentTeam(teams[0]);
    }
  }, [teams, currentTeam]);

  const createTeam = async (name: string, description: string): Promise<TeamWithMembers> => {
    if (!userId) throw new Error('User not authenticated');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate a slug from the name
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const newTeam = await teamService.createTeam({
        name,
        slug,
        description,
        created_by: userId
      }, userId);
      
      // Fetch the full team with members
      const teamWithMembers = await teamService.getTeam(newTeam.id);
      
      if (!teamWithMembers) {
        throw new Error('Failed to retrieve created team');
      }
      
      // Update teams list and set as current
      setTeams(prev => [...prev, teamWithMembers]);
      setCurrentTeam(teamWithMembers);
      
      toast({
        title: "Team Created",
        description: `${name} has been created successfully.`
      });
      
      return teamWithMembers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create team';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeam = async (teamId: string, name: string, description: string): Promise<TeamWithMembers> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate a slug from the name
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const updatedTeam = await teamService.updateTeam(teamId, { name, slug, description });
      
      // Fetch the full team with members
      const teamWithMembers = await teamService.getTeam(updatedTeam.id);
      
      if (!teamWithMembers) {
        throw new Error('Failed to retrieve updated team');
      }
      
      // Update teams list and current team if it's the one being updated
      setTeams(prev => prev.map(team => team.id === teamId ? teamWithMembers : team));
      
      if (currentTeam?.id === teamId) {
        setCurrentTeam(teamWithMembers);
      }
      
      toast({
        title: "Team Updated",
        description: `${name} has been updated successfully.`
      });
      
      return teamWithMembers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update team';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeam = async (teamId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await teamService.deleteTeam(teamId);
      
      // Remove from teams list and update current team if needed
      const updatedTeams = teams.filter(team => team.id !== teamId);
      setTeams(updatedTeams);
      
      if (currentTeam?.id === teamId) {
        setCurrentTeam(updatedTeams.length > 0 ? updatedTeams[0] : null);
      }
      
      toast({
        title: "Team Deleted",
        description: "The team has been deleted successfully."
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete team';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const inviteMember = async (email: string, role: TeamRole): Promise<void> => {
    if (!currentTeam) throw new Error('No team selected');
    
    setIsLoading(true);
    setError(null);
    
    try {
      await teamService.inviteToTeam(currentTeam.id, email, role);
      
      // Refresh the current team to get updated members
      await refreshTeams();
      
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${email}.`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to invite member';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemberRole = async (userId: string, role: TeamRole): Promise<void> => {
    if (!currentTeam) throw new Error('No team selected');
    
    setIsLoading(true);
    setError(null);
    
    try {
      await teamService.updateTeamMember(currentTeam.id, userId, { role });
      
      // Refresh the current team to get updated members
      await refreshTeams();
      
      toast({
        title: "Role Updated",
        description: `The member's role has been updated to ${role}.`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update member role';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (userId: string): Promise<void> => {
    if (!currentTeam) throw new Error('No team selected');
    
    setIsLoading(true);
    setError(null);
    
    try {
      await teamService.removeTeamMember(currentTeam.id, userId);
      
      // Refresh the current team to get updated members
      await refreshTeams();
      
      toast({
        title: "Member Removed",
        description: "The member has been removed from the team."
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove member';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (userId: string, roles: TeamRole[]): boolean => {
    if (!currentTeam) return false;
    
    const member = currentTeam.members.find(m => m.user_id === userId);
    return member ? roles.includes(member.role as TeamRole) : false;
  };

  const value = {
    teams,
    currentTeam,
    isLoading,
    error,
    setCurrentTeam,
    refreshTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    inviteMember,
    updateMemberRole,
    removeMember,
    hasRole
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};
