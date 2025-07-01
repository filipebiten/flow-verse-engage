
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  BookOpen, 
  GraduationCap,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Target
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  pgm: string;
  email: string;
  phone: string;
  role: string;
  irmandade: boolean;
  flowUp: boolean;
  flowUpLevel: number;
  phase: number;
  status: 'ativo' | 'inativo';
}

interface Mission {
  id: string;
  name: string;
  description: string;
  points: number;
  frequency: string;
  targetAudience: string;
  type: string;
}

interface Book {
  id: string;
  name: string;
  author: string;
  points: number;
  type: string;
  targetAudience: string;
}

interface Course {
  id: string;
  name: string;
  school: string;
  description: string;
  points: number;
  targetAudience: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Load data from localStorage
  const [users, setUsers] = useState<User[]>(() => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    return JSON.parse(localStorage.getItem('missions') || '[]');
  });

  const [books, setBooks] = useState<Book[]>(() => {
    return JSON.parse(localStorage.getItem('books') || '[]');
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    return JSON.parse(localStorage.getItem('courses') || '[]');
  });

  // Mission form state
  const [missionForm, setMissionForm] = useState({
    name: '',
    description: '',
    points: '',
    frequency: '',
    targetAudience: '',
    type: 'mission'
  });

  // Book form state
  const [bookForm, setBookForm] = useState({
    name: '',
    author: '',
    points: '',
    type: '',
    targetAudience: ''
  });

  // Course form state
  const [courseForm, setCourseForm] = useState({
    name: '',
    school: '',
    description: '',
    points: '',
    targetAudience: ''
  });

  const handleAddMission = () => {
    if (!missionForm.name || !missionForm.points || !missionForm.frequency) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newMission = {
      id: Date.now().toString(),
      ...missionForm,
      points: parseInt(missionForm.points)
    };

    const updatedMissions = [...missions, newMission];
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));

    setMissionForm({
      name: '',
      description: '',
      points: '',
      frequency: '',
      targetAudience: '',
      type: 'mission'
    });

    toast({
      title: "Sucesso",
      description: "Missão adicionada com sucesso!"
    });
  };

  const handleAddBook = () => {
    if (!bookForm.name || !bookForm.author || !bookForm.points) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      ...bookForm,
      points: parseInt(bookForm.points)
    };

    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));

    setBookForm({
      name: '',
      author: '',
      points: '',
      type: '',
      targetAudience: ''
    });

    toast({
      title: "Sucesso",
      description: "Livro adicionado com sucesso!"
    });
  };

  const handleAddCourse = () => {
    if (!courseForm.name || !courseForm.school || !courseForm.points) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newCourse = {
      id: Date.now().toString(),
      ...courseForm,
      points: parseInt(courseForm.points)
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));

    setCourseForm({
      name: '',
      school: '',
      description: '',
      points: '',
      targetAudience: ''
    });

    toast({
      title: "Sucesso",
      description: "Curso adicionado com sucesso!"
    });
  };

  const handleDeleteMission = (id: string) => {
    const updatedMissions = missions.filter(m => m.id !== id);
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    toast({
      title: "Sucesso",
      description: "Missão removida com sucesso!"
    });
  };

  const handleDeleteBook = (id: string) => {
    const updatedBooks = books.filter(b => b.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    toast({
      title: "Sucesso",
      description: "Livro removido com sucesso!"
    });
  };

  const handleDeleteCourse = (id: string) => {
    const updatedCourses = courses.filter(c => c.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    toast({
      title: "Sucesso",
      description: "Curso removido com sucesso!"
    });
  };

  // Filter logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.pgm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesFilter = selectedFilter === 'todos' ||
      (selectedFilter === 'irmandade' && user.irmandade) ||
      (selectedFilter === 'flowup' && user.flowUp) ||
      (selectedFilter.startsWith('fase') && user.phase.toString() === selectedFilter.split('-')[1]);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-2xl flex items-center gap-2 sm:gap-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              Painel Administrativo
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto">
                <TabsTrigger value="users" className="text-xs sm:text-sm py-2 sm:py-3">
                  <Users className="w-4 h-4 mr-1 sm:mr-2" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger value="missions" className="text-xs sm:text-sm py-2 sm:py-3">
                  <Target className="w-4 h-4 mr-1 sm:mr-2" />
                  Missões
                </TabsTrigger>
                <TabsTrigger value="books" className="text-xs sm:text-sm py-2 sm:py-3">
                  <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
                  Livros
                </TabsTrigger>
                <TabsTrigger value="courses" className="text-xs sm:text-sm py-2 sm:py-3">
                  <GraduationCap className="w-4 h-4 mr-1 sm:mr-2" />
                  Cursos
                </TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users" className="p-3 sm:p-6 space-y-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar por PGM, nome, email ou telefone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                      { key: 'todos', label: 'Todos' },
                      { key: 'irmandade', label: 'Irmandade' },
                      { key: 'flowup', label: 'Flow Up' },
                      { key: 'fase-1', label: 'Fase 1' },
                      { key: 'fase-2', label: 'Fase 2' },
                      { key: 'fase-3', label: 'Fase 3' }
                    ].map((filter) => (
                      <Button
                        key={filter.key}
                        variant={selectedFilter === filter.key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedFilter(filter.key)}
                        className="whitespace-nowrap text-xs"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredUsers.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                    </Card>
                  ) : (
                    filteredUsers.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-sm">{user.name}</h3>
                              <p className="text-xs text-gray-600">{user.pgm}</p>
                            </div>
                            <Badge variant={user.status === 'ativo' ? 'default' : 'secondary'} className="text-xs">
                              {user.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Email:</span>
                              <p className="truncate">{user.email}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Telefone:</span>
                              <p>{user.phone}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {user.irmandade && <Badge variant="secondary" className="text-xs">Irmandade</Badge>}
                            {user.flowUp && <Badge variant="secondary" className="text-xs">Flow Up</Badge>}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Missions Tab */}
              <TabsContent value="missions" className="p-3 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add Mission Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Adicionar Missão
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="mission-name">Nome da Missão *</Label>
                        <Input
                          id="mission-name"
                          value={missionForm.name}
                          onChange={(e) => setMissionForm({...missionForm, name: e.target.value})}
                          placeholder="Ex: Oração Matinal"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="mission-description">Descrição</Label>
                        <Textarea
                          id="mission-description"
                          value={missionForm.description}
                          onChange={(e) => setMissionForm({...missionForm, description: e.target.value})}
                          placeholder="Descrição da missão"
                        />
                      </div>

                      <div>
                        <Label htmlFor="mission-points">Pontos *</Label>
                        <Input
                          id="mission-points"
                          type="number"
                          value={missionForm.points}
                          onChange={(e) => setMissionForm({...missionForm, points: e.target.value})}
                          placeholder="10"
                        />
                      </div>

                      <div>
                        <Label htmlFor="mission-frequency">Frequência *</Label>
                        <Select value={missionForm.frequency} onValueChange={(value) => setMissionForm({...missionForm, frequency: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a frequência" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Diária">Diária</SelectItem>
                            <SelectItem value="Semanal">Semanal</SelectItem>
                            <SelectItem value="Mensal">Mensal</SelectItem>
                            <SelectItem value="Semestral">Semestral</SelectItem>
                            <SelectItem value="Anual">Anual</SelectItem>
                            <SelectItem value="Especial">Especial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="mission-audience">Público Alvo</Label>
                        <Select value={missionForm.targetAudience} onValueChange={(value) => setMissionForm({...missionForm, targetAudience: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o público" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Irmandade">Irmandade</SelectItem>
                            <SelectItem value="Flow Up">Flow Up</SelectItem>
                            <SelectItem value="Líderes">Líderes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={handleAddMission} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
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
                        {missions.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">Nenhuma missão cadastrada</p>
                        ) : (
                          missions.map((mission) => (
                            <div key={mission.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{mission.name}</h4>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">{mission.frequency}</Badge>
                                  <Badge variant="secondary" className="text-xs">{mission.points} pts</Badge>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteMission(mission.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Books Tab */}
              <TabsContent value="books" className="p-3 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add Book Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Adicionar Livro
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="book-name">Nome do Livro *</Label>
                        <Input
                          id="book-name"
                          value={bookForm.name}
                          onChange={(e) => setBookForm({...bookForm, name: e.target.value})}
                          placeholder="Ex: Livro da Vida"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="book-author">Autor *</Label>
                        <Input
                          id="book-author"
                          value={bookForm.author}
                          onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                          placeholder="Nome do autor"
                        />
                      </div>

                      <div>
                        <Label htmlFor="book-points">Pontos *</Label>
                        <Input
                          id="book-points"
                          type="number"
                          value={bookForm.points}
                          onChange={(e) => setBookForm({...bookForm, points: e.target.value})}
                          placeholder="50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="book-type">Tipo</Label>
                        <Input
                          id="book-type"
                          value={bookForm.type}
                          onChange={(e) => setBookForm({...bookForm, type: e.target.value})}
                          placeholder="Ex: Espiritual, Biografia"
                        />
                      </div>

                      <div>
                        <Label htmlFor="book-audience">Público Alvo</Label>
                        <Select value={bookForm.targetAudience} onValueChange={(value) => setBookForm({...bookForm, targetAudience: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o público" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Irmandade">Irmandade</SelectItem>
                            <SelectItem value="Flow Up">Flow Up</SelectItem>
                            <SelectItem value="Líderes">Líderes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={handleAddBook} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
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
                        {books.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">Nenhum livro cadastrado</p>
                        ) : (
                          books.map((book) => (
                            <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{book.name}</h4>
                                <p className="text-xs text-gray-600">{book.author}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">{book.points} pts</Badge>
                                  {book.type && <Badge variant="outline" className="text-xs">{book.type}</Badge>}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteBook(book.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="p-3 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add Course Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Adicionar Curso
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="course-name">Nome do Curso *</Label>
                        <Input
                          id="course-name"
                          value={courseForm.name}
                          onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                          placeholder="Ex: Fundamentos da Fé"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="course-school">Escola *</Label>
                        <Select value={courseForm.school} onValueChange={(value) => setCourseForm({...courseForm, school: value})}>
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
                        <Label htmlFor="course-description">Descrição</Label>
                        <Textarea
                          id="course-description"
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                          placeholder="Descrição do curso"
                        />
                      </div>

                      <div>
                        <Label htmlFor="course-points">Pontos *</Label>
                        <Input
                          id="course-points"
                          type="number"
                          value={courseForm.points}
                          onChange={(e) => setCourseForm({...courseForm, points: e.target.value})}
                          placeholder="100"
                        />
                      </div>

                      <div>
                        <Label htmlFor="course-audience">Público Alvo</Label>
                        <Select value={courseForm.targetAudience} onValueChange={(value) => setCourseForm({...courseForm, targetAudience: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o público" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Irmandade">Irmandade</SelectItem>
                            <SelectItem value="Flow Up">Flow Up</SelectItem>
                            <SelectItem value="Líderes">Líderes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={handleAddCourse} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
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
                        {courses.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">Nenhum curso cadastrado</p>
                        ) : (
                          courses.map((course) => (
                            <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{course.name}</h4>
                                <p className="text-xs text-gray-600">{course.school}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">{course.points} pts</Badge>
                                  {course.targetAudience && <Badge variant="outline" className="text-xs">{course.targetAudience}</Badge>}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
