
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, BookOpen, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PhaseChangeDialog from "@/components/PhaseChangeDialog";
import { getUserPhase, getNextPhase } from "@/utils/phaseUtils";
import { usePhaseColors } from "@/hooks/usePhaseColors";

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
  name: string;
  description: string;
  points: number;
  type: string;
  targetAudience: string[];
  createdAt: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  points: number;
  targetAudience: string[];
  createdAt: string;
  imageUrl?: string;
}

interface Course {
  id: string;
  name: string;
  school: string;
  description: string;
  points: number;
  targetAudience: string[];
  createdAt: string;
}

interface MissionActivity {
  id: string;
  userId: string;
  missionId: string;
  missionName: string;
  type: 'mission' | 'book' | 'course';
  points: number;
  completedAt: string;
  period: string;
}

const getCurrentPeriod = (type: string): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  switch (type) {
    case 'Missões Diárias':
      return `${year}-${month + 1}-${day}`;
    case 'Missões Semanais': {
      const startOfWeek = new Date(year, month, day - now.getDay());
      const endOfWeek = new Date(year, month, day + (6 - now.getDay()));
      return `${startOfWeek.toISOString().split('T')[0]} - ${endOfWeek.toISOString().split('T')[0]}`;
    }
    case 'Missões Mensais':
      return `${year}-${month + 1}`;
    case 'Missões Semestrais': {
      const semester = month < 6 ? 1 : 2;
      return `${year}-${semester}`;
    }
    case 'Missões Anuais':
      return `${year}`;
    default:
      return 'Sempre';
  }
};

