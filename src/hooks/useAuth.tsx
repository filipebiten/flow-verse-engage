
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch and store user profile when signed in (defer to avoid infinite loop)
          if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            setTimeout(async () => {
              try {
                const { data: profile, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();

                if (error && error.code !== 'PGRST116') {
                  console.error('Error fetching profile:', error);
                } else if (profile) {
                  localStorage.setItem('currentUser', JSON.stringify({
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    isAdmin: profile.is_admin,
                    points: profile.points || 0,
                    pgmRole: profile.pgm_role,
                    pgmNumber: profile.pgm_number,
                    profilePhoto: profile.profile_photo_url,
                    whatsapp: profile.whatsapp,
                    birthDate: profile.birth_date,
                    gender: profile.gender,
                    participatesFlowUp: profile.participates_flow_up,
                    participatesIrmandade: profile.participates_irmandade,
                    phase: profile.phase,
                    consecutiveDays: profile.consecutive_days
                  }));
                }
              } catch (error) {
                console.error('Error fetching profile:', error);
              }
            }, 0);
          }
          
          // Clear localStorage when signing out
          if (event === 'SIGNED_OUT') {
            localStorage.removeItem('currentUser');
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      localStorage.removeItem('currentUser');
      localStorage.clear();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error during sign out:', error);
      window.location.reload();
    }
  };

  const updateLoginStreak = async (userId: string) => {
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("last_login_date, consecutive_days")
        .eq("id", userId)
        .single();

    if (error) return console.error("Erro ao pegar perfil:", error);

    const today = new Date();
    const lastLogin = profile?.last_login_date ? new Date(profile.last_login_date) : null;

    let newStreak = 1;

    if (lastLogin) {
      const diffTime = today.getTime() - lastLogin.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = profile.consecutive_days + 1;
      } else if (diffDays === 0) {
        newStreak = profile.consecutive_days;
      } else {
        newStreak = 1;
      }
    }

    const { error: updateError } = await supabase
        .from("profiles")
        .update({ consecutive_days: newStreak, last_login_date: today.toISOString().split("T")[0] })
        .eq("id", userId);

    if (updateError) console.error("Erro ao atualizar streak:", updateError);

    return newStreak;
  };

  return {
    user,
    session,
    loading,
    signOut,
    updateLoginStreak
  };
};
