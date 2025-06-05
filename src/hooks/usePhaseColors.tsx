
import { useEffect } from 'react';
import { getUserPhase, applyPhaseColors } from '@/utils/phaseUtils';

export const usePhaseColors = (userPoints: number) => {
  useEffect(() => {
    const currentPhase = getUserPhase(userPoints);
    applyPhaseColors(currentPhase);
  }, [userPoints]);
};
