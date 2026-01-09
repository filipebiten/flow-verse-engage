import { createContext, useContext, useEffect, useState } from 'react';
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

interface UserProfileContextValue {
  profile: UserProfile | null;
  completedMissions: CompletedMission[];
  userBadges: UserBadge[];
  loading: boolean;
  refreshUserData: () => void;
  getBooksList: () => CompletedMission[];
  getCoursesList: () => CompletedMission[];
  getMissionsList: () => CompletedMission[];
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedMissions, setCompletedMissions] = useState<CompletedMission[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    if (!user) 
      return;

    setLoading(true);

    try {
      const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

      const { data: missionsData } = await supabase
          .from('missions_completed')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

      const { data: badgesData } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

      setProfile(profileData);
      setCompletedMissions(missionsData || []);
      setUserBadges(badgesData || []);

    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadUserData();
  }, [user]);

  const refreshUserData = () => {
    loadUserData();
  };

  const getMissionsByType = (type: string) =>
      completedMissions.filter(m => m.mission_type === type);

  return (
      <UserProfileContext.Provider
          value={{
            profile,
            completedMissions,
            userBadges,
            loading,
            refreshUserData,
            getBooksList: () => getMissionsByType('book'),
            getCoursesList: () => getMissionsByType('course'),
            getMissionsList: () => getMissionsByType('mission'),
          }}
      >
        {children}
      </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile deve ser usado dentro de <UserProfileProvider>');
  }
  return context;
};
