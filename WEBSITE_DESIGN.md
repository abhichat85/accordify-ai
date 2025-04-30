# Accordify AI Website Design Guidelines

## Overview
This document outlines the design guidelines and important structural considerations for the Accordify AI website and application. It should be referred to when making any changes to the codebase to ensure consistency and prevent regression of previous fixes.

## Layout Structure

### TriPanelLayout
The application uses a three-panel layout structure consisting of:
1. **Left Panel**: Navigation sidebar with main sections
2. **Center Panel**: Main content area (contract editor)
3. **Right Panel**: AI agent chat interface

Key considerations:
- The main layout container has class `flex h-screen w-screen overflow-hidden`
- The center panel uses `flex-grow h-full transition-all duration-300 relative`
- The right panel includes `right-panel-content` class to ensure proper padding and alignment

## CSS Considerations

### Critical CSS Classes
- `.right-panel-content`: Ensures the right chat panel properly fills its container without unwanted padding
- `.tiptap-editor-content-area`: Controls the contract editor content area with specific padding requirements

### Padding Requirements
- The right panel content should have zero padding outside its container
- The editor content area should maintain appropriate padding inside the container

## Component Guidelines

### Contract Editor
- The TipTap editor uses custom styling to ensure content is properly left-aligned
- Padding should only be applied to the inner content, not the outer container

### Chat Interface
- All chat interface components should use `w-full h-full` with `overflow-hidden`
- Padding should be controlled at the individual element level, not at container levels

## Dark Theme Implementation
- The dark theme uses a purple color scheme (`#7c3aed`) as the primary color
- Dark backgrounds use `#282828` (main) and `#1F1F1F` (header)
- All text and UI elements should maintain proper contrast ratios in dark mode

## Future Considerations
1. When making changes to the layout structure, be careful not to reintroduce padding issues
2. Test all layout changes across different viewports to ensure responsive behavior
3. Preserve the established visual hierarchy and spacing patterns

## Known Issues and Fixes
1. **Right Panel Padding**: Fixed by adding `right-panel-content` class and explicit width/height/padding controls
2. **Editor Content Alignment**: Maintained through specific padding rules in TipTapStyles.css
