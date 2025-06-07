import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  GraduationCap,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  pgm: string;
  email: string;
  phone: string;
  role: 'membro' | 'líder' | 'supervisor' | 'coordenador' | 'pastor';
  irmandade: boolean;
  flowUp: boolean;
  flowUpLevel: number;
  phase: number;
  status: 'ativo' | 'inativo';
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  phase: number;
  image?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  school: 'Escola do Discípulo' | 'Universidade da Família';
  duration: string;
  phase: number;
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "João Silva",
      pgm: "PGM001",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      role: "líder",
      irmandade: true,
      flowUp: true,
      flowUpLevel: 3,
      phase: 2,
      status: "ativo"
    },
    {
      id: "2", 
      name: "Maria Santos",
      pgm: "PGM002",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      role: "membro",
      irmandade: true,
      flowUp: false,
      flowUpLevel: 0,
      phase: 1,
      status: "ativo"
    }
  ]);

  const [books] = useState<Book[]>([
    {
      id: "1",
      title: "Livro da Vida",
      author: "Autor Exemplo",
      category: "Espiritual",
      phase: 1,
      image: "/placeholder.svg"
    }
  ]);

  const [courses] = useState<Course[]>([
    {
      id: "1",
      title: "Fundamentos da Fé",
      description: "Curso básico sobre fundamentos cristãos",
      school: "Escola do Discípulo",
      duration: "4 semanas",
      phase: 1
    }
  ]);

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
        
        {/* Header - Mobile Optimized */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-2xl flex items-center gap-2 sm:gap-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              Painel Administrativo
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Tabs - Mobile Optimized */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="users" className="text-xs sm:text-sm py-2 sm:py-3">
                  <Users className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Usuários</span>
                  <span className="sm:hidden">Users</span>
                </TabsTrigger>
                <TabsTrigger value="books" className="text-xs sm:text-sm py-2 sm:py-3">
                  <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Livros</span>
                  <span className="sm:hidden">Books</span>
                </TabsTrigger>
                <TabsTrigger value="courses" className="text-xs sm:text-sm py-2 sm:py-3">
                  <GraduationCap className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Cursos</span>
                  <span className="sm:hidden">Courses</span>
                </TabsTrigger>
              </TabsList>

              {/* Users Tab - Mobile Optimized */}
              <TabsContent value="users" className="p-3 sm:p-6 space-y-4">
                {/* Search and Filters - Mobile Responsive */}
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
                    <Button size="sm" className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Novo Usuário</span>
                      <span className="sm:hidden">Novo</span>
                    </Button>
                  </div>

                  {/* Filter Buttons - Mobile Scrollable */}
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

                {/* Users Table - Mobile Cards */}
                <div className="space-y-3">
                  {/* Desktop Table Header - Hidden on Mobile */}
                  <div className="hidden lg:grid lg:grid-cols-8 gap-4 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-600">
                    <span>Nome</span>
                    <span>PGM</span>
                    <span>Email</span>
                    <span>Telefone</span>
                    <span>Função</span>
                    <span>Grupo</span>
                    <span>Fase</span>
                    <span>Ações</span>
                  </div>

                  {/* Users List */}
                  {filteredUsers.map((user) => (
                    <div key={user.id}>
                      {/* Mobile Card View */}
                      <Card className="lg:hidden">
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
                            <div>
                              <span className="text-gray-500">Função:</span>
                              <p className="capitalize">{user.role}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Fase:</span>
                              <p>{user.phase}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {user.irmandade && <Badge variant="secondary" className="text-xs">Irmandade</Badge>}
                            {user.flowUp && <Badge variant="secondary" className="text-xs">Flow Up Nv.{user.flowUpLevel}</Badge>}
                          </div>

                          <div className="flex gap-2 pt-2 border-t">
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Ver
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              <Edit className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Desktop Table Row */}
                      <div className="hidden lg:grid lg:grid-cols-8 gap-4 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow text-sm">
                        <span className="font-medium">{user.name}</span>
                        <span>{user.pgm}</span>
                        <span className="truncate">{user.email}</span>
                        <span>{user.phone}</span>
                        <span className="capitalize">{user.role}</span>
                        <div className="flex gap-1">
                          {user.irmandade && <Badge variant="secondary" className="text-xs">Irmandade</Badge>}
                          {user.flowUp && <Badge variant="secondary" className="text-xs">Flow Up</Badge>}
                        </div>
                        <span>Fase {user.phase}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Books Tab - Mobile Optimized */}
              <TabsContent value="books" className="p-3 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <h3 className="text-lg font-semibold">Gerenciar Livros</h3>
                  <Button size="sm" className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Livro
                  </Button>
                </div>

                <div className="space-y-3">
                  {books.map((book) => (
                    <Card key={book.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          {book.image && (
                            <img 
                              src={book.image} 
                              alt={book.title}
                              className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
                              <div>
                                <h4 className="font-semibold text-sm sm:text-base truncate">{book.title}</h4>
                                <p className="text-xs sm:text-sm text-gray-600">{book.author}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="text-xs">Fase {book.phase}</Badge>
                                <Badge variant="secondary" className="text-xs">{book.category}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Trash2 className="w-3 h-3 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Courses Tab - Mobile Optimized */}
              <TabsContent value="courses" className="p-3 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <h3 className="text-lg font-semibold">Gerenciar Cursos</h3>
                  <Button size="sm" className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Curso
                  </Button>
                </div>

                <div className="space-y-3">
                  {courses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm sm:text-base">{course.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{course.description}</p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">Fase {course.phase}</Badge>
                              <Badge variant="secondary" className="text-xs">{course.school}</Badge>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Duração: {course.duration}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Trash2 className="w-3 h-3 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
