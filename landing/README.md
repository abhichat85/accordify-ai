# Accord AI Landing Page

This is a standalone landing page for Accord AI, designed to be deployed separately on Vercel.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployment to Vercel

This landing page is designed to be deployed independently from the main application. Follow these steps to deploy:

1. Push the `landing-page` branch to GitHub
2. In Vercel dashboard, create a new project
3. Connect your GitHub repository and select the `landing-page` branch
4. Set the root directory to `landing/`
5. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Deploy!

## Structure

- `src/components/landing/` - All landing page components
- `src/components/ui/` - Shared UI components
- `src/styles/` - CSS styles for the landing page
- `public/` - Static assets

## Technology

- React
- TypeScript
- Vite
- TailwindCSS
- Radix UI
