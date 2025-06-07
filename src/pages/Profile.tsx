
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
  name: string;
  pgm: string;
  email: string;
  phone: string;
  role: 'membro' | 'líder' | 'supervisor' | 'coordenador' | 'pastor';
  irmandade: boolean;
  flowUp: boolean;
  flowUpLevel: number;
  phase: number;
  completedMissions: number;
  totalMissions: number;
  badges: string[];
  completedBooks: string[];
  completedCourses: string[];
}

interface MissionActivity {
  id: string;
  type: 'mission' | 'book' | 'course';
  title: string;
  description: string;
  timestamp: string;
  type?: string;
  period?: string;
  completedAt?: string;
}

const Profile = () => {
  const [userProfile] = useState<UserProfile>({
    name: "João Silva",
    pgm: "PGM001",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    role: "líder",
    irmandade: true,
    flowUp: true,
    flowUpLevel: 3,
    phase: 2,
    completedMissions: 45,
    totalMissions: 60,
    badges: ["leitor-iniciante", "discipulo-formacao", "fiel-pouco"],
    completedBooks: ["Livro da Vida", "Propósito Eterno"],
    completedCourses: ["Fundamentos da Fé", "Liderança Cristã"]
  });

  const [activities] = useState<MissionActivity[]>([
    {
      id: "1",
      type: "mission",
      title: "Oração Matinal",
      description: "Realizou oração matinal",
      timestamp: "2024-01-15T08:00:00Z",
      completedAt: "2024-01-15T08:30:00Z"
    },
    {
      id: "2",
      type: "book",
      title: "Livro da Vida",
      description: "Concluiu a leitura",
      timestamp: "2024-01-14T20:00:00Z",
      completedAt: "2024-01-14T20:30:00Z"
    }
  ]);

  const getBadgeInfo = (badgeId: string) => {
    const badges = {
      "leitor-iniciante": { icon: "📖", name: "Leitor Iniciante", description: "Começando a jornada da leitura" },
      "discipulo-formacao": { icon: "🎓", name: "Discípulo em Formação", description: "Iniciando jornada de formação" },
      "fiel-pouco": { icon: "🕊️", name: "Fiel no Pouco", description: "Fidelidade nos detalhes" }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Mobile Optimized */}
        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{userProfile.name}</h1>
                    <p className="text-sm text-gray-600">{userProfile.pgm}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getRoleIcon(userProfile.role)}
                    <span className="text-sm font-medium capitalize">{userProfile.role}</span>
                  </div>
                </div>

                {/* Badges Row - Mobile Optimized */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                  {userProfile.irmandade && (
                    <Badge variant="secondary" className="text-xs">Irmandade</Badge>
                  )}
                  {userProfile.flowUp && (
                    <Badge variant="secondary" className="text-xs">Flow Up Nv.{userProfile.flowUpLevel}</Badge>
                  )}
                  <Badge variant="outline" className="text-xs">Fase {userProfile.phase}</Badge>
                </div>

                {/* User Badges - Mobile Scrollable */}
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {userProfile.badges.map((badgeId, index) => {
                    const badge = getBadgeInfo(badgeId);
                    return (
                      <div 
                        key={index}
                        className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0"
                      >
                        <span>{badge.icon}</span>
                        <span className="hidden sm:inline">{badge.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
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
                  <p className="text-lg sm:text-xl font-bold">{userProfile.completedMissions}/{userProfile.totalMissions}</p>
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
                  <p className="text-lg sm:text-xl font-bold">{userProfile.completedBooks.length}</p>
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
                  <p className="text-lg sm:text-xl font-bold">{userProfile.completedCourses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Badges</p>
                  <p className="text-lg sm:text-xl font-bold">{userProfile.badges.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Mobile Optimized */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="info" className="text-xs sm:text-sm py-2">Informações</TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs sm:text-sm py-2">Timeline</TabsTrigger>
                <TabsTrigger value="progress" className="text-xs sm:text-sm py-2">Progresso</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="p-3 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Informações Pessoais</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Email:</span> {userProfile.email}</p>
                      <p><span className="font-medium">Telefone:</span> {userProfile.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Livros Concluídos</h3>
                    <div className="space-y-1">
                      {userProfile.completedBooks.map((book, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="truncate">{book}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Cursos Concluídos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {userProfile.completedCourses.map((course, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="p-3 sm:p-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm sm:text-base">Histórico de Atividades</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {activity.type === 'mission' && <Target className="w-5 h-5 text-blue-500" />}
                          {activity.type === 'book' && <BookOpen className="w-5 h-5 text-green-500" />}
                          {activity.type === 'course' && <GraduationCap className="w-5 h-5 text-purple-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                          <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                          {activity.completedAt && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Concluído em {formatDate(activity.completedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="p-3 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-sm sm:text-base">Progresso da Fase</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fase {userProfile.phase}</span>
                      <span>{Math.round((userProfile.completedMissions / userProfile.totalMissions) * 100)}%</span>
                    </div>
                    <Progress value={(userProfile.completedMissions / userProfile.totalMissions) * 100} className="h-3" />
                    <p className="text-xs text-gray-600">
                      {userProfile.totalMissions - userProfile.completedMissions} missões restantes para a próxima fase
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-sm sm:text-base">Badges Conquistados</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userProfile.badges.map((badgeId, index) => {
                      const badge = getBadgeInfo(badgeId);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <span className="text-2xl">{badge.icon}</span>
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm">{badge.name}</h4>
                            <p className="text-xs text-gray-600">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
