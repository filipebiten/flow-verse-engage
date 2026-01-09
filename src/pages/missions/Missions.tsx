import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { useToast } from '@/hooks/use-toast.ts';
import { supabase } from '@/integrations/supabase/client.ts';
import { useAuth } from '@/hooks/useAuth.tsx';
import { Target, BookOpen, GraduationCap } from 'lucide-react';
import { useUserProfile } from "@/hooks/useUserProfile.tsx";
import { checkBadgeEligibility } from "@/utils/badgeUtils.ts";
import NewPhaseDialog from "@/components/newPhaseDialog.tsx";
import {CompleteMissionDialog} from "@/pages/missions/completeMissionDialog.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import MissionsList from './missionsList';
import { cn } from '@/lib/utils';
import { resolveFontColor, resolvePhaseGradient } from '@/utils/colorUtil';
import { usePhases } from '@/contexts/phaseContext';
import { profile } from 'console';

export interface Mission {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'mission' | 'book' | 'course';
  period?: string;
  school?: string;
  image_url?: string;
  comment?: string;
  mission_reference?: string;
  sequencia?: number;
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

const tabsDisponible = [
  { 
    icon: <Target className="w-4 h-4 mr-1" />,
    value: "missions", 
    label: "Missões",
    color: "data-[state=active]:bg-green-600"
  },
  { 
    icon: <BookOpen className="w-4 h-4 mr-1" />, 
    value: "books", 
    label: "Livros",
    color: "data-[state=active]:bg-red-600"
  },
  { 
    icon: <GraduationCap className="w-4 h-4 mr-1" />, 
    value: "courses", 
    label: "Cursos",
    color: "data-[state=active]:bg-blue-600"
  }, 
]

const Missions = () => {
  const { user } = useAuth();
  const { refreshUserData } = useUserProfile();
  const { toast } = useToast();
  const [ showCompleteMissionDialog, setShowCompleteMissionDialog ] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Mission[]>([]);
  const [courses, setCourses] = useState<Mission[]>([]);
  const [completedItems, setCompletedItems] = useState<MissionCompleted[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSubmitingMission, setCurrentSubmitingMission] = useState<Mission>(null);
  const completingMissionRef = React.useRef<string | null>(null);
  const {getPhaseByPoints} = usePhases();
  const [newPoints, setNewPoints] = useState<number>(0); 
  const [currentPhaseName, setCurrentPhaseName] =  useState<string>("");

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
        period: item.period,
        sequencia: item.sequencia,
        mission_reference: item.mission_reference
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

  const completeItem = async (
    item: Mission
  ): Promise<MissionCompleted[] | null> => {
    if (completingMissionRef.current === item.id) {
      return null;
    }

    completingMissionRef.current = item.id;

    try {
      const { data: completedItem, error } = await supabase
        .from('missions_completed')
        .insert({
          user_id: user.id,
          mission_id: item.id,
          mission_name: item.name,
          mission_type: item.type,
          points: item.points,
          period: item.period || null,
          school: item.school || null,
          comment: item.comment || null
        })
        .select()
        .single();

      if (error) throw error;

      const updatedCompletedItems = [...completedItems, completedItem];
      setCompletedItems(updatedCompletedItems);

      const updatedPoints = (userProfile?.points || 0) + item.points;

      setNewPoints(updatedPoints);

      const phaseCandidate = getPhaseByPoints(updatedPoints);

      if (phaseCandidate && userProfile?.phase !== phaseCandidate.name) {

        setCurrentPhaseName(userProfile?.phase);

        await supabase.from('phase_changes').insert({
          user_id: userProfile!.id,
          previous_phase: userProfile!.phase,
          new_phase: phaseCandidate.name,
          total_points: updatedPoints,
          changed_at: new Date()
        });

        setOpenDialog(true);
      }

      await supabase.from('profiles').update({
        points: updatedPoints,
        phase: phaseCandidate?.name
      }).eq('id', user.id);

      setUserProfile(prev =>
        prev
          ? { ...prev, points: updatedPoints, phase: phaseCandidate?.name }
          : prev
      );


      toast({
        title: "Parabéns! 🎉",
        className: "bg-green-700 text-white",
        description: `Você completou "${item.name}" e ganhou ${item.points} pontos!`,
      });

      refreshUserData();
      return updatedCompletedItems;

    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao completar a missão.",
        variant: "destructive"
      });
      return null;
    } finally {
      completingMissionRef.current = null;
    }
  };


  async function checkIfSequenceHasBeenCompleted(
    updatedCompletedItems: MissionCompleted[]
  ) {
    if (!Array.isArray(updatedCompletedItems)) 
      return;

    const sequenceMissions = missions.filter(
      m => m.period === 'sequencia' && m.mission_reference
    );

    for (const mission of sequenceMissions) {
      const alreadyCompleted = updatedCompletedItems.some(
        c => c.mission_id === mission.id
      );
      if (alreadyCompleted)
         continue;

      const sequenceCompletions = updatedCompletedItems.filter(
        c =>
          c.mission_id === mission.mission_reference &&
          c.mission_type === 'mission'
      );

      if (sequenceCompletions.length >= (mission.sequencia || 0)) {
        const newCompletedItems = await completeItem(mission);
        if (newCompletedItems) {
          updatedCompletedItems = newCompletedItems;
        }
      }
    }
  }
    
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

  const currentPhase = getPhaseByPoints(userProfile.points || 0);

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
                  if (!currentSubmitingMission) return;

                  const updatedCompletedItems = await completeItem(currentSubmitingMission);
                  if (!updatedCompletedItems) return;

                  await checkIfSequenceHasBeenCompleted(updatedCompletedItems);

                  setShowCompleteMissionDialog(false);
                }}
                mission={currentSubmitingMission}
                setMission={setCurrentSubmitingMission}
            />
        )}
        <NewPhaseDialog
            open={openDialog}
            setOpenDialog={setOpenDialog}
            currentPhaseName={currentPhaseName}
            newPhase={getPhaseByPoints(newPoints)}
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card className="overflow-hidden">
              <div className={`bg-gradient-to-r ${resolvePhaseGradient(currentPhase?.color)} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Missões e Desafios</h1>
                    <p className="text-white/90">Continue sua jornada de crescimento</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl mb-2">{currentPhase?.icon}</div>
                    <Badge className="bg-white text-gray-800">{currentPhase?.name}</Badge>
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
                    <div className={`text-2xl font-bold ${resolveFontColor(currentPhase?.color)}`}>{currentPhase?.name}</div>
                    <p className="text-sm text-gray-600">Fase Atual</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card>
                <Tabs 
                  defaultValue='missions'
                > 
                  <TabsList> 
                    {tabsDisponible.map((t) => { 
                      const selectColor = t.value === 'missions' ? 'green': t.value === 'books' ? 'blue' : 'red';
                      return ( 
                        <> 
                          <TabsTrigger 
                            key={t.value} 
                            value={t.value}
                            className={cn(
                              t.color,
                              "data-[state=active]:text-white",
                              "data-[state=inactive]:text-gray-500",
                              "data-[state=inactive]:hover:bg-gray-100"
                            )}
                          > 
                            {t.icon} {t.label} 
                          </TabsTrigger> 
                        </>) 
                        })
                    } 
                  </TabsList> 
                  <Separator/> 
                    {tabsDisponible.map((t) => { 
                      const selectArray = (value: string): Mission[] => {
                         return value === 'missions' ? missions : value === 'books' ? books : courses; 
                      } 
                      
                      return ( 
                        <TabsContent 
                          value={t.value} 
                          key={t.value}
                          className='p-2'
                        > 
                          <MissionsList 
                            items={selectArray(t.value)}
                            type={t.value}
                            title={t.label}
                            icon={t.icon}
                            emptyMessage={`Nenhum(a) ${t.value} disponível.`}
                            completedItems={completedItems}
                            setCurrentSubmitingMission={setCurrentSubmitingMission}
                            setShowCompleteMissionDialog={setShowCompleteMissionDialog}
                            currentSubmitingMission={currentSubmitingMission}
                          />
                        </TabsContent> ) })} 
                  </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </>
  );
};

export default Missions;
