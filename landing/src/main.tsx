import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from "./contexts/ThemeContext"
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

import "./styles/index.css";
import "./styles/backgrounds.css"; // Added background styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider defaultTheme="system" storageKey="accordify-landing-theme">
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
