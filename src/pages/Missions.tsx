
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import PhaseChangeDialog from '@/components/PhaseChangeDialog';
import { 
  Target, 
  CheckCircle, 
  Trophy, 
  BookOpen, 
  GraduationCap,
  Star,
  Clock,
  Award,
  Users
} from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'mission' | 'book' | 'course';
  period?: string;
  school?: string;
}

interface Activity {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  missionName: string;
  points: number;
  timestamp: string;
  type: string;
  period?: string;
  itemId: string;
}

const Missions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Mission[]>([]);
  const [courses, setCourses] = useState<Mission[]>([]);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showPhaseDialog, setShowPhaseDialog] = useState(false);
  const [previousPoints, setPreviousPoints] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.id) {
      navigate('/');
      return;
    }
    setCurrentUser(user);
    setPreviousPoints(user.points || 0);
    loadMissions();
    loadCompletedItems(user.id);
  }, [navigate]);

  const loadMissions = () => {
    const storedMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    setMissions(storedMissions);
    setBooks(storedBooks);
    setCourses(storedCourses);
  };

  const loadCompletedItems = (userId: string) => {
    const activities: Activity[] = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    const userActivities = activities.filter((a: Activity) => a.userId === userId);
    const completedIds = new Set(userActivities.map((a: Activity) => a.itemId));
    setCompletedItems(completedIds);
  };

  const getUserPhase = (points: number) => {
    if (points >= 1000) return { name: 'Oceano', icon: '🌊', phrase: 'Profundamente imerso em Deus', color: 'from-blue-900 to-indigo-900' };
    if (points >= 500) return { name: 'Cachoeira', icon: '💥', phrase: 'Entregue ao movimento de Deus', color: 'from-purple-600 to-blue-600' };
    if (points >= 250) return { name: 'Correnteza', icon: '🌊', phrase: 'Sendo levado por algo maior', color: 'from-blue-500 to-teal-500' };
    return { name: 'Riacho', icon: '🌀', phrase: 'Começando a fluir', color: 'from-green-400 to-blue-400' };
  };

  const getBadgeForPoints = (points: number, type: 'book' | 'course') => {
    if (type === 'book') {
      if (points >= 400) return 'reader-4';
      if (points >= 200) return 'reader-3';
      if (points >= 100) return 'reader-2';
      if (points >= 50) return 'reader-1';
    } else {
      if (points >= 400) return 'course-4';
      if (points >= 200) return 'course-3';
      if (points >= 100) return 'course-2';
      if (points >= 50) return 'course-1';
    }
    return null;
  };

  const completeItem = (item: Mission) => {
    if (completedItems.has(item.id)) return;

    const newPoints = (currentUser.points || 0) + item.points;
    const previousPhase = getUserPhase(currentUser.points || 0);
    const newPhase = getUserPhase(newPoints);

    // Update user data
    const updatedUser = {
      ...currentUser,
      points: newPoints,
      phase: newPhase.name,
      booksRead: item.type === 'book' ? [...(currentUser.booksRead || []), item.name] : (currentUser.booksRead || []),
      coursesCompleted: item.type === 'course' ? [...(currentUser.coursesCompleted || []), item.name] : (currentUser.coursesCompleted || [])
    };

    // Check for new badges
    if (item.type === 'book' || item.type === 'course') {
      const typePoints = (currentUser.points || 0) + item.points;
      const newBadge = getBadgeForPoints(typePoints, item.type);
      if (newBadge && !(currentUser.badges || []).includes(newBadge)) {
        updatedUser.badges = [...(currentUser.badges || []), newBadge];
      }
    }

    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => u.id === currentUser.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Add to activities with timestamp
    const activity = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhoto: currentUser.profilePhoto,
      missionName: item.name,
      points: item.points,
      timestamp: new Date().toISOString(),
      type: item.type,
      period: item.period || '',
      school: item.school || '',
      itemId: item.id
    };

    const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    activities.push(activity);
    localStorage.setItem('missionActivities', JSON.stringify(activities));

    // Update state
    setCurrentUser(updatedUser);
    setCompletedItems(prev => new Set([...prev, item.id]));

    // Show phase change dialog if phase changed
    if (previousPhase.name !== newPhase.name) {
      setPreviousPoints(currentUser.points || 0);
      setShowPhaseDialog(true);
    }

    toast({
      title: "Parabéns! 🎉",
      description: `Você completou "${item.name}" e ganhou ${item.points} pontos!`,
    });
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
              const isCompleted = completedItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">+{item.points} pts</Badge>
                        {item.period && <Badge variant="outline">{item.period}</Badge>}
                        {item.school && <Badge variant="outline">{item.school}</Badge>}
                      </div>
                    </div>
                    <Button
                      onClick={() => completeItem(item)}
                      disabled={isCompleted}
                      variant={isCompleted ? "secondary" : "default"}
                      size="sm"
                    >
                      {isCompleted ? "Concluído" : "Completar"}
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

  if (!currentUser) return null;

  const currentPhase = getUserPhase(currentUser.points || 0);
  const nextPhaseThreshold = currentUser.points >= 1000 ? 1000 : 
                           currentUser.points >= 500 ? 1000 :
                           currentUser.points >= 250 ? 500 : 250;
  const prevPhaseThreshold = currentUser.points >= 1000 ? 1000 :
                           currentUser.points >= 500 ? 500 :
                           currentUser.points >= 250 ? 250 : 0;
  
  const phaseProgress = currentUser.points >= 1000 ? 100 : 
                       ((currentUser.points - prevPhaseThreshold) / (nextPhaseThreshold - prevPhaseThreshold)) * 100;

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{currentUser.points || 0}</div>
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
            
            {/* Phase Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Fase</span>
                <span>{currentUser.points >= 1000 ? '100%' : `${Math.round(phaseProgress)}%`}</span>
              </div>
              <Progress value={phaseProgress} className="h-3" />
              <p className="text-xs text-gray-600">
                {currentUser.points >= 1000 
                  ? 'Fase máxima alcançada! Continue acumulando pontos.' 
                  : `${nextPhaseThreshold - currentUser.points} pontos para a próxima fase`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Missions, Books, Courses */}
        <div className="space-y-6">
          {renderItems(missions, "Missões", <Target className="w-5 h-5" />, "Nenhuma missão disponível")}
          {renderItems(books, "Livros", <BookOpen className="w-5 h-5" />, "Nenhum livro disponível")}
          {renderItems(courses, "Cursos", <GraduationCap className="w-5 h-5" />, "Nenhum curso disponível")}
        </div>

        <PhaseChangeDialog
          isOpen={showPhaseDialog}
          onClose={() => setShowPhaseDialog(false)}
          newPoints={currentUser.points || 0}
          previousPoints={previousPoints}
        />
      </div>
    </div>
  );
};

export default Missions;
