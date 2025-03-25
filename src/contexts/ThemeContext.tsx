
import React, { createContext, useContext, useEffect, useState } from "react";

// Define theme types
export type ColorTheme = "purple" | "orange" | "zinc" | "blue" | "red" | "rose" | "green" | "yellow";
export type ModeTheme = "light" | "dark";

interface ThemeContextType {
  colorTheme: ColorTheme;
  modeTheme: ModeTheme;
  setColorTheme: (theme: ColorTheme) => void;
  setModeTheme: (mode: ModeTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorTheme: "purple", // Default color theme
  modeTheme: "light",   // Default mode
  setColorTheme: () => {},
  setModeTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or defaults
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const savedColorTheme = localStorage.getItem("color-theme");
    return (savedColorTheme as ColorTheme) || "purple";
  });
  
  const [modeTheme, setModeTheme] = useState<ModeTheme>(() => {
    const savedModeTheme = localStorage.getItem("mode-theme");
    return (savedModeTheme as ModeTheme) || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  // Effect to apply theme changes
  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem("color-theme", colorTheme);
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
    
  }, [colorTheme, modeTheme]);

  return (
    <ThemeContext.Provider value={{ colorTheme, modeTheme, setColorTheme, setModeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
