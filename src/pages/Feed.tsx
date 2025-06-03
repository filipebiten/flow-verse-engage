import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, CheckSquare, Settings, ExternalLink, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  pgm: string;
  isAdmin: boolean;
  phase: string;
  points: number;
  profilePhoto: string | null;
  joinDate: string;
  booksRead: string[];
  coursesCompleted: string[];
  coursesInProgress: string[];
}

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  url?: string;
  isActive: boolean;
  createdAt: string;
}

interface MissionActivity {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  missionName: string;
  points: number;
  timestamp: string;
}

const Feed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [missionActivities, setMissionActivities] = useState<MissionActivity[]>([]);
  const [showPhasesModal, setShowPhasesModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    
    setCurrentUser(JSON.parse(user));
    loadNews();
    loadMissionActivities();
  }, [navigate]);

  const loadNews = () => {
    const storedNews = JSON.parse(localStorage.getItem('news') || '[]');
    setNews(storedNews.filter((item: NewsItem) => item.isActive));
  };

  const loadMissionActivities = () => {
    const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    setMissionActivities(activities.sort((a: MissionActivity, b: MissionActivity) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
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

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    toast({
      title: "Logout realizado",
      description: "Até logo! Volte sempre à FLOW.",
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const phases = [
    { name: "Riacho", minPoints: 0, maxPoints: 250, emoji: "🌀", phrase: "Começando a fluir", description: "Início da caminhada com Deus e com a FLOW.", color: "bg-green-100 text-green-800" },
    { name: "Correnteza", minPoints: 251, maxPoints: 500, emoji: "🌊", phrase: "Sendo levado por algo maior", description: "Engajado no PGM, abrindo-se ao mover de Deus.", color: "bg-blue-100 text-blue-800" },
    { name: "Cachoeira", minPoints: 501, maxPoints: 1000, emoji: "💥", phrase: "Entregue ao movimento de Deus", description: "Servindo com intensidade e sendo transformador.", color: "bg-purple-100 text-purple-800" },
    { name: "Oceano", minPoints: 1001, maxPoints: null, emoji: "🌌", phrase: "Profundamente imerso em Deus", description: "Maturidade espiritual, liderança e profundidade.", color: "bg-gray-900 text-white" }
  ];

  if (!currentUser) return null;

  const phaseInfo = getPhaseInfo(currentUser.phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-teal-700">APP da Rede FLOW</h1>
            <Dialog open={showPhasesModal} onOpenChange={setShowPhasesModal}>
              <DialogTrigger asChild>
                <Badge className={`${phaseInfo.color} cursor-pointer hover:opacity-80`}>
                  {phaseInfo.emoji} {currentUser.phase}
                </Badge>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Fases da FLOW
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {phases.map((phase) => {
                    const isCurrentPhase = phase.name === currentUser.phase;
                    const pointsNeeded = phase.minPoints > currentUser.points ? phase.minPoints - currentUser.points : 0;
                    
                    return (
                      <div key={phase.name} className={`p-3 rounded-lg border ${isCurrentPhase ? 'ring-2 ring-teal-500 bg-teal-50' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{phase.emoji}</span>
                            <span className="font-semibold">{phase.name}</span>
                            {isCurrentPhase && <Badge className="bg-teal-100 text-teal-700">Atual</Badge>}
                          </div>
                          <span className="text-sm text-gray-600">
                            {phase.minPoints}+ pontos
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">"{phase.phrase}"</p>
                        <p className="text-xs text-gray-600">{phase.description}</p>
                        {pointsNeeded > 0 && (
                          <p className="text-xs text-teal-600 mt-2">
                            Faltam {pointsNeeded} pontos para desbloquear
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/missions')}
              className="text-teal-600 border-teal-200"
            >
              <CheckSquare className="w-4 h-4 mr-1" />
              Missões
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
              className="text-teal-600 border-teal-200"
            >
              <User className="w-4 h-4 mr-1" />
              Perfil
            </Button>
            {currentUser.isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="text-purple-600 border-purple-200"
              >
                <Settings className="w-4 h-4 mr-1" />
                Admin
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* News Section */}
        {news.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">📰 Notícias</h2>
            {news.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      )}
                      {item.url && (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-teal-600 p-0 mt-2"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Saiba Mais
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Community Missions Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">🟡 Missões da Comunidade</h2>
          
          {missionActivities.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <p>Nenhuma missão foi concluída ainda.</p>
                <p className="text-sm mt-1">Seja o primeiro a completar uma missão!</p>
              </CardContent>
            </Card>
          ) : (
            missionActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-teal-200"
                      onClick={() => navigate(`/user/${activity.userId}`)}
                    >
                      <AvatarImage src={activity.userPhoto || ''} />
                      <AvatarFallback className="bg-teal-100 text-teal-700">
                        {activity.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className="font-medium text-gray-800 cursor-pointer hover:text-teal-600"
                          onClick={() => navigate(`/user/${activity.userId}`)}
                        >
                          {activity.userName}
                        </span>
                        <span className="text-gray-500">completou</span>
                        <span className="font-medium text-teal-600">{activity.missionName}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          +{activity.points} pontos
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
