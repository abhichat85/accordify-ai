# Landing Page Design Synchronization Plan

This document outlines the detailed plan to align the landing page design with the root application design system.

## COMPREHENSIVE GAP ANALYSIS (May 2025 Update)

Based on a systematic gap analysis between the landing page and root application, the following key areas need additional focus:

### Build & Tooling Gaps
- **Path Aliases**: Root uses `@/` alias in vite.config.ts; landing needs identical configuration
- **tsconfig Paths**: Landing only maps `@/components`; needs to add `@/lib`, `@/styles`
- **Missing Dependencies**: Need to add `@tailwindcss/line-clamp`, `@heroicons/*`, `clsx`
- **Build Plugins**: Missing `@vitejs/plugin-legacy` for consistent CSS hash generation
- **PostCSS Configuration**: Different directive handling affecting `@apply` usage

### Design Token Gaps
- **Shadow Definitions**: Missing "glass-lg", "glow-sm" shadows used in Hero section
- **Animation Keyframes**: Missing `glowPulse`, `blobFloat` used by background blobs
- **CSS Variables**: Missing ~40 color variables and radial-gradient helpers

### Theme System Structure
- **Context Organization**: Root expects both context and hook from the same file
- **Storage Keys**: Inconsistent localStorage keys (`accord-ai-theme` vs `accordify-landing-theme`)
- **Theme UI**: Root has 11 color themes via dropdown; landing has simplified buttons

### Component Gaps
- **Layout Structure**: Missing MainLayout wrapper with ScrollTop, CookieBanner, MetaTags
- **Missing Sections**: HeroSection (blob BG), Pricing, FAQ components missing
- **Interactive Elements**: WaitlistModal, EmailCapture functionality absent
- **Background Assets**: SVG textures missing from public directory

### Asset & Font Handling
- **Font Hosting**: Root self-hosts fonts; landing uses Google CDN
- **Icon Libraries**: Missing Heroicons package referenced by components

### Configuration & Environment
- **Environment Variables**: Missing .env with VITE_APP_VERSION, VITE_SUPABASE_URL
- **Meta Headers**: Missing dynamic theme-color meta tag and proper CSP

## Phase 1: CSS Variables and Theme Structure

1. **Create Theme Directory Structure**
   - Create `/landing/src/styles/themes` directory
   - Set up file structure to mirror root application

2. **Implement Purple Theme (Primary)**
   - Create `/landing/src/styles/themes/purple.css`
   - Copy exact HSL values from root app's purple theme
   - Implement both light and dark mode variables

3. **Add Secondary Theme Files**
   - Create remaining theme files (orange.css, zinc.css, blue.css, etc.)
   - Ensure consistent variable structure across all themes

4. **Update Main CSS Index File**
   - Modify `/landing/src/styles/index.css` to import all theme files
   - Add theme switching capability if present in root app

5. **Implement Chart Colors**
   - Add chart color variables (--chart-1 through --chart-5)
   - Ensure they match the root application's values

6. **Add Accord Branded Colors**
   - Implement accord-specific color variables (blue, teal, orange, etc.)
   - Ensure they're accessible throughout the application

7. **Add Sidebar Color Variables**
   - Implement sidebar-specific color variables
   - Ensure proper dark/light mode handling for sidebar colors

8. **Create Base CSS File**
   - Create `/landing/src/styles/base.css` if not present
   - Implement base styles matching root application

## Phase 2: Typography and Animation Systems

9. **Add Font Imports**
   - Update CSS to import Poppins and Jost fonts
   - Ensure proper font weights are included (300-700)

10. **Configure Font Family Extensions**
    - Update tailwind.config.ts to include font family extensions
    - Add Inter, Poppins, and Jost font configurations

11. **Apply Font Classes**
    - Update base HTML elements to use appropriate font classes
    - Ensure consistent typography across components

12. **Create Animations CSS File**
    - Create `/landing/src/styles/animations.css`
    - Copy all animation keyframes from root application

13. **Implement Fade Animations**
    - Add fade-in/fade-out animations
    - Ensure proper timing and easing functions

14. **Implement Slide Animations**
    - Add slide-in-right/slide-out-right animations
    - Add slide-in-up/slide-out-down animations

15. **Implement Scale and Pulse Animations**
    - Add scale-in/scale-out animations
    - Add pulse-subtle animation
    - Ensure proper timing and easing functions

16. **Update Animation Utility Classes**
    - Ensure animation classes are properly defined in tailwind config
    - Test animation applications on components

## Phase 3: Plugin Configuration and Tailwind Config Updates

17. **Add Tailwind Scrollbar Plugin**
    - Install tailwind-scrollbar plugin
    - Update package.json dependencies

18. **Configure Scrollbar Plugin**
    - Add scrollbar plugin to tailwind.config.ts
    - Configure scrollbar styling to match root app

19. **Maintain Typography Plugin**
    - Ensure @tailwindcss/typography plugin is properly configured
    - Align typography styles with root application

20. **Update Content Paths**
    - Expand content paths in tailwind.config.ts
    - Include all necessary file patterns

21. **Synchronize Border Radius System**
    - Update border radius variables to match root app
    - Ensure consistent radius application

22. **Add Extended Theme Configurations**
    - Copy any additional theme extensions from root app
    - Ensure proper integration with existing config

23. **Update Plugin Import Method**
    - Align plugin import method (require vs import)
    - Ensure consistent plugin initialization

## Phase 4: Component-Level Styling

24. **Audit UI Components**
    - Identify key UI components that need styling updates
    - Create inventory of components to modify

