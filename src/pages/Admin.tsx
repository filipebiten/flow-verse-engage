import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Plus, Pencil, Trash2, Users, BookOpen, GraduationCap, Newspaper, Target } from "lucide-react";
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
  description: string;
  points: number;
  type: string;
  targetAudience: string[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  points: number;
  targetAudience: string[];
}

interface Course {
  id: string;
  name: string;
  school: string;
  description: string;
  points: number;
  targetAudience: string[];
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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [participationFilter, setParticipationFilter] = useState("Todos");
  const [phaseFilter, setPhaseFilter] = useState("Todos");
  const [audienceFilter, setAudienceFilter] = useState("Todos");

  // Modal states
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [missionForm, setMissionForm] = useState({
    name: "",
    description: "",
    points: 0,
    type: "",
    targetAudience: [] as string[]
  });
  
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    points: 0,
    targetAudience: [] as string[]
  });
  
  const [courseForm, setCourseForm] = useState({
    name: "",
    school: "",
    description: "",
    points: 0,
    targetAudience: [] as string[]
  });
  
  const [newsForm, setNewsForm] = useState({
    title: "",
    description: "",
    image: "",
    url: "",
    isActive: true
  });

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(user);
    if (!userData.isAdmin) {
      navigate('/feed');
      return;
    }

    setCurrentUser(userData);
    loadData();
  }, [navigate]);

  const loadData = () => {
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
    setMissions(JSON.parse(localStorage.getItem('missions') || '[]'));
    setBooks(JSON.parse(localStorage.getItem('books') || '[]'));
    setCourses(JSON.parse(localStorage.getItem('courses') || '[]'));
    setNews(JSON.parse(localStorage.getItem('news') || '[]'));
  };

  const saveMission = () => {
    try {
      if (!missionForm.name || !missionForm.type) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      const updatedMissions = [...missions];
      
      if (editingItem) {
        const index = updatedMissions.findIndex(m => m.id === editingItem.id);
        if (index !== -1) {
          updatedMissions[index] = {
            ...editingItem,
            ...missionForm
          };
        }
      } else {
        const newMission: Mission = {
          id: `mission-${Date.now()}`,
          ...missionForm
        };
        updatedMissions.push(newMission);
      }
      
      localStorage.setItem('missions', JSON.stringify(updatedMissions));
      setMissions(updatedMissions);
      setShowMissionModal(false);
      setEditingItem(null);
      setMissionForm({
        name: "",
        description: "",
        points: 0,
        type: "",
        targetAudience: []
      });
      
      toast({
        title: editingItem ? "Missão atualizada" : "Missão criada",
        description: editingItem ? "A missão foi atualizada com sucesso." : "A missão foi criada com sucesso."
      });
    } catch (error) {
      console.error('Error saving mission:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a missão.",
        variant: "destructive"
      });
    }
  };

  const saveBook = () => {
    try {
      if (!bookForm.title || !bookForm.author) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      const updatedBooks = [...books];
      
      if (editingItem) {
        const index = updatedBooks.findIndex(b => b.id === editingItem.id);
        if (index !== -1) {
          updatedBooks[index] = {
            ...editingItem,
            ...bookForm
          };
        }
      } else {
        const newBook: Book = {
          id: `book-${Date.now()}`,
          ...bookForm
        };
        updatedBooks.push(newBook);
      }
      
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
      setShowBookModal(false);
      setEditingItem(null);
      setBookForm({
        title: "",
        author: "",
        points: 0,
        targetAudience: []
      });
      
      toast({
        title: editingItem ? "Livro atualizado" : "Livro adicionado",
        description: editingItem ? "O livro foi atualizado com sucesso." : "O livro foi adicionado com sucesso."
      });
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o livro.",
        variant: "destructive"
      });
    }
  };

  const saveCourse = () => {
    try {
      if (!courseForm.name || !courseForm.school) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      const updatedCourses = [...courses];
      
      if (editingItem) {
        const index = updatedCourses.findIndex(c => c.id === editingItem.id);
        if (index !== -1) {
          updatedCourses[index] = {
            ...editingItem,
            ...courseForm
          };
        }
      } else {
        const newCourse: Course = {
          id: `course-${Date.now()}`,
          ...courseForm
        };
        updatedCourses.push(newCourse);
      }
      
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      setShowCourseModal(false);
      setEditingItem(null);
      setCourseForm({
        name: "",
        school: "",
        description: "",
        points: 0,
        targetAudience: []
      });
      
      toast({
        title: editingItem ? "Curso atualizado" : "Curso adicionado",
        description: editingItem ? "O curso foi atualizado com sucesso." : "O curso foi adicionado com sucesso."
      });
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o curso.",
        variant: "destructive"
      });
    }
  };

  const saveNews = () => {
    try {
      if (!newsForm.title) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      const updatedNews = [...news];
      
      if (editingItem) {
        const index = updatedNews.findIndex(n => n.id === editingItem.id);
        if (index !== -1) {
          updatedNews[index] = {
            ...editingItem,
            ...newsForm
          };
        }
      } else {
        const newNewsItem: NewsItem = {
          id: `news-${Date.now()}`,
          ...newsForm,
          createdAt: new Date().toISOString()
        };
        updatedNews.push(newNewsItem);
      }
      
      localStorage.setItem('news', JSON.stringify(updatedNews));
      setNews(updatedNews);
      setShowNewsModal(false);
      setEditingItem(null);
      setNewsForm({
        title: "",
        description: "",
        image: "",
        url: "",
        isActive: true
      });
      
      toast({
        title: editingItem ? "Notícia atualizada" : "Notícia adicionada",
        description: editingItem ? "A notícia foi atualizada com sucesso." : "A notícia foi adicionada com sucesso."
      });
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a notícia.",
        variant: "destructive"
      });
    }
  };

  const deleteMission = (id: string) => {
    try {
      const updatedMissions = missions.filter(mission => mission.id !== id);
      localStorage.setItem('missions', JSON.stringify(updatedMissions));
      setMissions(updatedMissions);
      
      toast({
        title: "Missão excluída",
        description: "A missão foi excluída com sucesso."
      });
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a missão.",
        variant: "destructive"
      });
    }
  };

  const deleteBook = (id: string) => {
    try {
      const updatedBooks = books.filter(book => book.id !== id);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
      
      toast({
        title: "Livro excluído",
        description: "O livro foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o livro.",
        variant: "destructive"
      });
    }
  };

  const deleteCourse = (id: string) => {
    try {
      const updatedCourses = courses.filter(course => course.id !== id);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      
      toast({
        title: "Curso excluído",
        description: "O curso foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o curso.",
        variant: "destructive"
      });
    }
  };

  const deleteNews = (id: string) => {
    try {
      const updatedNews = news.filter(item => item.id !== id);
      localStorage.setItem('news', JSON.stringify(updatedNews));
      setNews(updatedNews);
      
      toast({
        title: "Notícia excluída",
        description: "A notícia foi excluída com sucesso."
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a notícia.",
        variant: "destructive"
      });
    }
  };

  // Updated filter functions
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "Todos" || user.pgmRole === roleFilter;
    
    const matchesParticipation = participationFilter === "Todos" || 
                               (participationFilter === "Irmandade" && user.participatesIrmandade) ||
                               (participationFilter === "Flow Up" && user.participatesFlowUp);
    
    const matchesPhase = phaseFilter === "Todos" || user.phase === phaseFilter;
    
    return matchesSearch && matchesRole && matchesParticipation && matchesPhase;
  });

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = audienceFilter === "Todos" || mission.targetAudience.includes(audienceFilter);
    return matchesSearch && matchesAudience;
  });

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = audienceFilter === "Todos" || book.targetAudience.includes(audienceFilter);
    return matchesSearch && matchesAudience;
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = audienceFilter === "Todos" || course.targetAudience.includes(audienceFilter);
    return matchesSearch && matchesAudience;
  });

  const filteredNews = news.filter(item => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/feed')}
              className="text-purple-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Feed
            </Button>
            <h1 className="text-2xl font-bold text-purple-700">Administração</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="missions">Missões</TabsTrigger>
            <TabsTrigger value="books">Livros</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Gerenciar Usuários ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos os cargos</SelectItem>
                      <SelectItem value="Membro">Membro</SelectItem>
                      <SelectItem value="Líder">Líder</SelectItem>
                      <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                      <SelectItem value="Coordenador">Coordenador</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Pastor">Pastor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={participationFilter} onValueChange={setParticipationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Participação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Irmandade">Irmandade</SelectItem>
                      <SelectItem value="Flow Up">Flow Up</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todas as fases</SelectItem>
                      <SelectItem value="Riacho">Riacho</SelectItem>
                      <SelectItem value="Correnteza">Correnteza</SelectItem>
                      <SelectItem value="Cachoeira">Cachoeira</SelectItem>
                      <SelectItem value="Oceano">Oceano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{user.pgmRole}</Badge>
                              <Badge variant="secondary">{user.points} pontos</Badge>
                              <Badge variant="secondary">{user.phase}</Badge>
                              {user.participatesIrmandade && (
                                <Badge className="bg-blue-100 text-blue-800">Irmandade</Badge>
                              )}
                              {user.participatesFlowUp && (
                                <Badge className="bg-orange-100 text-orange-800">Flow Up</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/user/${user.id}`)}
                      >
                        Ver Perfil
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missions" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Gerenciar Missões ({filteredMissions.length})
                </CardTitle>
                <Button onClick={() => setShowMissionModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Missão
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar missões..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos os públicos</SelectItem>
                      <SelectItem value="Membro">Membro</SelectItem>
                      <SelectItem value="Líder">Líder</SelectItem>
                      <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                      <SelectItem value="Coordenador">Coordenador</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Pastor">Pastor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Missions Table */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredMissions.map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex-1">
                        <h4 className="font-medium">{mission.name}</h4>
                        <p className="text-sm text-gray-600">{mission.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{mission.type}</Badge>
                          <Badge variant="secondary">{mission.points} pontos</Badge>
                          {mission.targetAudience.map((audience) => (
                            <Badge key={audience} variant="outline" className="text-xs">
                              {audience}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(mission);
                            setMissionForm({
                              name: mission.name,
                              description: mission.description,
                              points: mission.points,
                              type: mission.type,
                              targetAudience: mission.targetAudience
                            });
                            setShowMissionModal(true);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMission(mission.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Gerenciar Cursos ({filteredCourses.length})
                </CardTitle>
                <Button onClick={() => setShowCourseModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Curso
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar cursos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos os públicos</SelectItem>
                      <SelectItem value="Membro">Membro</SelectItem>
                      <SelectItem value="Líder">Líder</SelectItem>
                      <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                      <SelectItem value="Coordenador">Coordenador</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Pastor">Pastor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Courses Table */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex-1">
                        <h4 className="font-medium">{course.name}</h4>
                        <p className="text-sm text-gray-600">{course.school}</p>
                        <p className="text-sm text-gray-600">{course.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{course.points} pontos</Badge>
                          {course.targetAudience.map((audience) => (
                            <Badge key={audience} variant="outline" className="text-xs">
                              {audience}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(course);
                            setCourseForm({
                              name: course.name,
                              school: course.school,
                              description: course.description,
                              points: course.points,
                              targetAudience: course.targetAudience
                            });
                            setShowCourseModal(true);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCourse(course.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="books" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Gerenciar Livros ({filteredBooks.length})
                </CardTitle>
                <Button onClick={() => setShowBookModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Livro
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar livros..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos os públicos</SelectItem>
                      <SelectItem value="Membro">Membro</SelectItem>
                      <SelectItem value="Líder">Líder</SelectItem>
                      <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                      <SelectItem value="Coordenador">Coordenador</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Pastor">Pastor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Books Table */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex-1">
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-gray-600">por {book.author}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{book.points} pontos</Badge>
                          {book.targetAudience.map((audience) => (
                            <Badge key={audience} variant="outline" className="text-xs">
                              {audience}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(book);
                            setBookForm({
                              title: book.title,
                              author: book.author,
                              points: book.points,
                              targetAudience: book.targetAudience
                            });
                            setShowBookModal(true);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBook(book.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Newspaper className="w-5 h-5 mr-2" />
                  Gerenciar Notícias ({filteredNews.length})
                </CardTitle>
                <Button onClick={() => setShowNewsModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Notícia
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar notícias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* News Table */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredNews.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          {item.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">Inativa</Badge>
                          )}
                          {item.url && (
                            <Badge variant="outline" className="text-blue-600">
                              Link Externo
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(item);
                            setNewsForm({
                              title: item.title,
                              description: item.description || "",
                              image: item.image || "",
                              url: item.url || "",
                              isActive: item.isActive
                            });
                            setShowNewsModal(true);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNews(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mission Modal */}
      {showMissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Missão' : 'Nova Missão'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={missionForm.name}
                  onChange={(e) => setMissionForm({...missionForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={missionForm.description}
                  onChange={(e) => setMissionForm({...missionForm, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="points">Pontos</Label>
                <Input
                  id="points"
                  type="number"
                  value={missionForm.points}
                  onChange={(e) => setMissionForm({...missionForm, points: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select 
                  value={missionForm.type} 
                  onValueChange={(value) => setMissionForm({...missionForm, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Missões Diárias">Missões Diárias</SelectItem>
                    <SelectItem value="Missões Semanais">Missões Semanais</SelectItem>
                    <SelectItem value="Missões Mensais">Missões Mensais</SelectItem>
                    <SelectItem value="Missões Semestrais">Missões Semestrais</SelectItem>
                    <SelectItem value="Missões Anuais">Missões Anuais</SelectItem>
                    <SelectItem value="Outras Missões">Outras Missões</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Público Alvo</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Membro", "Líder", "Pastor de Rede", "Coordenador", "Supervisor", "Pastor"].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={missionForm.targetAudience.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setMissionForm({
                              ...missionForm,
                              targetAudience: [...missionForm.targetAudience, role]
                            });
                          } else {
                            setMissionForm({
                              ...missionForm,
                              targetAudience: missionForm.targetAudience.filter(r => r !== role)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`role-${role}`} className="text-sm">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => { setShowMissionModal(false); setEditingItem(null); }}>
                Cancelar
              </Button>
              <Button onClick={saveMission}>
                {editingItem ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Livro' : 'Novo Livro'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={bookForm.author}
                  onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="points">Pontos</Label>
                <Input
                  id="points"
                  type="number"
                  value={bookForm.points}
                  onChange={(e) => setBookForm({...bookForm, points: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Público Alvo</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Membro", "Líder", "Pastor de Rede", "Coordenador", "Supervisor", "Pastor"].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`book-role-${role}`}
                        checked={bookForm.targetAudience.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBookForm({
                              ...bookForm,
                              targetAudience: [...bookForm.targetAudience, role]
                            });
                          } else {
                            setBookForm({
                              ...bookForm,
                              targetAudience: bookForm.targetAudience.filter(r => r !== role)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`book-role-${role}`} className="text-sm">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => { setShowBookModal(false); setEditingItem(null); }}>
                Cancelar
              </Button>
              <Button onClick={saveBook}>
                {editingItem ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal with updated school dropdown */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Curso' : 'Novo Curso'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="school">Escola/Instituição</Label>
                <Select 
                  value={courseForm.school} 
                  onValueChange={(value) => setCourseForm({...courseForm, school: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a escola" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Escola do Discípulo">Escola do Discípulo</SelectItem>
                    <SelectItem value="Universidade da Família">Universidade da Família</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="points">Pontos</Label>
                <Input
                  id="points"
                  type="number"
                  value={courseForm.points}
                  onChange={(e) => setCourseForm({...courseForm, points: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Público Alvo</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Membro", "Líder", "Pastor de Rede", "Coordenador", "Supervisor", "Pastor"].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`course-role-${role}`}
                        checked={courseForm.targetAudience.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCourseForm({
                              ...courseForm,
                              targetAudience: [...courseForm.targetAudience, role]
                            });
                          } else {
                            setCourseForm({
                              ...courseForm,
                              targetAudience: courseForm.targetAudience.filter(r => r !== role)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`course-role-${role}`} className="text-sm">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => { setShowCourseModal(false); setEditingItem(null); }}>
                Cancelar
              </Button>
              <Button onClick={saveCourse}>
                {editingItem ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Notícia' : 'Nova Notícia'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={newsForm.description}
                  onChange={(e) => setNewsForm({...newsForm, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="image">URL da Imagem (opcional)</Label>
                <Input
                  id="image"
                  value={newsForm.image}
                  onChange={(e) => setNewsForm({...newsForm, image: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="url">Link Externo (opcional)</Label>
                <Input
                  id="url"
                  value={newsForm.url}
                  onChange={(e) => setNewsForm({...newsForm, url: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={newsForm.isActive}
                  onCheckedChange={(checked) => setNewsForm({...newsForm, isActive: !!checked})}
                />
                <Label htmlFor="isActive">Ativa</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => { setShowNewsModal(false); setEditingItem(null); }}>
                Cancelar
              </Button>
              <Button onClick={saveNews}>
                {editingItem ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
