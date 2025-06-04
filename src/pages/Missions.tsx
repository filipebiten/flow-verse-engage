import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Trophy, Sparkles, Calendar, BookOpen } from "lucide-react";
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
  booksReading: string[];
  coursesCompleted: string[];
  coursesInProgress: string[];
  gender: string;
  pgmRole: string;
  participatesFlowUp: boolean;
  participatesIrmandade: boolean;
}

const Missions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<CompletedMission[]>([]);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [bookForm, setBookForm] = useState({ title: '', author: '' });

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
        
        // Especiais
        { id: 'book-reading', name: 'Leitura de Livro', points: 5, type: 'Livro', description: 'Ler um livro cristão completo', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
        { id: 'disciple-course', name: 'Escola do Discípulo', points: 10, type: 'Curso', description: 'Completar curso da Escola do Discípulo', isActive: true, createdAt: new Date().toISOString(), targetAudience: ['all'] },
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

  const handleAddBook = () => {
    if (!bookForm.title.trim() || !bookForm.author.trim() || !currentUser) {
      toast({
        title: "Erro",
        description: "Preencha título e autor do livro",
        variant: "destructive"
      });
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      title: bookForm.title,
      author: bookForm.author,
      dateRead: new Date().toISOString()
    };

    const updatedUser = {
      ...currentUser,
      booksRead: [...currentUser.booksRead, newBook],
      points: currentUser.points + 5
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    // Update user in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }

    setBookForm({ title: '', author: '' });
    setShowBookDialog(false);

    toast({
      title: "Livro adicionado!",
      description: `Você ganhou 5 pontos por ler "${bookForm.title}"`,
    });
  };

  const toggleMission = (mission: Mission) => {
    if (!currentUser) return;

    const isCompleted = isMissionCompleted(mission.id);
    const userId = currentUser.id;
    
    if (isCompleted) {
      // Unmark mission
      const newCompleted = completedMissions.filter(cm => cm.missionId !== mission.id);
      localStorage.setItem(`completedMissions_${userId}`, JSON.stringify(newCompleted));
      setCompletedMissions(newCompleted);

      // Remove points
      const newPoints = Math.max(0, currentUser.points - mission.points);
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
            className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          });
        }, 1000);
      }

      // Check if it's a book reading mission
      if (mission.id === 'book-reading') {
        setTimeout(() => {
          setShowBookDialog(true);
        }, 1500);
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
    return Math.min((currentUser.points / 10) % 100, 100);
  };

  const getDiscountPercentage = () => {
    if (!currentUser) return 0;
    return Math.floor(currentUser.points / 10);
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
                          <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {mission.name}
                          </h3>
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
                        {mission.description && (
                          <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Book Dialog */}
      <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Adicionar Livro Lido
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookTitle">Título do Livro</Label>
              <Input
                id="bookTitle"
                value={bookForm.title}
                onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título do livro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bookAuthor">Autor</Label>
              <Input
                id="bookAuthor"
                value={bookForm.author}
                onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Digite o nome do autor"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddBook} className="flex-1">
                Adicionar à Biblioteca
              </Button>
              <Button variant="outline" onClick={() => setShowBookDialog(false)} className="flex-1">
                Pular
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Missions;
