
import React, { useState, useEffect } from 'react';
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
  Award,
  Activity
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  pgmNumber: string;
  email: string;
  whatsapp: string;
  birthDate: string;
  gender: string;
  pgmRole: string;
  participatesIrmandade: boolean;
  participatesFlowUp: boolean;
  phase: string;
  points: number;
  badges: string[];
  booksRead: string[];
  coursesCompleted: string[];
  joinDate: string;
}

interface Activity {
  id: string;
  userId: string;
  userName: string;
  missionName: string;
  points: number;
  timestamp: string;
  type: 'mission' | 'book' | 'course';
  period?: string;
}

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.id) {
      setCurrentUser(user);
      loadUserActivities(user.id);
    }
  }, []);

  const loadUserActivities = (userId: string) => {
    const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    const userActivities = activities
      .filter((activity: Activity) => activity.userId === userId)
      .sort((a: Activity, b: Activity) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setUserActivities(userActivities);
  };

  const getUserPhase = (points: number) => {
    if (points >= 1000) return { name: 'Oceano', icon: '🌊', phrase: 'Profundamente imerso em Deus', color: 'from-blue-900 to-indigo-900' };
    if (points >= 500) return { name: 'Cachoeira', icon: '💥', phrase: 'Entregue ao movimento de Deus', color: 'from-purple-600 to-blue-600' };
    if (points >= 250) return { name: 'Correnteza', icon: '🌊', phrase: 'Sendo levado por algo maior', color: 'from-blue-500 to-teal-500' };
    return { name: 'Riacho', icon: '🌀', phrase: 'Começando a fluir', color: 'from-green-400 to-blue-400' };
  };

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
      case 'pastor': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'coordenador': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'supervisor': return <Star className="w-4 h-4 text-blue-500" />;
      case 'líder': return <Award className="w-4 h-4 text-green-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getPhaseProgress = () => {
    const points = currentUser?.points || 0;
    const nextPhaseThreshold = points >= 1000 ? 1000 : 
                             points >= 500 ? 1000 :
                             points >= 250 ? 500 : 250;
    const prevPhaseThreshold = points >= 1000 ? 1000 :
                             points >= 500 ? 500 :
                             points >= 250 ? 250 : 0;
    
    return {
      current: points >= 1000 ? 4 : points >= 500 ? 3 : points >= 250 ? 2 : 1,
      progress: points >= 1000 ? 100 : ((points - prevPhaseThreshold) / (nextPhaseThreshold - prevPhaseThreshold)) * 100,
      remaining: points >= 1000 ? 0 : nextPhaseThreshold - points,
      nextThreshold: nextPhaseThreshold
    };
  };

  if (!currentUser) return null;

  const currentPhase = getUserPhase(currentUser.points);
  const phaseProgress = getPhaseProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${currentPhase.color} p-6 text-white`}>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {currentUser.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{currentUser.name}</h1>
                <p className="text-white/80 mb-2">{currentUser.pgmNumber}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  {getRoleIcon(currentUser.pgmRole)}
                  <span className="text-sm font-medium capitalize">{currentUser.pgmRole}</span>
                </div>

                <div className="flex gap-2 mb-3">
                  {currentUser.participatesIrmandade && (
                    <Badge className="bg-white/20 text-white border-white/30">Irmandade</Badge>
                  )}
                  {currentUser.participatesFlowUp && (
                    <Badge className="bg-white/20 text-white border-white/30">Flow Up</Badge>
                  )}
                  <Badge className="bg-white/20 text-white border-white/30">{currentUser.points} pts</Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-3xl">{currentPhase.icon}</div>
                  <div>
                    <div className="text-lg font-bold">{currentPhase.name}</div>
                    <div className="text-sm text-white/80">"{currentPhase.phrase}"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Missões</p>
                  <p className="text-xl font-bold">{userActivities.filter(a => a.type === 'mission').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Livros</p>
                  <p className="text-xl font-bold">{(currentUser.booksRead || []).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Cursos</p>
                  <p className="text-xl font-bold">{(currentUser.coursesCompleted || []).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Badges</p>
                  <p className="text-xl font-bold">{(currentUser.badges || []).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso da Fase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Fase {phaseProgress.current} - {currentPhase.name}</span>
                <span className="text-sm text-gray-600">
                  {currentUser.points >= 1000 ? '100%' : `${Math.round(phaseProgress.progress)}%`}
                </span>
              </div>
              <Progress value={phaseProgress.progress} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{currentUser.points} pontos</span>
                <span>
                  {phaseProgress.remaining > 0 
                    ? `${phaseProgress.remaining} pontos para próxima fase` 
                    : 'Fase máxima alcançada! Continue acumulando pontos.'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto rounded-none">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="books">Livros</TabsTrigger>
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="p-6 space-y-4 m-0">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5" />
                  <h3 className="font-semibold">Minha Timeline</h3>
                </div>
                
                {userActivities.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Nenhuma atividade ainda</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete missões, livros e cursos para aparecerem aqui
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {userActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-4 border rounded-lg bg-white">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{activity.missionName}</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              +{activity.points}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>
                              {activity.type === 'mission' ? '🎯 Missão' : 
                               activity.type === 'book' ? '📚 Livro' : '🎓 Curso'}
                            </span>
                            <span>•</span>
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="info" className="p-6 space-y-4 m-0">
                <div>
                  <h3 className="font-semibold mb-2">Informações Pessoais</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                    <p><span className="font-medium">WhatsApp:</span> {currentUser.whatsapp}</p>
                    <p><span className="font-medium">Data de Nascimento:</span> {currentUser.birthDate}</p>
                    <p><span className="font-medium">Gênero:</span> {currentUser.gender}</p>
                    <p><span className="font-medium">Membro desde:</span> {formatDate(currentUser.joinDate)}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="books" className="p-6 m-0">
                <div className="space-y-3">
                  <h3 className="font-semibold">Livros Lidos ({(currentUser.booksRead || []).length})</h3>
                  {(currentUser.booksRead || []).length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhum livro lido ainda</p>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {(currentUser.booksRead || []).map((book: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded border">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="flex-1">{book}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="courses" className="p-6 m-0">
                <div className="space-y-3">
                  <h3 className="font-semibold">Cursos Concluídos ({(currentUser.coursesCompleted || []).length})</h3>
                  {(currentUser.coursesCompleted || []).length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhum curso concluído ainda</p>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {(currentUser.coursesCompleted || []).map((course: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded border">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="flex-1">{course}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="badges" className="p-6 space-y-4 m-0">
                <h3 className="font-semibold">Badges Conquistados ({(currentUser.badges || []).length})</h3>
                {(currentUser.badges || []).length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Nenhum badge conquistado ainda</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {(currentUser.badges || []).map((badgeId: string, index: number) => {
                      const badge = getBadgeInfo(badgeId);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <span className="text-2xl">{badge.icon}</span>
                          <div>
                            <h4 className="font-medium">{badge.name}</h4>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
