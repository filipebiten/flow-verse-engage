import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { useToast } from '@/hooks/use-toast.ts';
import { supabase } from '@/integrations/supabase/client.ts';
import { useAuth } from '@/hooks/useAuth.tsx';
import { Target, CheckCircle, BookOpen, GraduationCap } from 'lucide-react';
import { useUserProfile } from "@/hooks/useUserProfile.tsx";
import { definePeriodBadgeColor } from "@/helpers/colorHelper.ts";
import { checkBadgeEligibility } from "@/utils/badgeUtils.ts";
import NewPhaseDialog from "@/components/newPhaseDialog.tsx";
import { differenceInDays, endOfDay } from 'date-fns';
import {CompleteMissionDialog} from "@/pages/missions/completeMissionDialog.tsx";

interface Mission {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'mission' | 'book' | 'course';
  period?: string;
  school?: string;
  image_url?: string;
}

interface MissionCompleted {
  mission_id: string;
  mission_type: string;
  completed_at: string;
  period?: string | null;
  school?: string | null;
}

interface UserProfile {
  consecutive_days: number;
  id: string;
  name: string;
  points: number;
  phase: string;
}

const getUserPhase = (points: number) => {
  if (points >= 1000) return { name: 'Oceano', icon: '🌊', phrase: 'Profundamente imerso em Deus', color: 'from-blue-900 to-indigo-900' };
  if (points >= 500) return { name: 'Cachoeira', icon: '💥', phrase: 'Entregue ao movimento de Deus', color: 'from-purple-600 to-blue-600' };
  if (points >= 250) return { name: 'Correnteza', icon: '🌊', phrase: 'Sendo levado por algo maior', color: 'from-blue-500 to-teal-500' };
  return { name: 'Riacho', icon: '🌀', phrase: 'Começando a fluir', color: 'from-green-400 to-blue-400' };
};

