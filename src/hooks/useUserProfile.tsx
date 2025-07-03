
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  birth_date?: string;
  gender?: string;
  pgm_role?: string;
  pgm_number?: string;
  participates_flow_up?: boolean;
  participates_irmandade?: boolean;
  is_admin?: boolean;
  points?: number;
  profile_photo_url?: string;
  phase?: string;
  consecutive_days?: number;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setError(error.message);
        } else {
          setProfile(data);
          // Store in localStorage for app-wide access
          localStorage.setItem('currentUser', JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
            isAdmin: data.is_admin,
            points: data.points || 0,
            pgmRole: data.pgm_role,
            pgmNumber: data.pgm_number,
            profilePhoto: data.profile_photo_url,
            whatsapp: data.whatsapp,
            birthDate: data.birth_date,
            gender: data.gender,
            participatesFlowUp: data.participates_flow_up,
            participatesIrmandade: data.participates_irmandade,
            phase: data.phase,
            consecutiveDays: data.consecutive_days
          }));
        }
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        setError('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      localStorage.setItem('currentUser', JSON.stringify({
        ...currentUser,
        ...updates
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return { profile, loading, error, updateProfile };
};
