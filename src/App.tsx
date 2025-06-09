
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { applyPhaseColors, getUserPhase } from "@/utils/phaseUtils";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Missions from "./pages/Missions";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Apply user phase colors on app load
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        const userPhase = getUserPhase(userData.points || 0);
        applyPhaseColors(userPhase);
      } catch (error) {
        console.error('Error applying phase colors:', error);
      }
    }

    // Initialize default user if none exists
    if (!currentUser) {
      const defaultUser = {
        id: '1',
        name: 'João Silva',
        pgm: 'PGM001',
        points: 150,
        role: 'user'
      };
      localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
