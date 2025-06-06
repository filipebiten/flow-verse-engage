
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, CheckSquare, Calendar, BookOpen, GraduationCap, Target, Trophy, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'mission' | 'book' | 'course';
  isActive: boolean;
  createdAt: string;
  bookId?: string;
  courseId?: string;
  period?: string;
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
  bookId?: string;
  courseId?: string;
  completedAt: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  phase: string;
  points: number;
  isActive: boolean;
  image?: string;
}

interface Course {
  id: string;
  title: string;
  school: string;
  phase: string;
  points: number;
  isActive: boolean;
}

const Missions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userActivities, setUserActivities] = useState<MissionActivity[]>([]);
  const [showBadgeDialog, setShowBadgeDialog] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    
    setCurrentUser(JSON.parse(user));
    loadMissions();
    loadBooks();
    loadCourses();
    loadUserActivities(JSON.parse(user).id);
  }, [navigate]);

  const loadMissions = () => {
    const storedMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    setMissions(storedMissions.filter((m: Mission) => m.isActive));
  };

  const loadBooks = () => {
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(storedBooks.filter((b: Book) => b.isActive));
  };

  const loadCourses = () => {
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(storedCourses.filter((c: Course) => c.isActive));
  };

  const loadUserActivities = (userId: string) => {
    const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    const userActivities = activities.filter((activity: MissionActivity) => activity.userId === userId);
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
    
    if (!phaseInfo.nextPoints) return 100;
    
    const currentPhaseStart = phaseInfo.nextPoints === 251 ? 0 : 
                             phaseInfo.nextPoints === 501 ? 251 :
                             phaseInfo.nextPoints === 1001 ? 501 : 0;
    
    const progressInPhase = currentUser.points - currentPhaseStart;
    const totalPointsForPhase = phaseInfo.nextPoints - currentPhaseStart;
    
    return Math.min((progressInPhase / totalPointsForPhase) * 100, 100);
  };

  const checkAndAwardBadges = (user: User) => {
    const currentBadges = user.badges || [];
    const newBadges: string[] = [];

    // Reading badges
    const booksCount = user.booksRead?.length || 0;
    if (booksCount >= 1 && !currentBadges.includes('reader-1')) newBadges.push('reader-1');
    if (booksCount >= 5 && !currentBadges.includes('reader-2')) newBadges.push('reader-2');
    if (booksCount >= 10 && !currentBadges.includes('reader-3')) newBadges.push('reader-3');
    if (booksCount >= 20 && !currentBadges.includes('reader-4')) newBadges.push('reader-4');

    // Course badges
    const coursesCount = user.coursesCompleted?.length || 0;
    if (coursesCount >= 1 && !currentBadges.includes('course-1')) newBadges.push('course-1');
    if (coursesCount >= 3 && !currentBadges.includes('course-2')) newBadges.push('course-2');
    if (coursesCount >= 5 && !currentBadges.includes('course-3')) newBadges.push('course-3');
    if (coursesCount >= 8 && !currentBadges.includes('course-4')) newBadges.push('course-4');

    // Combined badges
    if (booksCount >= 5 && coursesCount >= 3 && !currentBadges.includes('complete-1')) {
      newBadges.push('complete-1');
    }
    if (booksCount >= 10 && coursesCount >= 5 && !currentBadges.includes('complete-2')) {
      newBadges.push('complete-2');
    }
    if (booksCount >= 15 && coursesCount >= 8 && !currentBadges.includes('complete-3')) {
      newBadges.push('complete-3');
    }

    if (newBadges.length > 0) {
      const updatedUser = { ...user, badges: [...currentBadges, ...newBadges] };
      
      // Update localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      // Show badge dialog
      setNewBadges(newBadges);
      setShowBadgeDialog(true);

      // Add badge activity
      const badgeActivity = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userPhoto: user.profilePhoto,
        badges: newBadges,
        timestamp: new Date().toISOString()
      };
      
      const badgeActivities = JSON.parse(localStorage.getItem('badgeActivities') || '[]');
      badgeActivities.push(badgeActivity);
      localStorage.setItem('badgeActivities', JSON.stringify(badgeActivities));

      setCurrentUser(updatedUser);
    }
  };

  const completeMission = (mission: Mission) => {
    if (!currentUser) return;

    const completedAt = new Date().toISOString();
    
    const activity: MissionActivity = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhoto: currentUser.profilePhoto,
      missionName: mission.title,
      points: mission.points,
      timestamp: completedAt,
      type: mission.type,
      period: mission.period,
      bookId: mission.bookId,
      courseId: mission.courseId,
      completedAt
    };

    const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    activities.push(activity);
    localStorage.setItem('missionActivities', JSON.stringify(activities));

    const updatedUser = { 
      ...currentUser, 
      points: currentUser.points + mission.points 
    };

    if (mission.type === 'book' && mission.bookId) {
      const book = books.find(b => b.id === mission.bookId);
      if (book) {
        updatedUser.booksRead = [...(currentUser.booksRead || []), book.title];
      }
    }

    if (mission.type === 'course' && mission.courseId) {
      const course = courses.find(c => c.id === mission.courseId);
      if (course) {
        updatedUser.coursesCompleted = [...(currentUser.coursesCompleted || []), course.title];
      }
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    setCurrentUser(updatedUser);
    loadUserActivities(currentUser.id);

    toast({
      title: "Missão Concluída! 🎉",
      description: `Você ganhou ${mission.points} pontos!`,
    });

    // Check for new badges
    setTimeout(() => checkAndAwardBadges(updatedUser), 500);
  };

  const isMissionCompleted = (mission: Mission) => {
    return userActivities.some(activity => 
      activity.missionName === mission.title && 
      activity.type === mission.type
    );
  };

  const getMissionCompletionDate = (mission: Mission) => {
    const activity = userActivities.find(activity => 
      activity.missionName === mission.title && 
      activity.type === mission.type
    );
    return activity?.completedAt;
  };

  const formatDate = (dateString: string) => {
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
      'complete-1': { name: 'Discípulo Completo', icon: '🧎‍♂️🔥', description: 'Vida com Deus em ação.' },
      'complete-2': { name: 'Guerreiro da Rotina', icon: '🗡️📚🎓', description: 'Treinado e engajado.' },
      'complete-3': { name: 'Líder Exemplar', icon: '👑🧠✨', description: 'Liderança vivida com profundidade.' }
    };
    return badges[badgeId as keyof typeof badges];
  };

  const getAllBadges = () => {
    return [
      'reader-1', 'reader-2', 'reader-3', 'reader-4',
      'course-1', 'course-2', 'course-3', 'course-4',
      'complete-1', 'complete-2', 'complete-3'
    ];
  };

  const isBadgeUnlocked = (badgeId: string) => {
    return currentUser?.badges?.includes(badgeId) || false;
  };

  if (!currentUser) return null;

  const phaseInfo = getPhaseInfo(currentUser.phase);
  const currentPhaseMissions = missions.filter(m => 
    books.find(b => b.id === m.bookId)?.phase === currentUser.phase ||
    courses.find(c => c.id === m.courseId)?.phase === currentUser.phase ||
    (!m.bookId && !m.courseId)
  );

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
            <h1 className="text-2xl font-bold text-teal-700">Minhas Missões</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
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

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Badges ({currentUser.badges?.length || 0}/{getAllBadges().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getAllBadges().map((badgeId) => {
                const badge = getBadgeInfo(badgeId);
                const isUnlocked = isBadgeUnlocked(badgeId);
                
                return (
                  <div 
                    key={badgeId} 
                    className={`p-3 rounded-lg border transition-all ${
                      isUnlocked 
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' 
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl mb-1 ${!isUnlocked ? 'grayscale' : ''}`}>
                        {isUnlocked ? badge?.icon : '🔒'}
                      </div>
                      <h4 className={`text-xs font-medium ${isUnlocked ? 'text-purple-700' : 'text-gray-500'}`}>
                        {badge?.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{badge?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Missions for Current Phase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Missões da Fase {currentUser.phase}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPhaseMissions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma missão disponível para sua fase atual</p>
            ) : (
              currentPhaseMissions.map((mission) => {
                const isCompleted = isMissionCompleted(mission);
                const completionDate = getMissionCompletionDate(mission);

                return (
                  <div key={mission.id} className={`p-4 rounded-lg border ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{mission.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{mission.description}</p>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {mission.points} pontos
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {mission.type === 'mission' ? 'Missão' : mission.type === 'book' ? 'Livro' : 'Curso'}
                          </Badge>
                          {mission.period && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {mission.period}
                            </Badge>
                          )}
                        </div>
                        {isCompleted && completionDate && (
                          <div className="flex items-center space-x-1 mt-2 text-sm text-green-600">
                            <Calendar className="w-4 h-4" />
                            <span>Concluída em {formatDate(completionDate)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {isCompleted ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckSquare className="w-3 h-3 mr-1" />
                            Concluída
                          </Badge>
                        ) : (
                          <Button 
                            onClick={() => completeMission(mission)}
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            Concluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Badge Dialog */}
      <Dialog open={showBadgeDialog} onOpenChange={setShowBadgeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">🎉 Parabéns! Novo Badge Conquistado!</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            {newBadges.map((badgeId) => {
              const badge = getBadgeInfo(badgeId);
              return (
                <div key={badgeId} className="text-center space-y-4 mb-4">
                  <div className="text-6xl">{badge?.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-700">{badge?.name}</h3>
                    <p className="text-gray-600">{badge?.description}</p>
                  </div>
                </div>
              );
            })}
            <div className="text-center mt-6">
              <Button onClick={() => setShowBadgeDialog(false)} className="bg-purple-600 hover:bg-purple-700">
                Continuar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Missions;
