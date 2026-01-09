import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';

export interface Phase {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  required_points: number;
  created_at: string;
}

interface PhaseContextValue {
  phases: Phase[];
  loading: boolean;
  refreshPhases: () => Promise<void>;
  getPhaseByPoints: (points: number) => Phase | null;
  getCurrentPhase: () => Phase | null;
  getPhaseByPhaseName: (name: string) => Phase | null;
}

const PhaseContext = createContext<PhaseContextValue | undefined>(undefined);

export const PhaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const {profile} = useUserProfile() || {};

  const loadPhases = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('phase')
        .select('*')
        .order('required_points', { ascending: false });

      if (error)
        throw error;

      setPhases(data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhases();
  }, []);

  const getPhaseByPoints = (points: number) => {
    return (
      [...phases]
        .filter(phase => points >= phase.required_points)[0] || null
    );
  };

  const getPhaseByPhaseName = (name: string) => {
    return (
      [...phases]
        .find(phase => name === phase.name) || null
    );
  };

  const getCurrentPhase = () => {
    return getPhaseByPoints(profile.points || 0);
  }

  return (
    <PhaseContext.Provider
      value={{
        phases,
        loading,
        refreshPhases: loadPhases,
        getPhaseByPoints,
        getCurrentPhase: getCurrentPhase,
        getPhaseByPhaseName: getPhaseByPhaseName
      }}
    >
      {children}
    </PhaseContext.Provider>
  );
};

export const usePhases = () => {
  const context = useContext(PhaseContext);
  if (!context) {
    throw new Error('usePhases deve ser usado dentro de <PhaseProvider>');
  }
  return context;
};
