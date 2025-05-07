import { createContext } from "react";

// Define theme types
export type ColorTheme = "purple" | "orange" | "zinc" | "blue" | "red" | "rose" | "green" | "yellow";
export type ModeTheme = "light" | "dark";

export interface ThemeContextType {
  colorTheme: ColorTheme;
  modeTheme: ModeTheme;
  setColorTheme: (theme: ColorTheme) => void;
  setModeTheme: (mode: ModeTheme) => void;
}

// Create default context values
export const defaultThemeContext: ThemeContextType = {
  colorTheme: "purple",
  modeTheme: "light",
  setColorTheme: () => {},
  setModeTheme: () => {},
};

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);
