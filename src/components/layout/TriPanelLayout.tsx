
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  FileText, 
  History, 
  LayoutTemplate, 
  Settings, 
  User,
  Bell,
  Moon,
  Sun,
  PanelLeft,
  PanelRight,
  Users,
  Briefcase,
  CreditCard,
  Sparkles,
  ChevronRight,
  MessageSquare,
  X,
  Clock
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navigate = useNavigate();
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn("flex h-screen overflow-hidden", className)}>
      {/* Left Panel */}
      <div className={cn(
        "flex flex-col bg-background border-r border-border/40 h-full transition-all duration-300",
        leftCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/40">
          <div className={cn("flex items-center", leftCollapsed ? "justify-center w-full" : "")}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText size={18} className="text-primary-foreground" />
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
        
        <ScrollArea className="flex-grow">
          <div className={cn("py-4 px-3", leftCollapsed ? "items-center" : "")}>
            <nav className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "w-full justify-start rounded-lg gap-2 font-normal",
                  leftCollapsed ? "justify-center px-2" : ""
                )}
                onClick={() => handleNavigate("/contracts")}
              >
                <FileText size={leftCollapsed ? 20 : 16} />
                {!leftCollapsed && <span>Contracts</span>}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "w-full justify-start rounded-lg gap-2 font-normal",
                  leftCollapsed ? "justify-center px-2" : ""
                )}
                onClick={() => handleNavigate("/templates")}
              >
                <LayoutTemplate size={leftCollapsed ? 20 : 16} />
                {!leftCollapsed && <span>Templates</span>}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "w-full justify-start rounded-lg gap-2 font-normal",
                  leftCollapsed ? "justify-center px-2" : ""
                )}
                onClick={() => handleNavigate("/history")}
              >
                <History size={leftCollapsed ? 20 : 16} />
                {!leftCollapsed && <span>History</span>}
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "w-full justify-start rounded-lg gap-2 font-normal",
                  leftCollapsed ? "justify-center px-2" : ""
                )}
                onClick={() => handleNavigate("/workspaces")}
              >
                <Briefcase size={leftCollapsed ? 20 : 16} />
                {!leftCollapsed && <span>Workspaces</span>}
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "w-full justify-start rounded-lg gap-2 font-normal",
                  leftCollapsed ? "justify-center px-2" : ""
                )}
                onClick={() => handleNavigate("/team")}
              >
                <Users size={leftCollapsed ? 20 : 16} />
                {!leftCollapsed && <span>Team</span>}
              </Button>
            </nav>
            
            <div className="mt-8">
              <h3 className={cn(
                "text-xs font-medium text-muted-foreground mb-2",
                leftCollapsed ? "text-center" : "px-2"
              )}>
                {!leftCollapsed && "Recent Contracts"}
              </h3>
              
              <div className="space-y-1">
                {!leftCollapsed && Array.from({ length: 3 }).map((_, i) => (
                  <Button 
                    key={i}
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start rounded-lg text-xs overflow-hidden text-ellipsis whitespace-nowrap"
                    onClick={() => handleNavigate(`/contracts/nda-${i+1}`)}
                  >
                    <FileText size={14} className="mr-2 shrink-0" />
                    <span>NDA - XYZ Company {i + 1}</span>
                  </Button>
                ))}
                
                {leftCollapsed && (
                  <div className="flex justify-center">
                    <FileText size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Upgrade to Pro Button */}
            <div className="mt-8">
              <Button
                className={cn(
                  "w-full rounded-xl py-5 relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group",
                  leftCollapsed ? "p-2" : "px-4"
                )}
                onClick={() => handleNavigate("/pricing")}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')] opacity-50"></div>
                {leftCollapsed ? (
                  <Sparkles size={20} className="text-white" />
                ) : (
                  <div className="flex items-center justify-between w-full z-10">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-white" />
                      <span className="text-white font-medium">Upgrade to Pro</span>
                    </div>
                    <ChevronRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full relative"
              onClick={() => handleNavigate("/notifications")}
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>

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
      
      {/* Center Panel */}
      <div className={cn(
        "flex-grow h-full transition-all duration-300 overflow-auto",
        rightCollapsed ? "pr-0" : "pr-0"
      )}>
        {centerPanel}
      </div>
      
      {/* Right Panel - Improved AI Assistant */}
      <div className={cn(
        "h-full border-l border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 flex flex-col",
        rightCollapsed ? "w-16" : "w-96"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/40 bg-background/80">
          {!rightCollapsed && (
            <div className="flex items-center space-x-2">
              <MessageSquare size={18} className="text-primary" />
              <h2 className="text-base font-medium">AI Assistant</h2>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            {!rightCollapsed && (
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <X size={14} />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "rounded-full h-8 w-8",
                rightCollapsed ? "mx-auto" : ""
              )} 
              onClick={() => setRightCollapsed(!rightCollapsed)}
            >
              <PanelRight size={16} />
            </Button>
          </div>
        </div>
        
        {rightCollapsed ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)] text-muted-foreground">
            <MessageSquare size={24} />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Status bar */}
            <div className="bg-muted/10 border-b border-border/30 py-1.5 px-3 flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span>AI Agent Active</span>
            </div>
            
            {/* Main content area */}
            <div className="h-[calc(100%-2.5rem)] overflow-hidden">
              {rightPanel}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
