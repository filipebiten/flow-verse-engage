import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, BookOpen, GraduationCap, FileText, Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserPhase } from "@/utils/phaseUtils";

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
  createdAt: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  points: number;
  targetAudience: string[];
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  school: string;
  description: string;
  points: number;
  targetAudience: string[];
  createdAt: string;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
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

  // Filter states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('Todos');
  const [participationFilter, setParticipationFilter] = useState('Todos');
  const [phaseFilter, setPhaseFilter] = useState('Todos');

  // Form states for adding new items
  const [newMission, setNewMission] = useState({
    name: '',
    description: '',
    points: 0,
    type: 'Missões Diárias',
    targetAudience: []
  });

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    points: 0,
    targetAudience: []
  });

  const [newCourse, setNewCourse] = useState({
    name: '',
    school: 'Escola do Discípulo',
    description: '',
    points: 0,
    targetAudience: []
  });

  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    image: '',
    url: '',
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
    loadMissions();
    loadNews();
    loadBooks();
    loadCourses();
    loadUsers();
  }, [navigate]);

  const loadMissions = () => {
    const storedMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    setMissions(storedMissions);
  };

  const loadNews = () => {
    const storedNews = JSON.parse(localStorage.getItem('news') || '[]');
    setNews(storedNews);
  };

  const loadBooks = () => {
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(storedBooks);
  };

  const loadCourses = () => {
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(storedCourses);
  };

  const loadUsers = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  // Mission functions
  const addMission = () => {
    if (!newMission.name || !newMission.points || !newMission.type) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const mission = {
      id: Date.now().toString(),
      ...newMission,
      createdAt: new Date().toISOString()
    };

    setMissions([...missions, mission]);
    localStorage.setItem('missions', JSON.stringify([...missions, mission]));
    
    setNewMission({ name: '', description: '', points: 0, type: 'Missões Diárias', targetAudience: [] });
    
    toast({
      title: "Missão criada",
      description: "A missão foi salva com sucesso!"
    });
  };

  // News functions
  const addNews = () => {
    if (!newNews.title) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o título da notícia.",
        variant: "destructive"
      });
      return;
    }

    const newsItem = {
      id: Date.now().toString(),
      ...newNews,
      createdAt: new Date().toISOString()
    };

    setNews([...news, newsItem]);
    localStorage.setItem('news', JSON.stringify([...news, newsItem]));
    
    setNewNews({ title: '', description: '', image: '', url: '', isActive: true });
    
    toast({
      title: "Notícia criada",
      description: "A notícia foi salva com sucesso!"
    });
  };

  // Book functions
  const addBook = () => {
    if (!newBook.title || !newBook.points) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const book = {
      id: Date.now().toString(),
      ...newBook,
      createdAt: new Date().toISOString()
    };

    setBooks([...books, book]);
    localStorage.setItem('books', JSON.stringify([...books, book]));
    
    setNewBook({ title: '', author: '', points: 0, targetAudience: [] });
    
    toast({
      title: "Livro adicionado",
      description: "O livro foi salvo com sucesso!"
    });
  };

  // Course functions
  const addCourse = () => {
    if (!newCourse.name || !newCourse.points) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const course = {
      id: Date.now().toString(),
      ...newCourse,
      createdAt: new Date().toISOString()
    };

    setCourses([...courses, course]);
    localStorage.setItem('courses', JSON.stringify([...courses, course]));
    
    setNewCourse({ name: '', school: 'Escola do Discípulo', description: '', points: 0, targetAudience: [] });
    
    toast({
      title: "Curso adicionado",
      description: "O curso foi salvo com sucesso!"
    });
  };

  // Helper functions
  const handleTargetAudienceChange = (value: string, currentAudience: string[], setForm: any) => {
    const newAudience = currentAudience.includes(value)
      ? currentAudience.filter(item => item !== value)
      : [...currentAudience, value];
    setForm((prev: any) => ({ ...prev, targetAudience: newAudience }));
  };

  // User filtering logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    
    const matchesRole = userRoleFilter === 'Todos' || user.pgmRole === userRoleFilter;
    
    let matchesParticipation = true;
    if (participationFilter === 'IRMANDADE') {
      matchesParticipation = user.participatesIrmandade;
    } else if (participationFilter === 'FLOW UP') {
      matchesParticipation = user.participatesFlowUp;
    }
    
    const matchesPhase = phaseFilter === 'Todos' || user.phase === phaseFilter;
    
    return matchesSearch && matchesRole && matchesParticipation && matchesPhase;
  });

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta área.</p>
            <Button onClick={() => navigate('/feed')}>Voltar ao Feed</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-purple-700">Painel Administrativo</h1>
          </div>
          <Badge className="bg-purple-100 text-purple-700">
            Administrador
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="missions">Missões</TabsTrigger>
            <TabsTrigger value="books">Livros</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Gerenciar Usuários ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label htmlFor="userSearch">Buscar</Label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="userSearch"
                        placeholder="Nome ou email"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Função PGM</Label>
                    <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos</SelectItem>
                        <SelectItem value="Membro">Membro</SelectItem>
                        <SelectItem value="Líder">Líder</SelectItem>
                        <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                        <SelectItem value="Coordenador">Coordenador</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Pastor">Pastor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Participação</Label>
                    <Select value={participationFilter} onValueChange={setParticipationFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos</SelectItem>
                        <SelectItem value="IRMANDADE">IRMANDADE</SelectItem>
                        <SelectItem value="FLOW UP">FLOW UP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Fase</Label>
                    <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos</SelectItem>
                        <SelectItem value="Riacho">🌀 Riacho</SelectItem>
                        <SelectItem value="Correnteza">🌊 Correnteza</SelectItem>
                        <SelectItem value="Cachoeira">💥 Cachoeira</SelectItem>
                        <SelectItem value="Oceano">🌌 Oceano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.profilePhoto || ''} />
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{user.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {user.points} pts
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {user.pgmRole}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {user.phase}
                          </Badge>
                          {user.participatesIrmandade && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              IRMANDADE
                            </Badge>
                          )}
                          {user.participatesFlowUp && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">
                              FLOW UP
                            </Badge>
                          )}
                          {user.isAdmin && (
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              Admin
                            </Badge>
                          )}
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
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhum usuário encontrado com os filtros aplicados.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Mission Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Missão
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="missionName">Nome da Missão</Label>
                    <Input
                      id="missionName"
                      value={newMission.name}
                      onChange={(e) => setNewMission({ ...newMission, name: e.target.value })}
                      placeholder="Ex: Ler um capítulo da Bíblia"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="missionDescription">Descrição</Label>
                    <Textarea
                      id="missionDescription"
                      value={newMission.description}
                      onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                      placeholder="Descreva a missão..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="missionPoints">Pontos</Label>
                      <Input
                        id="missionPoints"
                        type="number"
                        value={newMission.points}
                        onChange={(e) => setNewMission({ ...newMission, points: parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <Label>Tipo</Label>
                      <Select 
                        value={newMission.type} 
                        onValueChange={(value) => setNewMission({ ...newMission, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                  </div>
                  
                  <div>
                    <Label>Público-alvo</Label>
                    <Select 
                      value={newMission.targetAudience.join(',')} 
                      onValueChange={(value) => setNewMission({ ...newMission, targetAudience: value ? [value] : [] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o público-alvo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Membro">Membro</SelectItem>
                        <SelectItem value="Líder">Líder</SelectItem>
                        <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                        <SelectItem value="Coordenador">Coordenador</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Pastor">Pastor</SelectItem>
                        <SelectItem value="Todos">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={addMission} className="w-full">
                    Adicionar Missão
                  </Button>
                </CardContent>
              </Card>

              {/* Missions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Missões Cadastradas ({missions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {missions.map((mission) => (
                      <div key={mission.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{mission.name}</h4>
                            <p className="text-sm text-gray-600">{mission.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {mission.points} pts
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {mission.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {missions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhuma missão cadastrada ainda.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Books Tab */}
          <TabsContent value="books">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Book Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Livro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bookTitle">Título do Livro</Label>
                    <Input
                      id="bookTitle"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      placeholder="Ex: Em Seus Passos"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bookAuthor">Autor</Label>
                    <Input
                      id="bookAuthor"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      placeholder="Ex: Charles Sheldon"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bookPoints">Pontos</Label>
                    <Input
                      id="bookPoints"
                      type="number"
                      value={newBook.points}
                      onChange={(e) => setNewBook({ ...newBook, points: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <Label>Público-alvo</Label>
                    <Select 
                      value={newBook.targetAudience.join(',')} 
                      onValueChange={(value) => setNewBook({ ...newBook, targetAudience: value ? [value] : [] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o público-alvo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Membro">Membro</SelectItem>
                        <SelectItem value="Líder">Líder</SelectItem>
                        <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                        <SelectItem value="Coordenador">Coordenador</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Pastor">Pastor</SelectItem>
                        <SelectItem value="Todos">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={addBook} className="w-full">
                    Adicionar Livro
                  </Button>
                </CardContent>
              </Card>

              {/* Books List */}
              <Card>
                <CardHeader>
                  <CardTitle>Livros Cadastrados ({books.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {books.map((book) => (
                      <div key={book.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{book.title}</h4>
                            <p className="text-sm text-gray-600">por {book.author}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {book.points} pts
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {books.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhum livro cadastrado ainda.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Course Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Curso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="courseName">Nome do Curso</Label>
                    <Input
                      id="courseName"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      placeholder="Ex: Fundamentos da Fé"
                    />
                  </div>
                  
                  <div>
                    <Label>Escola/Instituição</Label>
                    <Select 
                      value={newCourse.school} 
                      onValueChange={(value) => setNewCourse({ ...newCourse, school: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Escola do Discípulo">Escola do Discípulo</SelectItem>
                        <SelectItem value="Universidade da Família">Universidade da Família</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="courseDescription">Descrição</Label>
                    <Textarea
                      id="courseDescription"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      placeholder="Descreva o curso..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="coursePoints">Pontos</Label>
                    <Input
                      id="coursePoints"
                      type="number"
                      value={newCourse.points}
                      onChange={(e) => setNewCourse({ ...newCourse, points: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <Label>Público-alvo</Label>
                    <Select 
                      value={newCourse.targetAudience.join(',')} 
                      onValueChange={(value) => setNewCourse({ ...newCourse, targetAudience: value ? [value] : [] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o público-alvo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Membro">Membro</SelectItem>
                        <SelectItem value="Líder">Líder</SelectItem>
                        <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                        <SelectItem value="Coordenador">Coordenador</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Pastor">Pastor</SelectItem>
                        <SelectItem value="Todos">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={addCourse} className="w-full">
                    Adicionar Curso
                  </Button>
                </CardContent>
              </Card>

              {/* Courses List */}
              <Card>
                <CardHeader>
                  <CardTitle>Cursos Cadastrados ({courses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {courses.map((course) => (
                      <div key={course.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{course.name}</h4>
                            <p className="text-sm text-gray-600">{course.school}</p>
                            <p className="text-sm text-gray-600">{course.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {course.points} pts
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {courses.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhum curso cadastrado ainda.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add News Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Notícia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="newsTitle">Título</Label>
                    <Input
                      id="newsTitle"
                      value={newNews.title}
                      onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                      placeholder="Ex: Novo evento da FLOW"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newsDescription">Descrição</Label>
                    <Textarea
                      id="newsDescription"
                      value={newNews.description}
                      onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
                      placeholder="Descreva a notícia..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newsImage">URL da Imagem (opcional)</Label>
                    <Input
                      id="newsImage"
                      value={newNews.image}
                      onChange={(e) => setNewNews({ ...newNews, image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newsUrl">Link da Notícia (opcional)</Label>
                    <Input
                      id="newsUrl"
                      value={newNews.url}
                      onChange={(e) => setNewNews({ ...newNews, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  
                  <Button onClick={addNews} className="w-full">
                    Adicionar Notícia
                  </Button>
                </CardContent>
              </Card>

              {/* News List */}
              <Card>
                <CardHeader>
                  <CardTitle>Notícias Cadastradas ({news.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {news.map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">
                                {item.isActive ? "Ativa" : "Inativa"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {news.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhuma notícia cadastrada ainda.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
