import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Feed from "./pages/feed/Feed.tsx";
import Missions from "./pages/Missions";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Admin from "./pages/admin/Admin.tsx";
import NotFound from "./pages/NotFound";
import { UserProfileProvider } from "@/hooks/useUserProfile.tsx";
import { LoadingComponent } from "@/components/LoadingComponent.tsx";
import { useSessionGuard } from "@/hooks/useSessionGuard.tsx";

const queryClient = new QueryClient();

const App = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <UserProfileProvider>
                    <BrowserRouter>
                        <SessionGuardWrapper user={user} />

                        {!user ? (
                            <Routes>
                                <Route path="/auth" element={<Auth />} />
                                <Route path="*" element={<Index />} />
                            </Routes>
                        ) : (
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Feed />} />
                                    <Route path="/feed" element={<Feed />} />
                                    <Route path="/missions" element={<Missions />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/user/:userId" element={<UserProfile />} />
                                    <Route path="/admin" element={<Admin />} />
                                </Routes>
                            </Layout>
                        )}
                    </BrowserRouter>
                </UserProfileProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

const SessionGuardWrapper = ({ user }) => {
    useSessionGuard();
    return null;
};

export default App;
