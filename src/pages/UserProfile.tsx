
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckSquare, BookOpen, GraduationCap, Award, Clock, Target } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  birthDate: string;
  gender: string;
  pgmRole: string;
  pgmNumber: string;
  participatesFlowUp: boolean;
  participatesIrmandade: boolean;
  isAdmin: boolean;
  phase: string;
  points: number;
  profilePhoto: string | null;
  joinDate: string;
  booksRead: string[];
  coursesCompleted: string[];
  coursesInProgress: string[];
  badges: string[];
}

interface MissionActivity {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  missionName: string;
  points: number;
  timestamp: string;
  type?: string;
  period?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<MissionActivity[]>([]);

  useEffect(() => {
    // Check if current user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Load user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.id === userId);
    
    if (foundUser) {
      // Ensure arrays are properly initialized
      if (!foundUser.booksRead || !Array.isArray(foundUser.booksRead)) {
        foundUser.booksRead = [];
      }
      if (!foundUser.badges || !Array.isArray(foundUser.badges)) {
        foundUser.badges = [];
      }
      if (!foundUser.coursesCompleted || !Array.isArray(foundUser.coursesCompleted)) {
        foundUser.coursesCompleted = [];
      }
      
      setUser(foundUser);
      loadUserActivities(userId!);
    } else {
      navigate('/feed');
    }
  }, [userId, navigate]);

  const loadUserActivities = (userId: string) => {
    const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    const userActivities = activities
      .filter((activity: MissionActivity) => activity.userId === userId)
      .sort((a: MissionActivity, b: MissionActivity) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    setUserActivities(userActivities);
  };

  const getPhaseInfo = (phase: string) => {
    const phases = {
      "Riacho": { emoji: "🌀", color: "bg-green-100 text-green-800", phrase: "Começando a fluir" },
      "Correnteza": { emoji: "🌊", color: "bg-blue-100 text-blue-800", phrase: "Sendo levado por algo maior" },
      "Cachoeira": { emoji: "💥", color: "bg-purple-100 text-purple-800", phrase: "Entregue ao movimento de Deus" },
      "Oceano": { emoji: "🌌", color: "bg-gray-900 text-white", phrase: "Profundamente imerso em Deus" }
    };
    return phases[phase as keyof typeof phases] || phases["Riacho"];
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getBadgeInfo = (badgeId: string) => {
    const badges = {
      'reader-1': { name: 'Leitor Iniciante', icon: '📖', description: 'Começando a jornada da leitura.' },
      'reader-2': { name: 'Leitor Fluente', icon: '📚', description: 'Já tem o hábito da leitura.' },
      'reader-3': { name: 'Leitor Voraz', icon: '🔥📚', description: 'Não larga um bom livro por nada.' },
      'reader-4': { name: 'Mente Brilhante', icon: '🧠✨', description: 'Um verdadeiro devorador de sabedoria.' },
      'course-1': { name: 'Discípulo em Formação', icon: '🎓', description: 'Iniciando sua jornada de formação.' },
      'course-2': { name: 'Aprendiz Dedicado', icon: '📘🎓', description: 'Mostrando sede de crescimento.' },
      'course-3': { name: 'Líder em Construção', icon: '🛠️🎓', description: 'Preparando-se para grandes responsabilidades.' },
      'course-4': { name: 'Mestre da Jornada', icon: '🧙‍♂️📘', description: 'Um veterano na trilha do aprendizado.' },
    };
    return badges[badgeId as keyof typeof badges];
  };

  if (!user) return null;

  const phaseInfo = getPhaseInfo(user.phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/feed')}
              className="text-teal-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Feed
            </Button>
            <h1 className="text-2xl font-bold text-teal-700">Perfil de {user?.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header - Only show public info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profilePhoto || ''} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                  <p className="text-gray-600">
                    {user.pgmRole} {user.pgmNumber && `- ${user.pgmNumber}`}
                  </p>
                  <p className="text-sm text-gray-500">Membro desde {formatJoinDate(user.joinDate)}</p>
                </div>
                
                <div className="flex items-center space-x-3 flex-wrap">
                  <Badge className={phaseInfo.color}>
                    {phaseInfo.emoji} {user.phase}
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {user.points} pontos
                  </Badge>
                  {user.participatesFlowUp && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      FLOW UP
                    </Badge>
                  )}
                  {user.participatesIrmandade && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      IRMANDADE
                    </Badge>
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-700">"{phaseInfo.phrase}"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        {user.badges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Badges Conquistados ({user.badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.badges.map((badgeId) => {
                  const badge = getBadgeInfo(badgeId);
                  if (!badge) return null;
                  
                  return (
                    <div key={badgeId} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-700">{badge.name}</h4>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different sections */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="missions">Missões</TabsTrigger>
            <TabsTrigger value="books">Biblioteca</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Timeline de Atividades
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Este usuário ainda não concluiu nenhuma missão.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {userActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-lg border bg-white">
                        <div className="w-3 h-3 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{activity.missionName}</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              +{activity.points}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>Tipo: {activity.type === 'mission' ? 'Missão' : activity.type === 'book' ? 'Livro' : 'Curso'}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                          {activity.period && (
                            <div className="text-xs text-gray-400 mt-1">
                              Período: {activity.period}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="missions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Histórico de Missões
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userActivities.filter(a => a.type === 'mission').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma missão concluída ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {userActivities.filter(a => a.type === 'mission').map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-white">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{activity.missionName}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                +{activity.points}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Livros Lidos ({user.booksRead.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.booksRead.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum livro lido ainda</p>
                ) : (
                  <div className="space-y-2">
                    {user.booksRead.map((book, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded flex items-center">
                        <BookOpen className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm flex-1">{book}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          ✓ Lido
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Cursos ({user.coursesCompleted.length} concluídos)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.coursesCompleted.length === 0 && user.coursesInProgress.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum curso iniciado ainda</p>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-600">{user.coursesCompleted.length}</div>
                    <p className="text-gray-600">concluídos</p>
                    {user.coursesInProgress.length > 0 && (
                      <>
                        <div className="text-lg font-medium text-blue-600">{user.coursesInProgress.length}</div>
                        <p className="text-gray-600 text-sm">em andamento</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
