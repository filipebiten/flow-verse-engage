import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import {Button} from '@/components/ui/button.tsx';
import {Input} from '@/components/ui/input.tsx';
import {useToast} from '@/hooks/use-toast.ts';
import {supabase} from '@/integrations/supabase/client.ts';
import {BookOpen, GraduationCap, Shield, Target, UserPlus} from 'lucide-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {LoadingComponent} from "@/components/LoadingComponent.tsx";
import {FormDialog} from "@/pages/admin/FormDialog.tsx";
import {AdminStats} from "@/pages/admin/AdminStats.tsx";
import {useAdminData} from "@/hooks/UseAdminData.tsx";
import {ListItems} from "@/pages/admin/ListItems.tsx";
import ListUsers from "@/pages/admin/ListUsers.tsx";
import {deleteBookPhoto, uploadBookPhoto} from "@/services/bookService.ts";
import {MissionSugestions} from "@/pages/admin/missionSugestions.tsx";

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogType, setDialogType] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data, isLoading } = useAdminData();

  const [missionForm, setMissionForm] = useState({ name: '', description: '', points: '', period: 'diário' });
  const [bookForm, setBookForm] = useState({ name: '', description: '', points: '' });
  const [courseForm, setCourseForm] = useState({ name: '', description: '', points: '', school: 'Escola do Discípulo' });
  const [adminEmail, setAdminEmail] = useState('');
  const [bookImage, setBookImage] = useState(null);

  const handleOpenDialog = (type: string) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType(null);
  };

  const addAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      const userToPromote = data.users.find(u => u.email === email);
      if (!userToPromote) throw new Error("Usuário não encontrado.");
      if (userToPromote.is_admin) throw new Error("Este usuário já é administrador.");
      const { error } = await supabase.from('profiles').update({ is_admin: true }).eq('id', userToPromote.id);
      if (error) throw error;
      return userToPromote;
    },
    onSuccess: (userToPromote) => {
      toast({
        title: "Sucesso",
        description: `${userToPromote.name} agora é administrador!`,
        className: "bg-green-500"
      });
      setAdminEmail('');
      queryClient.invalidateQueries({ queryKey: ['adminData'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao promover usuário",
        variant: "destructive",
        className: 'bg-red-500'
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async ({ id, type, imageUrl }: { id: string; type: 'books' | 'courses' | 'missions'; imageUrl: string }) => {
      if(type === 'books' && imageUrl) {
        await deleteBookPhoto(imageUrl.substring(imageUrl.lastIndexOf("/") + 1));
        setBookImage(null);
      }

      const { error } = await supabase
          .from(type)
          .delete()
          .eq('id', id);

      if (error)
        throw error;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Item removido com sucesso!",
        className: "bg-green-500"
      });
      queryClient.invalidateQueries({ queryKey: ['adminData'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover item",
        variant: "destructive",
        className: 'bg-red-500' });
    },
  });

  const createMutation = (tableName: 'books' | 'courses' | 'missions', form: any, setForm: any) => useMutation({
    mutationFn: async (formData: any) => {

      if (!formData.name || !formData.description || !formData.points)
        throw new Error("Preencha todos os campos obrigatórios.");

      const { data, error } = await supabase
          .from(tableName)
          .insert({ ...formData, points: parseInt(formData.points) })
          .select();

      if (error)
        throw error;

      let bookImageUrl = null;

      bookImageUrl = await uploadBookPhoto(data[0].id, bookImage);

      if (bookImageUrl) {
        const { error: updateError } = await supabase
            .from('books')
            .update({ book_image_url: bookImageUrl })
            .eq('id', data[0].id);

        if (updateError) {
        }
      }
    },
    onSuccess: () => {
      if (tableName === 'courses'){
        setForm({ name: '', description: '', points: 'diário', school: 'Escola do Discípulo' });
      } else if (tableName === "missions"){
        setForm({ name: '', description: '', points: '', period: 'diário' })
      } else {
        setForm({ name: '', description: '', points: '' })
        setBookImage(null)
      }
      handleCloseDialog();
      toast({ title: "Sucesso", description: `${tableName} adicionado com sucesso!`, className: "bg-green-500" });
      queryClient.invalidateQueries({ queryKey: ['adminData'] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message || `Erro ao adicionar ${tableName}`, variant: "destructive" });
    },
  });

  const addMissionMutation = createMutation('missions', missionForm, setMissionForm);
  const addBookMutation = createMutation('books', bookForm, setBookForm);
  const addCourseMutation = createMutation('courses', courseForm, setCourseForm);

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
    { key: 'points', label: 'Pontos', type: 'number', placeholder: '100' },
    { key: 'image', label: 'Imagem', type: 'file',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setBookImage(file);
        }
      }},
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

  if (isLoading || !data) {
    return <LoadingComponent />;
  }

  const formsMap = {
    missions: { title: "Nova Missão", form: missionForm, setForm: setMissionForm, onSubmit: () => addMissionMutation.mutate(missionForm), fields: missionFields },
    books: { title: "Novo Livro", form: bookForm, setForm: setBookForm, onSubmit: () => addBookMutation.mutate(bookForm), fields: bookFields },
    courses: { title: "Novo Curso", form: courseForm, setForm: setCourseForm, onSubmit: () => addCourseMutation.mutate(courseForm), fields: courseFields },
  };

  const currentForm = dialogType ? formsMap[dialogType] : null;

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
          <AdminStats stats={{ users: data.users.length, missions: data.missions.length, books: data.books.length, courses: data.courses.length }} />

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
                <Button onClick={() => addAdminMutation.mutate(adminEmail)} disabled={addAdminMutation.isPending}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Promover
                </Button>
              </div>
            </CardContent>
          </Card>

          <ListUsers></ListUsers>

          {/* Listas com botões de adicionar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ListItems("Livros", data.books, "books", <BookOpen className="w-5 h-5" />, (id: string, type: 'books' | 'courses' | 'missions') => deleteItemMutation.mutate({ id, type }), () => handleOpenDialog('books'))}
            {ListItems("Cursos", data.courses, "courses", <GraduationCap className="w-5 h-5" />, (id: string, type: 'books' | 'courses' | 'missions') => deleteItemMutation.mutate({ id, type }), () => handleOpenDialog('courses'))}
            {ListItems("Missões", data.missions, "missions", <Target className="w-5 h-5" />, (id: string, type: 'books' | 'courses' | 'missions') => deleteItemMutation.mutate({ id, type }), () => handleOpenDialog('missions'))}
          </div>

          {/* Dialog de Adição */}
          {currentForm && (
              <FormDialog
                  title={currentForm.title}
                  form={currentForm.form}
                  setForm={currentForm.setForm}
                  onSubmit={currentForm.onSubmit}
                  fields={currentForm.fields}
                  open={openDialog}
                  onOpenChange={setOpenDialog}
              />
          )}

          <MissionSugestions></MissionSugestions>
        </div>
      </div>
  );
};

export default Admin;