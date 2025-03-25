
import React from "react";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  FileText, 
  History, 
  LayoutTemplate, 
  Settings, 
  User,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "border-b border-border/40 bg-background/80 backdrop-blur-md z-50 sticky top-0",
      className
    )}>
      <div className="flex items-center justify-between h-16 px-4 max-w-[1920px] mx-auto">
        <div className="flex items-center">
          <div className="flex items-center mr-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText size={18} className="text-primary-foreground" />
            </div>
            <h1 className="ml-3 text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Accord AI
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="rounded-lg gap-2 font-normal">
              <FileText size={16} />
              Contracts
            </Button>
            <Button variant="ghost" size="sm" className="rounded-lg gap-2 font-normal">
              <LayoutTemplate size={16} />
              Templates
            </Button>
            <Button variant="ghost" size="sm" className="rounded-lg gap-2 font-normal">
              <History size={16} />
              History
            </Button>
            <Button variant="ghost" size="sm" className="rounded-lg gap-2 font-normal">
              <BarChart3 size={16} />
              Analytics
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Replace the theme toggle with our new ThemeSwitcher */}
          <ThemeSwitcher />
          
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
    </header>
  );
};
