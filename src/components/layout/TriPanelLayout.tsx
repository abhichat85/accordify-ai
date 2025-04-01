import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  History, 
  LayoutTemplate, 
  Settings, 
  User,
  Bell,
  PanelLeft,
  PanelRight,
  Users,
  Briefcase,
  CreditCard,
  Sparkles,
  MessageSquare,
  FileSignature,
  BarChart3,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { NotificationPanel } from "./NotificationPanel";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Badge } from "@/components/ui/badge";

interface TriPanelLayoutProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
}

export const TriPanelLayout: React.FC<TriPanelLayoutProps> = ({
  leftPanel,
  centerPanel,
  rightPanel,
  className
}) => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn("flex h-screen w-screen", className)}>
      {/* Left Panel */}
      <div className={cn(
        "flex flex-col bg-background border-r border-border/40 h-full transition-all duration-300",
        leftCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/40">
          <div className={cn("flex items-center", leftCollapsed ? "justify-center w-full" : "")}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <MessageSquare size={18} className="text-primary-foreground" />
            </div>
            {!leftCollapsed && (
              <h1 className="ml-3 text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Accord AI
              </h1>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setLeftCollapsed(!leftCollapsed)}>
            <PanelLeft size={18} />
          </Button>
        </div>
        
        <ScrollArea className="flex-grow styled-scrollbar">
          <div className={cn("py-4 px-3", leftCollapsed ? "items-center" : "")}>
            <div className="mb-6">
              <h3 className={cn(
                "text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3",
                leftCollapsed ? "px-2" : "px-2"
              )}>
                {!leftCollapsed && "MAIN"}
              </h3>
              
              <nav className="space-y-1.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "w-full justify-start rounded-lg gap-3 font-medium hover:bg-primary/10",
                    leftCollapsed ? "justify-center px-2" : ""
                  )}
                  onClick={() => handleNavigate("/app")}
                >
                  <FileText size={leftCollapsed ? 18 : 16} className="text-primary/80" />
                  {!leftCollapsed && <span>Contracts</span>}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "w-full justify-start rounded-lg gap-3 font-medium hover:bg-primary/10",
                    leftCollapsed ? "justify-center px-2" : ""
                  )}
                  onClick={() => handleNavigate("/templates")}
                >
                  <LayoutTemplate size={leftCollapsed ? 18 : 16} className="text-primary/80" />
                  {!leftCollapsed && <span>Templates</span>}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "w-full justify-start rounded-lg gap-3 font-medium hover:bg-primary/10",
                    leftCollapsed ? "justify-center px-2" : ""
                  )}
                  onClick={() => handleNavigate("/history")}
                >
                  <History size={leftCollapsed ? 18 : 16} className="text-primary/80" />
                  {!leftCollapsed && <span>All Contracts</span>}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "w-full justify-start rounded-lg gap-3 font-medium hover:bg-primary/10",
                    leftCollapsed ? "justify-center px-2" : ""
                  )}
                  onClick={() => handleNavigate("/signatures")}
                >
                  <FileSignature size={leftCollapsed ? 18 : 16} className="text-primary/80" />
                  {!leftCollapsed && <span>E-Signatures</span>}
                </Button>
              </nav>
            </div>
            
            <div className="mb-6">
              <h3 className={cn(
                "text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3",
                leftCollapsed ? "px-2" : "px-2"
              )}>
                {!leftCollapsed && "WORKSPACE"}
              </h3>
              
              <nav className="space-y-1.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "w-full justify-start rounded-lg gap-3 font-medium hover:bg-primary/10",
                    leftCollapsed ? "justify-center px-2" : ""
                  )}
                  onClick={() => handleNavigate("/workspaces")}
                >
                  <Briefcase size={leftCollapsed ? 18 : 16} className="text-primary/80" />
                  {!leftCollapsed && <span>Workspaces</span>}
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "w-full justify-start rounded-lg gap-3 font-medium hover:bg-primary/10",
                    leftCollapsed ? "justify-center px-2" : ""
                  )}
                  onClick={() => handleNavigate("/team")}
                >
                  <Users size={leftCollapsed ? 18 : 16} className="text-primary/80" />
                  {!leftCollapsed && <span>Team</span>}
                </Button>
              </nav>
            </div>
            
            {!leftCollapsed && (
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3 px-2">
                  RECENT
                </h3>
                
                <div className="space-y-1.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Button 
                      key={i}
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start rounded-lg text-xs overflow-hidden text-ellipsis whitespace-nowrap font-medium hover:bg-primary/10"
                      onClick={() => handleNavigate(`/contracts/nda-${i+1}`)}
                    >
                      <FileText size={14} className="mr-3 shrink-0 text-primary/80" />
                      <span>NDA - XYZ Company {i + 1}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {leftCollapsed && (
              <div className="flex justify-center mt-6">
                <FileText size={18} className="text-muted-foreground" />
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 mt-auto">
          <Button
            variant="default"
            size={leftCollapsed ? "icon" : "lg"}
            className={cn(
              "w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
              leftCollapsed ? "aspect-square p-0 h-10 w-10" : "h-11"
            )}
            onClick={() => handleNavigate("/pricing")}
          >
            {leftCollapsed ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                <span>UPGRADE TO PRO</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="p-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <ThemeSwitcher />
            
            <div ref={notificationRef} className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full relative"
                onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              
              {notificationPanelOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-96 shadow-lg z-50">
                  <NotificationPanel />
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-full h-8 w-8 p-0"
                  onClick={() => {}}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleNavigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleNavigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleNavigate("/billing")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "flex-grow h-full transition-all duration-300 overflow-auto relative",
        rightCollapsed ? "pr-0" : "pr-0"
      )}>
        {centerPanel}
      </div>
      
      <div className={cn(
        "h-full border-l border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 flex flex-col",
        rightCollapsed ? "w-16" : "w-96"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/40 bg-background/80">
          {!rightCollapsed && (
            <div className="flex items-center space-x-2">
              <MessageSquare size={18} className="text-primary" />
              <h2 className="text-base font-medium">AI Agent</h2>
            </div>
          )}
          
          <div className="flex items-center space-x-1 ml-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "rounded-full h-9 w-9",
                rightCollapsed ? "mx-auto" : ""
              )} 
              onClick={() => setRightCollapsed(!rightCollapsed)}
            >
              <PanelRight size={18} />
            </Button>
          </div>
        </div>
        
        {rightCollapsed ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)] text-muted-foreground">
            <MessageSquare size={24} />
          </div>
        ) : (
          rightPanel
        )}
      </div>
    </div>
  );
};