const Missions = () => {
  const { user } = useAuth();
  const { refreshUserData, completedMissions } = useUserProfile();
  const { toast } = useToast();
  const [ showCompleteMissionDialog, setShowCompleteMissionDialog ] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Mission[]>([]);
  const [courses, setCourses] = useState<Mission[]>([]);
  const [completedItems, setCompletedItems] = useState<MissionCompleted[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPhase, setNewPhase] = useState<ReturnType<typeof getUserPhase> | null>(null);
  const [currentSubmitingMission, setCurrentSubmitingMission] = useState(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

      if (profile) setUserProfile(profile);

      const { data: missionsData } = await supabase.from('missions').select('*').order('created_at', { ascending: false });
      const { data: booksData } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      const { data: coursesData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });

      setMissions((missionsData || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        points: item.points,
        type: 'mission',
        period: item.period
      })));

      setBooks((booksData || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        points: item.points,
        type: 'book',
        image_url: item.book_image_url
      })));

      setCourses((coursesData || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        points: item.points,
        type: 'course',
        school: item.school
      })));

      const { data: completed } = await supabase
          .from('missions_completed')
          .select('*')
          .eq('user_id', user?.id);

      if (completed) setCompletedItems(completed);
    } catch {
      toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  async function checkIfUserCompletedAnyBadge(userStats) {
    const { data: allBadges } = await supabase.from('badges').select('*');
    let { data: userBadges } = await supabase.from('user_badges').select('*').eq('user_id', userStats.userId);

    if (!allBadges) return [];

    if(!userBadges)
      userBadges = [];

    const userBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

    return allBadges
        .map(b => ({
          ...b,
          requirement: { type: b.requirement_field, count: b.requirement_value }
        }))
        .filter(badge => !userBadgeIds.has(badge.id) && checkBadgeEligibility(badge, userStats));
  }

  const completeItem = async (item: Mission) => {

    if (currentSubmitingMission != item)
        return;

    try {

      const { data: completedItem, error: error } = await supabase.from('missions_completed').insert({
        user_id: user.id,
        mission_id: item.id,
        mission_name: item.name,
        mission_type: item.type,
        points: item.points,
        period: item.period || null,
        school: item.school || null
      }).select().single();

      if (error) throw error;

      setCompletedItems(prev => [...prev, completedItem]);

      const newPoints = (userProfile?.points || 0) + item.points;
      const phaseCandidate = getUserPhase(newPoints);
      setNewPhase(phaseCandidate);

      if (userProfile?.phase !== phaseCandidate.name) {
        await supabase.from('phase_changes').insert({
          user_id: userProfile!.id,
          previous_phase: userProfile!.phase,
          new_phase: phaseCandidate.name,
          total_points: newPoints,
          changed_at: new Date()
        });
        setOpenDialog(true);
      }

      await supabase.from('profiles').update({
        points: newPoints,
        phase: phaseCandidate.name
      }).eq('id', user.id);

      setUserProfile({ ...userProfile!, points: newPoints, phase: phaseCandidate.name });
      const updatedCompletedItems = [...completedMissions, completedItem];

      setCompletedItems(updatedCompletedItems);

      const badgesCompleted = await checkIfUserCompletedAnyBadge({
        points: newPoints,
        missions: updatedCompletedItems.filter(c => c.mission_type === 'mission'),
        books: updatedCompletedItems.filter(c => c.mission_type === 'book'),
        courses: updatedCompletedItems.filter(c => c.mission_type === 'course'),
        consecutive_days: userProfile!.consecutive_days,
        userId: userProfile.id
      });

      for (const badge of badgesCompleted) {
        await supabase.from('user_badges').insert({
          user_id: userProfile!.id,
          badge_id: badge.id,
          earned_at: new Date()
        });
        toast({
          title: "Conquista atingida!! 🎉",
          className: "bg-green-700 text-white",
          description: `Parabéns! Você atingiu a conquista ${badge.name}!!!!`,
        });
      }

      toast({
        title: "Parabéns! 🎉",
        className: "bg-green-700 text-white",
        description: `Você completou "${item.name}" e ganhou ${item.points} pontos!`,
      });

      refreshUserData();
    } catch {
      toast({
          title: "Erro",
          description: "Ocorreu um erro ao completar a missão.",
          className: "bg-red-700 text-white",
          variant: "destructive"
      });
    } finally {
      setCurrentSubmitingMission(null);
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

                  const isCompleted = () => {
                    const missionCompletions = completedItems.filter(i => i.mission_id === item.id);
                    if (missionCompletions.length === 0) return false;

                    missionCompletions.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
                    const latestCompletion = missionCompletions[0];

                    if (latestCompletion?.period === null || latestCompletion?.period?.toLowerCase() === 'especial') return true;

                    const now = new Date();
                    const completionEnd = endOfDay(new Date(latestCompletion.completed_at));

                    if (latestCompletion?.period?.toLowerCase() === 'diário' && now <= completionEnd) return true;
                    if (latestCompletion?.period?.toLowerCase() === 'semanal' && differenceInDays(now, new Date(latestCompletion.completed_at)) <= 6) return true;
                    if (latestCompletion?.period?.toLowerCase() === 'mensal' && differenceInDays(now, new Date(latestCompletion.completed_at)) <= 29) return true;
                    if (latestCompletion?.period?.toLowerCase() === 'semestral' && differenceInDays(now, new Date(latestCompletion.completed_at)) <= 179) return true;
                    if (latestCompletion?.period?.toLowerCase() === 'anual' && differenceInDays(now, new Date(latestCompletion.completed_at)) <= 364) return true;

                    return false;
                  };

                  return (
                      <div
                          key={item.id}
                          className={`border rounded-lg transition-all flex-1 items-center group: cursor-default ${isCompleted() ? 'bg-green-50 border-green-200' : 'bg-white hover:shadow-md'}`}
                      >
                        <div className="p-4 flex items-center justify-between">
                          {title === 'Livros' && (
                              <img src={item?.image_url} alt={item.name} className="w-20 h-20 mr-4 rounded-md object-cover" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              {isCompleted() && <CheckCircle className="w-5 h-5 text-green-600" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-2 pr-1">{item.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className='bg-green-500 hover:bg-green-500 text-white' variant="secondary">+{item.points} Pontos</Badge>
                              {item.period && <Badge className={`hover:${definePeriodBadgeColor(item.period)} ${definePeriodBadgeColor(item.period)}`} variant="default">{item.period[0].toUpperCase() + item.period.slice(1)}</Badge>}
                              {item.school && <Badge className="bg-blue-900 text-white">{item.school}</Badge>}
                            </div>
                          </div>
                          <Button
                              onClick={() => {
                                  setCurrentSubmitingMission(item);
                                  setShowCompleteMissionDialog(true)
                              }}
                              disabled={isCompleted() || currentSubmitingMission?.id === item.id}
                              variant={isCompleted() ? "secondary" : "default"}
                              className={isCompleted() ? "secondary" : "bg-green-600 hover:bg-green-400"}
                              size="sm"
                          >
                            {isCompleted() ? "Concluído" : "Completar"}
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

  return (
      <>
      {showCompleteMissionDialog && (
          <CompleteMissionDialog
              open={showCompleteMissionDialog}
              setOpen={setShowCompleteMissionDialog}
              onCancel={() =>{
                  setCurrentSubmitingMission(null);
              }}
              onConfirm={async () => {
                  await completeItem(currentSubmitingMission);
                  setShowCompleteMissionDialog(false);
              }}
          />
        )}
        <NewPhaseDialog
            open={openDialog}
            setOpenDialog={setOpenDialog}
            currentPhaseName={userProfile!.phase}
            newPhase={newPhase}
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
          <div className="max-w-6xl mx-auto space-y-6">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userProfile?.points || 0}</div>
                    <p className="text-sm text-gray-600">Pontos Totais</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{completedItems?.length}</div>
                    <p className="text-sm text-gray-600">Concluídos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{currentPhase.name}</div>
                    <p className="text-sm text-gray-600">Fase Atual</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {renderItems(missions, "Missões", <Target className="w-5 h-5" />, "Nenhuma missão disponível")}
              {renderItems(books, "Livros", <BookOpen className="w-5 h-5" />, "Nenhum livro disponível")}
              {renderItems(courses, "Cursos", <GraduationCap className="w-5 h-5" />, "Nenhum curso disponível")}
            </div>
          </div>
        </div>
      </>
  );
};

export default Missions;
