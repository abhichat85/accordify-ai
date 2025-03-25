
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
  PanelRight
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
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
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
              <Button variant="ghost" size="sm" className={cn(
                "w-full justify-start rounded-lg gap-2 font-normal",
                leftCollapsed ? "justify-center px-2" : ""
              )}>
                <FileText size={leftCollapsed ? 20 : 16} />
                {!leftCollapsed && <span>Contracts</span>}
              </Button>
              
              <Button variant="ghost" size="sm" className={cn(
                "w-full justify-start rounded-lg gap-2 font-normal",
                leftCollapsed ? "justify-center px-2" : ""
              )}>
                <LayoutTemplate size={leftCollapsed ? 20 : 16} />
                {!leftCollapsed && <span>Templates</span>}
              </Button>
              
              <Button variant="ghost" size="sm" className={cn(
                "w-full justify-start rounded-lg gap-2 font-normal",
                leftCollapsed ? "justify-center px-2" : ""
              )}>
                <History size={leftCollapsed ? 20 : 16} />
                {!leftCollapsed && <span>History</span>}
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
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
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
      
      {/* Right Panel */}
      <div className={cn(
        "h-full border-l border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300",
        rightCollapsed ? "w-16" : "w-96"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/40">
          {!rightCollapsed && (
            <h2 className="text-base font-medium">AI Assistant</h2>
          )}
          
          <Button variant="ghost" size="icon" className={cn(
            "rounded-full",
            rightCollapsed ? "mx-auto" : ""
          )} onClick={() => setRightCollapsed(!rightCollapsed)}>
            <PanelRight size={18} />
          </Button>
        </div>
        
        {rightCollapsed ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)] text-muted-foreground">
            <FileText size={24} />
          </div>
        ) : (
          <div className="h-[calc(100%-4rem)]">
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  );
};
