import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Star,
  Trophy,
  Flame,
  Crown,
  BookOpen,
  GraduationCap,
  Heart,
  Users,
  Zap
} from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'book' | 'course';
  phase: number;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  points: number;
  category: 'spiritual' | 'study' | 'service' | 'community';
}

interface UserProgress {
  currentPhase: number;
  totalMissions: number;
  completedMissions: number;
  nextPhaseRequirement: number;
  booksRead: number;
  coursesCompleted: number;
  consecutiveDays: number;
}

const Missions = () => {
  const [userProgress] = useState<UserProgress>({
    currentPhase: 2,
    totalMissions: 60,
    completedMissions: 45,
    nextPhaseRequirement: 60,
    booksRead: 3,
    coursesCompleted: 2,
    consecutiveDays: 15
  });

  const [missions] = useState<Mission[]>([
    {
      id: "1",
      title: "Oração Matinal",
      description: "Dedique 10 minutos para oração pessoal",
      type: "daily",
      phase: 2,
      completed: true,
      completedAt: "2024-01-15T08:30:00Z",
      points: 10,
      category: "spiritual"
    },
    {
      id: "2",
      title: "Leitura Bíblica",
      description: "Leia um capítulo da Bíblia",
      type: "daily",
      phase: 2,
      completed: false,
      dueDate: "2024-01-16T23:59:59Z",
      points: 15,
      category: "spiritual"
    },
    {
      id: "3",
      title: "Estudo: Fundamentos da Fé",
      description: "Complete o curso na Escola do Discípulo",
      type: "course",
      phase: 2,
      completed: false,
      points: 100,
      category: "study"
    },
    {
      id: "4",
      title: "Livro: Propósito Eterno",
      description: "Leia o livro completo",
      type: "book",
      phase: 2,
      completed: true,
      completedAt: "2024-01-10T20:00:00Z",
      points: 80,
      category: "study"
    }
  ]);

  const [showBadgePopup, setShowBadgePopup] = useState(false);

  const getBadges = () => {
    const badges = [
      // Badges de Leitura
      { 
        id: 'leitor-iniciante', 
        name: 'Leitor Iniciante', 
        icon: '📖', 
        requirement: 1, 
        current: userProgress.booksRead,
        type: 'books',
        unlocked: userProgress.booksRead >= 1,
        description: 'Começando a jornada da leitura'
      },
      { 
        id: 'leitor-fluente', 
        name: 'Leitor Fluente', 
        icon: '📚', 
        requirement: 5, 
        current: userProgress.booksRead,
        type: 'books',
        unlocked: userProgress.booksRead >= 5,
        description: 'Já tem o hábito da leitura'
      },
      { 
        id: 'leitor-voraz', 
        name: 'Leitor Voraz', 
        icon: '🔥📚', 
        requirement: 10, 
        current: userProgress.booksRead,
        type: 'books',
        unlocked: userProgress.booksRead >= 10,
        description: 'Não larga um bom livro por nada'
      },
      { 
        id: 'mente-brilhante', 
        name: 'Mente Brilhante', 
        icon: '🧠✨', 
        requirement: 20, 
        current: userProgress.booksRead,
        type: 'books',
        unlocked: userProgress.booksRead >= 20,
        description: 'Devorador de sabedoria'
      },
      
      // Badges de Cursos
      { 
        id: 'discipulo-formacao', 
        name: 'Discípulo em Formação', 
        icon: '🎓', 
        requirement: 1, 
        current: userProgress.coursesCompleted,
        type: 'courses',
        unlocked: userProgress.coursesCompleted >= 1,
        description: 'Iniciando jornada de formação'
      },
      { 
        id: 'aprendiz-dedicado', 
        name: 'Aprendiz Dedicado', 
        icon: '📘🎓', 
        requirement: 3, 
        current: userProgress.coursesCompleted,
        type: 'courses',
        unlocked: userProgress.coursesCompleted >= 3,
        description: 'Sede de crescimento'
      },
      { 
        id: 'lider-construcao', 
        name: 'Líder em Construção', 
        icon: '🛠️🎓', 
        requirement: 5, 
        current: userProgress.coursesCompleted,
        type: 'courses',
        unlocked: userProgress.coursesCompleted >= 5,
        description: 'Preparando-se para liderar'
      },
      { 
        id: 'mestre-jornada', 
        name: 'Mestre da Jornada', 
        icon: '🧙‍♂️📘', 
        requirement: 8, 
        current: userProgress.coursesCompleted,
        type: 'courses',
        unlocked: userProgress.coursesCompleted >= 8,
        description: 'Veterano do aprendizado'
      },
      
      // Badges de Consecutividade
      { 
        id: 'fiel-pouco', 
        name: 'Fiel no Pouco', 
        icon: '🕊️', 
        requirement: 7, 
        current: userProgress.consecutiveDays,
        type: 'consecutive',
        unlocked: userProgress.consecutiveDays >= 7,
        description: 'Fidelidade nos detalhes'
      },
      { 
        id: 'constante-caminho', 
        name: 'Constante no Caminho', 
        icon: '⛰️', 
        requirement: 30, 
        current: userProgress.consecutiveDays,
        type: 'consecutive',
        unlocked: userProgress.consecutiveDays >= 30,
        description: 'Perseverança constante'
      },
      { 
        id: 'incansavel-missao', 
        name: 'Incansável na Missão', 
        icon: '🏃‍♂️🔥', 
        requirement: 90, 
        current: userProgress.consecutiveDays,
        type: 'consecutive',
        unlocked: userProgress.consecutiveDays >= 90,
        description: 'Vive o propósito'
      },
      { 
        id: 'exemplo-disciplina', 
        name: 'Exemplo de Disciplina', 
        icon: '🛡️✨', 
        requirement: 180, 
        current: userProgress.consecutiveDays,
        type: 'consecutive',
        unlocked: userProgress.consecutiveDays >= 180,
        description: 'Inspiração de disciplina espiritual'
      }
    ];

    return badges;
  };

  const getPhaseInfo = (phase: number) => {
    const phases = {
      1: { name: "Fundação", color: "bg-blue-500", description: "Construindo bases sólidas" },
      2: { name: "Crescimento", color: "bg-green-500", description: "Expandindo conhecimento" },
      3: { name: "Maturidade", color: "bg-purple-500", description: "Desenvolvendo sabedoria" },
      4: { name: "Liderança", color: "bg-orange-500", description: "Influenciando outros" },
      5: { name: "Multiplicação", color: "bg-red-500", description: "Formando discípulos" }
    };
    return phases[phase as keyof typeof phases] || phases[1];
  };

  const getCategoryIcon = (category: Mission['category']) => {
    switch (category) {
      case 'spiritual': return <Heart className="w-4 h-4" />;
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'service': return <Users className="w-4 h-4" />;
      case 'community': return <Zap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const completeMission = (missionId: string) => {
    console.log(`Completing mission: ${missionId}`);
    // Lógica para completar missão
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const progressToNextPhase = (userProgress.completedMissions / userProgress.nextPhaseRequirement) * 100;
  const currentPhase = getPhaseInfo(userProgress.currentPhase);
  const nextPhase = getPhaseInfo(userProgress.currentPhase + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header - Mobile Optimized */}
        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-6">
            {/* Current Phase */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 ${currentPhase.color} rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0`}>
                {userProgress.currentPhase}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Fase {userProgress.currentPhase}: {currentPhase.name}</h1>
                <p className="text-sm text-gray-600">{currentPhase.description}</p>
              </div>
            </div>

            {/* Progress to Next Phase */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso para Fase {userProgress.currentPhase + 1}: {nextPhase.name}</span>
                <span className="font-medium">{userProgress.completedMissions}/{userProgress.nextPhaseRequirement}</span>
              </div>
              <Progress value={progressToNextPhase} className="h-3" />
              <p className="text-xs text-gray-600">
                {userProgress.nextPhaseRequirement - userProgress.completedMissions} missões restantes ({Math.round(100 - progressToNextPhase)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Missões</p>
                  <p className="text-lg sm:text-xl font-bold">{userProgress.completedMissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Livros</p>
                  <p className="text-lg sm:text-xl font-bold">{userProgress.booksRead}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Cursos</p>
                  <p className="text-lg sm:text-xl font-bold">{userProgress.coursesCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Sequência</p>
                  <p className="text-lg sm:text-xl font-bold">{userProgress.consecutiveDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missions List - Directly visible */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle className="text-lg sm:text-xl">Missões Ativas</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowBadgePopup(true)}
                className="text-xs sm:text-sm"
              >
                <Trophy className="w-4 h-4 mr-1" />
                Ver Badges
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="space-y-3">
              {missions.map((mission) => (
                <Card key={mission.id} className={`transition-all ${mission.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        mission.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        {mission.completed ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        ) : (
                          getCategoryIcon(mission.category)
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{mission.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={mission.type === 'daily' ? 'default' : 'secondary'} className="text-xs">
                              {mission.type === 'daily' ? 'Diária' : 
                               mission.type === 'weekly' ? 'Semanal' : 
                               mission.type === 'monthly' ? 'Mensal' :
                               mission.type === 'book' ? 'Livro' : 'Curso'}
                            </Badge>
                            <span className="text-xs text-orange-600 font-medium">+{mission.points}pts</span>
                          </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{mission.description}</p>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          {mission.completed && mission.completedAt ? (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>Concluído em {formatDate(mission.completedAt)}</span>
                            </div>
                          ) : mission.dueDate ? (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Prazo: {formatDate(mission.dueDate)}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Target className="w-3 h-3" />
                              <span>Sem prazo definido</span>
                            </div>
                          )}
                          
                          {!mission.completed && (
                            <Button 
                              size="sm" 
                              onClick={() => completeMission(mission.id)}
                              className="text-xs"
                            >
                              Marcar Concluído
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badge Popup - Mobile Optimized */}
        {showBadgePopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg sm:text-xl">Sistema de Badges</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowBadgePopup(false)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0 overflow-y-auto">
                <Tabs defaultValue="reading" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-auto">
                    <TabsTrigger value="reading" className="text-xs py-2">📚 Leitura</TabsTrigger>
                    <TabsTrigger value="courses" className="text-xs py-2">🎓 Cursos</TabsTrigger>
                    <TabsTrigger value="daily" className="text-xs py-2">🗓️ Diárias</TabsTrigger>
                    <TabsTrigger value="combined" className="text-xs py-2">🏆 Combinados</TabsTrigger>
                  </TabsList>

                  <TabsContent value="reading" className="space-y-3 mt-4">
                    {getBadges().filter(b => b.type === 'books').map((badge) => (
                      <div key={badge.id} className={`p-3 rounded-lg border-2 ${
                        badge.unlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' : 'bg-gray-100 border-gray-300 opacity-60'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{badge.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm sm:text-base">{badge.name}</h4>
                            <p className="text-xs text-gray-600 mb-1">{badge.description}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span>Progresso: {badge.current}/{badge.requirement}</span>
                              {badge.unlocked ? (
                                <Badge variant="default" className="text-xs">Desbloqueado</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">Bloqueado</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="courses" className="space-y-3 mt-4">
                    {getBadges().filter(b => b.type === 'courses').map((badge) => (
                      <div key={badge.id} className={`p-3 rounded-lg border-2 ${
                        badge.unlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' : 'bg-gray-100 border-gray-300 opacity-60'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{badge.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm sm:text-base">{badge.name}</h4>
                            <p className="text-xs text-gray-600 mb-1">{badge.description}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span>Progresso: {badge.current}/{badge.requirement}</span>
                              {badge.unlocked ? (
                                <Badge variant="default" className="text-xs">Desbloqueado</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">Bloqueado</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="daily" className="space-y-3 mt-4">
                    {getBadges().filter(b => b.type === 'consecutive').map((badge) => (
                      <div key={badge.id} className={`p-3 rounded-lg border-2 ${
                        badge.unlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' : 'bg-gray-100 border-gray-300 opacity-60'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{badge.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm sm:text-base">{badge.name}</h4>
                            <p className="text-xs text-gray-600 mb-1">{badge.description}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span>Progresso: {badge.current}/{badge.requirement}</span>
                              {badge.unlocked ? (
                                <Badge variant="default" className="text-xs">Desbloqueado</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">Bloqueado</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="combined" className="space-y-3 mt-4">
                    {/* Conteúdo para badges combinados */}
                    <p>Em breve, badges combinados!</p>
                  </TabsContent>

                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;
