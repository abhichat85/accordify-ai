
import React from "react";

type Role = "Admin" | "Editor" | "Viewer";

interface RoleBasedActionProps {
  userRole: Role;
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders its children based on user role
 */
export const RoleBasedAction: React.FC<RoleBasedActionProps> = ({
  userRole,
  allowedRoles,
  children,
  fallback
}) => {
  const hasPermission = allowedRoles.includes(userRole);
  
  if (hasPermission) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};
