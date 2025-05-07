import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../contexts/theme-constants";

/**
 * Hook to access the current theme state and functions
 */
export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
