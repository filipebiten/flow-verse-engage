import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Star,
  Trophy,
  Flame,
  Crown,
  BookOpen,
  GraduationCap,
  Heart,
  Users,
  Zap,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  Book,
  School
} from 'lucide-react';
import { getUserPhase } from '@/utils/phaseUtils';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'semestral' | 'annual' | 'book' | 'course' | 'special';
  points: number;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  category: 'spiritual' | 'study' | 'service' | 'community';
  targetAudience?: string[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  points: number;
  image?: string;
  completed: boolean;
  completedAt?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  school: 'Escola do Discípulo' | 'Universidade da Família';
  points: number;
  completed: boolean;
  completedAt?: string;
}

const Missions = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userPhase = getUserPhase(currentUser?.points || 0);

  // Missões por categoria
  const [missions] = useState<Mission[]>([
    // Missões Diárias
    {
      id: "daily_1",
      title: "Oração Matinal",
      description: "Dedique 10 minutos para oração pessoal",
      type: "daily",
      points: 10,
      completed: true,
      completedAt: "2024-01-15T08:30:00Z",
      category: "spiritual"
    },
    {
      id: "daily_2",
      title: "Leitura Bíblica",
      description: "Leia um capítulo da Bíblia",
      type: "daily",
      points: 15,
      completed: false,
      dueDate: "2024-01-16T23:59:59Z",
      category: "spiritual"
    },
    {
      id: "daily_3",
      title: "Momento de Gratidão",
      description: "Liste 3 coisas pelas quais é grato hoje",
      type: "daily",
      points: 5,
      completed: false,
      category: "spiritual"
    },
    
    // Missões Semanais
    {
      id: "weekly_1",
      title: "Participar do PGM",
      description: "Esteja presente na reunião do seu PGM",
      type: "weekly",
      points: 50,
      completed: true,
      completedAt: "2024-01-12T19:30:00Z",
      category: "community"
    },
    {
      id: "weekly_2",
      title: "Servir na Igreja",
      description: "Participe de algum ministério da igreja",
      type: "weekly",
      points: 30,
      completed: false,
      category: "service"
    },
    
    // Missões Mensais
    {
      id: "monthly_1",
      title: "Convidar Alguém",
      description: "Convide uma pessoa para conhecer a igreja",
      type: "monthly",
      points: 100,
      completed: false,
      category: "community"
    },
    {
      id: "monthly_2",
      title: "Jejum e Oração",
      description: "Dedique um dia do mês para jejum e oração",
      type: "monthly",
      points: 80,
      completed: true,
      completedAt: "2024-01-05T18:00:00Z",
      category: "spiritual"
    },
    
    // Missões Especiais
    {
      id: "special_1",
      title: "Participar do OVERFLOW",
      description: "Inscreva-se e participe do retiro OVERFLOW",
      type: "special",
      points: 200,
      completed: false,
      category: "community"
    }
  ]);

  const [books] = useState<Book[]>([
    {
      id: "book_1",
      title: "Propósito Eterno",
      author: "Watchman Nee",
      points: 80,
      completed: true,
      completedAt: "2024-01-10T20:00:00Z"
    },
    {
      id: "book_2",
      title: "A Vida Normal da Igreja Cristã",
      author: "Watchman Nee",
      points: 90,
      completed: false
    },
    {
      id: "book_3",
      title: "O Homem Espiritual",
      author: "Watchman Nee",
      points: 120,
      completed: false
    },
    {
      id: "book_4",
      title: "Autoridade Espiritual",
      author: "Watchman Nee",
      points: 85,
      completed: false
    }
  ]);

  const [courses] = useState<Course[]>([
    {
      id: "course_1",
      title: "Fundamentos da Fé",
      description: "Bases bíblicas da vida cristã",
      school: "Escola do Discípulo",
      points: 100,
      completed: true,
      completedAt: "2024-01-05T14:00:00Z"
    },
    {
      id: "course_2",
      title: "Vida de Igreja",
      description: "Entendendo a vida prática da igreja",
      school: "Escola do Discípulo",
      points: 120,
      completed: false
    },
    {
      id: "course_3",
      title: "Casamento Cristão",
      description: "Princípios bíblicos para o casamento",
      school: "Universidade da Família",
      points: 150,
      completed: false
    },
    {
      id: "course_4",
      title: "Educação de Filhos",
      description: "Criando filhos segundo a Palavra",
      school: "Universidade da Família",
      points: 130,
      completed: false
    }
  ]);

  const completeMission = (missionId: string, type: 'mission' | 'book' | 'course') => {
    console.log(`Completing ${type}: ${missionId}`);
    // Aqui seria implementada a lógica para completar missão
    // Incluindo atualização de pontos, badges, etc.
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: Mission['category']) => {
    switch (category) {
      case 'spiritual': return <Heart className="w-4 h-4" />;
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'service': return <Users className="w-4 h-4" />;
      case 'community': return <Zap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <CalendarDays className="w-4 h-4" />;
      case 'weekly': return <CalendarCheck className="w-4 h-4" />;
      case 'monthly': return <Calendar className="w-4 h-4" />;
      case 'book': return <Book className="w-4 h-4" />;
      case 'course': return <School className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTypeBadgeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'daily': 'Diária',
      'weekly': 'Semanal',
      'monthly': 'Mensal',
      'semestral': 'Semestral',
      'annual': 'Anual',
      'book': 'Livro',
      'course': 'Curso',
      'special': 'Especial'
    };
    return typeMap[type] || type;
  };

  const filteredMissions = {
    daily: missions.filter(m => m.type === 'daily'),
    weekly: missions.filter(m => m.type === 'weekly'),
    monthly: missions.filter(m => m.type === 'monthly'),
    semestral: missions.filter(m => m.type === 'semestral'),
    annual: missions.filter(m => m.type === 'annual'),
    special: missions.filter(m => m.type === 'special')
  };

  const totalCompleted = missions.filter(m => m.completed).length + 
                         books.filter(b => b.completed).length + 
                         courses.filter(c => c.completed).length;

  const totalMissions = missions.length + books.length + courses.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0`}
                   style={{ backgroundColor: userPhase.colors.primary }}>
                {userPhase.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Missões - {userPhase.name}</h1>
                <p className="text-sm text-gray-600">"{userPhase.phrase}"</p>
                <p className="text-xs text-gray-500">{totalCompleted}/{totalMissions} missões concluídas</p>
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={(totalCompleted / totalMissions) * 100} className="h-3" />
              <p className="text-xs text-gray-600">
                {Math.round((totalCompleted / totalMissions) * 100)}% de progresso geral
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Missões organizadas em Tabs */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Suas Missões</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto gap-1 bg-gray-100 p-1">
                <TabsTrigger value="daily" className="text-xs py-2">📅 Diárias</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs py-2">📆 Semanais</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs py-2">🗓️ Mensais</TabsTrigger>
                <TabsTrigger value="books" className="text-xs py-2">📚 Livros</TabsTrigger>
                <TabsTrigger value="courses" className="text-xs py-2">🎓 Cursos</TabsTrigger>
                <TabsTrigger value="semestral" className="text-xs py-2">📊 Semestrais</TabsTrigger>
                <TabsTrigger value="annual" className="text-xs py-2">🏆 Anuais</TabsTrigger>
                <TabsTrigger value="special" className="text-xs py-2">⭐ Especiais</TabsTrigger>
              </TabsList>

              {/* Missões Diárias */}
              <TabsContent value="daily" className="space-y-3 mt-4">
                {filteredMissions.daily.length > 0 ? (
                  filteredMissions.daily.map((mission) => (
                    <Card key={mission.id} className={`transition-all ${mission.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            mission.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`}>
                            {mission.completed ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                              getCategoryIcon(mission.category)
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                              <h3 className="font-semibold text-sm sm:text-base truncate">{mission.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="default" className="text-xs">
                                  {getTypeBadgeText(mission.type)}
                                </Badge>
                                <span className="text-xs text-orange-600 font-medium">+{mission.points}pts</span>
                              </div>
                            </div>
                            
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">{mission.description}</p>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              {mission.completed && mission.completedAt ? (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Concluído em {formatDate(mission.completedAt)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>Hoje</span>
                                </div>
                              )}
                              
                              {!mission.completed && (
                                <Button 
                                  size="sm" 
                                  onClick={() => completeMission(mission.id, 'mission')}
                                  className="text-xs"
                                >
                                  Marcar Concluído
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarDays className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma missão diária disponível</p>
                  </div>
                )}
              </TabsContent>

              {/* Missões Semanais */}
              <TabsContent value="weekly" className="space-y-3 mt-4">
                {filteredMissions.weekly.length > 0 ? (
                  filteredMissions.weekly.map((mission) => (
                    <Card key={mission.id} className={`transition-all ${mission.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            mission.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`}>
                            {mission.completed ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                              getCategoryIcon(mission.category)
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                              <h3 className="font-semibold text-sm sm:text-base truncate">{mission.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {getTypeBadgeText(mission.type)}
                                </Badge>
                                <span className="text-xs text-orange-600 font-medium">+{mission.points}pts</span>
                              </div>
                            </div>
                            
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">{mission.description}</p>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              {mission.completed && mission.completedAt ? (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Concluído em {formatDate(mission.completedAt)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>Esta semana</span>
                                </div>
                              )}
                              
                              {!mission.completed && (
                                <Button 
                                  size="sm" 
                                  onClick={() => completeMission(mission.id, 'mission')}
                                  className="text-xs"
                                >
                                  Marcar Concluído
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma missão semanal disponível</p>
                  </div>
                )}
              </TabsContent>

              {/* Missões Mensais */}
              <TabsContent value="monthly" className="space-y-3 mt-4">
                {filteredMissions.monthly.length > 0 ? (
                  filteredMissions.monthly.map((mission) => (
                    <Card key={mission.id} className={`transition-all ${mission.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            mission.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`}>
                            {mission.completed ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                              getCategoryIcon(mission.category)
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                              <h3 className="font-semibold text-sm sm:text-base truncate">{mission.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {getTypeBadgeText(mission.type)}
                                </Badge>
                                <span className="text-xs text-orange-600 font-medium">+{mission.points}pts</span>
                              </div>
                            </div>
                            
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">{mission.description}</p>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              {mission.completed && mission.completedAt ? (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Concluído em {formatDate(mission.completedAt)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>Este mês</span>
                                </div>
                              )}
                              
                              {!mission.completed && (
                                <Button 
                                  size="sm" 
                                  onClick={() => completeMission(mission.id, 'mission')}
                                  className="text-xs"
                                >
                                  Marcar Concluído
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma missão mensal disponível</p>
                  </div>
                )}
              </TabsContent>

              {/* Livros */}
              <TabsContent value="books" className="space-y-3 mt-4">
                {books.map((book) => (
                  <Card key={book.id} className={`transition-all ${book.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          book.completed ? 'bg-green-500' : 'bg-blue-100'
                        }`}>
                          {book.completed ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          ) : (
                            <Book className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                            <h3 className="font-semibold text-sm sm:text-base truncate">{book.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="text-xs bg-blue-100 text-blue-700">
                                Livro
                              </Badge>
                              <span className="text-xs text-orange-600 font-medium">+{book.points}pts</span>
                            </div>
                          </div>
                          
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">Autor: {book.author}</p>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            {book.completed && book.completedAt ? (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                <span>Concluído em {formatDate(book.completedAt)}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <BookOpen className="w-3 h-3" />
                                <span>Leitura disponível</span>
                              </div>
                            )}
                            
                            {!book.completed && (
                              <Button 
                                size="sm" 
                                onClick={() => completeMission(book.id, 'book')}
                                className="text-xs"
                              >
                                Marcar como Lido
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Cursos */}
              <TabsContent value="courses" className="space-y-3 mt-4">
                {courses.map((course) => (
                  <Card key={course.id} className={`transition-all ${course.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          course.completed ? 'bg-green-500' : 'bg-purple-100'
                        }`}>
                          {course.completed ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          ) : (
                            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                            <h3 className="font-semibold text-sm sm:text-base truncate">{course.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="text-xs bg-purple-100 text-purple-700">
                                Curso
                              </Badge>
                              <span className="text-xs text-orange-600 font-medium">+{course.points}pts</span>
                            </div>
                          </div>
                          
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">{course.description}</p>
                          <p className="text-xs text-gray-500 mb-2">Escola: {course.school}</p>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            {course.completed && course.completedAt ? (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                <span>Concluído em {formatDate(course.completedAt)}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <GraduationCap className="w-3 h-3" />
                                <span>Curso disponível</span>
                              </div>
                            )}
                            
                            {!course.completed && (
                              <Button 
                                size="sm" 
                                onClick={() => completeMission(course.id, 'course')}
                                className="text-xs"
                              >
                                Marcar Concluído
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Outras categorias (semestrais, anuais, especiais) */}
              <TabsContent value="semestral" className="space-y-3 mt-4">
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Missões semestrais serão disponibilizadas em breve</p>
                </div>
              </TabsContent>

              <TabsContent value="annual" className="space-y-3 mt-4">
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Missões anuais serão disponibilizadas em breve</p>
                </div>
              </TabsContent>

              <TabsContent value="special" className="space-y-3 mt-4">
                {filteredMissions.special.length > 0 ? (
                  filteredMissions.special.map((mission) => (
                    <Card key={mission.id} className={`transition-all ${mission.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            mission.completed ? 'bg-green-500' : 'bg-orange-100'
                          }`}>
                            {mission.completed ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                              <h3 className="font-semibold text-sm sm:text-base truncate">{mission.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                                  {getTypeBadgeText(mission.type)}
                                </Badge>
                                <span className="text-xs text-orange-600 font-medium">+{mission.points}pts</span>
                              </div>
                            </div>
                            
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">{mission.description}</p>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              {mission.completed && mission.completedAt ? (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Concluído em {formatDate(mission.completedAt)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Star className="w-3 h-3" />
                                  <span>Missão especial</span>
                                </div>
                              )}
                              
                              {!mission.completed && (
                                <Button 
                                  size="sm" 
                                  onClick={() => completeMission(mission.id, 'mission')}
                                  className="text-xs"
                                >
                                  Marcar Concluído
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma missão especial disponível no momento</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Missions;
