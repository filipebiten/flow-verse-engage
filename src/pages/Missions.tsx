
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Trophy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Mission {
  id: string;
  name: string;
  points: number;
  type: 'Diária' | 'Semanal' | 'Mensal' | 'Semestral' | 'Anual' | 'Livro' | 'Curso';
  description?: string;
  isActive: boolean;
  createdAt: string;
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
}

const Missions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);

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
        { id: 'daily-1', name: 'Momento com Deus', points: 1, type: 'Diária', description: 'Tempo de oração e reflexão', isActive: true, createdAt: new Date().toISOString() },
        { id: 'daily-2', name: 'Leitura Bíblica', points: 1, type: 'Diária', description: 'Ler um capítulo da Bíblia', isActive: true, createdAt: new Date().toISOString() },
        { id: 'daily-3', name: 'Gratidão', points: 1, type: 'Diária', description: 'Anotar 3 motivos de gratidão', isActive: true, createdAt: new Date().toISOString() },
        
        // Semanais
        { id: 'weekly-1', name: 'Participar do PGM', points: 3, type: 'Semanal', description: 'Estar presente no Pequeno Grupo Missionário', isActive: true, createdAt: new Date().toISOString() },
        { id: 'weekly-2', name: 'Servir na Igreja', points: 3, type: 'Semanal', description: 'Participar de algum ministério', isActive: true, createdAt: new Date().toISOString() },
        { id: 'weekly-3', name: 'Evangelizar', points: 3, type: 'Semanal', description: 'Compartilhar o evangelho com alguém', isActive: true, createdAt: new Date().toISOString() },
        
        // Mensais
        { id: 'monthly-1', name: 'Jejum e Oração', points: 5, type: 'Mensal', description: 'Dedicar um dia ao jejum e oração', isActive: true, createdAt: new Date().toISOString() },
        { id: 'monthly-2', name: 'Ação Social', points: 5, type: 'Mensal', description: 'Participar de projeto social', isActive: true, createdAt: new Date().toISOString() },
        { id: 'monthly-3', name: 'Mentoria', points: 5, type: 'Mensal', description: 'Mentorar ou ser mentorado', isActive: true, createdAt: new Date().toISOString() },
        
        // Semestrais
        { id: 'semester-1', name: 'Retiro Espiritual', points: 10, type: 'Semestral', description: 'Participar de retiro ou encontro', isActive: true, createdAt: new Date().toISOString() },
        { id: 'semester-2', name: 'Missões', points: 10, type: 'Semestral', description: 'Participar de viagem missionária', isActive: true, createdAt: new Date().toISOString() },
        
        // Anuais
        { id: 'annual-1', name: 'OVERFLOW', points: 20, type: 'Anual', description: 'Participar do evento OVERFLOW', isActive: true, createdAt: new Date().toISOString() },
        { id: 'annual-2', name: 'Liderança', points: 20, type: 'Anual', description: 'Assumir posição de liderança', isActive: true, createdAt: new Date().toISOString() },
        
        // Especiais
        { id: 'book-reading', name: 'Leitura de Livro', points: 5, type: 'Livro', description: 'Ler um livro cristão completo', isActive: true, createdAt: new Date().toISOString() },
        { id: 'disciple-course', name: 'Escola do Discípulo', points: 10, type: 'Curso', description: 'Completar curso da Escola do Discípulo', isActive: true, createdAt: new Date().toISOString() },
      ];
      
      localStorage.setItem('missions', JSON.stringify(defaultMissions));
      setMissions(defaultMissions);
    } else {
      setMissions(JSON.parse(storedMissions).filter((m: Mission) => m.isActive));
    }
  };

  const loadCompletedMissions = () => {
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    const completed = JSON.parse(localStorage.getItem(`completedMissions_${userId}`) || '[]');
    setCompletedMissions(completed);
  };

  const completeMission = (mission: Mission) => {
    if (!currentUser) return;

    const missionId = mission.id;
    const newCompleted = [...completedMissions, missionId];
    
    // Save completed missions
    localStorage.setItem(`completedMissions_${currentUser.id}`, JSON.stringify(newCompleted));
    setCompletedMissions(newCompleted);

    // Update user points
    const newPoints = currentUser.points + mission.points;
    const oldPhase = currentUser.phase;
    const newPhase = calculatePhase(newPoints);
    
    const updatedUser = { ...currentUser, points: newPoints, phase: newPhase };
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
      setTimeout(() => {
        const phaseInfo = getPhaseInfo(newPhase);
        toast({
          title: `🌟 Nova Fase Desbloqueada!`,
          description: `${phaseInfo.emoji} ${newPhase}: ${phaseInfo.phrase}`,
        });
      }, 1000);
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
    return Math.min((currentUser.points / 10) % 100, 100);
  };

  const getDiscountPercentage = () => {
    if (!currentUser) return 0;
    return Math.floor(currentUser.points / 10);
  };

  if (!currentUser) return null;

  const missionTypes = [
    { type: 'Diária', color: 'bg-green-100 text-green-800', resetInfo: 'Reset todo dia' },
    { type: 'Semanal', color: 'bg-blue-100 text-blue-800', resetInfo: 'Reset domingo' },
    { type: 'Mensal', color: 'bg-purple-100 text-purple-800', resetInfo: 'Reset dia 1' },
    { type: 'Semestral', color: 'bg-orange-100 text-orange-800', resetInfo: 'Reset configurável' },
    { type: 'Anual', color: 'bg-red-100 text-red-800', resetInfo: 'Reset anual' },
    { type: 'Livro', color: 'bg-indigo-100 text-indigo-800', resetInfo: '+5 pontos por livro' },
    { type: 'Curso', color: 'bg-pink-100 text-pink-800', resetInfo: '+10 pontos por curso' },
  ];

  const phaseInfo = getPhaseInfo(currentUser.phase);

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
                <span>Desconto atual: {getDiscountPercentage()}%</span>
                <span>Próximo desconto: {Math.floor(currentUser.points / 10) + 1}% (faltam {10 - (currentUser.points % 10)} pontos)</span>
              </div>
              <Progress value={getDiscountProgress()} className="h-3" />
              <p className="text-xs text-gray-600">A cada 10 pontos = 1% de desconto no OVERFLOW</p>
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
                    <Badge className={`${color} mr-3`}>{type}</Badge>
                    {resetInfo}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {typeMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      checked={completedMissions.includes(mission.id)}
                      onCheckedChange={() => {
                        if (!completedMissions.includes(mission.id)) {
                          completeMission(mission);
                        }
                      }}
                      className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${completedMissions.includes(mission.id) ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {mission.name}
                        </h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          +{mission.points}
                        </Badge>
                      </div>
                      {mission.description && (
                        <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Missions;
