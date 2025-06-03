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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Edit, Trash2, Search, Users, Newspaper, CheckSquare, GraduationCap, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterSpecial, setFilterSpecial] = useState("");
  
  // Mission form
  const [missionForm, setMissionForm] = useState({
    name: "",
    points: 1,
    type: "Diária",
    description: "",
    targetAudience: ["all"] as string[]
  });
  
  // News form
  const [newsForm, setNewsForm] = useState({
    title: "",
    description: "",
    image: "",
    url: "",
    targetAudience: ["all"] as string[]
  });

  // Course form
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    school: "Escola do Discípulo",
    points: 10,
    targetAudience: ["all"] as string[]
  });

  // Book form
  const [bookForm, setBookForm] = useState({
    name: "",
    author: "",
    image: "",
    points: 5,
    targetAudience: ["all"] as string[]
  });
  
  const [editingMission, setEditingMission] = useState<any>(null);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingBook, setEditingBook] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(user);
    if (!parsedUser.isAdmin) {
      navigate('/feed');
      return;
    }
    
    setCurrentUser(parsedUser);
    loadMissions();
    loadNews();
    loadCourses();
    loadBooks();
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

  const loadCourses = () => {
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(storedCourses);
  };

  const loadBooks = () => {
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(storedBooks);
  };

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  };

  const handleMissionSubmit = () => {
    if (!missionForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da missão é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const missions = JSON.parse(localStorage.getItem('missions') || '[]');
    
    if (editingMission) {
      const updatedMissions = missions.map((m: any) => 
        m.id === editingMission.id 
          ? { ...m, ...missionForm, points: Number(missionForm.points) }
          : m
      );
      localStorage.setItem('missions', JSON.stringify(updatedMissions));
      setEditingMission(null);
      toast({ title: "Missão atualizada com sucesso!" });
    } else {
      const newMission = {
        id: Date.now().toString(),
        ...missionForm,
        points: Number(missionForm.points),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      missions.push(newMission);
      localStorage.setItem('missions', JSON.stringify(missions));
      toast({ title: "Missão criada com sucesso!" });
    }
    
    setMissionForm({ name: "", points: 1, type: "Diária", description: "", targetAudience: ["all"] });
    loadMissions();
  };

  const handleCourseSubmit = () => {
    if (!courseForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do curso é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const missions = JSON.parse(localStorage.getItem('missions') || '[]');
    
    if (editingCourse) {
      const updatedCourses = courses.map((c: any) => 
        c.id === editingCourse.id ? { ...c, ...courseForm, points: Number(courseForm.points) } : c
      );
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      // Update corresponding mission
      const updatedMissions = missions.map((m: any) => 
        m.id === `course_${editingCourse.id}` 
          ? { 
              ...m, 
              name: courseForm.name,
              description: courseForm.description,
              points: Number(courseForm.points),
              targetAudience: courseForm.targetAudience,
              school: courseForm.school
            }
          : m
      );
      localStorage.setItem('missions', JSON.stringify(updatedMissions));
      
      setEditingCourse(null);
      toast({ title: "Curso atualizado com sucesso!" });
    } else {
      const newCourse = {
        id: Date.now().toString(),
        ...courseForm,
        points: Number(courseForm.points),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      courses.push(newCourse);
      localStorage.setItem('courses', JSON.stringify(courses));

      // Create corresponding mission
      const newMission = {
        id: `course_${newCourse.id}`,
        name: courseForm.name,
        points: Number(courseForm.points),
        type: 'Curso',
        description: courseForm.description,
        isActive: true,
        createdAt: new Date().toISOString(),
        targetAudience: courseForm.targetAudience,
        school: courseForm.school
      };
      missions.push(newMission);
      localStorage.setItem('missions', JSON.stringify(missions));
      
      toast({ title: "Curso criado com sucesso!" });
    }
    
    setCourseForm({ name: "", description: "", school: "Escola do Discípulo", points: 10, targetAudience: ["all"] });
    loadCourses();
    loadMissions();
  };

  const handleBookSubmit = () => {
    if (!bookForm.name.trim() || !bookForm.author.trim()) {
      toast({
        title: "Erro",
        description: "Nome e autor do livro são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const missions = JSON.parse(localStorage.getItem('missions') || '[]');
    
    if (editingBook) {
      const updatedBooks = books.map((b: any) => 
        b.id === editingBook.id ? { ...b, ...bookForm, points: Number(bookForm.points) } : b
      );
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      
      // Update corresponding mission
      const updatedMissions = missions.map((m: any) => 
        m.id === `book_${editingBook.id}` 
          ? { 
              ...m, 
              name: bookForm.name,
              description: `Livro: ${bookForm.name} por ${bookForm.author}`,
              points: Number(bookForm.points),
              targetAudience: bookForm.targetAudience,
              author: bookForm.author,
              image: bookForm.image
            }
          : m
      );
      localStorage.setItem('missions', JSON.stringify(updatedMissions));
      
      setEditingBook(null);
      toast({ title: "Livro atualizado com sucesso!" });
    } else {
      const newBook = {
        id: Date.now().toString(),
        ...bookForm,
        points: Number(bookForm.points),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      books.push(newBook);
      localStorage.setItem('books', JSON.stringify(books));

      // Create corresponding mission
      const newMission = {
        id: `book_${newBook.id}`,
        name: bookForm.name,
        points: Number(bookForm.points),
        type: 'Livro',
        description: `Livro: ${bookForm.name} por ${bookForm.author}`,
        isActive: true,
        createdAt: new Date().toISOString(),
        targetAudience: bookForm.targetAudience,
        author: bookForm.author,
        image: bookForm.image
      };
      missions.push(newMission);
      localStorage.setItem('missions', JSON.stringify(missions));
      
      toast({ title: "Livro criado com sucesso!" });
    }
    
    setBookForm({ name: "", author: "", image: "", points: 5, targetAudience: ["all"] });
    loadBooks();
    loadMissions();
  };

  const handleNewsSubmit = () => {
    if (!newsForm.title.trim()) {
      toast({
        title: "Erro",
        description: "Título da notícia é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const news = JSON.parse(localStorage.getItem('news') || '[]');
    
    if (editingNews) {
      const updatedNews = news.map((n: any) => 
        n.id === editingNews.id ? { ...n, ...newsForm } : n
      );
      localStorage.setItem('news', JSON.stringify(updatedNews));
      setEditingNews(null);
      toast({ title: "Notícia atualizada com sucesso!" });
    } else {
      const newNews = {
        id: Date.now().toString(),
        ...newsForm,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      news.push(newNews);
      localStorage.setItem('news', JSON.stringify(news));
      toast({ title: "Notícia criada com sucesso!" });
    }
    
    setNewsForm({ title: "", description: "", image: "", url: "", targetAudience: ["all"] });
    loadNews();
  };

  const deleteMission = (id: string) => {
    const missions = JSON.parse(localStorage.getItem('missions') || '[]');
    const updatedMissions = missions.filter((m: any) => m.id !== id);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    loadMissions();
    toast({ title: "Missão deletada com sucesso!" });
  };

  const toggleNewsActive = (id: string) => {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const updatedNews = news.map((n: any) => 
      n.id === id ? { ...n, isActive: !n.isActive } : n
    );
    localStorage.setItem('news', JSON.stringify(updatedNews));
    loadNews();
    toast({ title: "Status da notícia atualizado!" });
  };

  const deleteNews = (id: string) => {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const updatedNews = news.filter((n: any) => n.id !== id);
    localStorage.setItem('news', JSON.stringify(updatedNews));
    loadNews();
    toast({ title: "Notícia deletada com sucesso!" });
  };

  const deleteUser = (id: string) => {
    if (id === currentUser.id) {
      toast({
        title: "Erro",
        description: "Você não pode deletar seu próprio usuário",
        variant: "destructive"
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter((u: any) => u.id !== id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadUsers();
    toast({ title: "Usuário deletado com sucesso!" });
  };

  const toggleAudienceFilter = (audience: string, currentAudience: string[], setter: (audience: string[]) => void) => {
    if (audience === 'all') {
      setter(['all']);
    } else {
      let newAudience = currentAudience.filter(a => a !== 'all');
      if (newAudience.includes(audience)) {
        newAudience = newAudience.filter(a => a !== audience);
      } else {
        newAudience.push(audience);
      }
      if (newAudience.length === 0) {
        newAudience = ['all'];
      }
      setter(newAudience);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.whatsapp.includes(searchTerm) ||
      (user.pgmNumber && user.pgmNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === "" || user.pgmRole === filterRole;
    
    let matchesSpecial = true;
    if (filterSpecial === "flowUp") {
      matchesSpecial = user.participatesFlowUp;
    } else if (filterSpecial === "irmandade") {
      matchesSpecial = user.participatesIrmandade;
    }

    return matchesSearch && matchesRole && matchesSpecial;
  });

  const audienceOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'Participante', label: 'Participante' },
    { value: 'Líder', label: 'Líder' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Coordenador', label: 'Coordenador' },
    { value: 'Pastor de Rede', label: 'Pastor de Rede' },
    { value: 'flowUp', label: 'FLOW UP' },
    { value: 'irmandade', label: 'IRMANDADE' }
  ];

  const missionTypes = ['Diária', 'Semanal', 'Mensal', 'Semestral', 'Anual', 'Livro', 'Curso'];

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
              onClick={() => navigate('/profile')}
              className="text-purple-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar para Perfil
            </Button>
            <h1 className="text-2xl font-bold text-purple-700">Painel Administrativo</h1>
          </div>
          
          <Badge className="bg-purple-100 text-purple-800">
            Admin: {currentUser.name}
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="missions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="missions" className="flex items-center">
              <CheckSquare className="w-4 h-4 mr-2" />
              Missões
            </TabsTrigger>
            <TabsTrigger value="books" className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Livros
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center">
              <Newspaper className="w-4 h-4 mr-2" />
              Notícias
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
          </TabsList>

          {/* Books Tab */}
          <TabsContent value="books" className="space-y-6">
            {/* Add/Edit Book Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingBook ? "Editar Livro" : "Adicionar Novo Livro"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookName">Nome do Livro *</Label>
                    <Input
                      id="bookName"
                      value={bookForm.name}
                      onChange={(e) => setBookForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do livro"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bookAuthor">Autor *</Label>
                    <Input
                      id="bookAuthor"
                      value={bookForm.author}
                      onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Nome do autor"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bookImage">URL da Imagem</Label>
                    <Input
                      id="bookImage"
                      value={bookForm.image}
                      onChange={(e) => setBookForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bookPoints">Pontos *</Label>
                    <Input
                      id="bookPoints"
                      type="number"
                      min="1"
                      value={bookForm.points}
                      onChange={(e) => setBookForm(prev => ({ ...prev, points: parseInt(e.target.value) || 5 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Público Alvo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {audienceOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          checked={bookForm.targetAudience.includes(option.value)}
                          onCheckedChange={() => toggleAudienceFilter(option.value, bookForm.targetAudience, (audience) => setBookForm(prev => ({ ...prev, targetAudience: audience })))}
                        />
                        <Label className="text-sm">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleBookSubmit} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {editingBook ? "Atualizar" : "Criar"} Livro
                  </Button>
                  {editingBook && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingBook(null);
                        setBookForm({ name: "", author: "", image: "", points: 5, targetAudience: ["all"] });
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Books List */}
            <Card>
              <CardHeader>
                <CardTitle>Livros Existentes ({books.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {books.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        {book.image && (
                          <img src={book.image} alt={book.name} className="w-12 h-12 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{book.name}</h3>
                            <Badge className="bg-green-100 text-green-700">+{book.points}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">por {book.author}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingBook(book);
                            setBookForm({
                              name: book.name,
                              author: book.author,
                              image: book.image || "",
                              points: book.points,
                              targetAudience: book.targetAudience || ["all"]
                            });
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            // Delete book and corresponding mission
                            const books = JSON.parse(localStorage.getItem('books') || '[]');
                            const missions = JSON.parse(localStorage.getItem('missions') || '[]');
                            
                            const updatedBooks = books.filter((b: any) => b.id !== book.id);
                            const updatedMissions = missions.filter((m: any) => m.id !== `book_${book.id}`);
                            
                            localStorage.setItem('books', JSON.stringify(updatedBooks));
                            localStorage.setItem('missions', JSON.stringify(updatedMissions));
                            
                            loadBooks();
                            loadMissions();
                            toast({ title: "Livro deletado com sucesso!" });
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {books.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Nenhum livro cadastrado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* Add/Edit Course Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingCourse ? "Editar Curso" : "Adicionar Novo Curso"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseName">Nome *</Label>
                    <Input
                      id="courseName"
                      value={courseForm.name}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do curso"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="courseDescription">Descrição</Label>
                    <Textarea
                      id="courseDescription"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição do curso (opcional)"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseSchool">Escola *</Label>
                      <Select
                        value={courseForm.school}
                        onValueChange={(value) => setCourseForm(prev => ({ ...prev, school: value }))}
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="coursePoints">Pontos *</Label>
                      <Input
                        id="coursePoints"
                        type="number"
                        min="1"
                        value={courseForm.points}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Público Alvo</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {audienceOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={courseForm.targetAudience.includes(option.value)}
                            onCheckedChange={() => toggleAudienceFilter(option.value, courseForm.targetAudience, (audience) => setCourseForm(prev => ({ ...prev, targetAudience: audience })))}
                          />
                          <Label className="text-sm">{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleCourseSubmit} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {editingCourse ? "Atualizar" : "Criar"} Curso
                  </Button>
                  {editingCourse && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingCourse(null);
                        setCourseForm({ name: "", description: "", school: "Escola do Discípulo", points: 10, targetAudience: ["all"] });
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Courses List */}
            <Card>
              <CardHeader>
                <CardTitle>Cursos Existentes ({courses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{course.name}</h3>
                          <Badge variant="secondary">{course.school}</Badge>
                          <Badge className="bg-green-100 text-green-700">+{course.points}</Badge>
                        </div>
                        {course.description && (
                          <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {course.targetAudience.map((audience: string) => (
                            <Badge key={audience} variant="outline" className="text-xs">
                              {audienceOptions.find(opt => opt.value === audience)?.label || audience}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCourse(course);
                            setCourseForm({
                              name: course.name,
                              description: course.description || "",
                              school: course.school,
                              points: course.points,
                              targetAudience: course.targetAudience
                            });
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            // Delete course and corresponding mission
                            const courses = JSON.parse(localStorage.getItem('courses') || '[]');
                            const missions = JSON.parse(localStorage.getItem('missions') || '[]');
                            
                            const updatedCourses = courses.filter((c: any) => c.id !== course.id);
                            const updatedMissions = missions.filter((m: any) => m.id !== `course_${course.id}`);
                            
                            localStorage.setItem('courses', JSON.stringify(updatedCourses));
                            localStorage.setItem('missions', JSON.stringify(updatedMissions));
                            
                            loadCourses();
                            loadMissions();
                            toast({ title: "Curso deletado com sucesso!" });
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Nenhum curso cadastrado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions" className="space-y-6">
            {/* Add/Edit Mission Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingMission ? "Editar Missão" : "Adicionar Nova Missão"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="missionName">Nome *</Label>
                    <Input
                      id="missionName"
                      value={missionForm.name}
                      onChange={(e) => setMissionForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome da missão"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="missionPoints">Pontos *</Label>
                    <Input
                      id="missionPoints"
                      type="number"
                      min="1"
                      value={missionForm.points}
                      onChange={(e) => setMissionForm(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="missionType">Tipo *</Label>
                    <Select
                      value={missionForm.type}
                      onValueChange={(value) => setMissionForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {missionTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="missionDescription">Descrição</Label>
                    <Input
                      id="missionDescription"
                      value={missionForm.description}
                      onChange={(e) => setMissionForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição opcional"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Público Alvo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {audienceOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          checked={missionForm.targetAudience.includes(option.value)}
                          onCheckedChange={() => toggleAudienceFilter(option.value, missionForm.targetAudience, (audience) => setMissionForm(prev => ({ ...prev, targetAudience: audience })))}
                        />
                        <Label className="text-sm">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleMissionSubmit} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {editingMission ? "Atualizar" : "Criar"} Missão
                  </Button>
                  {editingMission && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingMission(null);
                        setMissionForm({ name: "", points: 1, type: "Diária", description: "", targetAudience: ["all"] });
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Missions List */}
            <Card>
              <CardHeader>
                <CardTitle>Missões Existentes ({missions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {missions.map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium">{mission.name}</h3>
                          <Badge variant="secondary">{mission.type}</Badge>
                          <Badge className="bg-green-100 text-green-700">+{mission.points}</Badge>
                        </div>
                        {mission.description && (
                          <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingMission(mission);
                            setMissionForm({
                              name: mission.name,
                              points: mission.points,
                              type: mission.type,
                              description: mission.description || "",
                              targetAudience: mission.targetAudience || ["all"]
                            });
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMission(mission.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {missions.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Nenhuma missão cadastrada</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            {/* Add/Edit News Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingNews ? "Editar Notícia" : "Adicionar Nova Notícia"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newsTitle">Título *</Label>
                    <Input
                      id="newsTitle"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título da notícia"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newsDescription">Descrição</Label>
                    <Textarea
                      id="newsDescription"
                      value={newsForm.description}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição da notícia (opcional)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newsImage">URL da Imagem</Label>
                    <Input
                      id="newsImage"
                      value={newsForm.image}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://exemplo.com/imagem.jpg (opcional)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newsUrl">URL do Link</Label>
                    <Input
                      id="newsUrl"
                      value={newsForm.url}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://exemplo.com (opcional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Público Alvo</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {audienceOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={newsForm.targetAudience.includes(option.value)}
                            onCheckedChange={() => toggleAudienceFilter(option.value, newsForm.targetAudience, (audience) => setNewsForm(prev => ({ ...prev, targetAudience: audience })))}
                          />
                          <Label className="text-sm">{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleNewsSubmit} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {editingNews ? "Atualizar" : "Criar"} Notícia
                  </Button>
                  {editingNews && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingNews(null);
                        setNewsForm({ title: "", description: "", image: "", url: "", targetAudience: ["all"] });
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* News List */}
            <Card>
              <CardHeader>
                <CardTitle>Notícias Existentes ({news.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {news.map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex space-x-3 flex-1">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{item.title}</h3>
                            <Badge variant={item.isActive ? "default" : "secondary"}>
                              {item.isActive ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                          {item.url && (
                            <p className="text-xs text-blue-600 mt-1">{item.url}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleNewsActive(item.id)}
                        >
                          {item.isActive ? "Desativar" : "Ativar"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingNews(item);
                            setNewsForm({
                              title: item.title,
                              description: item.description || "",
                              image: item.image || "",
                              url: item.url || "",
                              targetAudience: item.targetAudience || ["all"]
                            });
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteNews(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {news.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Nenhuma notícia cadastrada</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Search Users */}
            <Card>
              <CardHeader>
                <CardTitle>Buscar Usuários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, email, WhatsApp ou PGM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Filtrar por Função</Label>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as funções" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as funções</SelectItem>
                        <SelectItem value="Participante">Participante</SelectItem>
                        <SelectItem value="Líder">Líder</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Coordenador">Coordenador</SelectItem>
                        <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Filtrar por Público Alvo</Label>
                    <Select value={filterSpecial} onValueChange={setFilterSpecial}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os grupos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os grupos</SelectItem>
                        <SelectItem value="flowUp">FLOW UP</SelectItem>
                        <SelectItem value="irmandade">IRMANDADE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Usuários Cadastrados ({filteredUsers.length} de {users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.profilePhoto || ''} />
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{user.name}</h3>
                            {user.isAdmin && (
                              <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                            )}
                            {user.participatesFlowUp && (
                              <Badge className="bg-blue-100 text-blue-800">FLOW UP</Badge>
                            )}
                            {user.participatesIrmandade && (
                              <Badge className="bg-green-100 text-green-800">IRMANDADE</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>{user.email} | {user.whatsapp}</p>
                            <p>Função: {user.pgmRole}{user.pgmNumber ? ` | PGM: ${user.pgmNumber}` : ''}</p>
                            <p>Fase: {user.phase} | {user.points} pontos</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/user/${user.id}`)}
                        >
                          Ver Perfil
                        </Button>
                        {user.id !== currentUser.id && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      {searchTerm || filterRole || filterSpecial ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                    </p>
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
