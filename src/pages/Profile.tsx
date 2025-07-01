
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Trophy, 
  Target, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  Star,
  Crown,
  Shield,
  Clock,
  CheckCircle,
  Award
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  pgm: string;
  email: string;
  phone: string;
  role: string;
  irmandade: boolean;
  flowUp: boolean;
  flowUpLevel: number;
  phase: string;
  completedMissions: number;
  totalMissions: number;
  badges: string[];
  completedBooks: string[];
  completedCourses: string[];
  points: number;
}

interface MissionActivity {
  id: string;
  type: 'mission' | 'book' | 'course';
  title: string;
  description: string;
  timestamp: string;
  period?: string;
  completedAt?: string;
}

const Profile = () => {
  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const missionActivities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
  
  // Filter activities for current user
  const userActivities = missionActivities.filter((activity: any) => activity.userId === currentUser.id);

  const getBadgeInfo = (badgeId: string) => {
    const badges = {
      "reader-1": { icon: "📖", name: "Leitor Iniciante", description: "Começando a jornada da leitura" },
      "reader-2": { icon: "📚", name: "Leitor Fluente", description: "Já tem o hábito da leitura" },
      "reader-3": { icon: "🔥📚", name: "Leitor Voraz", description: "Não larga um bom livro por nada" },
      "reader-4": { icon: "🧠✨", name: "Mente Brilhante", description: "Um verdadeiro devorador de sabedoria" },
      "course-1": { icon: "🎓", name: "Discípulo em Formação", description: "Iniciando sua jornada de formação" },
      "course-2": { icon: "📘🎓", name: "Aprendiz Dedicado", description: "Mostrando sede de crescimento" },
      "course-3": { icon: "🛠️🎓", name: "Líder em Construção", description: "Preparando-se para grandes responsabilidades" },
      "course-4": { icon: "🧙‍♂️📘", name: "Mestre da Jornada", description: "Um veterano na trilha do aprendizado" }
    };
    return badges[badgeId as keyof typeof badges] || { icon: "🏅", name: "Badge", description: "" };
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'pastor': return <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />;
      case 'coordenador': return <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />;
      case 'supervisor': return <Star className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />;
      case 'líder': return <Award className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
      default: return <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPhaseProgress = () => {
    const points = currentUser.points || 0;
    // Simulate phase progress based on points
    const phaseThresholds = [0, 100, 250, 500, 1000];
    const currentPhaseIndex = phaseThresholds.findIndex(threshold => points < threshold) - 1;
    const currentPhase = Math.max(0, currentPhaseIndex);
    const nextThreshold = phaseThresholds[currentPhase + 1] || 1000;
    const prevThreshold = phaseThresholds[currentPhase] || 0;
    
    return {
      current: currentPhase + 1,
      progress: ((points - prevThreshold) / (nextThreshold - prevThreshold)) * 100,
      remaining: nextThreshold - points
    };
  };

  const phaseProgress = getPhaseProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-3 sm:space-y-6">
        {/* Header */}
        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm sm:text-2xl font-bold flex-shrink-0">
                {currentUser.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </div>
              
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{currentUser.name}</h1>
                    <p className="text-xs sm:text-sm text-gray-600">{currentUser.pgmNumber}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2 self-start sm:self-center">
                    {getRoleIcon(currentUser.pgmRole)}
                    <span className="text-xs sm:text-sm font-medium capitalize">{currentUser.pgmRole}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                  {currentUser.participatesIrmandade && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Irmandade</Badge>
                  )}
                  {currentUser.participatesFlowUp && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Flow Up</Badge>
                  )}
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">{currentUser.phase}</Badge>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{currentUser.points || 0} pts</Badge>
                </div>

                {/* User Badges */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                  {(currentUser.badges || []).map((badgeId: string, index: number) => {
                    const badge = getBadgeInfo(badgeId);
                    return (
                      <div 
                        key={index}
                        className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0"
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <span className="hidden sm:inline text-xs">{badge.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600">Missões</p>
                  <p className="text-sm sm:text-xl font-bold">{userActivities.filter((a: any) => a.type === 'mission').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600">Livros</p>
                  <p className="text-sm sm:text-xl font-bold">{(currentUser.booksRead || []).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600">Cursos</p>
                  <p className="text-sm sm:text-xl font-bold">{(currentUser.coursesCompleted || []).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600">Badges</p>
                  <p className="text-sm sm:text-xl font-bold">{(currentUser.badges || []).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto rounded-none">
                <TabsTrigger value="info" className="text-xs sm:text-sm py-2 px-1">Informações</TabsTrigger>
                <TabsTrigger value="books" className="text-xs sm:text-sm py-2 px-1">Livros</TabsTrigger>
                <TabsTrigger value="courses" className="text-xs sm:text-sm py-2 px-1">Cursos</TabsTrigger>
                <TabsTrigger value="badges" className="text-xs sm:text-sm py-2 px-1">Badges</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="p-3 sm:p-6 space-y-3 sm:space-y-4 m-0">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Informações Pessoais</h3>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                      <p><span className="font-medium">WhatsApp:</span> {currentUser.whatsapp}</p>
                      <p><span className="font-medium">Data de Nascimento:</span> {currentUser.birthDate}</p>
                      <p><span className="font-medium">Gênero:</span> {currentUser.gender}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Progresso da Fase</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Fase {phaseProgress.current}</span>
                        <span>{Math.round(phaseProgress.progress)}%</span>
                      </div>
                      <Progress value={phaseProgress.progress} className="h-2 sm:h-3" />
                      <p className="text-xs text-gray-600">
                        {phaseProgress.remaining > 0 ? `${phaseProgress.remaining} pontos para a próxima fase` : 'Fase máxima alcançada!'}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="books" className="p-3 sm:p-6 m-0">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm sm:text-base">Livros Lidos ({(currentUser.booksRead || []).length})</h3>
                  {(currentUser.booksRead || []).length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhum livro lido ainda</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Complete missões de leitura para aparecerem aqui
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-1">
                      {(currentUser.booksRead || []).map((book: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs sm:text-sm p-2 bg-green-50 rounded">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                          <span className="truncate">{book}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="courses" className="p-3 sm:p-6 m-0">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm sm:text-base">Cursos Concluídos ({(currentUser.coursesCompleted || []).length})</h3>
                  {(currentUser.coursesCompleted || []).length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhum curso concluído ainda</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Complete missões de cursos para aparecerem aqui
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-1">
                      {(currentUser.coursesCompleted || []).map((course: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs sm:text-sm p-2 bg-blue-50 rounded">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{course}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="badges" className="p-3 sm:p-6 space-y-3 sm:space-y-4 m-0">
                <div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Badges Conquistados ({(currentUser.badges || []).length})</h3>
                  {(currentUser.badges || []).length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhum badge conquistado ainda</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Complete missões para conquistar badges
                      </p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {(currentUser.badges || []).map((badgeId: string, index: number) => {
                        const badge = getBadgeInfo(badgeId);
                        return (
                          <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                            <span className="text-lg sm:text-2xl">{badge.icon}</span>
                            <div className="min-w-0">
                              <h4 className="font-medium text-xs sm:text-sm">{badge.name}</h4>
                              <p className="text-xs text-gray-600">{badge.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
