import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Activity,
  Edit,
  Save,
  X,
  Lock
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
  missionsCompleted: string[];
  joinDate: string;
  profilePhoto?: string;
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
  school?: string;
}

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.id) {
      setCurrentUser(user);
      setEditForm(user);
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

  const getAllBadges = () => {
    return {
      "reader-1": { 
        icon: "📖", 
        name: "Leitor Iniciante", 
        description: "Começando a jornada da leitura",
        condition: "Leia 1 livro",
        requirement: 1,
        type: "books"
      },
      "reader-2": { 
        icon: "📚", 
        name: "Leitor Fluente", 
        description: "Já tem o hábito da leitura",
        condition: "Leia 3 livros",
        requirement: 3,
        type: "books"
      },
      "reader-3": { 
        icon: "🔥📚", 
        name: "Leitor Voraz", 
        description: "Não larga um bom livro por nada",
        condition: "Leia 5 livros",
        requirement: 5,
        type: "books"
      },
      "reader-4": { 
        icon: "🧠✨", 
        name: "Mente Brilhante", 
        description: "Um verdadeiro devorador de sabedoria",
        condition: "Leia 10 livros",
        requirement: 10,
        type: "books"
      },
      "course-1": { 
        icon: "🎓", 
        name: "Discípulo em Formação", 
        description: "Iniciando sua jornada de formação",
        condition: "Complete 1 curso",
        requirement: 1,
        type: "courses"
      },
      "course-2": { 
        icon: "📘🎓", 
        name: "Aprendiz Dedicado", 
        description: "Mostrando sede de crescimento",
        condition: "Complete 3 cursos",
        requirement: 3,
        type: "courses"
      },
      "course-3": { 
        icon: "🛠️🎓", 
        name: "Líder em Construção", 
        description: "Preparando-se para grandes responsabilidades",
        condition: "Complete 5 cursos",
        requirement: 5,
        type: "courses"
      },
      "course-4": { 
        icon: "🧙‍♂️📘", 
        name: "Mestre da Jornada", 
        description: "Um veterano na trilha do aprendizado",
        condition: "Complete 10 cursos",
        requirement: 10,
        type: "courses"
      },
      "mission-1": {
        icon: "🎯",
        name: "Primeiro Passo",
        description: "Completou sua primeira missão",
        condition: "Complete 1 missão",
        requirement: 1,
        type: "missions"
      },
      "mission-2": {
        icon: "🏹",
        name: "Focado no Alvo",
        description: "Mantendo a consistência",
        condition: "Complete 5 missões",
        requirement: 5,
        type: "missions"
      },
      "mission-3": {
        icon: "🏆",
        name: "Guerreiro Dedicado",
        description: "Mostrando determinação",
        condition: "Complete 10 missões",
        requirement: 10,
        type: "missions"
      }
    };
  };

  const getBadgeInfo = (badgeId: string) => {
    const badges = getAllBadges();
    return badges[badgeId as keyof typeof badges] || { icon: "🏅", name: "Badge", description: "", condition: "", requirement: 0, type: "" };
  };

  const checkBadgeEligibility = (badgeId: string) => {
    const badge = getBadgeInfo(badgeId);
    const userBadges = currentUser?.badges || [];
    
    if (userBadges.includes(badgeId)) return { earned: true, progress: badge.requirement };
    
    let currentCount = 0;
    if (badge.type === 'books') {
      currentCount = userActivities.filter(a => a.type === 'book').length;
    } else if (badge.type === 'courses') {
      currentCount = userActivities.filter(a => a.type === 'course').length;
    } else if (badge.type === 'missions') {
      currentCount = userActivities.filter(a => a.type === 'mission').length;
    }
    
    return { earned: false, progress: currentCount };
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
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...currentUser, ...editForm };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => u.id === currentUser?.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setIsEditing(false);
  };

  if (!currentUser) return null;

  const currentPhase = getUserPhase(currentUser.points);
  const phaseProgress = getPhaseProgress();
  const allBadges = getAllBadges();

  const missionActivities = userActivities.filter(a => a.type === 'mission');
  const bookActivities = userActivities.filter(a => a.type === 'book');
  const courseActivities = userActivities.filter(a => a.type === 'course');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${currentPhase.color} p-6 text-white`}>
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20 border-4 border-white/20">
                {currentUser.profilePhoto ? (
                  <AvatarImage src={currentUser.profilePhoto} alt={currentUser.name} />
                ) : (
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {getUserInitials(currentUser.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{currentUser.name}</h1>
                <p className="text-white/80 mb-2">{currentUser.pgmNumber}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  {getRoleIcon(currentUser.pgmRole)}
                  <span className="text-sm font-medium capitalize">{currentUser.pgmRole}</span>
                </div>

                <div className="flex gap-2 mb-3 flex-wrap">
                  {currentUser.participatesIrmandade && (
                    <Badge className="bg-white/20 text-white border-white/30">Irmandade</Badge>
                  )}
                  {currentUser.participatesFlowUp && (
                    <Badge className="bg-white/20 text-white border-white/30">Flow Up</Badge>
                  )}
                  <Badge className="bg-white/20 text-white border-white/30">{currentUser.points} pts</Badge>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{currentPhase.icon}</div>
                  <div>
                    <div className="text-lg font-bold">{currentPhase.name}</div>
                    <div className="text-sm text-white/80">"{currentPhase.phrase}"</div>
                  </div>
                </div>

                {/* Badges Display - Show earned badges */}
                {(currentUser.badges || []).length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-sm text-white/80 mr-2">Badges:</span>
                    {(currentUser.badges || []).map((badgeId: string, index: number) => {
                      const badge = getBadgeInfo(badgeId);
                      return (
                        <span key={index} className="text-xl" title={badge.name}>
                          {badge.icon}
                        </span>
                      );
                    })}
                  </div>
                )}
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
                  <p className="text-xl font-bold">{missionActivities.length}</p>
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
                  <p className="text-xl font-bold">{bookActivities.length}</p>
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
                  <p className="text-xl font-bold">{courseActivities.length}</p>
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
              <TabsList className="grid w-full grid-cols-7 h-auto rounded-none">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="missions">Missões</TabsTrigger>
                <TabsTrigger value="books">Livros</TabsTrigger>
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="all-badges">Conquistas</TabsTrigger>
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
                          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                            <span>
                              {activity.type === 'mission' ? '🎯 Missão' : 
                               activity.type === 'book' ? '📚 Livro' : '🎓 Curso'}
                            </span>
                            <span>•</span>
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                            {activity.period && (
                              <>
                                <span>•</span>
                                <span>{activity.period}</span>
                              </>
                            )}
                            {activity.school && (
                              <>
                                <span>•</span>
                                <span>{activity.school}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="info" className="p-6 space-y-4 m-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Informações Pessoais</h3>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        setEditForm(currentUser);
                      }
                      setIsEditing(!isEditing);
                    }}
                  >
                    {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          value={editForm.whatsapp || ''}
                          onChange={(e) => setEditForm({...editForm, whatsapp: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                        <Input
                          id="birthDate"
                          value={editForm.birthDate || ''}
                          onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      <Save className="w-4 h-4 mr-1" />
                      Salvar Alterações
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                    <p><span className="font-medium">WhatsApp:</span> {currentUser.whatsapp}</p>
                    <p><span className="font-medium">Data de Nascimento:</span> {currentUser.birthDate}</p>
                    <p><span className="font-medium">Gênero:</span> {currentUser.gender}</p>
                    <p><span className="font-medium">Membro desde:</span> {formatDate(currentUser.joinDate)}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="missions" className="p-6 m-0">
                <div className="space-y-3">
                  <h3 className="font-semibold">Missões Completadas ({missionActivities.length})</h3>
                  {missionActivities.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhuma missão completada ainda</p>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {missionActivities.map((activity: Activity) => (
                        <div key={activity.id} className="flex items-center gap-2 p-3 bg-blue-50 rounded border">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <div className="flex-1">
                            <span className="font-medium">{activity.missionName}</span>
                            <div className="text-xs text-gray-500">
                              {formatTimeAgo(activity.timestamp)}
                              {activity.period && ` • ${activity.period}`}
                            </div>
                          </div>
                          <Badge variant="secondary">+{activity.points}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="books" className="p-6 m-0">
                <div className="space-y-3">
                  <h3 className="font-semibold">Livros Lidos ({bookActivities.length})</h3>
                  {bookActivities.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhum livro lido ainda</p>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {bookActivities.map((activity: Activity) => (
                        <div key={activity.id} className="flex items-center gap-2 p-3 bg-green-50 rounded border">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <div className="flex-1">
                            <span className="font-medium">{activity.missionName}</span>
                            <div className="text-xs text-gray-500">
                              {formatTimeAgo(activity.timestamp)}
                            </div>
                          </div>
                          <Badge variant="secondary">+{activity.points}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="courses" className="p-6 m-0">
                <div className="space-y-3">
                  <h3 className="font-semibold">Cursos Concluídos ({courseActivities.length})</h3>
                  {courseActivities.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhum curso concluído ainda</p>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {courseActivities.map((activity: Activity) => (
                        <div key={activity.id} className="flex items-center gap-2 p-3 bg-purple-50 rounded border">
                          <CheckCircle className="w-4 h-4 text-purple-500" />
                          <div className="flex-1">
                            <span className="font-medium">{activity.missionName}</span>
                            <div className="text-xs text-gray-500">
                              {formatTimeAgo(activity.timestamp)}
                              {activity.school && ` • ${activity.school}`}
                            </div>
                          </div>
                          <Badge variant="secondary">+{activity.points}</Badge>
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

              <TabsContent value="all-badges" className="p-6 space-y-4 m-0">
                <h3 className="font-semibold">Todas as Conquistas Disponíveis</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(allBadges).map(([badgeId, badge]) => {
                    const eligibility = checkBadgeEligibility(badgeId);
                    const isEarned = eligibility.earned;
                    const progressPercent = Math.min((eligibility.progress / badge.requirement) * 100, 100);
                    
                    return (
                      <div 
                        key={badgeId} 
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          isEarned 
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="relative">
                          <span className={`text-2xl ${!isEarned ? 'grayscale opacity-50' : ''}`}>
                            {badge.icon}
                          </span>
                          {!isEarned && (
                            <Lock className="w-3 h-3 absolute -top-1 -right-1 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${!isEarned ? 'text-gray-500' : ''}`}>
                              {badge.name}
                            </h4>
                            {isEarned && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                Conquistado!
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${!isEarned ? 'text-gray-400' : 'text-gray-600'}`}>
                            {badge.description}
                          </p>
                          <p className={`text-xs mt-1 ${!isEarned ? 'text-gray-400' : 'text-blue-600'}`}>
                            {badge.condition}
                          </p>
                          {!isEarned && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Progresso: {eligibility.progress}/{badge.requirement}</span>
                                <span>{Math.round(progressPercent)}%</span>
                              </div>
                              <Progress value={progressPercent} className="h-1 mt-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
