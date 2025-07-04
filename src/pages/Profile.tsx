
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Award, BookOpen, GraduationCap, Target, Clock } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile, completedMissions, userBadges, loading, refreshUserData, getBooksList, getCoursesList, getMissionsList } = useUserProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    birth_date: '',
    gender: '',
    pgm_role: '',
    pgm_number: '',
    participates_flow_up: false,
    participates_irmandade: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        whatsapp: profile.whatsapp || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || '',
        pgm_role: profile.pgm_role || '',
        pgm_number: profile.pgm_number || '',
        participates_flow_up: profile.participates_flow_up || false,
        participates_irmandade: profile.participates_irmandade || false
      });
    }
  }, [profile]);

  const getPhaseInfo = (phase: string) => {
    const phases = {
      "Riacho": { emoji: "🌀", color: "bg-green-100 text-green-800", phrase: "Começando a fluir" },
      "Correnteza": { emoji: "🌊", color: "bg-blue-100 text-blue-800", phrase: "Sendo levado por algo maior" },
      "Cachoeira": { emoji: "💥", color: "bg-purple-100 text-purple-800", phrase: "Entregue ao movimento de Deus" },
      "Oceano": { emoji: "🌌", color: "bg-gray-900 text-white", phrase: "Profundamente imerso em Deus" }
    };
    return phases[phase as keyof typeof phases] || phases["Riacho"];
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar uma imagem para upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: publicUrl })
        .eq('id', profile?.id);

      if (updateError) {
        throw updateError;
      }

      refreshUserData();
      
      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          whatsapp: formData.whatsapp,
          birth_date: formData.birth_date || null,
          gender: formData.gender || null,
          pgm_role: formData.pgm_role || null,
          pgm_number: formData.pgm_number || null,
          participates_flow_up: formData.participates_flow_up,
          participates_irmandade: formData.participates_irmandade
        })
        .eq('id', profile?.id);

      if (error) throw error;

      refreshUserData();
      setIsEditing(false);
      
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Erro ao carregar perfil</p>
        </div>
      </div>
    );
  }

  const phaseInfo = getPhaseInfo(profile.phase);
  const booksList = getBooksList();
  const coursesList = getCoursesList();
  const missionsList = getMissionsList();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profile_photo_url || ''} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
                
                <div className="flex items-center space-x-3 flex-wrap">
                  <Badge className={phaseInfo.color}>
                    {phaseInfo.emoji} {profile.phase}
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {profile.points} pontos
                  </Badge>
                  {profile.participates_flow_up && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      FLOW UP
                    </Badge>
                  )}
                  {profile.participates_irmandade && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      IRMANDADE
                    </Badge>
                  )}
                  {profile.is_admin && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      ADMIN
                    </Badge>
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-700">"{phaseInfo.phrase}"</p>
                </div>
              </div>
              
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
              >
                {isEditing ? "Cancelar" : "Editar Perfil"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pgm_role">Função no PGM</Label>
                    <Select value={formData.pgm_role} onValueChange={(value) => setFormData({...formData, pgm_role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="membro">Membro</SelectItem>
                        <SelectItem value="líder">Líder</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="coordenador">Coordenador</SelectItem>
                        <SelectItem value="pastor">Pastor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pgm_number">Número do PGM</Label>
                    <Input
                      id="pgm_number"
                      value={formData.pgm_number}
                      onChange={(e) => setFormData({...formData, pgm_number: e.target.value})}
                      placeholder="Ex: PGM001"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="flow_up"
                      checked={formData.participates_flow_up}
                      onCheckedChange={(checked) => setFormData({...formData, participates_flow_up: checked})}
                    />
                    <Label htmlFor="flow_up">Participa do FLOW UP</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="irmandade"
                      checked={formData.participates_irmandade}
                      onCheckedChange={(checked) => setFormData({...formData, participates_irmandade: checked})}
                    />
                    <Label htmlFor="irmandade">Participa da IRMANDADE</Label>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Badges Section */}
        {userBadges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Badges Conquistados ({userBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="text-2xl">{badge.badge_icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-700 text-sm">{badge.badge_name}</h4>
                      <p className="text-xs text-gray-600">{formatTimeAgo(badge.earned_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different sections */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="missions">Missões ({missionsList.length})</TabsTrigger>
            <TabsTrigger value="books">Livros ({booksList.length})</TabsTrigger>
            <TabsTrigger value="courses">Cursos ({coursesList.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Timeline de Atividades
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedMissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Você ainda não concluiu nenhuma missão.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {completedMissions.map((mission) => (
                      <div key={mission.id} className="flex items-start space-x-3 p-4 rounded-lg border bg-white">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{mission.mission_name}</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              +{mission.points}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>Tipo: {mission.mission_type === 'mission' ? 'Missão' : mission.mission_type === 'book' ? 'Livro' : 'Curso'}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(mission.completed_at)}</span>
                          </div>
                          {mission.period && (
                            <div className="text-xs text-gray-400 mt-1">
                              Período: {mission.period}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="missions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Missões Concluídas ({missionsList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {missionsList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma missão concluída ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {missionsList.map((mission) => (
                      <div key={mission.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <span className="font-medium text-gray-800">{mission.mission_name}</span>
                            {mission.period && (
                              <div className="text-xs text-gray-500">{mission.period}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            +{mission.points}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(mission.completed_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Livros Lidos ({booksList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {booksList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum livro lido ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {booksList.map((book) => (
                      <div key={book.id} className="flex items-center justify-between p-3 rounded-lg border bg-green-50">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-800">{book.mission_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            +{book.points}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(book.completed_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Cursos Concluídos ({coursesList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {coursesList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum curso concluído ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {coursesList.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border bg-blue-50">
                        <div className="flex items-center space-x-3">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-medium text-gray-800">{course.mission_name}</span>
                            {course.school && (
                              <div className="text-xs text-gray-500">{course.school}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            +{course.points}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(course.completed_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
