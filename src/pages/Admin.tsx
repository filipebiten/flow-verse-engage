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

  // States for missions, news, books, courses would be here if needed
  // For this snippet, focusing on users and search

  // User search states
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [pgmRoleFilter, setPgmRoleFilter] = useState('all');
  const [irmandadeFilter, setIrmandadeFilter] = useState('all');
  const [flowUpFilter, setFlowUpFilter] = useState('all');

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
    // Load other data if needed
    loadUsers();
  }, [navigate]);

  const loadUsers = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
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
      (irmandadeFilter === 'yes' && user.participatesIrmandade) ||
      (irmandadeFilter === 'no' && !user.participatesIrmandade);
    const matchesFlowUp = flowUpFilter === 'all' || 
      (flowUpFilter === 'yes' && user.participatesFlowUp) ||
      (flowUpFilter === 'no' && !user.participatesFlowUp);

    return matchesSearch && matchesGender && matchesPgmRole && matchesIrmandade && matchesFlowUp;
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

          {/* Missions, Books, Courses, News tabs content would be here */}

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
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        <SelectItem value="Vice-líder">Vice-líder</SelectItem>
                        <SelectItem value="Membro">Membro</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={irmandadeFilter} onValueChange={setIrmandadeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Irmandade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="yes">Participa</SelectItem>
                        <SelectItem value="no">Não participa</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={flowUpFilter} onValueChange={setFlowUpFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Flow Up" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="yes">Participa</SelectItem>
                        <SelectItem value="no">Não participa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {filteredUsers.length} usuário(s) encontrado(s)
                  </p>
                  
                  {filteredUsers.map((user) => (
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
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Email: {user.email}</p>
                            <p>WhatsApp: {user.whatsapp}</p>
                            <p>PGM: {user.pgmRole} {user.pgmNumber}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{user.phase}</Badge>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
