
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
        // Get initial session
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
      // Clear localStorage first
      localStorage.removeItem('currentUser');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      
      // Force refresh to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force refresh even if there's an error
      window.location.reload();
    }
  };

  return {
    user,
    session,
    loading,
    signOut
  };
};
