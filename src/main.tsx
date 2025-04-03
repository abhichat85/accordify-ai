import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from "@/contexts/ThemeContext"
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

import "@/styles/index.css";
import "@/styles/backgrounds.css"; // Added background styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
          <App />
          <Toaster />
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
