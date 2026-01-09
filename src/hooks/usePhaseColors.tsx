
import { useEffect } from 'react';

export const usePhaseColors = (userPoints: number) => {
  useEffect(() => {
    const currentPhase = getUserPhase(userPoints);
  }, [userPoints]);
};
