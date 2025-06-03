import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, BookOpen, GraduationCap, Sparkles } from "lucide-react";
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
  coursesCompleted: string[];
  coursesInProgress: string[];
}

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    
    setCurrentUser(userData);
  }, [navigate]);

  const handleUpdateBooks = () => {
    // This function is kept for compatibility but doesn't need to do anything
    // since books are managed by admin only now
  };

  const getPhaseInfo = (phase: string) => {
    const phases = {
      "Riacho": { 
        emoji: "🌀", 
        phrase: "Começando a fluir", 
        description: "Início da caminhada com Deus e com a FLOW.",
        color: "bg-green-100 text-green-800",
        nextPhase: "Correnteza",
        nextPoints: 251
      },
      "Correnteza": { 
        emoji: "🌊", 
        phrase: "Sendo levado por algo maior", 
        description: "Engajado no PGM, abrindo-se ao mover de Deus.",
        color: "bg-blue-100 text-blue-800",
        nextPhase: "Cachoeira",
        nextPoints: 501
      },
      "Cachoeira": { 
        emoji: "💥", 
        phrase: "Entregue ao movimento de Deus", 
        description: "Servindo com intensidade e sendo transformador.",
        color: "bg-purple-100 text-purple-800",
        nextPhase: "Oceano",
        nextPoints: 1001
      },
      "Oceano": { 
        emoji: "🌌", 
        phrase: "Profundamente imerso em Deus", 
        description: "Maturidade espiritual, liderança e profundidade.",
        color: "bg-gray-900 text-white",
        nextPhase: null,
        nextPoints: null
      }
    };
    return phases[phase as keyof typeof phases] || phases["Riacho"];
  };

  const getPhaseProgress = () => {
    if (!currentUser) return 0;
    const phaseInfo = getPhaseInfo(currentUser.phase);
    
    if (!phaseInfo.nextPoints) return 100; // Max level
    
    const currentPhaseStart = phaseInfo.nextPoints === 251 ? 0 : 
                             phaseInfo.nextPoints === 501 ? 251 :
                             phaseInfo.nextPoints === 1001 ? 501 : 0;
    
    const progressInPhase = currentUser.points - currentPhaseStart;
    const totalPointsForPhase = phaseInfo.nextPoints - currentPhaseStart;
    
    return Math.min((progressInPhase / totalPointsForPhase) * 100, 100);
  };

  const getDiscountPercentage = () => {
    if (!currentUser) return 0;
    return Math.floor(currentUser.points / 10);
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!currentUser) return null;

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
            <h1 className="text-2xl font-bold text-teal-700">Meu Perfil</h1>
          </div>
          
          {currentUser.isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-purple-600 border-purple-200"
            >
              <Settings className="w-4 h-4 mr-1" />
              Modo Admin
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentUser.profilePhoto || ''} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
                  <p className="text-gray-600">{currentUser.email}</p>
                  {currentUser.whatsapp && (
                    <p className="text-gray-600">WhatsApp: {currentUser.whatsapp}</p>
                  )}
                  <p className="text-gray-600">
                    {currentUser.pgmRole} {currentUser.pgmNumber && `- ${currentUser.pgmNumber}`}
                  </p>
                  <p className="text-sm text-gray-500">Membro desde {formatJoinDate(currentUser.joinDate)}</p>
                </div>
                
                <div className="flex items-center space-x-3 flex-wrap">
                  <Badge className={phaseInfo.color}>
                    {phaseInfo.emoji} {currentUser.phase}
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {currentUser.points} pontos
                  </Badge>
                  {currentUser.isAdmin && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Administrador
                    </Badge>
                  )}
                  {currentUser.participatesFlowUp && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      FLOW UP
                    </Badge>
                  )}
                  {currentUser.participatesIrmandade && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      IRMANDADE
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {phaseInfo.emoji} Fase: {currentUser.phase}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-lg font-medium text-gray-700">"{phaseInfo.phrase}"</p>
              <p className="text-gray-600">{phaseInfo.description}</p>
            </div>
            
            {phaseInfo.nextPhase && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso para {phaseInfo.nextPhase}</span>
                  <span>{currentUser.points} / {phaseInfo.nextPoints} pontos</span>
                </div>
                <Progress value={getPhaseProgress()} className="h-3" />
                <p className="text-xs text-gray-500">
                  Faltam {(phaseInfo.nextPoints || 0) - currentUser.points} pontos para a próxima fase
                </p>
              </div>
            )}
            
            {currentUser.phase === "Oceano" && (
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-lg font-medium text-gray-700">🎉 Você alcançou o nível máximo!</p>
                <p className="text-gray-600">Parabéns por sua jornada espiritual!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* OVERFLOW Discount */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Sparkles className="w-5 h-5 mr-2" />
              Desconto OVERFLOW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-orange-600">{getDiscountPercentage()}%</div>
              <p className="text-gray-600">Desconto acumulado para o OVERFLOW</p>
              <div className="bg-white p-3 rounded-lg">
                <Progress value={Math.min((currentUser.points % 10) * 10, 100)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Próximo 1%: {10 - (currentUser.points % 10)} pontos restantes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Books and Courses Tabs */}
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="books">Biblioteca</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books">
            <BookLibrary
              userId={currentUser.id}
              booksRead={currentUser.booksRead}
              onUpdateBooks={handleUpdateBooks}
            />
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Cursos ({currentUser.coursesCompleted.length} concluídos)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentUser.coursesCompleted.length === 0 && currentUser.coursesInProgress.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum curso iniciado ainda</p>
                ) : (
                  <>
                    {currentUser.coursesCompleted.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Concluídos:</h4>
                        <div className="space-y-2">
                          {currentUser.coursesCompleted.map((course, index) => (
                            <div key={index} className="p-2 bg-green-50 rounded flex items-center">
                              <span className="text-sm flex-1">{course}</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                ✓
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentUser.coursesInProgress.length > 0 && (
                      <div>
                        <h4 className="font-medium text-blue-700 mb-2">Em andamento:</h4>
                        <div className="space-y-2">
                          {currentUser.coursesInProgress.map((course, index) => (
                            <div key={index} className="p-2 bg-blue-50 rounded flex items-center">
                              <span className="text-sm flex-1">{course}</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                📖
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
