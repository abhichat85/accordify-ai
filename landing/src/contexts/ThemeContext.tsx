/**
 * Compatibility layer for ThemeContext
 * 
 * This component serves as a re-export of the ThemeProvider to maintain
 * backward compatibility with components that import from @/contexts/ThemeContext
 */

import { ThemeProvider as OriginalThemeProvider } from './ThemeProvider';

// Re-export the provider as a component only
export function ThemeProvider(props: React.ComponentProps<typeof OriginalThemeProvider>) {
  return <OriginalThemeProvider {...props} />;
}
