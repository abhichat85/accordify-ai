
import React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTheme, ColorTheme } from "@/contexts/ThemeContext";

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { colorTheme, modeTheme, setColorTheme, setModeTheme } = useTheme();

  const colorOptions: { value: ColorTheme; label: string; color: string }[] = [
    { value: "purple", label: "Purple", color: "bg-purple-500" },
    { value: "orange", label: "Orange", color: "bg-orange-500" },
    { value: "zinc", label: "Zinc", color: "bg-zinc-500" },
    { value: "blue", label: "Blue", color: "bg-blue-500" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`rounded-full ${className}`}>
          {modeTheme === "light" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setModeTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {modeTheme === "light" && (
            <span className="ml-auto">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setModeTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {modeTheme === "dark" && (
            <span className="ml-auto">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center">
          <Palette className="mr-2 h-4 w-4" />
          <span>Color Theme</span>
        </DropdownMenuLabel>
        
        {colorOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setColorTheme(option.value)}
            className="flex items-center"
          >
            <span className={`mr-2 h-4 w-4 rounded-full ${option.color}`} />
            <span>{option.label}</span>
            {colorTheme === option.value && (
              <span className="ml-auto">
                <span className="flex h-2 w-2 rounded-full bg-primary" />
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
