
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckSquare, User, Trophy, Menu, Sparkles, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  type: 'mission' | 'phase';
  missionName?: string;
  points?: number;
  oldPhase?: string;
  newPhase?: string;
  timestamp: string;
}

const Feed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showLevelsModal, setShowLevelsModal] = useState(false);

  // Clear localStorage on component mount to delete database
  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    
    setCurrentUser(JSON.parse(user));
    loadActivities();
  }, [navigate]);

  const loadActivities = () => {
    const missionActivities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    const phaseActivities = JSON.parse(localStorage.getItem('phaseActivities') || '[]');
    
    const allActivities = [...missionActivities, ...phaseActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setActivities(allActivities);
  };

  const getPhaseInfo = (phase: string) => {
    const phases = {
      "Riacho": { emoji: "🌀", color: "bg-green-100 text-green-800", phrase: "Começando a fluir" },
      "Correnteza": { emoji: "🌊", color: "bg-blue-100 text-blue-800", phrase: "Sendo levado por algo maior" },
      "Cachoeira": { emoji: "💥", color: "bg-purple-100 text-purple-800", phrase: "Entregue ao movimento de Deus" },
      "Oceano": { emoji: "🌌", color: "bg-gray-900 text-white", phrase: "Profundamente imerso em Deus" }
    };
    return phases[phase as keyof typeof phases] || phases["Riacho"];
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

  const levels = [
    { name: "Riacho", emoji: "🌀", points: "0-250", phrase: "Começando a fluir", description: "Início da caminhada com Deus e com a FLOW." },
    { name: "Correnteza", emoji: "🌊", points: "251-500", phrase: "Sendo levado por algo maior", description: "Engajado no PGM, abrindo-se ao mover de Deus." },
    { name: "Cachoeira", emoji: "💥", points: "501-1000", phrase: "Entregue ao movimento de Deus", description: "Servindo com intensidade e sendo transformador." },
    { name: "Oceano", emoji: "🌌", points: "1001+", phrase: "Profundamente imerso em Deus", description: "Maturidade espiritual, liderança e profundidade." }
  ];

  if (!currentUser) return null;

  const phaseInfo = getPhaseInfo(currentUser.phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-teal-700">FLOW - POSTURA | IDENTIDADE | OBEDIÊNCIA</h1>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLevelsModal(true)}
              className="text-teal-600"
            >
              <Badge className={phaseInfo.color}>
                {phaseInfo.emoji} {currentUser.phase}
              </Badge>
            </Button>
            <Badge className="bg-yellow-100 text-yellow-800">
              <Trophy className="w-3 h-3 mr-1" />
              {currentUser.points} pontos
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="text-teal-600"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/missions')}>
            <CardContent className="p-4 flex items-center space-x-3">
              <CheckSquare className="w-8 h-8 text-teal-600" />
              <div>
                <h3 className="font-medium">Missões</h3>
                <p className="text-sm text-gray-600">Complete suas missões diárias</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/profile')}>
            <CardContent className="p-4 flex items-center space-x-3">
              <User className="w-8 h-8 text-teal-600" />
              <div>
                <h3 className="font-medium">Meu Perfil</h3>
                <p className="text-sm text-gray-600">Veja seu progresso</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Feed de Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma atividade ainda. Complete suas primeiras missões!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-white">
                    <Avatar 
                      className="w-10 h-10 cursor-pointer" 
                      onClick={() => navigate(`/user/${activity.userId}`)}
                    >
                      <AvatarImage src={activity.userPhoto || ''} />
                      <AvatarFallback className="bg-teal-100 text-teal-700">
                        {activity.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span 
                            className="font-medium text-teal-700 cursor-pointer hover:underline"
                            onClick={() => navigate(`/user/${activity.userId}`)}
                          >
                            {activity.userName}
                          </span>
                          {activity.type === 'mission' ? (
                            <span className="text-gray-600"> completou a missão </span>
                          ) : (
                            <span className="text-gray-600"> mudou de fase de </span>
                          )}
                          {activity.type === 'mission' ? (
                            <span className="font-medium text-gray-800">{activity.missionName}</span>
                          ) : (
                            <>
                              <span className="font-medium text-gray-800">{activity.oldPhase}</span>
                              <span className="text-gray-600"> para </span>
                              <span className="font-medium text-gray-800">{activity.newPhase}</span>
                              <TrendingUp className="w-4 h-4 inline ml-1 text-green-600" />
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {activity.type === 'mission' && activity.points && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              +{activity.points}
                            </Badge>
                          )}
                          {activity.type === 'phase' && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              🎉 Nova Fase!
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Levels Modal */}
      <Dialog open={showLevelsModal} onOpenChange={setShowLevelsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Níveis FLOW</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {levels.map((level, index) => {
              const isCurrentLevel = level.name === currentUser.phase;
              const isCompleted = levels.findIndex(l => l.name === currentUser.phase) > index;
              
              return (
                <div 
                  key={level.name} 
                  className={`p-4 rounded-lg border-2 ${
                    isCurrentLevel 
                      ? 'border-teal-500 bg-teal-50' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{level.emoji}</span>
                      <div>
                        <h3 className="font-bold text-lg">{level.name}</h3>
                        <p className="text-sm text-gray-600">{level.points} pontos</p>
                      </div>
                    </div>
                    {isCurrentLevel && (
                      <Badge className="bg-teal-100 text-teal-800">Atual</Badge>
                    )}
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-800">✓ Completo</Badge>
                    )}
                  </div>
                  <p className="font-medium text-gray-700 mb-1">"{level.phrase}"</p>
                  <p className="text-sm text-gray-600">{level.description}</p>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feed;
