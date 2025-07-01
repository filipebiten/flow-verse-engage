
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, Calendar, Book, GraduationCap, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Missions = () => {
  const { toast } = useToast();
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);

  // Get missions from localStorage
  const missions = JSON.parse(localStorage.getItem('missions') || '[]');
  const books = JSON.parse(localStorage.getItem('books') || '[]');
  const courses = JSON.parse(localStorage.getItem('courses') || '[]');

  const handleMissionToggle = (missionId: string, missionName: string, points: number) => {
    const isCompleted = completedMissions.includes(missionId);
    
    if (isCompleted) {
      setCompletedMissions(prev => prev.filter(id => id !== missionId));
      toast({
        title: "Missão desmarcada",
        description: `${missionName} foi desmarcada.`,
      });
    } else {
      setCompletedMissions(prev => [...prev, missionId]);
      
      // Update user points
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        points: (currentUser.points || 0) + points
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Show celebration toast
      toast({
        title: "🎉 Missão Concluída!",
        description: `Parabéns! Você ganhou ${points} pontos.`,
      });
    }
  };

  const renderMissionCard = (mission: any, icon: any) => (
    <Card key={mission.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{mission.name}</CardTitle>
          </div>
          <Badge variant="secondary">{mission.points} pts</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {mission.frequency}
            </Badge>
            {mission.targetAudience && (
              <Badge variant="outline" className="text-xs">
                {mission.targetAudience}
              </Badge>
            )}
          </div>
          <Button
            variant={completedMissions.includes(mission.id) ? "default" : "outline"}
            size="sm"
            onClick={() => handleMissionToggle(mission.id, mission.name, mission.points)}
            className="flex items-center gap-1"
          >
            {completedMissions.includes(mission.id) ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
            {completedMissions.includes(mission.id) ? "Concluída" : "Marcar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const dailyMissions = missions.filter((m: any) => m.frequency === 'Diária');
  const weeklyMissions = missions.filter((m: any) => m.frequency === 'Semanal');
  const monthlyMissions = missions.filter((m: any) => m.frequency === 'Mensal');
  const semestralMissions = missions.filter((m: any) => m.frequency === 'Semestral');
  const annualMissions = missions.filter((m: any) => m.frequency === 'Anual');
  const specialMissions = missions.filter((m: any) => m.frequency === 'Especial');

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Missões</h1>
        <p className="text-muted-foreground">Complete suas missões para ganhar pontos e crescer espiritualmente</p>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="daily">📆 Diárias</TabsTrigger>
          <TabsTrigger value="weekly">📅 Semanais</TabsTrigger>
          <TabsTrigger value="monthly">🗓️ Mensais</TabsTrigger>
          <TabsTrigger value="semestral">📋 Semestrais</TabsTrigger>
          <TabsTrigger value="annual">📊 Anuais</TabsTrigger>
          <TabsTrigger value="books">📚 Livros</TabsTrigger>
          <TabsTrigger value="courses">🎓 Cursos</TabsTrigger>
          <TabsTrigger value="special">⭐ Especiais</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Missões Diárias</h2>
          {dailyMissions.length > 0 ? (
            <div className="grid gap-4">
              {dailyMissions.map((mission: any) => 
                renderMissionCard(mission, <Calendar className="w-5 h-5 text-green-600" />)
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma missão diária disponível</p>
              <p className="text-sm text-muted-foreground mt-2">
                Missões serão adicionadas pelo administrador
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Missões Semanais</h2>
          {weeklyMissions.length > 0 ? (
            <div className="grid gap-4">
              {weeklyMissions.map((mission: any) => 
                renderMissionCard(mission, <Calendar className="w-5 h-5 text-blue-600" />)
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma missão semanal disponível</p>
              <p className="text-sm text-muted-foreground mt-2">
                Missões serão adicionadas pelo administrador
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Missões Mensais</h2>
          {monthlyMissions.length > 0 ? (
            <div className="grid gap-4">
              {monthlyMissions.map((mission: any) => 
                renderMissionCard(mission, <Calendar className="w-5 h-5 text-purple-600" />)
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma missão mensal disponível</p>
              <p className="text-sm text-muted-foreground mt-2">
                Missões serão adicionadas pelo administrador
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="semestral" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Missões Semestrais</h2>
          {semestralMissions.length > 0 ? (
            <div className="grid gap-4">
              {semestralMissions.map((mission: any) => 
                renderMissionCard(mission, <Calendar className="w-5 h-5 text-orange-600" />)
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma missão semestral disponível</p>
              <p className="text-sm text-muted-foreground mt-2">
                Missões serão adicionadas pelo administrador
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="annual" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Missões Anuais</h2>
          {annualMissions.length > 0 ? (
            <div className="grid gap-4">
              {annualMissions.map((mission: any) => 
                renderMissionCard(mission, <Calendar className="w-5 h-5 text-red-600" />)
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma missão anual disponível</p>
              <p className="text-sm text-muted-foreground mt-2">
                Missões serão adicionadas pelo administrador
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="books" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Leitura de Livros</h2>
          {books.length > 0 ? (
            <div className="grid gap-4">
              {books.map((book: any) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Book className="w-5 h-5 text-amber-600" />
                        <div>
                          <CardTitle className="text-lg">{book.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{book.points} pts</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {book.type}
                        </Badge>
                        {book.targetAudience && (
                          <Badge variant="outline" className="text-xs">
                            {book.targetAudience}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant={completedMissions.includes(book.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleMissionToggle(book.id, book.name, book.points)}
                        className="flex items-center gap-1"
                      >
                        {completedMissions.includes(book.id) ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        {completedMissions.includes(book.id) ? "Lido" : "Marcar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum livro disponível</p>
              <p className="text-sm text-muted-foreground mt-2">
                Livros serão adicionados pelo administrador
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Cursos</h2>
          {courses.length > 0 ? (
            <div className="grid gap-4">
              {courses.map((course: any) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                        <div>
                          <CardTitle className="text-lg">{course.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{course.school}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{course.points} pts</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.description && (
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {course.targetAudience && (
                            <Badge variant="outline" className="text-xs">
                              {course.targetAudience}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant={completedMissions.includes(course.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleMissionToggle(course.id, course.name, course.points)}
                          className="flex items-center gap-1"
                        >
                          {completedMissions.includes(course.id) ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                          {completedMissions.includes(course.id) ? "Concluído" : "Marcar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum curso disponível</p>
              <p className="text-sm text-muted-foreground mt-2">
                Cursos serão adicionados pelo administrador
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="special" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Missões Especiais</h2>
          {specialMissions.length > 0 ? (
            <div className="grid gap-4">
              {specialMissions.map((mission: any) => 
                renderMissionCard(mission, <Star className="w-5 h-5 text-yellow-600" />)
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma missão especial disponível</p>
              <p className="text-sm text-muted-foreground mt-2">
                Missões serão adicionadas pelo administrador
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Missions;
