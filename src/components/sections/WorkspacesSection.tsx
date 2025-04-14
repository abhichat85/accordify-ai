import React, { useState } from "react";
import { Briefcase, Plus, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { WorkspaceWithMembers } from "@/services/workspaceService";

export const WorkspacesSection = () => {
  const { 
    workspaces, 
    currentWorkspace, 
    setCurrentWorkspace, 
    isLoading, 
    createWorkspace,
    updateWorkspace,
    deleteWorkspace
  } = useWorkspace();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [workspaceToEdit, setWorkspaceToEdit] = useState<string | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState("");

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    
    try {
      await createWorkspace(newWorkspaceName, newWorkspaceDescription);
      setCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  const handleEditWorkspace = async () => {
    if (!workspaceToEdit || !newWorkspaceName.trim()) return;
    
    try {
      await updateWorkspace(workspaceToEdit, newWorkspaceName, newWorkspaceDescription);
      setEditDialogOpen(false);
      setWorkspaceToEdit(null);
      resetForm();
    } catch (error) {
      console.error("Error updating workspace:", error);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await deleteWorkspace(workspaceId);
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const openEditDialog = (workspace: WorkspaceWithMembers) => {
    setWorkspaceToEdit(workspace.id);
    setNewWorkspaceName(workspace.name);
    setNewWorkspaceDescription(workspace.description || "");
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setNewWorkspaceName("");
    setNewWorkspaceDescription("");
  };

  // If loading, show a loading state
  if (isLoading) {
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Workspaces</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // If no workspaces, show empty state
  if (workspaces.length === 0) {
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Create Workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new workspace</DialogTitle>
                <DialogDescription>
                  Workspaces help you organize your contracts and team members.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="My Workspace"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose of this workspace"
                    value={newWorkspaceDescription}
                    onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWorkspace}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No workspaces yet</h3>
          <p className="text-muted-foreground mt-1 mb-4 max-w-md">
            Create your first workspace to start organizing your contracts and team members.
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            Create Workspace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <p className="text-muted-foreground mt-1">Manage your workspaces and their members</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Create Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new workspace</DialogTitle>
              <DialogDescription>
                Workspaces help you organize your contracts and team members.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="My Workspace"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this workspace"
                  value={newWorkspaceDescription}
                  onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkspace}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((workspace) => (
          <Card 
            key={workspace.id} 
            className={`overflow-hidden ${
              currentWorkspace?.id === workspace.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{workspace.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEditDialog(workspace)}>
                      Edit workspace
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentWorkspace(workspace)}>
                      Set as active
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteWorkspace(workspace.id)}
                    >
                      Delete workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="line-clamp-2">
                {workspace.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users size={14} className="mr-1" />
                <span>{workspace.members.length} members</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setCurrentWorkspace(workspace)}
              >
                {currentWorkspace?.id === workspace.id ? "Current workspace" : "Switch to this workspace"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Workspace Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit workspace</DialogTitle>
            <DialogDescription>
              Update the details of your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditWorkspace}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