const Missions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [missionActivities, setMissionActivities] = useState<MissionActivity[]>([]);
  const [showPhaseDialog, setShowPhaseDialog] = useState(false);
  const [previousPoints, setPreviousPoints] = useState(0);

  usePhaseColors(currentUser?.points || 0);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(user);
    setCurrentUser(userData);
    setPreviousPoints(userData.points);
    loadMissions();
    loadBooks();
    loadCourses();
    loadMissionActivities(userData.id);
  }, [navigate]);

  const loadMissions = () => {
    const storedMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    setMissions(storedMissions);
  };

  const loadBooks = () => {
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(storedBooks);
  };

  const loadCourses = () => {
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(storedCourses);
  };

  const loadMissionActivities = (userId: string) => {
    const storedActivities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    const userActivities = storedActivities.filter((activity: MissionActivity) => activity.userId === userId);
    setMissionActivities(userActivities);
  };

  const completeMission = (mission: Mission | Book | Course, type: 'mission' | 'book' | 'course') => {
    if (!currentUser) return;

    try {
      const activityId = `${mission.id}-${Date.now()}`;
      const missionName = (mission as Mission).name || (mission as Book).title || (mission as Course).name;
      
      const activity: MissionActivity = {
        id: activityId,
        userId: currentUser.id,
        missionId: mission.id,
        missionName: missionName,
        type,
        points: mission.points,
        completedAt: new Date().toISOString(),
        period: getCurrentPeriod((mission as Mission).type || 'Outras Missões')
      };

      const updatedActivities = [...missionActivities, activity];
      setMissionActivities(updatedActivities);
      localStorage.setItem('missionActivities', JSON.stringify(updatedActivities));

      // Store global mission activities for feed
      const globalActivities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
      const globalActivity = {
        ...activity,
        userName: currentUser.name,
        userPhoto: currentUser.profilePhoto
      };
      globalActivities.push(globalActivity);
      localStorage.setItem('missionActivities', JSON.stringify(globalActivities));

      setPreviousPoints(currentUser.points);
      const newPoints = currentUser.points + mission.points;
      
      let updatedUser = { ...currentUser, points: newPoints };

      // Add book/course to completed lists
      if (type === 'book' && !updatedUser.booksRead.includes(missionName)) {
        updatedUser.booksRead = [...updatedUser.booksRead, missionName];
      } else if (type === 'course' && !updatedUser.coursesCompleted.includes(missionName)) {
        updatedUser.coursesCompleted = [...updatedUser.coursesCompleted, missionName];
        // Remove from in progress if it was there
        updatedUser.coursesInProgress = updatedUser.coursesInProgress.filter(c => c !== missionName);
      }

      // Check for new badges
      const newBadges = checkForNewBadges(updatedUser, type);
      
      if (newBadges.length > 0) {
        updatedUser.badges = [...updatedUser.badges, ...newBadges];
        
        // Show badge notification
        toast({
          title: "🏆 Novo Badge Conquistado!",
          description: `Você ganhou ${newBadges.length} novo(s) badge(s)!`
        });
      }
      
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: User) => 
        user.id === currentUser.id ? updatedUser : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Check for phase change
      const oldPhase = getUserPhase(currentUser.points);
      const newPhase = getUserPhase(newPoints);
      
      if (oldPhase.name !== newPhase.name) {
        // Save phase change activity
        const phaseChanges = JSON.parse(localStorage.getItem('phaseChanges') || '[]');
        const phaseChange = {
          id: `phase-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userPhoto: currentUser.profilePhoto,
          oldPhase: oldPhase.name,
          newPhase: newPhase.name,
          timestamp: new Date().toISOString()
        };
        phaseChanges.push(phaseChange);
        localStorage.setItem('phaseChanges', JSON.stringify(phaseChanges));
        
        setShowPhaseDialog(true);
      }

      toast({
        title: "🎉 Missão Concluída!",
        description: `+${mission.points} pontos adicionados!`
      });

    } catch (error) {
      console.error('Error completing mission:', error);
      toast({
        title: "Erro",
        description: "Não foi possível completar a missão. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const checkForNewBadges = (user: User, type: 'mission' | 'book' | 'course'): string[] => {
    const newBadges: string[] = [];
    
    if (type === 'book') {
      const booksRead = user.booksRead.length;
      
      if (booksRead === 1 && !user.badges.includes('reader-1')) {
        newBadges.push('reader-1');
      } else if (booksRead === 5 && !user.badges.includes('reader-2')) {
        newBadges.push('reader-2');
      } else if (booksRead === 10 && !user.badges.includes('reader-3')) {
        newBadges.push('reader-3');
      } else if (booksRead === 20 && !user.badges.includes('reader-4')) {
        newBadges.push('reader-4');
      }
    }
    
    if (type === 'course') {
      const coursesCompleted = user.coursesCompleted.length;
      
      if (coursesCompleted === 1 && !user.badges.includes('course-1')) {
        newBadges.push('course-1');
      } else if (coursesCompleted === 3 && !user.badges.includes('course-2')) {
        newBadges.push('course-2');
      } else if (coursesCompleted === 5 && !user.badges.includes('course-3')) {
        newBadges.push('course-3');
      } else if (coursesCompleted === 8 && !user.badges.includes('course-4')) {
        newBadges.push('course-4');
      }
    }
    
    // Check for combined badges
    const booksCount = user.booksRead.length;
    const coursesCount = user.coursesCompleted.length;
    
    // Discípulo Completo: 5 livros + 3 cursos + 30 dias missão
    if (booksCount >= 5 && coursesCount >= 3 && !user.badges.includes('complete-1')) {
      newBadges.push('complete-1');
    }
    
    // Guerreiro da Rotina: 10 livros + 5 cursos + 90 dias missão
    if (booksCount >= 10 && coursesCount >= 5 && !user.badges.includes('complete-2')) {
      newBadges.push('complete-2');
    }
    
    // Líder Exemplar: 15 livros + 8 cursos + 180 dias missão
    if (booksCount >= 15 && coursesCount >= 8 && !user.badges.includes('complete-3')) {
      newBadges.push('complete-3');
    }
    
    return newBadges;
  };

  const uncompleteMission = (mission: Mission | Book | Course, type: 'mission' | 'book' | 'course') => {
    if (!currentUser) return;

    const period = getCurrentPeriod((mission as Mission).type || 'Outras Missões');
    const activityToRemove = missionActivities.find(activity => 
      activity.userId === currentUser.id && 
      activity.missionId === mission.id && 
      activity.type === type &&
      activity.period === period
    );

    if (activityToRemove) {
      const updatedActivities = missionActivities.filter(activity => activity.id !== activityToRemove.id);
      setMissionActivities(updatedActivities);
      localStorage.setItem('missionActivities', JSON.stringify(updatedActivities));

      const newPoints = Math.max(0, currentUser.points - mission.points);
      const missionName = (mission as Mission).name || (mission as Book).title || (mission as Course).name;
      
      let updatedUser = { ...currentUser, points: newPoints };

      // Remove book/course from completed lists
      if (type === 'book') {
        updatedUser.booksRead = updatedUser.booksRead.filter(book => book !== missionName);
      } else if (type === 'course') {
        updatedUser.coursesCompleted = updatedUser.coursesCompleted.filter(course => course !== missionName);
      }
      
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: User) => 
        user.id === currentUser.id ? updatedUser : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      toast({
        title: "Missão desmarcada",
        description: `${mission.points} pontos removidos.`
      });
    }
  };

  const isMissionCompleted = (mission: Mission | Book | Course, type: 'mission' | 'book' | 'course'): boolean => {
    if (!currentUser) return false;
  
    const period = getCurrentPeriod((mission as Mission).type || 'Outras Missões');
    return missionActivities.some(activity =>
      activity.userId === currentUser.id &&
      activity.missionId === mission.id &&
      activity.type === type &&
      activity.period === period
    );
  };

  const getMissionsByType = (type: string): Mission[] => {
    return missions.filter(mission => mission.type === type);
  };

  function renderMissionCategory(title: string, items: (Mission | Book | Course)[], icon: string) {
    if (!items.length) return null;

    return (
      <Card key={title}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">{icon}</span>
            {title} ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => {
              const isCompleted = isMissionCompleted(item, 
                title.includes('Livros') ? 'book' : 
                title.includes('Cursos') ? 'course' : 'mission'
              );
              
              return (
                <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={(checked) => {
                      const type = title.includes('Livros') ? 'book' : 
                                  title.includes('Cursos') ? 'course' : 'mission';
                      if (checked) {
                        completeMission(item, type);
                      } else {
                        uncompleteMission(item, type);
                      }
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {(item as Mission).name || (item as Book).title || (item as Course).name}
                    </h4>
                    {(item as Mission).description && (
                      <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                        {(item as Mission).description}
                      </p>
                    )}
                    {(item as Book).author && (
                      <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                        por {(item as Book).author}
                      </p>
                    )}
                    {(item as Course).school && (
                      <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                        {(item as Course).school}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {item.points} pontos
                      </Badge>
                      {item.targetAudience.map((audience) => (
                        <Badge key={audience} variant="outline" className="text-xs">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!currentUser) return null;

  const currentPhase = getUserPhase(currentUser.points);
  const nextPhase = getNextPhase(currentUser.points);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/feed')}
              className="text-purple-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Feed
            </Button>
            <h1 className="text-2xl font-bold text-purple-700">Missões</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-yellow-100 text-yellow-800">
              {currentUser.points} pontos
            </Badge>
            <Badge className="bg-purple-100 text-purple-700">
              {currentPhase.icon} {currentPhase.name}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Phase Progress */}
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-purple-700 mb-1">
                  {currentPhase.icon} {currentPhase.name}
                </h2>
                <p className="text-purple-600 italic">"{currentPhase.phrase}"</p>
                <p className="text-sm text-gray-600 mt-1">{currentPhase.description}</p>
              </div>
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            
            {nextPhase && (
              <>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{currentUser.points} pontos</span>
                  <span>{nextPhase.minPoints} pontos para {nextPhase.name}</span>
                </div>
                <Progress 
                  value={(currentUser.points / nextPhase.minPoints) * 100} 
                  className="h-2"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Faltam {nextPhase.minPoints - currentUser.points} pontos ({Math.round(((nextPhase.minPoints - currentUser.points) / nextPhase.minPoints) * 100)}%) para a próxima fase: {nextPhase.icon} {nextPhase.name}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Mission Categories */}
        {renderMissionCategory("Missões Diárias", getMissionsByType("Missões Diárias"), "🌅")}
        {renderMissionCategory("Missões Semanais", getMissionsByType("Missões Semanais"), "📅")}
        {renderMissionCategory("Missões Mensais", getMissionsByType("Missões Mensais"), "📊")}
        {renderMissionCategory("Missões Semestrais", getMissionsByType("Missões Semestrais"), "🎯")}
        {renderMissionCategory("Missões Anuais", getMissionsByType("Missões Anuais"), "🏆")}
        {renderMissionCategory("Livros para Ler", books, "📚")}
        {renderMissionCategory("Cursos para Fazer", courses, "🎓")}
        {renderMissionCategory("Outras Missões", getMissionsByType("Outras Missões"), "⭐")}
      </div>

      <PhaseChangeDialog
        isOpen={showPhaseDialog}
        onClose={() => setShowPhaseDialog(false)}
        newPoints={currentUser.points}
        previousPoints={previousPoints}
      />
    </div>
  );
};

export default Missions;
