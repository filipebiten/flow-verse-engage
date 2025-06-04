import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
    loadMissions();
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
      type: 'Livro',
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
      type: 'Curso',
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
        }

        // Handle book completion
        if (mission.type === 'Livro') {
          if (!updatedUser.booksRead) updatedUser.booksRead = [];
          const bookTitle = mission.name;
          if (!updatedUser.booksRead.includes(bookTitle)) {
            updatedUser.booksRead.push(bookTitle);
          }
        }

        // Handle course completion
        if (mission.type === 'Curso') {
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

    loadMissions();
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
    if (user.coursesCompleted?.length >= 10 && !user.badges?.includes('course-4')) newBadges.push('course-4');

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

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      {/* Phase Change Popup */}
      {phaseChangePopup.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-teal-100 text-teal-800 border border-teal-500 rounded-md p-4 shadow-lg z-50">
          <p className="font-bold">Parabéns! Você alcançou a fase {phaseChangePopup.newPhase}!</p>
        </div>
      )}

      {/* Badge Popup */}
      {badgePopup.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-800 border border-purple-500 rounded-md p-4 shadow-lg z-50">
          <p className="font-bold">Você conquistou novos badges!</p>
          <div className="flex space-x-2 mt-2">
            {badgePopup.badges.map(badgeId => {
              const badge = getBadgeInfo(badgeId);
              return badge ? (
                <div key={badgeId} className="flex items-center space-x-1">
                  <span className="text-xl">{badge.icon}</span>
                  <span>{badge.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-teal-700">Minhas Missões</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {missions.length === 0 ? (
          <Card>
            <CardContent className="text-center p-6">
              <p className="text-gray-500">Nenhuma missão disponível no momento.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map((mission) => (
              <Card key={mission.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-semibold">{mission.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-600">{mission.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <Badge className="bg-teal-100 text-teal-700">
                        +{mission.points} pontos
                      </Badge>
                      <Badge variant="secondary" className="ml-2">{mission.type}</Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => completeMission(mission)}
                      disabled={completedMissions.includes(mission.id)}
                    >
                      Concluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;
