
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch and store user profile when signed in
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
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
        }
        
        // Clear localStorage when signing out
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('currentUser');
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
