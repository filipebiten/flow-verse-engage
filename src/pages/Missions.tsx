
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import PhaseChangeDialog from '@/components/PhaseChangeDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Target, 
  CheckCircle, 
  BookOpen, 
  GraduationCap
} from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'mission' | 'book' | 'course';
  period?: string;
  school?: string;
}

const Missions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Mission[]>([]);
  const [courses, setCourses] = useState<Mission[]>([]);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showPhaseDialog, setShowPhaseDialog] = useState(false);
  const [previousPoints, setPreviousPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      // Load user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      setUserProfile(profile);
      setPreviousPoints(profile?.points || 0);

      // Load missions, books, courses
      const [missionsResult, booksResult, coursesResult] = await Promise.all([
        supabase.from('missions').select('*'),
        supabase.from('books').select('*'),
        supabase.from('courses').select('*')
      ]);

      setMissions(missionsResult.data || []);
      setBooks(booksResult.data || []);
      setCourses(coursesResult.data || []);

      // Load completed items
      const { data: completed } = await supabase
        .from('missions_completed')
        .select('mission_id');

      const completedIds = new Set(completed?.map(item => item.mission_id) || []);
      setCompletedItems(completedIds);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserPhase = (points: number) => {
    if (points >= 1000) return { name: 'Oceano', icon: '🌊', phrase: 'Profundamente imerso em Deus', color: 'from-blue-900 to-indigo-900' };
    if (points >= 500) return { name: 'Cachoeira', icon: '💥', phrase: 'Entregue ao movimento de Deus', color: 'from-purple-600 to-blue-600' };
    if (points >= 250) return { name: 'Correnteza', icon: '🌊', phrase: 'Sendo levado por algo maior', color: 'from-blue-500 to-teal-500' };
    return { name: 'Riacho', icon: '🌀', phrase: 'Começando a fluir', color: 'from-green-400 to-blue-400' };
  };

  const completeItem = async (item: Mission) => {
    if (completedItems.has(item.id) || !user) return;

    try {
      // Insert completed mission
      const { error } = await supabase
        .from('missions_completed')
        .insert({
          user_id: user.id,
          mission_id: item.id,
          mission_name: item.name,
          mission_type: item.type,
          points: item.points,
          period: item.period || null,
          school: item.school || null
        });

      if (error) {
        console.error('Error saving mission:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar a missão completada.",
          variant: "destructive"
        });
        return;
      }

      // Update user points
      const newPoints = (userProfile?.points || 0) + item.points;
      const previousPhase = getUserPhase(userProfile?.points || 0);
      const newPhase = getUserPhase(newPoints);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          points: newPoints,
          phase: newPhase.name
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o perfil.",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setUserProfile({ ...userProfile, points: newPoints, phase: newPhase.name });
      setCompletedItems(prev => new Set([...prev, item.id]));

      // Check for phase change
      if (previousPhase.name !== newPhase.name) {
        // Save phase change
        await supabase
          .from('phase_changes')
          .insert({
            user_id: user.id,
            previous_phase: previousPhase.name,
            new_phase: newPhase.name,
            phase_icon: newPhase.icon,
            total_points: newPoints
          });

        setPreviousPoints(userProfile?.points || 0);
        setShowPhaseDialog(true);
      }

      toast({
        title: "Parabéns! 🎉",
        description: `Você completou "${item.name}" e ganhou ${item.points} pontos!`,
      });

    } catch (error) {
      console.error('Error completing mission:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao completar a missão.",
        variant: "destructive"
      });
    }
  };

  const renderItems = (items: Mission[], title: string, icon: React.ReactNode, emptyMessage: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title} ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const isCompleted = completedItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">+{item.points} pts</Badge>
                        {item.period && <Badge variant="outline">{item.period}</Badge>}
                        {item.school && <Badge variant="outline">{item.school}</Badge>}
                      </div>
                    </div>
                    <Button
                      onClick={() => completeItem(item)}
                      disabled={isCompleted}
                      variant={isCompleted ? "secondary" : "default"}
                      size="sm"
                    >
                      {isCompleted ? "Concluído" : "Completar"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const currentPhase = getUserPhase(userProfile?.points || 0);
  const nextPhaseThreshold = userProfile?.points >= 1000 ? 1000 : 
                           userProfile?.points >= 500 ? 1000 :
                           userProfile?.points >= 250 ? 500 : 250;
  const prevPhaseThreshold = userProfile?.points >= 1000 ? 1000 :
                           userProfile?.points >= 500 ? 500 :
                           userProfile?.points >= 250 ? 250 : 0;
  
  const phaseProgress = userProfile?.points >= 1000 ? 100 : 
                       (((userProfile?.points || 0) - prevPhaseThreshold) / (nextPhaseThreshold - prevPhaseThreshold)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${currentPhase.color} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Missões e Desafios</h1>
                <p className="text-white/90">Continue sua jornada de crescimento</p>
              </div>
              <div className="text-right">
                <div className="text-4xl mb-2">{currentPhase.icon}</div>
                <Badge className="bg-white text-gray-800">{currentPhase.name}</Badge>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userProfile?.points || 0}</div>
                <p className="text-sm text-gray-600">Pontos Totais</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedItems.size}</div>
                <p className="text-sm text-gray-600">Concluídos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{currentPhase.name}</div>
                <p className="text-sm text-gray-600">Fase Atual</p>
              </div>
            </div>
            
            {/* Phase Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Fase</span>
                <span>{userProfile?.points >= 1000 ? '100%' : `${Math.round(phaseProgress)}%`}</span>
              </div>
              <Progress value={phaseProgress} className="h-3" />
              <p className="text-xs text-gray-600">
                {userProfile?.points >= 1000 
                  ? 'Fase máxima alcançada! Continue acumulando pontos.' 
                  : `${nextPhaseThreshold - (userProfile?.points || 0)} pontos para a próxima fase`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Missions, Books, Courses */}
        <div className="space-y-6">
          {renderItems(missions, "Missões", <Target className="w-5 h-5" />, "Nenhuma missão disponível")}
          {renderItems(books, "Livros", <BookOpen className="w-5 h-5" />, "Nenhum livro disponível")}
          {renderItems(courses, "Cursos", <GraduationCap className="w-5 h-5" />, "Nenhum curso disponível")}
        </div>

        <PhaseChangeDialog
          isOpen={showPhaseDialog}
          onClose={() => setShowPhaseDialog(false)}
          newPoints={userProfile?.points || 0}
          previousPoints={previousPoints}
        />
      </div>
    </div>
  );
};

export default Missions;
