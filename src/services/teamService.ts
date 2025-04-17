import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate, Enums } from '@/integrations/supabase/types';

// Type definitions
export type TeamRole = Enums<'team_role'>;
export type Team = Tables<'teams'>;
export type TeamMember = Tables<'team_members'>;
export type TeamInsert = TablesInsert<'teams'>;
export type TeamMemberInsert = TablesInsert<'team_members'>;
export type TeamUpdate = TablesUpdate<'teams'>;
export type TeamMemberUpdate = TablesUpdate<'team_members'>;

export interface TeamWithMembers extends Team {
  members: TeamMember[];
}

/**
 * Team Service - Handles all team-related operations
 */
export const teamService = {
  /**
   * Get all teams for the current user
   */
  async getUserTeams(userId: string): Promise<TeamWithMembers[]> {
    // First get teams where user is a member
    const { data: teamMembers, error: memberError } = await supabase
      .from('team_members')
      .select('team_id, role')
      .eq('user_id', userId);

    if (memberError) {
      console.error('Error fetching team memberships:', memberError);
      throw new Error('Failed to fetch team memberships');
    }

    if (!teamMembers || teamMembers.length === 0) {
      return [];
    }

    // Get the team IDs
    const teamIds = teamMembers.map(member => member.team_id);

    // Fetch the teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*, team_members(*)')
      .in('id', teamIds);

    if (teamsError) {
      console.error('Error fetching teams:', teamsError);
      throw new Error('Failed to fetch teams');
    }

    // Transform the data to match our TeamWithMembers interface
    return (teams || []).map(team => ({
      ...team,
      members: team.team_members || []
    })) as unknown as TeamWithMembers[];
  },

  /**
   * Get a single team by ID with all members
   */
  async getTeam(teamId: string): Promise<TeamWithMembers | null> {
    const { data, error } = await supabase
      .from('teams')
      .select('*, team_members(*)')
      .eq('id', teamId)
      .single();

    if (error) {
      console.error('Error fetching team:', error);
      throw new Error('Failed to fetch team');
    }

    if (!data) return null;

    // Transform to match our interface
    return {
      ...data,
      members: data.team_members || []
    } as unknown as TeamWithMembers;
  },

  /**
   * Create a new team
   */
  async createTeam(team: Omit<TeamInsert, 'description'> & { description?: string }, userId: string): Promise<Team> {
    // Start a transaction
    const { data: newTeam, error: teamError } = await supabase
      .from('teams')
      .insert(team)
      .select()
      .single();

    if (teamError) {
      console.error('Error creating team:', teamError);
      throw new Error('Failed to create team');
    }

    // Add the creator as an owner
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: newTeam.id,
        user_id: userId,
        role: 'owner'
      });

    if (memberError) {
      console.error('Error adding team owner:', memberError);
      // Try to clean up the team
      await supabase.from('teams').delete().eq('id', newTeam.id);
      throw new Error('Failed to add team owner');
    }

    return newTeam;
  },

  /**
   * Update a team
   */
  async updateTeam(teamId: string, updates: Omit<TeamUpdate, 'description'> & { description?: string }): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single();

    if (error) {
      console.error('Error updating team:', error);
      throw new Error('Failed to update team');
    }

    return data;
  },

  /**
   * Delete a team
   */
  async deleteTeam(teamId: string): Promise<void> {
    // Team members will be automatically deleted due to foreign key constraints
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) {
      console.error('Error deleting team:', error);
      throw new Error('Failed to delete team');
    }
  },

  /**
   * Get all members of a team
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*, profiles(id, full_name, email, avatar_url)')
      .eq('team_id', teamId);

    if (error) {
      console.error('Error fetching team members:', error);
      throw new Error('Failed to fetch team members');
    }

    return data;
  },

  /**
   * Add a member to a team
   */
  async addTeamMember(teamMember: TeamMemberInsert): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert(teamMember)
      .select()
      .single();

    if (error) {
      console.error('Error adding team member:', error);
      throw new Error('Failed to add team member');
    }

    return data;
  },

  /**
   * Update a team member's role
   */
  async updateTeamMember(
    teamId: string,
    userId: string,
    updates: TeamMemberUpdate
  ): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating team member:', error);
      throw new Error('Failed to update team member');
    }

    return data;
  },

  /**
   * Remove a member from a team
   */
  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing team member:', error);
      throw new Error('Failed to remove team member');
    }
  },

  /**
   * Check if a user has a specific role in a team
   */
  async checkUserRole(
    teamId: string,
    userId: string,
    roles: TeamRole[]
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }

    return roles.includes(data.role as TeamRole);
  },

  /**
   * Invite a user to a team (creates a pending invitation)
   */
  // async inviteToTeam(
  //   teamId: string,
  //   email: string,
  //   role: TeamRole
  // ): Promise<void> {
  //   try {
  //     // Use a simpler query approach with explicit type assertions to avoid TypeScript errors
  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select('id')
  //       .eq('email', email) 
  //       .maybeSingle();
      
  //     if (error) {
  //       console.error('Error checking user:', error);
  //       throw new Error('Failed to check if user exists');
  //     }
      
  //     const userProfile = data as { id: string } | null;

  //     if (userProfile) {
  //       // User exists, add them directly
  //       await this.addTeamMember({
  //         team_id: teamId,
  //         user_id: userProfile.id,
  //         role: role
  //       });
  //     } else {
  //       // User doesn't exist, create a pending invitation
  //       // This would normally store the invitation in a database and send an email
  //       console.log(`Invitation sent to ${email} for team ${teamId} with role ${role}`);
  //     }
  //   } catch (error) {
  //     console.error('Error inviting user to team:', error);
  //     throw new Error('Failed to invite user to team');
  //   }
  // }
};
