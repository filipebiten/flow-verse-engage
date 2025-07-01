
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Target, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Trash2,
  UserPlus,
  Shield
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  
  // Form states
  const [missionForm, setMissionForm] = useState({
    name: '', description: '', points: '', category: '', difficulty: 'easy', period: ''
  });
  const [bookForm, setBookForm] = useState({
    name: '', description: '', points: '', category: '', difficulty: 'easy'
  });
  const [courseForm, setCourseForm] = useState({
    name: '', description: '', points: '', category: '', difficulty: 'easy'
  });
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = () => {
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
    setMissions(JSON.parse(localStorage.getItem('missions') || '[]'));
    setBooks(JSON.parse(localStorage.getItem('books') || '[]'));
    setCourses(JSON.parse(localStorage.getItem('courses') || '[]'));
  };

  const addMission = () => {
    if (!missionForm.name || !missionForm.description || !missionForm.points) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const newMission = {
      id: Date.now().toString(),
      ...missionForm,
      points: parseInt(missionForm.points),
      type: 'mission'
    };

    const updatedMissions = [...missions, newMission];
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    
    setMissionForm({ name: '', description: '', points: '', category: '', difficulty: 'easy', period: '' });
    toast({ title: "Sucesso", description: "Missão adicionada com sucesso!" });
  };

  const addBook = () => {
    if (!bookForm.name || !bookForm.description || !bookForm.points) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      ...bookForm,
      points: parseInt(bookForm.points),
      type: 'book'
    };

    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    
    setBookForm({ name: '', description: '', points: '', category: '', difficulty: 'easy' });
    toast({ title: "Sucesso", description: "Livro adicionado com sucesso!" });
  };

  const addCourse = () => {
    if (!courseForm.name || !courseForm.description || !courseForm.points) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const newCourse = {
      id: Date.now().toString(),
      ...courseForm,
      points: parseInt(courseForm.points),
      type: 'course'
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    setCourseForm({ name: '', description: '', points: '', category: '', difficulty: 'easy' });
    toast({ title: "Sucesso", description: "Curso adicionado com sucesso!" });
  };

  const deleteItem = (id: string, type: 'missions' | 'books' | 'courses') => {
    let updatedItems: any[] = [];
    let currentItems: any[] = [];
    
    switch (type) {
      case 'missions':
        currentItems = missions;
        updatedItems = missions.filter(item => item.id !== id);
        setMissions(updatedItems);
        break;
      case 'books':
        currentItems = books;
        updatedItems = books.filter(item => item.id !== id);
        setBooks(updatedItems);
        break;
      case 'courses':
        currentItems = courses;
        updatedItems = courses.filter(item => item.id !== id);
        setCourses(updatedItems);
        break;
    }
    
    localStorage.setItem(type, JSON.stringify(updatedItems));
    toast({ title: "Sucesso", description: "Item removido com sucesso!" });
  };

  const addAdmin = () => {
    if (!adminEmail) {
      toast({ title: "Erro", description: "Digite um email válido", variant: "destructive" });
      return;
    }

    const userToPromote = users.find(user => user.email === adminEmail);
    if (!userToPromote) {
      toast({ title: "Erro", description: "Usuário não encontrado", variant: "destructive" });
      return;
    }

    if (userToPromote.isAdmin) {
      toast({ title: "Aviso", description: "Este usuário já é administrador", variant: "destructive" });
      return;
    }

    const updatedUsers = users.map(user => 
      user.email === adminEmail ? { ...user, isAdmin: true } : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setAdminEmail('');
    
    toast({ title: "Sucesso", description: `${userToPromote.name} agora é administrador!` });
  };

  const renderForm = (title: string, form: any, setForm: any, onSubmit: any, fields: any[]) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.key}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.key}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                {field.options.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={field.key}
                type={field.type}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
        <Button onClick={onSubmit} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar {title}
        </Button>
      </CardContent>
    </Card>
  );

  const renderList = (title: string, items: any[], type: 'missions' | 'books' | 'courses', icon: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title} ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Nenhum item cadastrado</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <Badge variant="secondary">+{item.points} pts</Badge>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteItem(item.id, type)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const missionFields = [
    { key: 'name', label: 'Nome da Missão', type: 'text', placeholder: 'Ex: Ler Salmo 23' },
    { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva a missão...' },
    { key: 'points', label: 'Pontos', type: 'number', placeholder: '50' },
    { key: 'category', label: 'Categoria', type: 'text', placeholder: 'Ex: Leitura Bíblica' },
    { key: 'period', label: 'Período', type: 'text', placeholder: 'Ex: Semanal' },
    { 
      key: 'difficulty', 
      label: 'Dificuldade', 
      type: 'select', 
      options: [
        { value: 'easy', label: 'Fácil' },
        { value: 'medium', label: 'Médio' },
        { value: 'hard', label: 'Difícil' }
      ]
    }
  ];

  const bookFields = [
    { key: 'name', label: 'Nome do Livro', type: 'text', placeholder: 'Ex: O Peregrino' },
    { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva o livro...' },
    { key: 'points', label: 'Pontos', type: 'number', placeholder: '100' },
    { key: 'category', label: 'Categoria', type: 'text', placeholder: 'Ex: Teologia' },
    { 
      key: 'difficulty', 
      label: 'Dificuldade', 
      type: 'select', 
      options: [
        { value: 'easy', label: 'Fácil' },
        { value: 'medium', label: 'Médio' },
        { value: 'hard', label: 'Difícil' }
      ]
    }
  ];

  const courseFields = [
    { key: 'name', label: 'Nome do Curso', type: 'text', placeholder: 'Ex: Fundamentos da Fé' },
    { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva o curso...' },
    { key: 'points', label: 'Pontos', type: 'number', placeholder: '200' },
    { key: 'category', label: 'Categoria', type: 'text', placeholder: 'Ex: Discipulado' },
    { 
      key: 'difficulty', 
      label: 'Dificuldade', 
      type: 'select', 
      options: [
        { value: 'easy', label: 'Fácil' },
        { value: 'medium', label: 'Médio' },
        { value: 'hard', label: 'Difícil' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Painel de Administração
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-sm text-gray-600">Usuários</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{missions.length}</div>
              <p className="text-sm text-gray-600">Missões</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{books.length}</div>
              <p className="text-sm text-gray-600">Livros</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-sm text-gray-600">Cursos</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Admin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Adicionar Administrador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Email do usuário para promover a admin"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addAdmin}>
                <UserPlus className="w-4 h-4 mr-2" />
                Promover
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderForm("Missão", missionForm, setMissionForm, addMission, missionFields)}
          {renderForm("Livro", bookForm, setBookForm, addBook, bookFields)}
          {renderForm("Curso", courseForm, setCourseForm, addCourse, courseFields)}
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderList("Missões", missions, "missions", <Target className="w-5 h-5" />)}
          {renderList("Livros", books, "books", <BookOpen className="w-5 h-5" />)}
          {renderList("Cursos", courses, "courses", <GraduationCap className="w-5 h-5" />)}
        </div>
      </div>
    </div>
  );
};

export default Admin;
