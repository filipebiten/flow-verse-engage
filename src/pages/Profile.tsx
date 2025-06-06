import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, BookOpen, GraduationCap, Award, TrendingUp, Calendar, Clock } from "lucide-react";

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

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<MissionActivity[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    
    const userData = JSON.parse(user);
    // Ensure books are arrays with proper structure
    if (!userData.booksRead || !Array.isArray(userData.booksRead)) {
      userData.booksRead = [];
    }
    if (!userData.badges || !Array.isArray(userData.badges)) {
      userData.badges = [];
    }
    
    setCurrentUser(userData);
    loadUserActivities(userData.id);
  }, [navigate]);

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
      "Riacho": { 
        emoji: "🌀", 
        phrase: "Começando a fluir", 
        description: "Início da caminhada com Deus e com a FLOW.",
        color: "bg-green-100 text-green-800",
        nextPhase: "Correnteza",
        nextPoints: 251
      },
      "Correnteza": { 
        emoji: "🌊", 
        phrase: "Sendo levado por algo maior", 
        description: "Engajado no PGM, abrindo-se ao mover de Deus.",
        color: "bg-blue-100 text-blue-800",
        nextPhase: "Cachoeira",
        nextPoints: 501
      },
      "Cachoeira": { 
        emoji: "💥", 
        phrase: "Entregue ao movimento de Deus", 
        description: "Servindo com intensidade e sendo transformador.",
        color: "bg-purple-100 text-purple-800",
        nextPhase: "Oceano",
        nextPoints: 1001
      },
      "Oceano": { 
        emoji: "🌌", 
        phrase: "Profundamente imerso em Deus", 
        description: "Maturidade espiritual, liderança e profundidade.",
        color: "bg-gray-900 text-white",
        nextPhase: null,
        nextPoints: null
      }
    };
    return phases[phase as keyof typeof phases] || phases["Riacho"];
  };

  const getPhaseProgress = () => {
    if (!currentUser) return 0;
    const phaseInfo = getPhaseInfo(currentUser.phase);
    
    if (!phaseInfo.nextPoints) return 100; // Max level
    
    const currentPhaseStart = phaseInfo.nextPoints === 251 ? 0 : 
                             phaseInfo.nextPoints === 501 ? 251 :
                             phaseInfo.nextPoints === 1001 ? 501 : 0;
    
    const progressInPhase = currentUser.points - currentPhaseStart;
    const totalPointsForPhase = phaseInfo.nextPoints - currentPhaseStart;
    
    return Math.min((progressInPhase / totalPointsForPhase) * 100, 100);
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  const getBadgeInfo = (badgeId: string) => {
    const badges = {
      // Reading badges
      'reader-1': { name: 'Leitor Iniciante', icon: '📖', description: 'Começando a jornada da leitura.' },
      'reader-2': { name: 'Leitor Fluente', icon: '📚', description: 'Já tem o hábito da leitura.' },
      'reader-3': { name: 'Leitor Voraz', icon: '🔥📚', description: 'Não larga um bom livro por nada.' },
      'reader-4': { name: 'Mente Brilhante', icon: '🧠✨', description: 'Devorador de sabedoria.' },
      
      // Course badges
      'course-1': { name: 'Discípulo em Formação', icon: '🎓', description: 'Iniciando jornada de formação.' },
      'course-2': { name: 'Aprendiz Dedicado', icon: '📘🎓', description: 'Sede de crescimento.' },
      'course-3': { name: 'Líder em Construção', icon: '🛠️🎓', description: 'Preparando-se para liderar.' },
      'course-4': { name: 'Mestre da Jornada', icon: '🧙‍♂️📘', description: 'Veterano do aprendizado.' },
      
      // Daily mission badges
      'daily-1': { name: 'Fiel no Pouco', icon: '🕊️', description: 'Fidelidade nos detalhes.' },
      'daily-2': { name: 'Constante no Caminho', icon: '⛰️', description: 'Perseverança constante.' },
      'daily-3': { name: 'Incansável na Missão', icon: '🏃‍♂️🔥', description: 'Vive o propósito.' },
      'daily-4': { name: 'Exemplo de Disciplina', icon: '🛡️✨', description: 'Inspiração de disciplina espiritual.' },
      
      // Combined badges
      'complete-1': { name: 'Discípulo Completo', icon: '🧎‍♂️🔥', description: 'Vida com Deus em ação.' },
      'complete-2': { name: 'Guerreiro da Rotina', icon: '🗡️📚🎓', description: 'Treinado e engajado.' },
      'complete-3': { name: 'Líder Exemplar', icon: '👑🧠✨', description: 'Liderança vivida com profundidade.' }
    };
    return badges[badgeId as keyof typeof badges];
  };

  const getStatistics = () => {
    if (!currentUser) return {};
    
    return {
      totalPoints: currentUser.points,
      booksRead: currentUser.booksRead.length,
      coursesCompleted: currentUser.coursesCompleted.length,
      missionsCompleted: userActivities.filter(a => a.type === 'mission').length,
      daysInJourney: getDaysInJourney(),
      badgesEarned: currentUser.badges.length,
      currentPhase: currentUser.phase
    };
  };

  const getDaysInJourney = () => {
    if (!currentUser?.joinDate) return 0;
    const joinDate = new Date(currentUser.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (!currentUser) return null;

  const phaseInfo = getPhaseInfo(currentUser.phase);
  const stats = getStatistics();

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
            <div>
              <h1 className="text-2xl font-bold text-teal-700">Meu Perfil</h1>
            </div>
          </div>
          
          {currentUser.isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-purple-600 border-purple-200"
            >
              <Settings className="w-4 h-4 mr-1" />
              Modo Admin
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentUser.profilePhoto || ''} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
                  <p className="text-gray-600">{currentUser.email}</p>
                  {currentUser.whatsapp && (
                    <p className="text-gray-600">WhatsApp: {currentUser.whatsapp}</p>
                  )}
                  <p className="text-gray-600">
                    {currentUser.pgmRole} {currentUser.pgmNumber && `- ${currentUser.pgmNumber}`}
                  </p>
                  <p className="text-sm text-gray-500">Membro desde {formatJoinDate(currentUser.joinDate)}</p>
                </div>
                
                <div className="flex items-center space-x-3 flex-wrap">
                  <Badge className={phaseInfo.color}>
                    {phaseInfo.emoji} {currentUser.phase}
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {currentUser.points} pontos
                  </Badge>
                  {currentUser.isAdmin && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Administrador
                    </Badge>
                  )}
                  {currentUser.participatesFlowUp && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      FLOW UP
                    </Badge>
                  )}
                  {currentUser.participatesIrmandade && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      IRMANDADE
                    </Badge>
                  )}
                </div>

                {/* Small Badges Display */}
                {currentUser.badges.length > 0 && (
                  <div className="flex items-center space-x-1 flex-wrap">
                    <span className="text-sm font-medium text-gray-600 mr-2">Badges:</span>
                    {currentUser.badges.slice(0, 8).map((badgeId) => {
                      const badge = getBadgeInfo(badgeId);
                      if (!badge) return null;
                      return (
                        <span key={badgeId} className="text-lg" title={badge.name}>
                          {badge.icon}
                        </span>
                      );
                    })}
                    {currentUser.badges.length > 8 && (
                      <span className="text-sm text-gray-500">+{currentUser.badges.length - 8}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Estatísticas da Jornada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.totalPoints}</div>
                <p className="text-gray-600 text-sm">Pontos Totais</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.booksRead}</div>
                <p className="text-gray-600 text-sm">Livros Lidos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.coursesCompleted}</div>
                <p className="text-gray-600 text-sm">Cursos Concluídos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.missionsCompleted}</div>
                <p className="text-gray-600 text-sm">Missões Concluídas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">{stats.badgesEarned}</div>
                <p className="text-gray-600 text-sm">Badges Conquistados</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">{stats.daysInJourney}</div>
                <p className="text-gray-600 text-sm">Dias de Jornada</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{phaseInfo.emoji}</div>
                <p className="text-gray-600 text-sm">{stats.currentPhase}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {phaseInfo.emoji} Fase: {currentUser.phase}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-lg font-medium text-gray-700">"{phaseInfo.phrase}"</p>
              <p className="text-gray-600">{phaseInfo.description}</p>
            </div>
            
            {phaseInfo.nextPhase && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso para {phaseInfo.nextPhase}</span>
                  <span>{currentUser.points} / {phaseInfo.nextPoints} pontos</span>
                </div>
                <Progress value={getPhaseProgress()} className="h-3" />
                <p className="text-xs text-gray-500">
                  Faltam {(phaseInfo.nextPoints || 0) - currentUser.points} pontos para a próxima fase
                </p>
              </div>
            )}
            
            {currentUser.phase === "Oceano" && (
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-lg font-medium text-gray-700">🎉 Você alcançou o nível máximo!</p>
                <p className="text-gray-600">Parabéns por sua jornada espiritual!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="books">Biblioteca</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Badges Conquistados ({currentUser.badges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentUser.badges.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum badge conquistado ainda</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentUser.badges.map((badgeId) => {
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Timeline de Missões
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma missão concluída ainda.</p>
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
                          {activity.completedAt && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                              <Calendar className="w-3 h-3" />
                              <span>Concluída em {formatDate(activity.completedAt)}</span>
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
          
          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Livros Lidos ({currentUser.booksRead.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentUser.booksRead.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum livro lido ainda</p>
                ) : (
                  <div className="space-y-2">
                    {currentUser.booksRead.map((book, index) => (
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
                  Cursos ({currentUser.coursesCompleted.length} concluídos)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentUser.coursesCompleted.length === 0 && currentUser.coursesInProgress.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum curso iniciado ainda</p>
                ) : (
                  <>
                    {currentUser.coursesCompleted.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Concluídos:</h4>
                        <div className="space-y-2">
                          {currentUser.coursesCompleted.map((course, index) => (
                            <div key={index} className="p-2 bg-green-50 rounded flex items-center">
                              <span className="text-sm flex-1">{course}</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                ✓
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentUser.coursesInProgress.length > 0 && (
                      <div>
                        <h4 className="font-medium text-blue-700 mb-2">Em andamento:</h4>
                        <div className="space-y-2">
                          {currentUser.coursesInProgress.map((course, index) => (
                            <div key={index} className="p-2 bg-blue-50 rounded flex items-center">
                              <span className="text-sm flex-1">{course}</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                📖
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
