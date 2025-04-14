import React from "react";
import { 
  Shield, 
  Users, 
  Eye, 
  Edit2,
  Info,
  UserCog
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
import { TeamRole } from "@/services/teamService";

type Role = TeamRole;

interface RoleInfoProps {
  role: TeamRole;
}

const RoleInfo: React.FC<RoleInfoProps> = ({ role }) => {
  const getRoleDetails = (role: TeamRole) => {
    switch (role) {
      case "owner":
        return {
          icon: <Shield className="w-4 h-4 mr-1.5 text-amber-500" />,
          color: "bg-amber-100 text-amber-700",
          description: "Full access to all resources and settings"
        };
      case "admin":
        return {
          icon: <UserCog className="w-4 h-4 mr-1.5 text-blue-500" />,
          color: "bg-blue-100 text-blue-700",
          description: "Can manage team members and most settings"
        };
      case "member":
        return {
          icon: <Users className="w-4 h-4 mr-1.5 text-green-500" />,
          color: "bg-green-100 text-green-700",
          description: "Can view and edit shared resources"
        };
      default:
        return {
          icon: <Users className="w-4 h-4 mr-1.5 text-gray-500" />,
          color: "bg-gray-100 text-gray-700",
          description: "Unknown role"
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
  currentRole: TeamRole;
  onChange: (role: string) => void;
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
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="owner">
          <div className="flex items-center">
            <Shield className="mr-2 h-4 w-4 text-amber-500" />
            <span>Owner</span>
          </div>
        </SelectItem>
        <SelectItem value="admin">
          <div className="flex items-center">
            <UserCog className="mr-2 h-4 w-4 text-blue-500" />
            <span>Admin</span>
          </div>
        </SelectItem>
        <SelectItem value="member">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-green-500" />
            <span>Member</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export { RoleInfo };
