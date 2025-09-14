import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSessionGuard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                if (location.pathname !== "/auth") {
                    navigate("/auth", { replace: true });
                }
                return;
            }

            const now = Math.floor(Date.now() / 1000);
            const maxAge = 24 * 60 * 60;

            if (session.expires_at && session.expires_at - now > maxAge) {
                await supabase.auth.signOut();
                toast({
                    title: "Sessão expirada",
                    description: "Por segurança, faça login novamente.",
                    variant: "destructive",
                });
                if (location.pathname !== "/auth") {
                    navigate("/auth", { replace: true });
                }
            }
        };

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session && location.pathname !== "/auth") {
                navigate("/auth", { replace: true });
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [navigate, location.pathname, toast]);
};
