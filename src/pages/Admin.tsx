import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, Users, BookOpen, GraduationCap, Target, Image, ExternalLink } from "lucide-react";
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
  
  // States for different entities
  const [users, setUsers] = useState<User[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  
  // Form states
  const [newMission, setNewMission] = useState({ name: '', description: '', points: 0, type: '', targetAudience: [] });
  const [newBook, setNewBook] = useState({ title: '', author: '', points: 0, targetAudience: [] });
  const [newCourse, setNewCourse] = useState({ name: '', school: '', description: '', points: 0, targetAudience: [] });
  const [newNews, setNewNews] = useState({ title: '', description: '', image: '', url: '', isActive: true });
  
  // Filter states
  const [userFilter, setUserFilter] = useState('todos');
  const [phaseFilter, setPhaseFilter] = useState('todos');

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
    loadNews();
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

  const loadNews = () => {
    const storedNews = JSON.parse(localStorage.getItem('news') || '[]');
    setNews(storedNews);
  };

  // CRUD operations for missions
  const createMission = () => {
    if (!newMission.name || !newMission.description || newMission.points <= 0) return;

    const mission = {
      ...newMission,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedMissions = [...missions, mission];
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    
    setNewMission({ name: '', description: '', points: 0, type: '', targetAudience: [] });
    toast({ title: "Missão criada com sucesso!" });
  };

  const deleteMission = (id: string) => {
    const updatedMissions = missions.filter(mission => mission.id !== id);
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    toast({ title: "Missão removida com sucesso!" });
  };

  // CRUD operations for books
  const createBook = () => {
    if (!newBook.title || !newBook.author || newBook.points <= 0) return;

    const book = {
      ...newBook,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedBooks = [...books, book];
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    
    setNewBook({ title: '', author: '', points: 0, targetAudience: [] });
    toast({ title: "Livro adicionado com sucesso!" });
  };

  const deleteBook = (id: string) => {
    const updatedBooks = books.filter(book => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    toast({ title: "Livro removido com sucesso!" });
  };

  // CRUD operations for courses
  const createCourse = () => {
    if (!newCourse.name || !newCourse.school || newCourse.points <= 0) return;

    const course = {
      ...newCourse,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    setNewCourse({ name: '', school: '', description: '', points: 0, targetAudience: [] });
    toast({ title: "Curso adicionado com sucesso!" });
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    toast({ title: "Curso removido com sucesso!" });
  };

  // CRUD operations for news
  const createNews = () => {
    if (!newNews.title) return;

    const newsItem = {
      ...newNews,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedNews = [...news, newsItem];
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
    
    setNewNews({ title: '', description: '', image: '', url: '', isActive: true });
    toast({ title: "Notícia criada com sucesso!" });
  };

  const deleteNews = (id: string) => {
    const updatedNews = news.filter(item => item.id !== id);
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
    toast({ title: "Notícia removida com sucesso!" });
  };

  const toggleNewsStatus = (id: string) => {
    const updatedNews = news.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
    toast({ title: "Status da notícia atualizado!" });
  };

  const filteredUsers = users.filter(user => {
    const participationMatch = 
      userFilter === 'todos' || 
      (userFilter === 'irmandade' && user.participatesIrmandade) ||
      (userFilter === 'flowup' && user.participatesFlowUp);
    
    const phaseMatch = phaseFilter === 'todos' || user.phase === phaseFilter;
    
    return participationMatch && phaseMatch;
  });

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
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
          <Badge className="bg-purple-100 text-purple-700">Admin</Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-1" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="missions">
              <Target className="w-4 h-4 mr-1" />
              Missões
            </TabsTrigger>
            <TabsTrigger value="books">
              <BookOpen className="w-4 h-4 mr-1" />
              Livros
            </TabsTrigger>
            <TabsTrigger value="courses">
              <GraduationCap className="w-4 h-4 mr-1" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="news">
              <ExternalLink className="w-4 h-4 mr-1" />
              Notícias
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gerenciar Usuários ({filteredUsers.length})</CardTitle>
                  <div className="flex space-x-2">
                    <Select value={userFilter} onValueChange={setUserFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="irmandade">Irmandade</SelectItem>
                        <SelectItem value="flowup">Flow Up</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas as Fases</SelectItem>
                        <SelectItem value="Riacho">Riacho</SelectItem>
                        <SelectItem value="Correnteza">Correnteza</SelectItem>
                        <SelectItem value="Cachoeira">Cachoeira</SelectItem>
                        <SelectItem value="Oceano">Oceano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{user.name}</h4>
                          <Badge variant="outline">{user.points} pontos</Badge>
                          <Badge variant="secondary">{user.phase}</Badge>
                          {user.isAdmin && <Badge className="bg-purple-100 text-purple-700">Admin</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex space-x-2 mt-1">
                          {user.participatesIrmandade && (
                            <Badge variant="outline" className="text-xs">Irmandade</Badge>
                          )}
                          {user.participatesFlowUp && (
                            <Badge variant="outline" className="text-xs">Flow Up</Badge>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions">
            <div className="space-y-6">
              {/* Create Mission Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Nome da missão"
                      value={newMission.name}
                      onChange={(e) => setNewMission({...newMission, name: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Pontos"
                      value={newMission.points || ''}
                      onChange={(e) => setNewMission({...newMission, points: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <Textarea
                    placeholder="Descrição da missão"
                    className="mt-4"
                    value={newMission.description}
                    onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <Select value={newMission.type} onValueChange={(value) => setNewMission({...newMission, type: value})}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Tipo de missão" />
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
                    <Button onClick={createMission}>
                      <Plus className="w-4 h-4 mr-1" />
                      Criar Missão
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Missions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Missões Criadas ({missions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {missions.map((mission) => (
                      <div key={mission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{mission.name}</h4>
                            <Badge variant="secondary">{mission.points} pontos</Badge>
                            <Badge variant="outline">{mission.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{mission.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMission(mission.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Books Tab */}
          <TabsContent value="books">
            <div className="space-y-6">
              {/* Create Book Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Novo Livro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Título do livro"
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    />
                    <Input
                      placeholder="Autor"
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Pontos"
                      value={newBook.points || ''}
                      onChange={(e) => setNewBook({...newBook, points: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={createBook}>
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Livro
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Books List */}
              <Card>
                <CardHeader>
                  <CardTitle>Livros Cadastrados ({books.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {books.map((book) => (
                      <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{book.title}</h4>
                            <Badge variant="secondary">{book.points} pontos</Badge>
                          </div>
                          <p className="text-sm text-gray-600">por {book.author}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBook(book.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="space-y-6">
              {/* Create Course Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Novo Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Nome do curso"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    />
                    <Input
                      placeholder="Escola/Plataforma"
                      value={newCourse.school}
                      onChange={(e) => setNewCourse({...newCourse, school: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Pontos"
                      value={newCourse.points || ''}
                      onChange={(e) => setNewCourse({...newCourse, points: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <Textarea
                    placeholder="Descrição do curso"
                    className="mt-4"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  />
                  <div className="flex justify-end mt-4">
                    <Button onClick={createCourse}>
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Curso
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Courses List */}
              <Card>
                <CardHeader>
                  <CardTitle>Cursos Cadastrados ({courses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{course.name}</h4>
                            <Badge variant="secondary">{course.points} pontos</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{course.school}</p>
                          {course.description && (
                            <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCourse(course.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <div className="space-y-6">
              {/* Create News Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Notícia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Título da notícia"
                      value={newNews.title}
                      onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                    />
                    <Textarea
                      placeholder="Descrição (opcional)"
                      value={newNews.description}
                      onChange={(e) => setNewNews({...newNews, description: e.target.value})}
                    />
                    <Input
                      placeholder="URL da imagem (opcional)"
                      value={newNews.image}
                      onChange={(e) => setNewNews({...newNews, image: e.target.value})}
                    />
                    <Input
                      placeholder="Link externo (opcional)"
                      value={newNews.url}
                      onChange={(e) => setNewNews({...newNews, url: e.target.value})}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={newNews.isActive}
                        onCheckedChange={(checked) => setNewNews({...newNews, isActive: !!checked})}
                      />
                      <label className="text-sm">Ativar notícia</label>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={createNews}>
                      <Plus className="w-4 h-4 mr-1" />
                      Criar Notícia
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* News List */}
              <Card>
                <CardHeader>
                  <CardTitle>Notícias Criadas ({news.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {news.map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex space-x-3 flex-1">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{item.title}</h4>
                              <Badge variant={item.isActive ? "default" : "secondary"}>
                                {item.isActive ? "Ativa" : "Inativa"}
                              </Badge>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                            {item.url && (
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline mt-1 block"
                              >
                                {item.url}
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleNewsStatus(item.id)}
                          >
                            {item.isActive ? "Desativar" : "Ativar"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNews(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
