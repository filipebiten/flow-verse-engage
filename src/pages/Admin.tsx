import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react";
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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Mission states
  const [missions, setMissions] = useState<any[]>([]);
  const [missionForm, setMissionForm] = useState({
    name: '',
    description: '',
    points: '',
    type: '',
    targetAudience: [] as string[]
  });
  const [editingMission, setEditingMission] = useState<any>(null);

  // News states
  const [news, setNews] = useState<any[]>([]);
  const [newsForm, setNewsForm] = useState({
    title: '',
    description: '',
    image: '',
    url: '',
    isActive: true
  });
  const [editingNews, setEditingNews] = useState<any>(null);

  // Book states
  const [books, setBooks] = useState<any[]>([]);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    points: '',
    targetAudience: [] as string[]
  });
  const [editingBook, setEditingBook] = useState<any>(null);

  // Course states
  const [courses, setCourses] = useState<any[]>([]);
  const [courseForm, setCourseForm] = useState({
    name: '',
    school: '',
    description: '',
    points: '',
    targetAudience: [] as string[]
  });
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // User search states
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [pgmRoleFilter, setPgmRoleFilter] = useState('all');
  const [irmandadeFilter, setIrmandadeFilter] = useState('all');
  const [flowUpFilter, setFlowUpFilter] = useState('all');
  const [phaseFilter, setPhaseFilter] = useState('all');

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
  const saveMission = () => {
    if (!missionForm.name || !missionForm.points || !missionForm.type) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const mission = {
      id: editingMission?.id || Date.now().toString(),
      ...missionForm,
      points: parseInt(missionForm.points),
      createdAt: editingMission?.createdAt || new Date().toISOString()
    };

    let updatedMissions;
    if (editingMission) {
      updatedMissions = missions.map(m => m.id === editingMission.id ? mission : m);
    } else {
      updatedMissions = [...missions, mission];
    }

    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    
    setMissionForm({ name: '', description: '', points: '', type: '', targetAudience: [] });
    setEditingMission(null);
    
    toast({
      title: editingMission ? "Missão atualizada" : "Missão criada",
      description: "A missão foi salva com sucesso!"
    });
  };

  const deleteMission = (id: string) => {
    const updatedMissions = missions.filter(m => m.id !== id);
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    toast({
      title: "Missão removida",
      description: "A missão foi removida com sucesso!"
    });
  };

  // News functions
  const saveNews = () => {
    if (!newsForm.title) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o título da notícia.",
        variant: "destructive"
      });
      return;
    }

    const newsItem = {
      id: editingNews?.id || Date.now().toString(),
      ...newsForm,
      createdAt: editingNews?.createdAt || new Date().toISOString()
    };

    let updatedNews;
    if (editingNews) {
      updatedNews = news.map(n => n.id === editingNews.id ? newsItem : n);
    } else {
      updatedNews = [...news, newsItem];
    }

    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
    
    setNewsForm({ title: '', description: '', image: '', url: '', isActive: true });
    setEditingNews(null);
    
    toast({
      title: editingNews ? "Notícia atualizada" : "Notícia criada",
      description: "A notícia foi salva com sucesso!"
    });
  };

  const deleteNews = (id: string) => {
    const updatedNews = news.filter(n => n.id !== id);
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
    toast({
      title: "Notícia removida",
      description: "A notícia foi removida com sucesso!"
    });
  };

  // Book functions
  const saveBook = () => {
    if (!bookForm.title || !bookForm.points) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const book = {
      id: editingBook?.id || Date.now().toString(),
      ...bookForm,
      points: parseInt(bookForm.points),
      createdAt: editingBook?.createdAt || new Date().toISOString()
    };

    let updatedBooks;
    if (editingBook) {
      updatedBooks = books.map(b => b.id === editingBook.id ? book : b);
    } else {
      updatedBooks = [...books, book];
    }

    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    
    setBookForm({ title: '', author: '', points: '', targetAudience: [] });
    setEditingBook(null);
    
    toast({
      title: editingBook ? "Livro atualizado" : "Livro adicionado",
      description: "O livro foi salvo com sucesso!"
    });
  };

  const deleteBook = (id: string) => {
    const updatedBooks = books.filter(b => b.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    toast({
      title: "Livro removido",
      description: "O livro foi removido com sucesso!"
    });
  };

  // Course functions
  const saveCourse = () => {
    if (!courseForm.name || !courseForm.points) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const course = {
      id: editingCourse?.id || Date.now().toString(),
      ...courseForm,
      points: parseInt(courseForm.points),
      createdAt: editingCourse?.createdAt || new Date().toISOString()
    };

    let updatedCourses;
    if (editingCourse) {
      updatedCourses = courses.map(c => c.id === editingCourse.id ? course : c);
    } else {
      updatedCourses = [...courses, course];
    }

    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    setCourseForm({ name: '', school: '', description: '', points: '', targetAudience: [] });
    setEditingCourse(null);
    
    toast({
      title: editingCourse ? "Curso atualizado" : "Curso adicionado",
      description: "O curso foi salvo com sucesso!"
    });
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(c => c.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    toast({
      title: "Curso removido",
      description: "O curso foi removido com sucesso!"
    });
  };

  // Helper functions
  const handleTargetAudienceChange = (value: string, currentAudience: string[], setForm: any) => {
    const newAudience = currentAudience.includes(value)
      ? currentAudience.filter(item => item !== value)
      : [...currentAudience, value];
    setForm((prev: any) => ({ ...prev, targetAudience: newAudience }));
  };

  // Filtering users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.whatsapp.includes(searchTerm) ||
      user.pgmNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === 'all' || user.gender === genderFilter;
    const matchesPgmRole = pgmRoleFilter === 'all' || user.pgmRole === pgmRoleFilter;
    const matchesIrmandade = irmandadeFilter === 'all' || 
      (irmandadeFilter === 'sim' && user.participatesIrmandade) ||
      (irmandadeFilter === 'nao' && !user.participatesIrmandade);
    const matchesFlowUp = flowUpFilter === 'all' || 
      (flowUpFilter === 'sim' && user.participatesFlowUp) ||
      (flowUpFilter === 'nao' && !user.participatesFlowUp);

    const userPhase = getUserPhase(user.points);
    const matchesPhase = phaseFilter === 'all' || userPhase.name === phaseFilter;

    return matchesSearch && matchesGender && matchesPgmRole && matchesIrmandade && matchesFlowUp && matchesPhase;
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
            <h1 className="text-2xl font-bold text-purple-700">Painel Administrativo</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="missions" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="missions">Missões</TabsTrigger>
            <TabsTrigger value="books">Livros</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          {/* Missions Tab */}
          <TabsContent value="missions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add/Edit Mission Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingMission ? 'Editar Missão' : 'Nova Missão'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Nome da missão"
                    value={missionForm.name}
                    onChange={(e) => setMissionForm({...missionForm, name: e.target.value})}
                  />
                  <Textarea
                    placeholder="Descrição da missão"
                    value={missionForm.description}
                    onChange={(e) => setMissionForm({...missionForm, description: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Pontos"
                    value={missionForm.points}
                    onChange={(e) => setMissionForm({...missionForm, points: e.target.value})}
                  />
                  <Select value={missionForm.type} onValueChange={(value) => setMissionForm({...missionForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo da missão" />
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
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Público Alvo:</p>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'Líder', 'Membro', 'Pastor de Rede', 'Coordenador', 'Supervisor', 'flowUp', 'irmandade'].map((audience) => (
                        <div key={audience} className="flex items-center space-x-2">
                          <Checkbox
                            checked={missionForm.targetAudience.includes(audience)}
                            onCheckedChange={() => handleTargetAudienceChange(audience, missionForm.targetAudience, setMissionForm)}
                          />
                          <label className="text-sm">
                            {audience === 'all' ? 'Todos' : 
                             audience === 'flowUp' ? 'Flow Up' : 
                             audience === 'irmandade' ? 'Irmandade' : audience}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={saveMission} className="flex-1">
                      {editingMission ? 'Atualizar' : 'Criar'} Missão
                    </Button>
                    {editingMission && (
                      <Button variant="outline" onClick={() => {
                        setEditingMission(null);
                        setMissionForm({ name: '', description: '', points: '', type: '', targetAudience: [] });
                      }}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Missions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Missões Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {missions.map((mission) => (
                      <div key={mission.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <h4 className="font-medium">{mission.name}</h4>
                          <p className="text-sm text-gray-600">{mission.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{mission.type}</Badge>
                            <Badge className="bg-green-100 text-green-700">+{mission.points} pontos</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingMission(mission);
                              setMissionForm({
                                name: mission.name,
                                description: mission.description,
                                points: mission.points.toString(),
                                type: mission.type,
                                targetAudience: mission.targetAudience || []
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMission(mission.id)}
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

          {/* Books Tab */}
          <TabsContent value="books">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add/Edit Book Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingBook ? 'Editar Livro' : 'Novo Livro'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Título do livro"
                    value={bookForm.title}
                    onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                  />
                  <Input
                    placeholder="Autor"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Pontos"
                    value={bookForm.points}
                    onChange={(e) => setBookForm({...bookForm, points: e.target.value})}
                  />
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Público Alvo:</p>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'Líder', 'Membro', 'Pastor de Rede', 'Coordenador', 'Supervisor', 'flowUp', 'irmandade'].map((audience) => (
                        <div key={audience} className="flex items-center space-x-2">
                          <Checkbox
                            checked={bookForm.targetAudience.includes(audience)}
                            onCheckedChange={() => handleTargetAudienceChange(audience, bookForm.targetAudience, setBookForm)}
                          />
                          <label className="text-sm">
                            {audience === 'all' ? 'Todos' : 
                             audience === 'flowUp' ? 'Flow Up' : 
                             audience === 'irmandade' ? 'Irmandade' : audience}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={saveBook} className="flex-1">
                      {editingBook ? 'Atualizar' : 'Adicionar'} Livro
                    </Button>
                    {editingBook && (
                      <Button variant="outline" onClick={() => {
                        setEditingBook(null);
                        setBookForm({ title: '', author: '', points: '', targetAudience: [] });
                      }}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Books List */}
              <Card>
                <CardHeader>
                  <CardTitle>Livros Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {books.map((book) => (
                      <div key={book.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <h4 className="font-medium">{book.title}</h4>
                          {book.author && <p className="text-sm text-gray-600">por {book.author}</p>}
                          <Badge className="bg-green-100 text-green-700">+{book.points} pontos</Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingBook(book);
                              setBookForm({
                                title: book.title,
                                author: book.author || '',
                                points: book.points.toString(),
                                targetAudience: book.targetAudience || []
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteBook(book.id)}
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

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add/Edit Course Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingCourse ? 'Editar Curso' : 'Novo Curso'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Nome do curso"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                  />
                  <Select value={courseForm.school} onValueChange={(value) => setCourseForm({...courseForm, school: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escola/Instituição" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Escola do Discípulo">Escola do Discípulo</SelectItem>
                      <SelectItem value="Universidade da Família">Universidade da Família</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Descrição do curso"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Pontos"
                    value={courseForm.points}
                    onChange={(e) => setCourseForm({...courseForm, points: e.target.value})}
                  />
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Público Alvo:</p>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'Líder', 'Membro', 'Pastor de Rede', 'Coordenador', 'Supervisor', 'flowUp', 'irmandade'].map((audience) => (
                        <div key={audience} className="flex items-center space-x-2">
                          <Checkbox
                            checked={courseForm.targetAudience.includes(audience)}
                            onCheckedChange={() => handleTargetAudienceChange(audience, courseForm.targetAudience, setCourseForm)}
                          />
                          <label className="text-sm">
                            {audience === 'all' ? 'Todos' : 
                             audience === 'flowUp' ? 'Flow Up' : 
                             audience === 'irmandade' ? 'Irmandade' : audience}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={saveCourse} className="flex-1">
                      {editingCourse ? 'Atualizar' : 'Adicionar'} Curso
                    </Button>
                    {editingCourse && (
                      <Button variant="outline" onClick={() => {
                        setEditingCourse(null);
                        setCourseForm({ name: '', school: '', description: '', points: '', targetAudience: [] });
                      }}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Courses List */}
              <Card>
                <CardHeader>
                  <CardTitle>Cursos Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <h4 className="font-medium">{course.name}</h4>
                          {course.school && <p className="text-sm text-gray-600">{course.school}</p>}
                          {course.description && <p className="text-xs text-gray-500">{course.description}</p>}
                          <Badge className="bg-green-100 text-green-700">+{course.points} pontos</Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCourse(course);
                              setCourseForm({
                                name: course.name,
                                school: course.school || '',
                                description: course.description || '',
                                points: course.points.toString(),
                                targetAudience: course.targetAudience || []
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCourse(course.id)}
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

          {/* News Tab */}
          <TabsContent value="news">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add/Edit News Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingNews ? 'Editar Notícia' : 'Nova Notícia'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Título da notícia"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Descrição"
                    value={newsForm.description}
                    onChange={(e) => setNewsForm({...newsForm, description: e.target.value})}
                  />
                  <Input
                    placeholder="URL da imagem (opcional)"
                    value={newsForm.image}
                    onChange={(e) => setNewsForm({...newsForm, image: e.target.value})}
                  />
                  <Input
                    placeholder="Link externo (opcional)"
                    value={newsForm.url}
                    onChange={(e) => setNewsForm({...newsForm, url: e.target.value})}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={newsForm.isActive}
                      onCheckedChange={(checked) => setNewsForm({...newsForm, isActive: !!checked})}
                    />
                    <label className="text-sm">Notícia ativa</label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={saveNews} className="flex-1">
                      {editingNews ? 'Atualizar' : 'Criar'} Notícia
                    </Button>
                    {editingNews && (
                      <Button variant="outline" onClick={() => {
                        setEditingNews(null);
                        setNewsForm({ title: '', description: '', image: '', url: '', isActive: true });
                      }}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* News List */}
              <Card>
                <CardHeader>
                  <CardTitle>Notícias Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {news.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                          <Badge variant={item.isActive ? "default" : "secondary"}>
                            {item.isActive ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingNews(item);
                              setNewsForm({
                                title: item.title,
                                description: item.description || '',
                                image: item.image || '',
                                url: item.url || '',
                                isActive: item.isActive
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNews(item.id)}
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

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Pesquisar Usuários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search and Filters */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Pesquisar por nome, email, WhatsApp ou PGM..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os gêneros</SelectItem>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={pgmRoleFilter} onValueChange={setPgmRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="PGM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os PGMs</SelectItem>
                        <SelectItem value="Líder">Líder</SelectItem>
                        <SelectItem value="Membro">Membro</SelectItem>
                        <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                        <SelectItem value="Coordenador">Coordenador</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={irmandadeFilter} onValueChange={setIrmandadeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Irmandade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="sim">Participa</SelectItem>
                        <SelectItem value="nao">Não participa</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={flowUpFilter} onValueChange={setFlowUpFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Flow Up" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="sim">Participa</SelectItem>
                        <SelectItem value="nao">Não participa</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Fase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as fases</SelectItem>
                        <SelectItem value="Riacho">🌀 Riacho</SelectItem>
                        <SelectItem value="Correnteza">🌊 Correnteza</SelectItem>
                        <SelectItem value="Cachoeira">💥 Cachoeira</SelectItem>
                        <SelectItem value="Oceano">🌌 Oceano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {filteredUsers.length} usuário(s) encontrado(s)
                  </p>
                  
                  {filteredUsers.map((user) => {
                    const userPhase = getUserPhase(user.points);
                    return (
                      <Card key={user.id} className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar 
                            className="w-12 h-12 cursor-pointer"
                            onClick={() => navigate(`/user/${user.id}`)}
                          >
                            <AvatarImage src={user.profilePhoto || ''} />
                            <AvatarFallback className="bg-purple-100 text-purple-700">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-800">{user.name}</h3>
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                {user.points} pontos
                              </Badge>
                              <Badge className="bg-purple-100 text-purple-800">
                                {userPhase.icon} {userPhase.name}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Email: {user.email}</p>
                              <p>WhatsApp: {user.whatsapp}</p>
                              <p>PGM: {user.pgmRole} {user.pgmNumber}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline">{user.gender}</Badge>
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
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/user/${user.id}`)}
                          >
                            Ver Perfil
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhum usuário encontrado com os filtros aplicados.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