25. **Update Button Styles**
    - Align button styling with root application
    - Ensure consistent hover/focus states

26. **Update Card Styles**
    - Align card styling with root application
    - Ensure proper border radius and shadows

27. **Update Form Element Styles**
    - Align input, select, and checkbox styles
    - Ensure consistent focus states and animations

28. **Update Navigation Components**
    - Align navigation menu styling
    - Ensure consistent dropdown and hover effects

29. **Update Modal and Dialog Styles**
    - Align modal styling with root application
    - Ensure consistent animations and overlays

30. **Update Table and Data Display Components**
    - Align table styling with root application
    - Ensure consistent borders and spacing

31. **Update Hero and Banner Components**
    - Align hero section styling
    - Ensure consistent background treatments

32. **Update Footer Styling**
    - Align footer styling with root application
    - Ensure consistent spacing and typography

## Phase 5: Testing and Final Adjustments

33. **Create Visual Test Plan**
    - Identify key pages and components to test
    - Create side-by-side comparison methodology

34. **Test Light Mode Rendering**
    - Verify all components in light mode
    - Compare with root application

35. **Test Dark Mode Rendering**
    - Verify all components in dark mode
    - Test theme switching functionality

36. **Test Responsive Behavior**
    - Verify mobile, tablet, and desktop layouts
    - Ensure consistent breakpoint behavior

37. **Test Animation Performance**
    - Verify animations run smoothly
    - Check for any performance issues

38. **Test Color Accessibility**
    - Verify color contrast meets accessibility standards
    - Ensure text remains readable across themes

39. **Fix Edge Cases and Inconsistencies**
    - Address any remaining visual discrepancies
    - Ensure pixel-perfect alignment with root app

40. **Final Documentation**
    - Document the synchronized design system
    - Note any intentional differences that remain

## Phase 6: Advanced Configuration & Component Compatibility

41. **Fix Build Tooling & Path Aliases**
    - Update vite.config.ts with proper `@/` path alias
    - Modify tsconfig.json to include all root path mappings (`@/lib`, `@/styles`)
    - Add missing dependencies: `@tailwindcss/line-clamp`, `@heroicons/*`, `clsx`
    - Install `@vitejs/plugin-legacy` for consistent CSS hash generation

42. **Create Theme Compatibility Layer**
    - Create ThemeContext.tsx facade to maintain backward compatibility:
      ```tsx
      // ThemeContext.tsx (compatibility facade)
      export { ThemeContext, type ColorTheme, type ModeTheme } from './theme-constants';
      export { ThemeProvider } from './ThemeProvider';
      export { useTheme } from '../hooks/use-theme';
      ```
    - Update ThemeProvider to use consistent storage key: `accord-ai-theme`

43. **Implement Full ThemeSwitcher**
    - Replace simplified theme toggles with root's ThemeSwitcher component
    - Ensure all 11 color themes are supported with correct dropdown UI

44. **Port Layout Structure**
    - Copy MainLayout from root to wrap all landing pages
    - Implement ScrollTop, CookieBanner, and MetaTags components

45. **Add Hero & Pricing Components**
    - Port HeroSection with blob background and animated headline
    - Add Pricing and FAQ components with proper routing
    - Implement WaitlistModal and EmailCapture functionality

46. **Migrate SVG Backgrounds**
    - Transfer all `/public/textures/*.svg` to landing's public folder

47. **Self-host Fonts**
    - Copy font files from root into landing's assets
    - Add @font-face declarations to remove Google CDN dependencies
    - Update Heroicons package and component imports

48. **Configure Environment Variables**
    - Create .env file with VITE_APP_VERSION, VITE_SUPABASE_URL
    - Add dynamic theme-color meta tag to index.html
    - Implement proper CSP headers

## Implementation Timeline

### Week 1: Foundation & Theme System

#### Days 1-2: Environment & Configuration
- Fix build tooling & path aliases (Task 41)
- Complete CSS variable copying (Tasks 2-8)
- Add missing shadow definitions & keyframes (Tasks 13-16, + missing animations)

#### Days 3-4: Theme System
- Create theme compatibility layer (Task 42)
- Implement full ThemeSwitcher (Task 43)
- Test theme switching across components

#### Day 5: Font & Typography System
- Self-host fonts (Task 47)
- Finalize Typography and Animation systems (Tasks 9-16)

### Week 2: Component Migration

#### Days 1-2: Layout & Primary Components
- Port MainLayout component (Task 44)
- Implement HeroSection with blob background (Task 45)

#### Days 3-4: Secondary Components & Assets
- Add Pricing, FAQ, and remaining components
- Migrate SVG backgrounds (Task 46)
- Set up environment variables (Task 48)

#### Day 5: Polish & Component Refinement
- Ensure consistent styling across all components
- Fix any component-specific issues

### Week 3: Finalization

#### Days 1-2: Testing & Verification
- Perform component & responsive testing (Tasks 33-36)
- Conduct visual regression testing

#### Days 3-4: Optimization & Fixes
- Address any performance issues
- Fix edge cases and inconsistencies (Task 39)

#### Day 5: Documentation & Deployment
- Complete final documentation (Task 40)
- Prepare deployment configuration

## Success Metrics

1. **Visual Parity**: Landing page visually identical to root application landing page
2. **Functional Parity**: All interactive elements work consistently
3. **Theme Support**: Complete theme system working across all components
4. **Responsive Behavior**: Consistent across all viewport sizes
5. **Build Success**: Clean build without warnings or errors
6. **Performance**: Equal or better loading and interaction times
7. **Accessibility**: Maintain or improve accessibility scores
