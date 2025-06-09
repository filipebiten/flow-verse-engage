
import { useEffect, useState } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    setIsLoggedIn(!!currentUser);

    // Apply user phase colors on app load
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        const userPhase = getUserPhase(userData.points || 0);
        applyPhaseColors(userPhase);
      } catch (error) {
        console.error('Error applying phase colors:', error);
      }
    }
  }, []);

  // Listen for storage changes to update login status
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = localStorage.getItem('currentUser');
      setIsLoggedIn(!!currentUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!isLoggedIn ? (
            <Index onLogin={() => setIsLoggedIn(true)} />
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/missions" element={<Missions />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/user/:userId" element={<UserProfile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
