
import React from "react";
import { 
  Shield, 
  Users, 
  Eye, 
  Edit2,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Role = "Admin" | "Editor" | "Viewer";

interface RoleInfoProps {
  role: Role;
}

const RoleInfo: React.FC<RoleInfoProps> = ({ role }) => {
  const getRoleDetails = (role: Role) => {
    switch (role) {
      case "Admin":
        return {
          icon: <Shield className="w-4 h-4 mr-1.5" />,
          color: "bg-purple-100 text-purple-700",
          description: "Full access to create, edit, and delete contracts."
        };
      case "Editor":
        return {
          icon: <Edit2 className="w-4 h-4 mr-1.5" />,
          color: "bg-blue-100 text-blue-700",
          description: "Can create and edit contracts, but cannot delete them."
        };
      case "Viewer":
        return {
          icon: <Eye className="w-4 h-4 mr-1.5" />,
          color: "bg-gray-100 text-gray-700",
          description: "View-only access to contracts."
        };
    }
  };

  const details = getRoleDetails(role);

  return (
    <div className="flex items-center">
      <Badge variant="outline" className={`${details.color} flex items-center px-2 py-1`}>
        {details.icon}
        {role}
      </Badge>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 ml-1.5 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-64 text-sm">{details.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

interface RoleSelectProps {
  currentRole: Role;
  onChange: (role: Role) => void;
  disabled?: boolean;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ 
  currentRole, 
  onChange, 
  disabled = false 
}) => {
  return (
    <Select 
      defaultValue={currentRole} 
      onValueChange={(value) => onChange(value as Role)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Admin">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-purple-700" />
            <span>Admin</span>
          </div>
        </SelectItem>
        <SelectItem value="Editor">
          <div className="flex items-center">
            <Edit2 className="w-4 h-4 mr-2 text-blue-700" />
            <span>Editor</span>
          </div>
        </SelectItem>
        <SelectItem value="Viewer">
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2 text-gray-700" />
            <span>Viewer</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export { RoleInfo };
