
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
import { ArrowLeft, Plus, Edit, Trash2, Search, Users, Newspaper, CheckSquare, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mission form
  const [missionForm, setMissionForm] = useState({
    name: "",
    points: 1,
    type: "Diária",
    description: ""
  });
  
  // News form
  const [newsForm, setNewsForm] = useState({
    title: "",
    description: "",
    image: "",
    url: ""
  });
  
  const [editingMission, setEditingMission] = useState<any>(null);
  const [editingNews, setEditingNews] = useState<any>(null);

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
    
    setMissionForm({ name: "", points: 1, type: "Diária", description: "" });
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
    
    setNewsForm({ title: "", description: "", image: "", url: "" });
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.whatsapp.includes(searchTerm) ||
    (user.pgm && user.pgm.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="missions" className="flex items-center">
              <CheckSquare className="w-4 h-4 mr-2" />
              Missões
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
                        setMissionForm({ name: "", points: 1, type: "Diária", description: "" });
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
                              description: mission.description || ""
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
                        setNewsForm({ title: "", description: "", image: "", url: "" });
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
                              url: item.url || ""
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
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, email, WhatsApp ou PGM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
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
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>{user.email} | {user.whatsapp}</p>
                            {user.pgm && <p>PGM: {user.pgm}</p>}
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
                      {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
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
