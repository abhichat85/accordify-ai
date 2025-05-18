import React, { useState, useEffect } from "react";
import { ThemeContext, ColorTheme, ModeTheme } from "./theme-constants";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

/**
 * ThemeProvider component that manages theme state and provides it via context
 */
export function ThemeProvider({ 
  children, 
  defaultTheme = "system",
  storageKey = "accord-ai-theme" 
}: ThemeProviderProps) {
  // Initialize from localStorage or defaults
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    if (typeof window === "undefined") return "purple";
    const savedColorTheme = localStorage.getItem(storageKey);
    return (savedColorTheme as ColorTheme) || "purple";
  });
  
  const [modeTheme, setModeTheme] = useState<ModeTheme>(() => {
    if (typeof window === "undefined") return "light";
    
    const savedModeTheme = localStorage.getItem("mode-theme");
    if (savedModeTheme) {
      return savedModeTheme as ModeTheme;
    }
    
    if (defaultTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    return (defaultTheme as ModeTheme) || "light";
  });

  // Effect to apply theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Save preferences to localStorage
    localStorage.setItem(storageKey, colorTheme);
    localStorage.setItem("mode-theme", modeTheme);
    
    // Apply theme classes to document
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove(
      "theme-purple", 
      "theme-orange", 
      "theme-zinc", 
      "theme-blue", 
      "theme-red", 
      "theme-rose", 
      "theme-green", 
      "theme-yellow"
    );
    root.classList.add(`theme-${colorTheme}`);
    
    // Apply dark/light mode
    if (modeTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
  }, [colorTheme, modeTheme, storageKey]);

  const value = {
    colorTheme,
    modeTheme,
    setColorTheme,
    setModeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
