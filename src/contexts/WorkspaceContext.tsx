import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { workspaceService, WorkspaceWithMembers } from '@/services/workspaceService';
import { useToast } from '@/components/ui/use-toast';

interface WorkspaceContextType {
  workspaces: WorkspaceWithMembers[];
  currentWorkspace: WorkspaceWithMembers | null;
  isLoading: boolean;
  error: string | null;
  setCurrentWorkspace: (workspace: WorkspaceWithMembers | null) => void;
  refreshWorkspaces: () => Promise<void>;
  createWorkspace: (name: string, description: string) => Promise<WorkspaceWithMembers>;
  updateWorkspace: (workspaceId: string, name: string, description: string) => Promise<WorkspaceWithMembers>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  addMember: (userId: string) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Custom hook to use the workspace context
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

interface WorkspaceProviderProps {
  children: ReactNode;
  userId?: string;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children, userId }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceWithMembers[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Define refreshWorkspaces with useCallback to avoid dependency cycles
  const refreshWorkspaces = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedWorkspaces = await workspaceService.getUserWorkspaces(userId);
      setWorkspaces(fetchedWorkspaces);
      
      // If current workspace exists, refresh it with updated data
      if (currentWorkspace) {
        const updatedCurrentWorkspace = fetchedWorkspaces.find(workspace => workspace.id === currentWorkspace.id);
        if (updatedCurrentWorkspace) {
          setCurrentWorkspace(updatedCurrentWorkspace);
        } else if (fetchedWorkspaces.length > 0) {
          // If current workspace no longer exists, set the first available workspace
          setCurrentWorkspace(fetchedWorkspaces[0]);
        } else {
          setCurrentWorkspace(null);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workspaces';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentWorkspace, toast]);

  // Load workspaces when userId changes
  useEffect(() => {
    if (userId) {
      refreshWorkspaces();
    } else {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setIsLoading(false);
    }
  }, [userId, refreshWorkspaces]);

  // Set the first workspace as current workspace if none is selected
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace]);

  const createWorkspace = async (name: string, description: string): Promise<WorkspaceWithMembers> => {
    if (!userId) throw new Error('User not authenticated');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate a slug from the name
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const newWorkspace = await workspaceService.createWorkspace({
        name,
        description,
        created_by: userId,
        slug
      }, userId);
      
      // Fetch the full workspace with members
      const workspaceWithMembers = await workspaceService.getWorkspace(newWorkspace.id);
      
      if (!workspaceWithMembers) {
        throw new Error('Failed to retrieve created workspace');
      }
      
      // Update workspaces list and set as current
      setWorkspaces(prev => [...prev, workspaceWithMembers]);
      setCurrentWorkspace(workspaceWithMembers);
      
      toast({
        title: "Workspace Created",
        description: `${name} has been created successfully.`
      });
      
      return workspaceWithMembers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create workspace';
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

  const updateWorkspace = async (workspaceId: string, name: string, description: string): Promise<WorkspaceWithMembers> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedWorkspace = await workspaceService.updateWorkspace(workspaceId, { name, description });
      
      // Fetch the full workspace with members
      const workspaceWithMembers = await workspaceService.getWorkspace(updatedWorkspace.id);
      
      if (!workspaceWithMembers) {
        throw new Error('Failed to retrieve updated workspace');
      }
      
      // Update workspaces list and current workspace if it's the one being updated
      setWorkspaces(prev => prev.map(workspace => workspace.id === workspaceId ? workspaceWithMembers : workspace));
      
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(workspaceWithMembers);
      }
      
      toast({
        title: "Workspace Updated",
        description: `${name} has been updated successfully.`
      });
      
      return workspaceWithMembers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update workspace';
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

  const deleteWorkspace = async (workspaceId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await workspaceService.deleteWorkspace(workspaceId);
      
      // Remove from workspaces list and update current workspace if needed
      const updatedWorkspaces = workspaces.filter(workspace => workspace.id !== workspaceId);
      setWorkspaces(updatedWorkspaces);
      
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(updatedWorkspaces.length > 0 ? updatedWorkspaces[0] : null);
      }
      
      toast({
        title: "Workspace Deleted",
        description: "The workspace has been deleted successfully."
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete workspace';
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

  const addMember = async (userId: string): Promise<void> => {
    if (!currentWorkspace) throw new Error('No workspace selected');
    
    setIsLoading(true);
    setError(null);
    
    try {
      await workspaceService.addWorkspaceMember(currentWorkspace.id, userId);
      
      // Refresh the current workspace to get updated members
      await refreshWorkspaces();
      
      toast({
        title: "Member Added",
        description: `The user has been added to the workspace.`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add member';
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
    if (!currentWorkspace) throw new Error('No workspace selected');
    
    setIsLoading(true);
    setError(null);
    
    try {
      await workspaceService.removeWorkspaceMember(currentWorkspace.id, userId);
      
      // Refresh the current workspace to get updated members
      await refreshWorkspaces();
      
      toast({
        title: "Member Removed",
        description: "The member has been removed from the workspace."
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

  const value = {
    workspaces,
    currentWorkspace,
    isLoading,
    error,
    setCurrentWorkspace,
    refreshWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addMember,
    removeMember
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};
