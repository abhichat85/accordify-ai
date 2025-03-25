
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signatures from "./pages/Signatures";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
          <Route path="/signatures" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
