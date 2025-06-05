
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserPhase, applyPhaseColors } from '@/utils/phaseUtils';

interface PhaseChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newPoints: number;
  previousPoints: number;
}

const PhaseChangeDialog = ({ isOpen, onClose, newPoints, previousPoints }: PhaseChangeDialogProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const previousPhase = getUserPhase(previousPoints);
  const newPhase = getUserPhase(newPoints);
  
  const hasPhaseChanged = previousPhase.name !== newPhase.name;

  useEffect(() => {
    if (isOpen && hasPhaseChanged) {
      setShowConfetti(true);
      applyPhaseColors(newPhase);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen, hasPhaseChanged, newPhase]);

  if (!hasPhaseChanged) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-primary">
            🎉 Nova Fase Alcançada! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">{newPhase.icon}</div>
          
          <Badge className="text-lg px-4 py-2 bg-primary text-primary-foreground">
            {newPhase.name}
          </Badge>
          
          <h3 className="text-xl font-semibold text-primary">
            "{newPhase.phrase}"
          </h3>
          
          <p className="text-gray-600 text-sm">
            {newPhase.description}
          </p>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm font-medium">
              Seus pontos: <span className="text-primary font-bold">{newPoints}</span>
            </p>
          </div>
        </div>

        <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
          Continuar Fluindo! 🌊
        </Button>
        
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-10 animate-pulse"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhaseChangeDialog;
