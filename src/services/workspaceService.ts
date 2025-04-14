import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Type definitions
export type Workspace = Tables<'workspaces'>;
export type WorkspaceInsert = TablesInsert<'workspaces'>;
export type WorkspaceUpdate = TablesUpdate<'workspaces'>;

export interface WorkspaceWithMembers extends Workspace {
  members: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  }[];
}

/**
 * Workspace Service - Handles all workspace-related operations
 */
export const workspaceService = {
  /**
   * Get all workspaces for the current user
   */
  async getUserWorkspaces(userId: string): Promise<WorkspaceWithMembers[]> {
    // Get workspaces where user has access
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('created_by', userId);

    if (error) {
      console.error('Error fetching workspaces:', error);
      throw new Error('Failed to fetch workspaces');
    }

    if (!workspaces || workspaces.length === 0) {
      return [];
    }

    // Get workspace members for each workspace
    const workspaceIds = workspaces.map(workspace => workspace.id);
    const { data: workspaceMembers, error: membersError } = await supabase
      .from('workspace_members')
      .select('workspace_id, user_id')
      .in('workspace_id', workspaceIds);

    if (membersError) {
      console.error('Error fetching workspace members:', membersError);
      // Continue with empty members
    }

    // For each workspace, create a members array with user IDs
    // In a real implementation, you would fetch user profiles from auth.users
    // but for now, we'll create placeholder data
    const membersByWorkspace = new Map();
    workspaceMembers?.forEach(member => {
      if (!membersByWorkspace.has(member.workspace_id)) {
        membersByWorkspace.set(member.workspace_id, []);
      }
      
      // Create a placeholder member object
      membersByWorkspace.get(member.workspace_id).push({
        id: member.user_id,
        name: `User ${member.user_id.substring(0, 8)}`,
        email: `user-${member.user_id.substring(0, 6)}@example.com`,
        avatar_url: null
      });
    });

    // Transform the data to match our WorkspaceWithMembers interface
    return workspaces.map(workspace => {
      return {
        ...workspace,
        members: membersByWorkspace.get(workspace.id) || []
      } as WorkspaceWithMembers;
    });
  },

  /**
   * Get a single workspace by ID with all members
   */
  async getWorkspace(workspaceId: string): Promise<WorkspaceWithMembers | null> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .single();

    if (error) {
      console.error('Error fetching workspace:', error);
      throw new Error('Failed to fetch workspace');
    }

    if (!data) return null;

    // Get workspace members
    const { data: workspaceMembers, error: membersError } = await supabase
      .from('workspace_members')
      .select('user_id')
      .eq('workspace_id', workspaceId);

    if (membersError) {
      console.error('Error fetching workspace members:', membersError);
      // Continue with empty members
    }

    // Create placeholder member objects
    const members = workspaceMembers?.map(member => ({
      id: member.user_id,
      name: `User ${member.user_id.substring(0, 8)}`,
      email: `user-${member.user_id.substring(0, 6)}@example.com`,
      avatar_url: null
    })) || [];

    return {
      ...data,
      members
    } as WorkspaceWithMembers;
  },

  /**
   * Create a new workspace
   */
  async createWorkspace(workspace: WorkspaceInsert, userId: string): Promise<Workspace> {
    // Start a transaction
    const { data: newWorkspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert(workspace)
      .select()
      .single();

    if (workspaceError) {
      console.error('Error creating workspace:', workspaceError);
      throw new Error('Failed to create workspace');
    }

    // Add the creator as a member
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: newWorkspace.id,
        user_id: userId
      });

    if (memberError) {
      console.error('Error adding workspace member:', memberError);
      // Try to clean up the workspace
      await supabase.from('workspaces').delete().eq('id', newWorkspace.id);
      throw new Error('Failed to add workspace member');
    }

    return newWorkspace;
  },

  /**
   * Update a workspace
   */
  async updateWorkspace(workspaceId: string, updates: WorkspaceUpdate): Promise<Workspace> {
    const { data, error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', workspaceId)
      .select()
      .single();

    if (error) {
      console.error('Error updating workspace:', error);
      throw new Error('Failed to update workspace');
    }

    return data;
  },

  /**
   * Delete a workspace
   */
  async deleteWorkspace(workspaceId: string): Promise<void> {
    // Workspace members will be automatically deleted due to foreign key constraints
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', workspaceId);

    if (error) {
      console.error('Error deleting workspace:', error);
      throw new Error('Failed to delete workspace');
    }
  },

  /**
   * Add a member to a workspace
   */
  async addWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspaceId,
        user_id: userId
      });

    if (error) {
      console.error('Error adding workspace member:', error);
      throw new Error('Failed to add workspace member');
    }
  },

  /**
   * Remove a member from a workspace
   */
  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing workspace member:', error);
      throw new Error('Failed to remove workspace member');
    }
  }
};
