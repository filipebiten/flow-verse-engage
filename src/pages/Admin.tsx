
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [missionForm, setMissionForm] = useState({
    name: '', description: '', points: '', period: 'diário'
  });
  const [bookForm, setBookForm] = useState({
    name: '', description: '', points: ''
  });
  const [courseForm, setCourseForm] = useState({
    name: '', description: '', points: '', school: 'Escola do Discípulo'
  });
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    checkAdminAndLoadData();
  }, [user]);

  const checkAdminAndLoadData = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      console.log('Checking admin status for user:', user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      console.log('Profile admin check result:', { profile, profileError });

      if (profileError || !profile?.is_admin) {
        console.log('User is not admin, redirecting...');
        navigate('/');
        return;
      }

      await loadData();
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const loadData = async () => {
    try {
      console.log('Loading admin data...');
      const [missionsResult, booksResult, coursesResult, profilesResult] = await Promise.all([
        supabase.from('missions').select('*').order('created_at', { ascending: false }),
        supabase.from('books').select('*').order('created_at', { ascending: false }),
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false })
      ]);

      console.log('Admin data results:', {
        missions: missionsResult,
        books: booksResult,
        courses: coursesResult,
        profiles: profilesResult
      });

      if (missionsResult.error) console.error('Error loading missions:', missionsResult.error);
      if (booksResult.error) console.error('Error loading books:', booksResult.error);
      if (coursesResult.error) console.error('Error loading courses:', coursesResult.error);
      if (profilesResult.error) console.error('Error loading profiles:', profilesResult.error);

      setMissions(missionsResult.data || []);
      setBooks(booksResult.data || []);
      setCourses(coursesResult.data || []);
      setUsers(profilesResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ title: "Erro", description: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addMission = async () => {
    if (!missionForm.name || !missionForm.description || !missionForm.points) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('missions')
        .insert({
          name: missionForm.name,
          description: missionForm.description,
          points: parseInt(missionForm.points),
          period: missionForm.period
        })
        .select()
        .single();

      if (error) throw error;

      setMissions([...missions, data]);
      setMissionForm({ name: '', description: '', points: '', period: 'diário' });
      toast({ title: "Sucesso", description: "Missão adicionada com sucesso!" });
    } catch (error) {
      console.error('Error adding mission:', error);
      toast({ title: "Erro", description: "Erro ao adicionar missão", variant: "destructive" });
    }
  };

  const addBook = async () => {
    if (!bookForm.name || !bookForm.description || !bookForm.points) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('books')
        .insert({
          name: bookForm.name,
          description: bookForm.description,
          points: parseInt(bookForm.points)
        })
        .select()
        .single();

      if (error) throw error;

      setBooks([...books, data]);
      setBookForm({ name: '', description: '', points: '' });
      toast({ title: "Sucesso", description: "Livro adicionado with sucesso!" });
    } catch (error) {
      console.error('Error adding book:', error);
      toast({ title: "Erro", description: "Erro ao adicionar livro", variant: "destructive" });
    }
  };

  const addCourse = async () => {
    if (!courseForm.name || !courseForm.description || !courseForm.points) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          name: courseForm.name,
          description: courseForm.description,
          points: parseInt(courseForm.points),
          school: courseForm.school
        })
        .select()
        .single();

      if (error) throw error;

      setCourses([...courses, data]);
      setCourseForm({ name: '', description: '', points: '', school: 'Escola do Discípulo' });
      toast({ title: "Sucesso", description: "Curso adicionado com sucesso!" });
    } catch (error) {
      console.error('Error adding course:', error);
      toast({ title: "Erro", description: "Erro ao adicionar curso", variant: "destructive" });
    }
  };

  const deleteItem = async (id: string, type: 'missions' | 'books' | 'courses') => {
    try {
      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);

      if (error) throw error;

      switch (type) {
        case 'missions':
          setMissions(missions.filter(item => item.id !== id));
          break;
        case 'books':
          setBooks(books.filter(item => item.id !== id));
          break;
        case 'courses':
          setCourses(courses.filter(item => item.id !== id));
          break;
      }
      
      toast({ title: "Sucesso", description: "Item removido com sucesso!" });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({ title: "Erro", description: "Erro ao remover item", variant: "destructive" });
    }
  };

  const addAdmin = async () => {
    if (!adminEmail) {
      toast({ title: "Erro", description: "Digite um email válido", variant: "destructive" });
      return;
    }

    const userToPromote = users.find(user => user.email === adminEmail);
    if (!userToPromote) {
      toast({ title: "Erro", description: "Usuário não encontrado", variant: "destructive" });
      return;
    }

    if (userToPromote.is_admin) {
      toast({ title: "Aviso", description: "Este usuário já é administrador", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', userToPromote.id);

      if (error) throw error;

      const updatedUsers = users.map(user => 
        user.email === adminEmail ? { ...user, is_admin: true } : user
      );
      
      setUsers(updatedUsers);
      setAdminEmail('');
      
      toast({ title: "Sucesso", description: `${userToPromote.name} agora é administrador!` });
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({ title: "Erro", description: "Erro ao promover usuário", variant: "destructive" });
    }
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
                className="w-full p-2 border rounded-md bg-white"
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
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">+{item.points} pts</Badge>
                    {item.period && <Badge variant="outline">{item.period}</Badge>}
                    {item.school && <Badge variant="outline">{item.school}</Badge>}
                  </div>
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
    { 
      key: 'period', 
      label: 'Período', 
      type: 'select', 
      options: [
        { value: 'diário', label: 'Diário' },
        { value: 'semanal', label: 'Semanal' },
        { value: 'mensal', label: 'Mensal' },
        { value: 'semestral', label: 'Semestral' },
        { value: 'anual', label: 'Anual' },
        { value: 'especial', label: 'Missão Especial' }
      ]
    }
  ];

  const bookFields = [
    { key: 'name', label: 'Nome do Livro', type: 'text', placeholder: 'Ex: O Peregrino' },
    { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva o livro...' },
    { key: 'points', label: 'Pontos', type: 'number', placeholder: '100' }
  ];

  const courseFields = [
    { key: 'name', label: 'Nome do Curso', type: 'text', placeholder: 'Ex: Fundamentos da Fé' },
    { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva o curso...' },
    { key: 'points', label: 'Pontos', type: 'number', placeholder: '200' },
    { 
      key: 'school', 
      label: 'Escola', 
      type: 'select', 
      options: [
        { value: 'Escola do Discípulo', label: 'Escola do Discípulo' },
        { value: 'Escola da Família', label: 'Escola da Família' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

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
