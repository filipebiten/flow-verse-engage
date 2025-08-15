
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Target,
  CheckCircle,
  BookOpen,
  GraduationCap,
  Award
} from 'lucide-react';
import {useUserProfile} from "@/hooks/useUserProfile.tsx";
import { differenceInDays } from 'date-fns';
import {definePeriodBadgeColor} from "@/helpers/colorHelper.ts";
import {BadgeRequirement, checkBadgeEligibility} from "@/utils/badgeUtils.ts";

interface Mission {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'mission' | 'book' | 'course';
  period?: string;
  school?: string;
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
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Mission[]>([]);
  const [courses, setCourses] = useState<Mission[]>([]);
  const [completedItems, setCompletedItems] = useState<Map<string, object>>(new Map());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      console.log('Loading missions data...');
      
      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (profileError) {
        console.error('Error loading profile:', profileError);
      } else {
        console.log('Profile loaded:', profile);
        setUserProfile(profile);
      }

      // Load missions
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Missions query result:', { missionsData, missionsError });

      // Load books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Books query result:', { booksData, booksError });

      // Load courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Courses query result:', { coursesData, coursesError });

      // Transform data
      const transformedMissions = (missionsData || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        points: item.points,
        type: 'mission' as const,
        period: item.period
      }));

      const transformedBooks = (booksData || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        points: item.points,
        type: 'book' as const
      }));

      const transformedCourses = (coursesData || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        points: item.points,
        type: 'course' as const,
        school: item.school
      }));

      console.log('Transformed data:', { 
        missions: transformedMissions, 
        books: transformedBooks, 
        courses: transformedCourses 
      });

      setMissions(transformedMissions);
      setBooks(transformedBooks);
      setCourses(transformedCourses);

      // Load completed items
      const { data: completed, error: completedError } = await supabase
        .from('missions_completed')
        .select('*')
        .eq('user_id', user?.id);

      console.log('Completed missions result:', { completed, completedError });

      if (completed) {
        const completedIds = new Map(completed.map(item => [item.mission_id, item]));
        setCompletedItems(completedIds);
      }

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

  async function checkIfUserCompletedAnyBadge(userStats) {

    const badgesAchieved: BadgeRequirement[] = [];

    const {data: allBadges, error: error} = await supabase
        .from('badges')
        .select('*');

    const {data: userBadges, error: badgeError } = await supabase
        .from('user_badges')
        .select('*');

    allBadges.map((b) => {
      return {
        ...b,
        requirement:{
          type: b.requirement_field,
          count: b.requirement_value
        }
      }
    }).forEach((badge) => {
      const res = userBadges.find((ub) => ub.badge_id === badge.id);

      if (res === undefined && checkBadgeEligibility(badge, userStats)) {
        badgesAchieved.push(badge);
      }
    })

    return badgesAchieved;
  }

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

      const newPoints = (userProfile?.points || 0) + item.points;
      const newPhase = getUserPhase(newPoints);

      if(userProfile.phase !== newPhase.name) {

        const { errorPhase } = await supabase
            .from('phase_changes')
            .insert({
              user_id: userProfile.id,
              previous_phase: userProfile.phase,
              new_phase: newPhase.name,
              total_points: newPoints,
              changed_at: new Date()
            })

        toast({
          title: "Nova fase! 🎉",
          className: "bg-blue-700 text-white",
          description: `Você passou da fase ${userProfile.phase} para ${newPhase.name}`,
        });
      }

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
          variant: "destructive",
          className: "bg-red-700 text-white",
        });
        return;
      }

      setUserProfile({ ...userProfile!, points: newPoints, phase: newPhase.name });
      setCompletedItems(prev => new Map([...prev, [item.id, item]]));

      const badgesCompleted = await checkIfUserCompletedAnyBadge({
        points: newPoints,
        missions: completedMissions.find(c => c.mission_type === 'mission') || [],
        books: completedMissions.find(c => c.mission_type === 'book') || [],
        courses: completedMissions.find(c => c.mission_type === 'course') || [],
        consecutive_days: userProfile.consecutive_days
      });

      if(badgesCompleted.length > 0) {
        for (const badge of badgesCompleted) {

          const { error } = await supabase
              .from('user_badges')
              .insert({
                user_id: userProfile.id,
                badge_id: badge.id,
                earned_at: new Date()
              });

          toast({
            title: "Conquista atingida!! 🎉",
            className: "bg-green-700 text-white",
            description: `Parabens você acaba de atingir a conquista ${badge.name}!!!!`,
          });
        }
      }

      toast({
        title: "Parabéns! 🎉",
        className: "bg-green-700 text-white",
        description: `Você completou "${item.name}" e ganhou ${item.points} pontos!`,
      });

      refreshUserData();
    } catch (error) {
      console.error('Error completing mission:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao completar a missão.",
        className: "bg-red-700 text-white",
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
              const isCompleted = () => {
                const completed = completedItems.get(item.id);

                if (!completed)
                  return false;

                if (completed.period === null) {
                  return true;
                }

                if (completed.period === 'diário' && differenceInDays(new Date(), new Date(completed.completed_at)) > 0)
                  return false;
                else if (completed.period === 'semanal' && differenceInDays(new Date(), new Date(completed.completed_at)) > 6)
                  return false;
                else if (completed.period === 'semestral' && differenceInDays(new Date(), new Date(completed.completed_at)) > 179)
                  return false;
                else if (completed.period === 'Anual' && differenceInDays(new Date(), new Date(completed.completed_at)) > 364)
                  return false;

                return true;
              };

              return (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg transition-all ${
                    isCompleted()
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        {isCompleted() && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className='bg-green-500 text-white' variant="secondary">+{item.points} pts</Badge>
                        {item.period && <Badge className={`${definePeriodBadgeColor(item.period)}`} variant="default">{item.period[0].toUpperCase() + item.period.slice(1)}</Badge>}
                        {item.school && <Badge variant="outline">{item.school}</Badge>}
                      </div>
                    </div>
                    <Button
                      onClick={() => completeItem(item)}
                      disabled={isCompleted()}
                      variant={isCompleted() ? "secondary" : "default"}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </CardContent>
        </Card>

        {/* Missions, Books, Courses */}
        <div className="space-y-6">
          {renderItems(missions, "Missões", <Target className="w-5 h-5" />, "Nenhuma missão disponível")}
          {renderItems(books, "Livros", <BookOpen className="w-5 h-5" />, "Nenhum livro disponível")}
          {renderItems(courses, "Cursos", <GraduationCap className="w-5 h-5" />, "Nenhum curso disponível")}
        </div>
      </div>
    </div>
  );
};

export default Missions;
