import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Trophy, Sparkles, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Mission {
  id: string;
  name: string;
  points: number;
  type: 'Diária' | 'Semanal' | 'Mensal' | 'Semestral' | 'Anual' | 'Livro' | 'Curso';
  description?: string;
  isActive: boolean;
  createdAt: string;
  targetAudience: string[];
  bookTitle?: string;
  bookAuthor?: string;
  bookImage?: string;
  courseTitle?: string;
}

interface CompletedMission {
  missionId: string;
  completedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phase: string;
  points: number;
  profilePhoto: string | null;
  booksRead: string[];
  coursesCompleted: string[];
  coursesInProgress: string[];
  gender: string;
  pgmRole: string;
  participatesFlowUp: boolean;
  participatesIrmandade: boolean;
  badges: string[];
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
}

const Missions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<CompletedMission[]>([]);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    
    setCurrentUser(JSON.parse(user));
    loadMissions();
    loadCompletedMissions();
  }, [navigate]);

  const loadMissions = () => {
    // Initialize default missions if none exist
    const storedMissions = localStorage.getItem('missions');
    if (!storedMissions) {
      const defaultMissions: Mission[] = [
        // Diárias
        { id: 'daily-1', name: 'Momento com Deus', points: 1, type: 'Diária', description: 'Tempo de oração e reflexão', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        { id: 'daily-2', name: 'Leitura Bíblica', points: 1, type: 'Diária', description: 'Ler um capítulo da Bíblia', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        { id: 'daily-3', name: 'Gratidão', points: 1, type: 'Diária', description: 'Anotar 3 motivos de gratidão', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        
        // Semanais
        { id: 'weekly-1', name: 'Participar do PGM', points: 3, type: 'Semanal', description: 'Estar presente no Pequeno Grupo Missionário', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['Participante', 'Líder'] },
        { id: 'weekly-2', name: 'Servir na Igreja', points: 3, type: 'Semanal', description: 'Participar de algum ministério', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        { id: 'weekly-3', name: 'Evangelizar', points: 3, type: 'Semanal', description: 'Compartilhar o evangelho com alguém', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        
        // Mensais
        { id: 'monthly-1', name: 'Jejum e Oração', points: 5, type: 'Mensal', description: 'Dedicar um dia ao jejum e oração', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        { id: 'monthly-2', name: 'Ação Social', points: 5, type: 'Mensal', description: 'Participar de projeto social', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        { id: 'monthly-3', name: 'Mentoria', points: 5, type: 'Mensal', description: 'Mentorar ou ser mentorado', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['Líder', 'Supervisor', 'Coordenador'] },
        
        // Semestrais
        { id: 'semester-1', name: 'Retiro Espiritual', points: 10, type: 'Semestral', description: 'Participar de retiro ou encontro', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        { id: 'semester-2', name: 'Missões', points: 10, type: 'Semestral', description: 'Participar de viagem missionária', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        
        // Anuais
        { id: 'annual-1', name: 'OVERFLOW', points: 20, type: 'Anual', description: 'Participar do evento OVERFLOW', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        { id: 'annual-2', name: 'Liderança', points: 20, type: 'Anual', description: 'Assumir posição de liderança', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['Líder', 'Supervisor', 'Coordenador'] },
        
        // Especiais Flow Up
        { id: 'flowup-1', name: 'Mentorar Jovem', points: 15, type: 'Mensal', description: 'Mentorar jovem do FLOW', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['flowUp'] },
        
        // Especiais Irmandade
        { id: 'irmandade-1', name: 'Encontro da Irmandade', points: 8, type: 'Mensal', description: 'Participar do encontro mensal da Irmandade', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['irmandade'] },
      ];
      
      localStorage.setItem('missions', JSON.stringify(defaultMissions));
      setMissions(filterMissionsForUser(defaultMissions));
    } else {
      const allMissions = JSON.parse(storedMissions).filter((m: Mission) => m.isActive);
      setMissions(filterMissionsForUser(allMissions));
    }
  };

  const filterMissionsForUser = (missions: Mission[]) => {
    if (!currentUser) return missions;
    
    return missions.filter(mission => {
      if (mission.targetAudience.includes('all')) return true;
      if (mission.targetAudience.includes(currentUser.pgmRole)) return true;
      if (mission.targetAudience.includes('flowUp') && currentUser.participatesFlowUp) return true;
      if (mission.targetAudience.includes('irmandade') && currentUser.participatesIrmandade) return true;
      return false;
    });
  };

  const loadCompletedMissions = () => {
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    const completed = JSON.parse(localStorage.getItem(`completedMissions_${userId}`) || '[]');
    setCompletedMissions(completed);
  };

  const isMissionCompleted = (missionId: string) => {
    return completedMissions.some(cm => cm.missionId === missionId);
  };

  const checkForNewBadges = (newUser: User) => {
    const badges = [
      // Reading badges
      { id: 'reader-1', name: 'Leitor Iniciante', icon: '📖', description: 'Começando a jornada da leitura.', category: 'reading', requirement: 1 },
      { id: 'reader-2', name: 'Leitor Fluente', icon: '📚', description: 'Já tem o hábito da leitura.', category: 'reading', requirement: 5 },
      { id: 'reader-3', name: 'Leitor Voraz', icon: '🔥📚', description: 'Não larga um bom livro por nada.', category: 'reading', requirement: 10 },
      { id: 'reader-4', name: 'Mente Brilhante', icon: '🧠✨', description: 'Um verdadeiro devorador de sabedoria.', category: 'reading', requirement: 20 },
      
      // Course badges
      { id: 'course-1', name: 'Discípulo em Formação', icon: '🎓', description: 'Iniciando sua jornada de formação.', category: 'course', requirement: 1 },
      { id: 'course-2', name: 'Aprendiz Dedicado', icon: '📘🎓', description: 'Mostrando sede de crescimento.', category: 'course', requirement: 3 },
      { id: 'course-3', name: 'Líder em Construção', icon: '🛠️🎓', description: 'Preparando-se para grandes responsabilidades.', category: 'course', requirement: 5 },
      { id: 'course-4', name: 'Mestre da Jornada', icon: '🧙‍♂️📘', description: 'Um veterano na trilha do aprendizado.', category: 'course', requirement: 8 },
    ];

    for (const badge of badges) {
      if (!newUser.badges.includes(badge.id)) {
        let count = 0;
        if (badge.category === 'reading') {
          count = newUser.booksRead.length;
        } else if (badge.category === 'course') {
          count = newUser.coursesCompleted.length;
        }

        if (count >= badge.requirement) {
          newUser.badges.push(badge.id);
          setNewBadge(badge);
          setShowCelebrationModal(true);
          
          toast({
            title: `🏆 Novo Badge Conquistado!`,
            description: `${badge.icon} ${badge.name}`,
            className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          });
          break;
        }
      }
    }
  };

  const toggleMission = (mission: Mission) => {
    if (!currentUser) return;

    const isCompleted = isMissionCompleted(mission.id);
    const userId = currentUser.id;
    
    if (isCompleted) {
      const newCompleted = completedMissions.filter(cm => cm.missionId !== mission.id);
      localStorage.setItem(`completedMissions_${userId}`, JSON.stringify(newCompleted));
      setCompletedMissions(newCompleted);

      // Remove points and update user
      const newPoints = Math.max(0, currentUser.points - mission.points);
      const newPhase = calculatePhase(newPoints);
      
      let updatedUser = { ...currentUser, points: newPoints, phase: newPhase };

      // Remove from book/course lists if applicable
      if (mission.type === 'Livro' && mission.bookTitle) {
        updatedUser.booksRead = updatedUser.booksRead.filter(book => book !== mission.bookTitle);
      } else if (mission.type === 'Curso' && mission.courseTitle) {
        updatedUser.coursesCompleted = updatedUser.coursesCompleted.filter(course => course !== mission.courseTitle);
      }

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      // Update user in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }

      // Remove from activities
      const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
      const newActivities = activities.filter((a: any) => !(a.userId === userId && a.missionName === mission.name));
      localStorage.setItem('missionActivities', JSON.stringify(newActivities));

      toast({
        title: "Missão desmarcada",
        description: `${mission.points} pontos removidos. Total: ${newPoints}`,
      });
    } else {
      // Complete mission
      const completedMission = {
        missionId: mission.id,
        completedAt: new Date().toISOString()
      };
      
      const newCompleted = [...completedMissions, completedMission];
      localStorage.setItem(`completedMissions_${userId}`, JSON.stringify(newCompleted));
      setCompletedMissions(newCompleted);

      // Add points
      const newPoints = currentUser.points + mission.points;
      const oldPhase = currentUser.phase;
      const newPhase = calculatePhase(newPoints);
      
      let updatedUser = { ...currentUser, points: newPoints, phase: newPhase };

      // Add to book/course lists if applicable
      if (mission.type === 'Livro' && mission.bookTitle) {
        if (!updatedUser.booksRead.includes(mission.bookTitle)) {
          updatedUser.booksRead = [...updatedUser.booksRead, mission.bookTitle];
        }
      } else if (mission.type === 'Curso' && mission.courseTitle) {
        if (!updatedUser.coursesCompleted.includes(mission.courseTitle)) {
          updatedUser.coursesCompleted = [...updatedUser.coursesCompleted, mission.courseTitle];
        }
      }

      // Check for new badges
      checkForNewBadges(updatedUser);

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      // Update user in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }

      // Add to mission activities feed
      const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
      const newActivity = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userPhoto: currentUser.profilePhoto,
        missionName: mission.name,
        points: mission.points,
        timestamp: new Date().toISOString()
      };
      activities.unshift(newActivity);
      localStorage.setItem('missionActivities', JSON.stringify(activities));

      // Show celebration
      toast({
        title: "🎉 Missão Concluída!",
        description: `Você ganhou ${mission.points} pontos! Total: ${newPoints}`,
      });

      // Check for phase change
      if (oldPhase !== newPhase) {
        // Add phase change to feed
        const phaseChanges = JSON.parse(localStorage.getItem('phaseChanges') || '[]');
        const phaseChange = {
          id: Date.now().toString() + '_phase',
          userId: currentUser.id,
          userName: currentUser.name,
          userPhoto: currentUser.profilePhoto,
          oldPhase,
          newPhase,
          timestamp: new Date().toISOString()
        };
        phaseChanges.unshift(phaseChange);
        localStorage.setItem('phaseChanges', JSON.stringify(phaseChanges));

        setTimeout(() => {
          const phaseInfo = getPhaseInfo(newPhase);
          toast({
            title: `🌟 Nova Fase Desbloqueada!`,
            description: `${phaseInfo.emoji} ${newPhase}: ${phaseInfo.phrase}`,
            className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          });
        }, 1000);
      }
    }
  };

  const calculatePhase = (points: number): string => {
    if (points >= 1001) return "Oceano";
    if (points >= 501) return "Cachoeira";
    if (points >= 251) return "Correnteza";
    return "Riacho";
  };

  const getPhaseInfo = (phase: string) => {
    const phases = {
      "Riacho": { emoji: "🌀", phrase: "Começando a fluir", description: "Início da caminhada com Deus e com a FLOW." },
      "Correnteza": { emoji: "🌊", phrase: "Sendo levado por algo maior", description: "Engajado no PGM, abrindo-se ao mover de Deus." },
      "Cachoeira": { emoji: "💥", phrase: "Entregue ao movimento de Deus", description: "Servindo com intensidade e sendo transformador." },
      "Oceano": { emoji: "🌌", phrase: "Profundamente imerso em Deus", description: "Maturidade espiritual, liderança e profundidade." }
    };
    return phases[phase as keyof typeof phases] || phases["Riacho"];
  };

  const getMissionsByType = (type: string) => {
    return missions.filter(m => m.type === type);
  };

  const getDiscountProgress = () => {
    if (!currentUser) return 0;
    const discountEarned = Math.floor(currentUser.points / 10);
    if (discountEarned >= 100) return 100;
    return (currentUser.points % 10) * 10;
  };

  const getDiscountPercentage = () => {
    if (!currentUser) return 0;
    return Math.min(Math.floor(currentUser.points / 10), 100);
  };

  const formatCompletionDate = (missionId: string) => {
    const completed = completedMissions.find(cm => cm.missionId === missionId);
    if (!completed) return '';
    
    return new Date(completed.completedAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!currentUser) return null;

  const missionTypes = [
    { type: 'Diária', color: 'bg-green-100 text-green-800', resetInfo: 'Missões Diárias' },
    { type: 'Semanal', color: 'bg-blue-100 text-blue-800', resetInfo: 'Missões Semanais' },
    { type: 'Mensal', color: 'bg-purple-100 text-purple-800', resetInfo: 'Missões Mensais' },
    { type: 'Semestral', color: 'bg-orange-100 text-orange-800', resetInfo: 'Missões Semestrais' },
    { type: 'Anual', color: 'bg-red-100 text-red-800', resetInfo: 'Missões Anuais' },
    { type: 'Livro', color: 'bg-indigo-100 text-indigo-800', resetInfo: 'Leitura de Livros' },
    { type: 'Curso', color: 'bg-pink-100 text-pink-800', resetInfo: 'Cursos' },
  ];

  const phaseInfo = getPhaseInfo(currentUser.phase);
  const discountPercentage = getDiscountPercentage();
  const isMaxDiscount = discountPercentage >= 100;

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
            <h1 className="text-2xl font-bold text-teal-700">Missões</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className="bg-yellow-100 text-yellow-800">
              <Trophy className="w-3 h-3 mr-1" />
              {currentUser.points} pontos
            </Badge>
            <Badge className={getPhaseInfo(currentUser.phase).emoji === "🌀" ? "bg-green-100 text-green-800" : 
                             getPhaseInfo(currentUser.phase).emoji === "🌊" ? "bg-blue-100 text-blue-800" :
                             getPhaseInfo(currentUser.phase).emoji === "💥" ? "bg-purple-100 text-purple-800" :
                             "bg-gray-900 text-white"}>
              {phaseInfo.emoji} {currentUser.phase}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* OVERFLOW Discount Progress */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Sparkles className="w-5 h-5 mr-2" />
              Desconto OVERFLOW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Desconto atual: {discountPercentage}%</span>
                {isMaxDiscount ? (
                  <span className="text-green-600 font-semibold">Desconto máximo alcançado!</span>
                ) : (
                  <span>Próximo desconto: {discountPercentage + 1}% (faltam {10 - (currentUser.points % 10)} pontos)</span>
                )}
              </div>
              <Progress value={getDiscountProgress()} className="h-3" />
              <p className="text-xs text-gray-600">
                {isMaxDiscount 
                  ? "Você alcançou o desconto máximo de 100% para o OVERFLOW!"
                  : "A cada 10 pontos = 1% de desconto no OVERFLOW"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mission Categories */}
        {missionTypes.map(({ type, color, resetInfo }) => {
          const typeMissions = getMissionsByType(type);
          if (typeMissions.length === 0) return null;

          return (
            <Card key={type}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Badge className={`${color} mr-3`}>{resetInfo}</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {typeMissions.map((mission) => {
                  const isCompleted = isMissionCompleted(mission.id);
                  return (
                    <div
                      key={mission.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleMission(mission)}
                        className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {mission.name}
                            </h3>
                            {mission.description && (
                              <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
                            )}
                            {mission.bookTitle && (
                              <p className="text-sm text-gray-600 mt-1">
                                📖 {mission.bookTitle} - {mission.bookAuthor}
                              </p>
                            )}
                            {mission.courseTitle && (
                              <p className="text-sm text-gray-600 mt-1">
                                🎓 {mission.courseTitle}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              +{mission.points}
                            </Badge>
                            {isCompleted && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatCompletionDate(mission.id)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Badge Celebration Modal */}
      <Dialog open={showCelebrationModal} onOpenChange={setShowCelebrationModal}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">🎉 Parabéns!</DialogTitle>
          </DialogHeader>
          {newBadge && (
            <div className="space-y-4 py-4">
              <div className="text-6xl">{newBadge.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-purple-600">{newBadge.name}</h3>
                <p className="text-gray-600 mt-2">{newBadge.description}</p>
              </div>
              <Button 
                onClick={() => {
                  setShowCelebrationModal(false);
                  setNewBadge(null);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Continuar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Missions;
