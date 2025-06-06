
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, BookOpen, GraduationCap, CheckSquare, Search } from "lucide-react";
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
  createdAt: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  points: number;
  targetAudience: string[];
  createdAt: string;
  imageUrl?: string;
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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Filters and search
  const [participationFilter, setParticipationFilter] = useState('Todos');
  const [phaseFilter, setPhaseFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [newMission, setNewMission] = useState({
    name: '',
    description: '',
    points: 0,
    type: 'Missões Diárias',
    targetAudience: [] as string[]
  });

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    points: 0,
    targetAudience: [] as string[],
    imageUrl: ''
  });

  const [newCourse, setNewCourse] = useState({
    name: '',
    school: 'Escola do Discípulo',
    description: '',
    points: 0,
    targetAudience: [] as string[]
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
    loadUsers();
    loadMissions();
    loadBooks();
    loadCourses();
  }, [navigate]);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  };

  const loadMissions = () => {
    const storedMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    setMissions(storedMissions);
  };

  const loadBooks = () => {
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(storedBooks);
  };

  const loadCourses = () => {
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(storedCourses);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.whatsapp.includes(searchTerm) ||
      user.pgmNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesParticipation = participationFilter === 'Todos' ||
      (participationFilter === 'Irmandade' && user.participatesIrmandade) ||
      (participationFilter === 'Flow Up' && user.participatesFlowUp);

    const matchesPhase = phaseFilter === 'Todas' || user.phase === phaseFilter;

    return matchesSearch && matchesParticipation && matchesPhase;
  });

  const createMission = () => {
    if (!newMission.name || !newMission.description) {
      toast({
        title: "Erro",
        description: "Nome e descrição são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const mission: Mission = {
      id: Date.now().toString(),
      ...newMission,
      createdAt: new Date().toISOString()
    };

    const updatedMissions = [...missions, mission];
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));

    setNewMission({
      name: '',
      description: '',
      points: 0,
      type: 'Missões Diárias',
      targetAudience: []
    });

    toast({
      title: "Missão criada!",
      description: "A nova missão foi adicionada com sucesso."
    });
  };

  const createBook = () => {
    if (!newBook.title || !newBook.author) {
      toast({
        title: "Erro",
        description: "Título e autor são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const book: Book = {
      id: Date.now().toString(),
      ...newBook,
      createdAt: new Date().toISOString()
    };

    const updatedBooks = [...books, book];
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));

    setNewBook({
      title: '',
      author: '',
      points: 0,
      targetAudience: [],
      imageUrl: ''
    });

    toast({
      title: "Livro adicionado!",
      description: "O novo livro foi adicionado com sucesso."
    });
  };

  const createCourse = () => {
    if (!newCourse.name || !newCourse.description) {
      toast({
        title: "Erro",
        description: "Nome e descrição são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
      createdAt: new Date().toISOString()
    };

    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));

    setNewCourse({
      name: '',
      school: 'Escola do Discípulo',
      description: '',
      points: 0,
      targetAudience: []
    });

    toast({
      title: "Curso criado!",
      description: "O novo curso foi adicionado com sucesso."
    });
  };

  const deleteMission = (id: string) => {
    const updatedMissions = missions.filter(m => m.id !== id);
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    
    toast({
      title: "Missão removida",
      description: "A missão foi removida com sucesso."
    });
  };

  const deleteBook = (id: string) => {
    const updatedBooks = books.filter(b => b.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    
    toast({
      title: "Livro removido",
      description: "O livro foi removido com sucesso."
    });
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(c => c.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    toast({
      title: "Curso removido",
      description: "O curso foi removido com sucesso."
    });
  };

  const handleTargetAudienceChange = (value: string, setter: any, currentValues: string[]) => {
    if (currentValues.includes(value)) {
      setter((prev: any) => ({
        ...prev,
        targetAudience: currentValues.filter(v => v !== value)
      }));
    } else {
      setter((prev: any) => ({
        ...prev,
        targetAudience: [...currentValues, value]
      }));
    }
  };

  if (!currentUser?.isAdmin) return null;

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="missions">Missões</TabsTrigger>
            <TabsTrigger value="books">Livros</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Gerenciar Usuários ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="flex space-x-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="search">Pesquisar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Nome, email, telefone ou PGM..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="participation">Participação</Label>
                    <Select value={participationFilter} onValueChange={setParticipationFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos</SelectItem>
                        <SelectItem value="Irmandade">Irmandade</SelectItem>
                        <SelectItem value="Flow Up">Flow Up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phase">Fase</Label>
                    <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todas">Todas</SelectItem>
                        <SelectItem value="Riacho">Riacho</SelectItem>
                        <SelectItem value="Correnteza">Correnteza</SelectItem>
                        <SelectItem value="Cachoeira">Cachoeira</SelectItem>
                        <SelectItem value="Oceano">Oceano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex-1">
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.pgmRole} {user.pgmNumber}</p>
                        <p className="text-sm text-gray-600">WhatsApp: {user.whatsapp}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{user.points} pts</Badge>
                        <Badge variant="outline">{user.phase}</Badge>
                        {user.participatesIrmandade && (
                          <Badge className="bg-blue-100 text-blue-800">Irmandade</Badge>
                        )}
                        {user.participatesFlowUp && (
                          <Badge className="bg-orange-100 text-orange-800">Flow Up</Badge>
                        )}
                        {user.isAdmin && (
                          <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missions">
            <div className="space-y-6">
              {/* Create Mission Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Missão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mission-name">Nome da Missão</Label>
                      <Input
                        id="mission-name"
                        value={newMission.name}
                        onChange={(e) => setNewMission(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Oração matinal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mission-points">Pontos</Label>
                      <Input
                        id="mission-points"
                        type="number"
                        value={newMission.points}
                        onChange={(e) => setNewMission(prev => ({ ...prev, points: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mission-description">Descrição</Label>
                    <Textarea
                      id="mission-description"
                      value={newMission.description}
                      onChange={(e) => setNewMission(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva a missão..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="mission-type">Tipo de Missão</Label>
                    <Select 
                      value={newMission.type} 
                      onValueChange={(value) => setNewMission(prev => ({ ...prev, type: value }))}
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

                  <div>
                    <Label>Público-alvo</Label>
                    <div className="flex space-x-2 mt-2">
                      {['Todos', 'Membros', 'Líderes', 'Supervisores', 'Coordenadores', 'Pastores'].map((audience) => (
                        <Button
                          key={audience}
                          variant={newMission.targetAudience.includes(audience) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTargetAudienceChange(audience, setNewMission, newMission.targetAudience)}
                        >
                          {audience}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={createMission} className="w-full">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Criar Missão
                  </Button>
                </CardContent>
              </Card>

              {/* Missions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Missões Existentes ({missions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {missions.map((mission) => (
                      <div key={mission.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex-1">
                          <h4 className="font-medium">{mission.name}</h4>
                          <p className="text-sm text-gray-600">{mission.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{mission.points} pontos</Badge>
                            <Badge variant="outline">{mission.type}</Badge>
                            {mission.targetAudience.map((audience) => (
                              <Badge key={audience} variant="outline" className="text-xs">
                                {audience}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMission(mission.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="books">
            <div className="space-y-6">
              {/* Create Book Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Novo Livro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="book-title">Título do Livro</Label>
                      <Input
                        id="book-title"
                        value={newBook.title}
                        onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: O Peregrino"
                      />
                    </div>
                    <div>
                      <Label htmlFor="book-author">Autor</Label>
                      <Input
                        id="book-author"
                        value={newBook.author}
                        onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Ex: John Bunyan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="book-points">Pontos</Label>
                      <Input
                        id="book-points"
                        type="number"
                        value={newBook.points}
                        onChange={(e) => setNewBook(prev => ({ ...prev, points: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="book-image">URL da Imagem</Label>
                      <Input
                        id="book-image"
                        value={newBook.imageUrl}
                        onChange={(e) => setNewBook(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Público-alvo</Label>
                    <div className="flex space-x-2 mt-2">
                      {['Todos', 'Membros', 'Líderes', 'Supervisores', 'Coordenadores', 'Pastores'].map((audience) => (
                        <Button
                          key={audience}
                          variant={newBook.targetAudience.includes(audience) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTargetAudienceChange(audience, setNewBook, newBook.targetAudience)}
                        >
                          {audience}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={createBook} className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Adicionar Livro
                  </Button>
                </CardContent>
              </Card>

              {/* Books List */}
              <Card>
                <CardHeader>
                  <CardTitle>Livros Existentes ({books.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {books.map((book) => (
                      <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex items-center space-x-3 flex-1">
                          {book.imageUrl && (
                            <img src={book.imageUrl} alt={book.title} className="w-12 h-16 object-cover rounded" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium">{book.title}</h4>
                            <p className="text-sm text-gray-600">por {book.author}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary">{book.points} pontos</Badge>
                              {book.targetAudience.map((audience) => (
                                <Badge key={audience} variant="outline" className="text-xs">
                                  {audience}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBook(book.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="space-y-6">
              {/* Create Course Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Criar Novo Curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="course-name">Nome do Curso</Label>
                      <Input
                        id="course-name"
                        value={newCourse.name}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Fundamentos da Fé"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-school">Escola/Plataforma</Label>
                      <Select 
                        value={newCourse.school} 
                        onValueChange={(value) => setNewCourse(prev => ({ ...prev, school: value }))}
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
                  </div>

                  <div>
                    <Label htmlFor="course-description">Descrição</Label>
                    <Textarea
                      id="course-description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o curso..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="course-points">Pontos</Label>
                    <Input
                      id="course-points"
                      type="number"
                      value={newCourse.points}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, points: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label>Público-alvo</Label>
                    <div className="flex space-x-2 mt-2">
                      {['Todos', 'Membros', 'Líderes', 'Supervisores', 'Coordenadores', 'Pastores'].map((audience) => (
                        <Button
                          key={audience}
                          variant={newCourse.targetAudience.includes(audience) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTargetAudienceChange(audience, setNewCourse, newCourse.targetAudience)}
                        >
                          {audience}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={createCourse} className="w-full">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Criar Curso
                  </Button>
                </CardContent>
              </Card>

              {/* Courses List */}
              <Card>
                <CardHeader>
                  <CardTitle>Cursos Existentes ({courses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex-1">
                          <h4 className="font-medium">{course.name}</h4>
                          <p className="text-sm text-gray-600">{course.school}</p>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{course.points} pontos</Badge>
                            {course.targetAudience.map((audience) => (
                              <Badge key={audience} variant="outline" className="text-xs">
                                {audience}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCourse(course.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
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
