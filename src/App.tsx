
import "./App.css"; // Add this import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Signatures from "./pages/Signatures";
import Blog from "./pages/Blog";
import { ThemeProvider } from "./contexts/ThemeContext";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<Index />} />
            <Route path="/contracts/*" element={<Index />} />
            <Route path="/templates" element={<Index />} />
            <Route path="/history" element={<Index />} />
            <Route path="/workspaces" element={<Index />} />
            <Route path="/team" element={<Index />} />
            <Route path="/settings" element={<Index />} />
            <Route path="/pricing" element={<Index />} />
            <Route path="/profile" element={<Index />} />
            <Route path="/billing" element={<Index />} />
            <Route path="/notifications" element={<Index />} />
            <Route path="/signatures" element={<Signatures />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/docs/*" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
