import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
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
  name: string;
  points: number;
  type: string;
  description: string;
}

const Missions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [phaseChangePopup, setPhaseChangePopup] = useState<{ show: boolean, newPhase: string }>({ show: false, newPhase: '' });
  const [badgePopup, setBadgePopup] = useState<{ show: boolean, badges: string[] }>({ show: false, badges: [] });

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
    
    // Load completed missions for this user
    const userCompletedMissions = JSON.parse(localStorage.getItem(`completedMissions_${userData.id}`) || '[]');
    setCompletedMissions(userCompletedMissions);
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      loadMissions();
    }
  }, [currentUser]);

  const loadMissions = () => {
    const storedMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    // Filter missions for current user
    const userMissions = storedMissions.filter((mission: any) => {
      return mission.targetAudience.includes('all') ||
             mission.targetAudience.includes(currentUser.pgmRole) ||
             (currentUser.participatesFlowUp && mission.targetAudience.includes('flowUp')) ||
             (currentUser.participatesIrmandade && mission.targetAudience.includes('irmandade'));
    });

    // Filter books for current user and convert to missions
    const userBooks = storedBooks.filter((book: any) => {
      return book.targetAudience.includes('all') ||
             book.targetAudience.includes(currentUser.pgmRole) ||
             (currentUser.participatesFlowUp && book.targetAudience.includes('flowUp')) ||
             (currentUser.participatesIrmandade && book.targetAudience.includes('irmandade'));
    }).map((book: any) => ({
      ...book,
      name: book.title + (book.author ? ` - ${book.author}` : ''),
      type: 'Leitura de Livros',
      description: `Livro: ${book.title}${book.author ? ` por ${book.author}` : ''}`,
      points: book.points
    }));

    // Filter courses for current user and convert to missions
    const userCourses = storedCourses.filter((course: any) => {
      return course.targetAudience.includes('all') ||
             course.targetAudience.includes(currentUser.pgmRole) ||
             (currentUser.participatesFlowUp && course.targetAudience.includes('flowUp')) ||
             (currentUser.participatesIrmandade && course.targetAudience.includes('irmandade'));
    }).map((course: any) => ({
      ...course,
      name: course.name,
      type: 'Cursos',
      description: course.description || `Curso: ${course.name} - ${course.school}`,
      points: course.points
    }));

    const allMissions = [...userMissions, ...userBooks, ...userCourses];
    setMissions(allMissions);
  };

  const completeMission = (mission: any) => {
    const activity = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhoto: currentUser.profilePhoto,
      missionName: mission.name,
      points: mission.points,
      timestamp: new Date().toISOString()
    };

    // Add to activities
    const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    activities.push(activity);
    localStorage.setItem('missionActivities', JSON.stringify(activities));

    // Add to completed missions for this user
    const userCompletedMissions = [...completedMissions, mission.id];
    setCompletedMissions(userCompletedMissions);
    localStorage.setItem(`completedMissions_${currentUser.id}`, JSON.stringify(userCompletedMissions));

    // Update user points
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => {
      if (user.id === currentUser.id) {
        const newPoints = user.points + mission.points;
        const updatedUser = { ...user, points: newPoints };

        // Check for phase change
        const newPhase = getPhaseFromPoints(newPoints);
        if (newPhase !== user.phase) {
          updatedUser.phase = newPhase;
          showPhaseChangePopup(newPhase);
          
          // Add phase change activity
          const phaseChangeActivity = {
            id: Date.now().toString() + '_phase',
            userId: currentUser.id,
            userName: currentUser.name,
            userPhoto: currentUser.profilePhoto,
            oldPhase: user.phase,
            newPhase: newPhase,
            timestamp: new Date().toISOString()
          };
          const phaseChanges = JSON.parse(localStorage.getItem('phaseChanges') || '[]');
          phaseChanges.push(phaseChangeActivity);
          localStorage.setItem('phaseChanges', JSON.stringify(phaseChanges));
        }

        // Handle book completion
        if (mission.type === 'Leitura de Livros') {
          if (!updatedUser.booksRead) updatedUser.booksRead = [];
          const bookTitle = mission.title || mission.name;
          if (!updatedUser.booksRead.includes(bookTitle)) {
            updatedUser.booksRead.push(bookTitle);
          }
        }

        // Handle course completion
        if (mission.type === 'Cursos') {
          if (!updatedUser.coursesCompleted) updatedUser.coursesCompleted = [];
          const courseName = mission.name;
          if (!updatedUser.coursesCompleted.includes(courseName)) {
            updatedUser.coursesCompleted.push(courseName);
          }
        }

        // Check for new badges
        const newBadges = checkForNewBadges(updatedUser);
        if (newBadges.length > 0) {
          updatedUser.badges = [...(updatedUser.badges || []), ...newBadges];
          showBadgePopup(newBadges);
          
          // Add badge activity to feed
          const badgeActivity = {
            id: Date.now().toString() + '_badge',
            userId: currentUser.id,
            userName: currentUser.name,
            userPhoto: currentUser.profilePhoto,
            badges: newBadges,
            timestamp: new Date().toISOString()
          };
          const badgeActivities = JSON.parse(localStorage.getItem('badgeActivities') || '[]');
          badgeActivities.push(badgeActivity);
          localStorage.setItem('badgeActivities', JSON.stringify(badgeActivities));
        }

        return updatedUser;
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUsers.find((u: any) => u.id === currentUser.id)));

    toast({
      title: "Missão concluída! 🎉",
      description: `Você ganhou ${mission.points} pontos!`
    });

    setCurrentUser(updatedUsers.find((u: any) => u.id === currentUser.id));
  };

  const uncompleteMission = (mission: any) => {
    // Remove from completed missions for this user
    const userCompletedMissions = completedMissions.filter(id => id !== mission.id);
    setCompletedMissions(userCompletedMissions);
    localStorage.setItem(`completedMissions_${currentUser.id}`, JSON.stringify(userCompletedMissions));

    // Update user points (subtract)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => {
      if (user.id === currentUser.id) {
        const newPoints = Math.max(0, user.points - mission.points);
        const updatedUser = { ...user, points: newPoints };

        // Check for phase change (downgrade)
        const newPhase = getPhaseFromPoints(newPoints);
        if (newPhase !== user.phase) {
          updatedUser.phase = newPhase;
        }

        // Handle book removal
        if (mission.type === 'Leitura de Livros') {
          if (updatedUser.booksRead) {
            const bookTitle = mission.title || mission.name;
            updatedUser.booksRead = updatedUser.booksRead.filter((book: string) => book !== bookTitle);
          }
        }

        // Handle course removal
        if (mission.type === 'Cursos') {
          if (updatedUser.coursesCompleted) {
            const courseName = mission.name;
            updatedUser.coursesCompleted = updatedUser.coursesCompleted.filter((course: string) => course !== courseName);
          }
        }

        return updatedUser;
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUsers.find((u: any) => u.id === currentUser.id)));

    toast({
      title: "Missão desmarcada",
      description: `${mission.points} pontos foram removidos.`
    });

    setCurrentUser(updatedUsers.find((u: any) => u.id === currentUser.id));
  };

  const getPhaseFromPoints = (points: number) => {
    if (points >= 1001) return "Oceano";
    if (points >= 501) return "Cachoeira";
    if (points >= 251) return "Correnteza";
    return "Riacho";
  };

  const checkForNewBadges = (user: any) => {
    const newBadges: string[] = [];

    // Reader Badges
    if (user.booksRead?.length === 1 && !user.badges?.includes('reader-1')) newBadges.push('reader-1');
    if (user.booksRead?.length === 5 && !user.badges?.includes('reader-2')) newBadges.push('reader-2');
    if (user.booksRead?.length === 10 && !user.badges?.includes('reader-3')) newBadges.push('reader-3');
    if (user.booksRead?.length >= 20 && !user.badges?.includes('reader-4')) newBadges.push('reader-4');

    // Course Badges
    if (user.coursesCompleted?.length === 1 && !user.badges?.includes('course-1')) newBadges.push('course-1');
    if (user.coursesCompleted?.length === 3 && !user.badges?.includes('course-2')) newBadges.push('course-2');
    if (user.coursesCompleted?.length === 5 && !user.badges?.includes('course-3')) newBadges.push('course-3');
    if (user.coursesCompleted?.length >= 8 && !user.badges?.includes('course-4')) newBadges.push('course-4');

    return newBadges;
  };

  const showPhaseChangePopup = (newPhase: string) => {
    setPhaseChangePopup({ show: true, newPhase });
    setTimeout(() => {
      setPhaseChangePopup({ show: false, newPhase: '' });
    }, 5000);
  };

  const showBadgePopup = (badges: string[]) => {
    setBadgePopup({ show: true, badges });
    setTimeout(() => {
      setBadgePopup({ show: false, badges: [] });
    }, 5000);
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

  const getPhaseInfo = (phase: string) => {
    const phases = {
      "Riacho": { emoji: "🌀", color: "from-green-400 to-emerald-600" },
      "Correnteza": { emoji: "🌊", color: "from-blue-400 to-cyan-600" },
      "Cachoeira": { emoji: "💥", color: "from-purple-400 to-violet-600" },
      "Oceano": { emoji: "🌌", color: "from-gray-700 to-gray-900" }
    };
    return phases[phase as keyof typeof phases] || phases["Riacho"];
  };

  const organizeMissionsByType = () => {
    const organized = {
      daily: missions.filter(m => m.type === 'Missões Diárias'),
      weekly: missions.filter(m => m.type === 'Missões Semanais'),
      monthly: missions.filter(m => m.type === 'Missões Mensais'),
      semestral: missions.filter(m => m.type === 'Missões Semestrais'),
      annual: missions.filter(m => m.type === 'Missões Anuais'),
      books: missions.filter(m => m.type === 'Leitura de Livros'),
      courses: missions.filter(m => m.type === 'Cursos'),
      others: missions.filter(m => !['Missões Diárias', 'Missões Semanais', 'Missões Mensais', 'Missões Semestrais', 'Missões Anuais', 'Leitura de Livros', 'Cursos'].includes(m.type))
    };
    return organized;
  };

  const renderMissionSection = (title: string, missions: any[], emoji: string) => {
    if (missions.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="text-2xl mr-2">{emoji}</span>
          {title} ({missions.length})
        </h3>
        <div className="space-y-2">
          {missions.map((mission) => {
            const isCompleted = completedMissions.includes(mission.id);
            return (
              <div key={mission.id} className={`p-4 border rounded-lg ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow`}>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        completeMission(mission);
                      } else {
                        uncompleteMission(mission);
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {mission.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs">{mission.type}</Badge>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        +{mission.points} pontos
                      </Badge>
                    </div>
                    <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                      {mission.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!currentUser) return null;

  const phaseInfo = getPhaseInfo(currentUser.phase);
  const organizedMissions = organizeMissionsByType();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${phaseInfo.color}`}>
      {/* Phase Change Popup */}
      {phaseChangePopup.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">{getPhaseInfo(phaseChangePopup.newPhase).emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Parabéns! 🎉
            </h2>
            <p className="text-lg text-gray-700">
              Você alcançou a fase <span className="font-bold text-purple-600">{phaseChangePopup.newPhase}</span>!
            </p>
          </div>
        </div>
      )}

      {/* Badge Popup */}
      {badgePopup.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Novo Badge Conquistado! 🏆
            </h2>
            <div className="space-y-4">
              {badgePopup.badges.map(badgeId => {
                const badge = getBadgeInfo(badgeId);
                return badge ? (
                  <div key={badgeId} className="flex items-center justify-center space-x-3 p-4 bg-purple-50 rounded-lg">
                    <span className="text-3xl">{badge.icon}</span>
                    <div className="text-left">
                      <h3 className="font-bold text-purple-800">{badge.name}</h3>
                      <p className="text-sm text-purple-600">{badge.description}</p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/feed')}
            className="text-teal-600 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-teal-700">Minhas Missões</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {missions.length === 0 ? (
          <Card>
            <CardContent className="text-center p-6">
              <p className="text-gray-500">Nenhuma missão disponível no momento.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {renderMissionSection("Missões Diárias", organizedMissions.daily, "☀️")}
            {renderMissionSection("Missões Semanais", organizedMissions.weekly, "📅")}
            {renderMissionSection("Missões Mensais", organizedMissions.monthly, "🗓️")}
            {renderMissionSection("Missões Semestrais", organizedMissions.semestral, "📊")}
            {renderMissionSection("Missões Anuais", organizedMissions.annual, "🎯")}
            {renderMissionSection("Leitura de Livros", organizedMissions.books, "📚")}
            {renderMissionSection("Cursos", organizedMissions.courses, "🎓")}
            {renderMissionSection("Outras Missões", organizedMissions.others, "⚡")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;
