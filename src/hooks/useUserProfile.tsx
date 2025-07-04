
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  phase: string;
  is_admin: boolean;
  whatsapp?: string;
  birth_date?: string;
  gender?: string;
  pgm_role?: string;
  pgm_number?: string;
  participates_flow_up: boolean;
  participates_irmandade: boolean;
  profile_photo_url?: string;
  created_at: string;
  consecutive_days?: number;
}

interface CompletedMission {
  id: string;
  mission_id: string;
  mission_name: string;
  mission_type: string;
  points: number;
  completed_at: string;
  period?: string;
  school?: string;
}

interface UserBadge {
  id: string;
  badge_name: string;
  badge_icon: string;
  earned_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedMissions, setCompletedMissions] = useState<CompletedMission[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        return;
      }

      setProfile(profileData);

      // Load completed missions
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions_completed')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (missionsError) {
        console.error('Error loading completed missions:', missionsError);
      } else {
        setCompletedMissions(missionsData || []);
      }

      // Load user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (badgesError) {
        console.error('Error loading badges:', badgesError);
      } else {
        setUserBadges(badgesData || []);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user]);

  const refreshUserData = () => {
    loadUserData();
  };

  const getMissionsByType = (type: string) => {
    return completedMissions.filter(mission => mission.mission_type === type);
  };

  const getBooksList = () => getMissionsByType('book');
  const getCoursesList = () => getMissionsByType('course');
  const getMissionsList = () => getMissionsByType('mission');

  return {
    profile,
    completedMissions,
    userBadges,
    loading,
    refreshUserData,
    getBooksList,
    getCoursesList,
    getMissionsList
  };
};
