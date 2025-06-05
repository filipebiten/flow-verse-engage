
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, CheckSquare, Settings, ExternalLink, Trophy, TrendingUp, Award } from "lucide-react";
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
  badges: string[];
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

interface PhaseChangeActivity {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  oldPhase: string;
  newPhase: string;
  timestamp: string;
}

interface BadgeActivity {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  badges: string[];
  timestamp: string;
}

const Feed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [missionActivities, setMissionActivities] = useState<MissionActivity[]>([]);
  const [phaseChanges, setPhaseChanges] = useState<PhaseChangeActivity[]>([]);
  const [badgeActivities, setBadgeActivities] = useState<BadgeActivity[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    
    setCurrentUser(JSON.parse(user));
    loadNews();
    loadMissionActivities();
    loadPhaseChanges();
    loadBadgeActivities();
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

  const loadPhaseChanges = () => {
    const changes = JSON.parse(localStorage.getItem('phaseChanges') || '[]');
    setPhaseChanges(changes.sort((a: PhaseChangeActivity, b: PhaseChangeActivity) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const loadBadgeActivities = () => {
    const activities = JSON.parse(localStorage.getItem('badgeActivities') || '[]');
    setBadgeActivities(activities.sort((a: BadgeActivity, b: BadgeActivity) => 
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

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    toast({
      title: "Logout realizado",
      description: "Até logo! Volte sempre à REDE FLOW.",
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

  // Combine and sort all activities
  const allActivities = [
    ...missionActivities.map(activity => ({ ...activity, type: 'mission' })),
    ...phaseChanges.map(change => ({ ...change, type: 'phase' })),
    ...badgeActivities.map(activity => ({ ...activity, type: 'badge' }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (!currentUser) return null;

  const phaseInfo = getPhaseInfo(currentUser.phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              REDE FLOW
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              POSTURA | IDENTIDADE | OBEDIÊNCIA
            </p>
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

        {/* Community Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">🟡 Atividades da Comunidade</h2>
          
          {allActivities.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <p>Nenhuma atividade foi registrada ainda.</p>
                <p className="text-sm mt-1">Seja o primeiro a completar uma missão!</p>
              </CardContent>
            </Card>
          ) : (
            allActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-teal-200"
                      onClick={() => navigate(`/user/${activity.userId}`)}
                    >
                      <AvatarImage src={activity.userPhoto || ''} />
                      <AvatarFallback className="bg-teal-100 text-teal-700">
                        {(activity.userName || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      {activity.type === 'mission' ? (
                        <div className="flex items-center space-x-2">
                          <span
                            className="font-medium text-gray-800 cursor-pointer hover:text-teal-600"
                            onClick={() => navigate(`/user/${activity.userId}`)}
                          >
                            {activity.userName || 'Usuário'}
                          </span>
                          <span className="text-gray-500">completou</span>
                          <span className="font-medium text-teal-600">{(activity as any).missionName}</span>
                        </div>
                      ) : activity.type === 'phase' ? (
                        <div className="flex items-center space-x-2">
                          <span
                            className="font-medium text-gray-800 cursor-pointer hover:text-teal-600"
                            onClick={() => navigate(`/user/${activity.userId}`)}
                          >
                            {activity.userName || 'Usuário'}
                          </span>
                          <span className="text-gray-500">avançou para</span>
                          <span className="font-medium text-purple-600">{(activity as any).newPhase}</span>
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span
                            className="font-medium text-gray-800 cursor-pointer hover:text-teal-600"
                            onClick={() => navigate(`/user/${activity.userId}`)}
                          >
                            {activity.userName || 'Usuário'}
                          </span>
                          <span className="text-gray-500">conquistou novos badges</span>
                          <Award className="w-4 h-4 text-yellow-600" />
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        {activity.type === 'mission' ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            +{(activity as any).points} pontos
                          </Badge>
                        ) : activity.type === 'phase' ? (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            Nova fase alcançada!
                          </Badge>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {(activity as any).badges && (activity as any).badges.map((badgeId: string) => {
                              const badge = getBadgeInfo(badgeId);
                              return badge ? (
                                <Badge key={badgeId} variant="secondary" className="bg-yellow-100 text-yellow-700">
                                  {badge.icon} {badge.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}
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
