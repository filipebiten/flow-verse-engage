import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckSquare } from "lucide-react";
import BookLibrary from "@/components/BookLibrary";

interface Book {
  id: string;
  title: string;
  author: string;
  addedAt: string;
}

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
  booksRead: Book[];
  booksReading: Book[];
  coursesCompleted: string[];
  coursesInProgress: string[];
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

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<MissionActivity[]>([]);

  useEffect(() => {
    // Check if current user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Load user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.id === userId);
    
    if (foundUser) {
      // Ensure books are arrays with proper structure
      if (!foundUser.booksRead || !Array.isArray(foundUser.booksRead)) {
        foundUser.booksRead = [];
      }
      
      setUser(foundUser);
      loadUserActivities(userId!);
    } else {
      navigate('/feed');
    }
  }, [userId, navigate]);

  const loadUserActivities = (userId: string) => {
    const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    const userActivities = activities
      .filter((activity: MissionActivity) => activity.userId === userId)
      .sort((a: MissionActivity, b: MissionActivity) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    setUserActivities(userActivities);
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

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!user) return null;

  const phaseInfo = getPhaseInfo(user.phase);

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
            <h1 className="text-2xl font-bold text-teal-700">Perfil de {user.name}</h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/missions')}
            className="text-teal-600 border-teal-200"
          >
            <CheckSquare className="w-4 h-4 mr-1" />
            Minhas Missões
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profilePhoto || ''} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                  <p className="text-gray-600">
                    {user.pgmRole} {user.pgmNumber && `- ${user.pgmNumber}`}
                  </p>
                  <p className="text-sm text-gray-500">Membro desde {formatJoinDate(user.joinDate)}</p>
                </div>
                
                <div className="flex items-center space-x-3 flex-wrap">
                  <Badge className={phaseInfo.color}>
                    {phaseInfo.emoji} {user.phase}
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {user.points} pontos
                  </Badge>
                  {user.isAdmin && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Administrador
                    </Badge>
                  )}
                  {user.participatesFlowUp && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      FLOW UP
                    </Badge>
                  )}
                  {user.participatesIrmandade && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      IRMANDADE
                    </Badge>
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-700">"{phaseInfo.phrase}"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="missions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="missions">Missões</TabsTrigger>
            <TabsTrigger value="books">Biblioteca</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="missions">
            <Card>
              <CardHeader>
                <CardTitle>📈 Timeline de Missões</CardTitle>
              </CardHeader>
              <CardContent>
                {userActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Este usuário ainda não concluiu nenhuma missão.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {userActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-white">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{activity.missionName}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                +{activity.points}
                              </Badge>
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
          </TabsContent>
          
          <TabsContent value="books">
            <BookLibrary
              userId={user.id}
              booksRead={user.booksRead}
              onUpdateBooks={() => {}} // Read-only for other users
              readOnly={true}
            />
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎓 Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                {user.coursesCompleted.length === 0 && user.coursesInProgress.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum curso iniciado ainda</p>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-600">{user.coursesCompleted.length}</div>
                    <p className="text-gray-600">concluídos</p>
                    {user.coursesInProgress.length > 0 && (
                      <>
                        <div className="text-lg font-medium text-blue-600">{user.coursesInProgress.length}</div>
                        <p className="text-gray-600 text-sm">em andamento</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
