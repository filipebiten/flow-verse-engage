
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PhaseChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newPoints: number;
  previousPoints: number;
}

const PhaseChangeDialog = ({ isOpen, onClose, newPoints, previousPoints }: PhaseChangeDialogProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const getUserPhase = (points: number) => {
    if (points >= 1000) return { 
      name: 'Oceano', 
      icon: '🌊', 
      phrase: 'Profundamente imerso em Deus', 
      description: 'Você alcançou a fase máxima! Continue fluindo com Deus.',
      color: 'from-blue-900 to-indigo-900'
    };
    if (points >= 500) return { 
      name: 'Cachoeira', 
      icon: '💥', 
      phrase: 'Entregue ao movimento de Deus', 
      description: 'Sua jornada está ganhando força e impacto.',
      color: 'from-purple-600 to-blue-600'
    };
    if (points >= 250) return { 
      name: 'Correnteza', 
      icon: '🌊', 
      phrase: 'Sendo levado por algo maior', 
      description: 'Você está fluindo com o propósito de Deus.',
      color: 'from-blue-500 to-teal-500'
    };
    return { 
      name: 'Riacho', 
      icon: '🌀', 
      phrase: 'Começando a fluir', 
      description: 'O início de uma jornada transformadora.',
      color: 'from-green-400 to-blue-400'
    };
  };

  const previousPhase = getUserPhase(previousPoints);
  const newPhase = getUserPhase(newPoints);
  
  const hasPhaseChanged = previousPhase.name !== newPhase.name;

  useEffect(() => {
    if (isOpen && hasPhaseChanged) {
      setShowConfetti(true);
      
      const root = document.documentElement;
      root.style.setProperty('--phase-gradient', `linear-gradient(135deg, ${newPhase.color.replace('from-', '').replace('to-', ', ')})`);
      
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen, hasPhaseChanged, newPhase]);

  if (!hasPhaseChanged) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-primary">
            🎉 Nova Fase Alcançada! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">{newPhase.icon}</div>
          
          <Badge className={`text-lg px-4 py-2 bg-gradient-to-r ${newPhase.color} text-white`}>
            {newPhase?.name}
          </Badge>
          
          <h3 className="text-xl font-semibold text-primary">
            "{newPhase?.phrase}"
          </h3>
          
          <p className="text-gray-600 text-sm">
            {newPhase?.description}
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
