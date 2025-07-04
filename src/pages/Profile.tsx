
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Settings, 
  Trophy, 
  BookOpen, 
  GraduationCap, 
  Target,
  Upload,
  CheckSquare,
  Award,
  Edit,
  Save,
  X
} from 'lucide-react';

// Função para obter informações da fase (movida para o topo)
const getPhaseInfo = (phase: string) => {
  const phases = {
    "Riacho": { emoji: "🌀", color: "bg-green-100 text-green-800", phrase: "Começando a fluir" },
    "Correnteza": { emoji: "🌊", color: "bg-blue-100 text-blue-800", phrase: "Sendo levado por algo maior" },
    "Cachoeira": { emoji: "💥", color: "bg-purple-100 text-purple-800", phrase: "Entregue ao movimento de Deus" },
    "Oceano": { emoji: "🌌", color: "bg-gray-900 text-white", phrase: "Profundamente imerso em Deus" }
  };
  return phases[phase as keyof typeof phases] || phases["Riacho"];
};

const Profile = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { profile, completedMissions, userBadges, refreshUserData, loading } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [pgmRole, setPgmRole] = useState('');
  const [pgmNumber, setPgmNumber] = useState('');
  const [participatesFlowUp, setParticipatesFlowUp] = useState(false);
  const [participatesIrmandade, setParticipatesIrmandade] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | undefined>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setWhatsapp(profile.whatsapp || '');
      setBirthDate(profile.birth_date || '');
      setGender(profile.gender || '');
      setPgmRole(profile.pgm_role || '');
      setPgmNumber(profile.pgm_number || '');
      setParticipatesFlowUp(profile.participates_flow_up || false);
      setParticipatesIrmandade(profile.participates_irmandade || false);
      setProfilePhotoUrl(profile.profile_photo_url);
    }
  }, [profile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (profile) {
      setName(profile.name || '');
      setWhatsapp(profile.whatsapp || '');
      setBirthDate(profile.birth_date || '');
      setGender(profile.gender || '');
      setPgmRole(profile.pgm_role || '');
      setPgmNumber(profile.pgm_number || '');
      setParticipatesFlowUp(profile.participates_flow_up || false);
      setParticipatesIrmandade(profile.participates_irmandade || false);
      setProfilePhotoUrl(profile.profile_photo_url);
    }
  };

  const handleSaveClick = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          whatsapp,
          birth_date: birthDate,
          gender,
          pgm_role: pgmRole,
          pgm_number: pgmNumber,
          participates_flow_up: participatesFlowUp,
          participates_irmandade: participatesIrmandade,
          profile_photo_url: profilePhotoUrl
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o perfil.",
          variant: "destructive"
        });
        return;
      }

      refreshUserData();
      setIsEditing(false);
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Error during profile update:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil.",
        variant: "destructive"
      });
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Erro",
          description: "Não foi possível fazer upload da imagem.",
          variant: "destructive"
        });
      } else {
        // Usar o método correto para obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        setProfilePhotoUrl(publicUrl);
        toast({
          title: "Sucesso",
          description: "Foto de perfil atualizada!",
        });
      }
    } catch (error) {
      console.error('Error during image upload:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer upload da imagem.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getBadgeInfo = (badgeId: string) => {
    const badges = {
      'consecutive-days-7': { name: '7 Dias de Consistência', icon: '🗓️', description: '7 dias seguidos completando missões.' },
      'consecutive-days-15': { name: '15 Dias de Consistência', icon: '🔥', description: '15 dias seguidos completando missões.' },
      'consecutive-days-30': { name: '30 Dias de Consistência', icon: '🚀', description: '30 dias seguidos completando missões.' },
      'consecutive-days-60': { name: 'Hábito Formado', icon: '💪', description: '60 dias seguidos completando missões.' },
      'reader-1': { name: 'Leitor Iniciante', icon: '📖', description: 'Começando a jornada da leitura.' },
      'reader-2': { name: 'Leitor Fluente', icon: '📚', description: 'Já tem o hábito da leitura.' },
      'reader-3': { name: 'Leitor Voraz', icon: '🔥📚', description: 'Não larga um bom livro por nada.' },
      'reader-4': { name: 'Mente Brilhante', icon: '🧠✨', description: 'Um verdadeiro devorador de sabedoria.' },
      'course-1': { name: 'Discípulo em Formação', icon: '🎓', description: 'Iniciando sua jornada de formação.' },
      'course-2': { name: 'Aprendiz Dedicado', icon: '📘🎓', description: 'Mostrando sede de crescimento.' },
      'course-3': { name: 'Líder em Construção', icon: '🛠️🎓', description: 'Preparando-se para grandes responsabilidades.' },
      'course-4': { name: 'Mestre da Jornada', icon: '🧙‍♂️📘', description: 'Um veterano na trilha do aprendizado.' },
      'mission-1': { name: 'Primeiro Passo', icon: '🎯', description: 'Completou a primeira missão.' },
      'mission-5': { name: 'Focado no Alvo', icon: '🏹', description: 'Completou 5 missões.' },
      'mission-10': { name: 'Atirador de Elite', icon: '🎯🎯', description: 'Completou 10 missões.' },
      'mission-20': { name: 'Mestre das Missões', icon: '🏆', description: 'Completou 20 missões.' },
    };
    return badges[badgeId as keyof typeof badges];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Perfil não encontrado.</p>
        </div>
      </div>
    );
  }

  const phaseInfo = getPhaseInfo(profile.phase || 'Riacho');

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-teal-700">Meu Perfil</h1>
          <Button variant="destructive" size="sm" onClick={signOut}>
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profilePhotoUrl || ''} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl">
                  {profile?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
                  <p className="text-gray-600">
                    {profile?.pgm_role} {profile?.pgm_number && `- ${profile?.pgm_number}`}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 flex-wrap">
                  <Badge className={phaseInfo.color}>
                    {phaseInfo.emoji} {profile?.phase}
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {profile?.points} pontos
                  </Badge>
                  {profile?.participates_flow_up && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      FLOW UP
                    </Badge>
                  )}
                  {profile?.participates_irmandade && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      IRMANDADE
                    </Badge>
                  )}
                  {profile?.consecutive_days && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {profile?.consecutive_days} dias seguidos
                    </Badge>
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-700">"{phaseInfo.phrase}"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Editar Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      type="text"
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      type="date"
                      id="birthDate"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gênero</Label>
                    <Input
                      type="text"
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pgmRole">Função no PGM</Label>
                    <Input
                      type="text"
                      id="pgmRole"
                      value={pgmRole}
                      onChange={(e) => setPgmRole(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pgmNumber">Número no PGM</Label>
                    <Input
                      type="text"
                      id="pgmNumber"
                      value={pgmNumber}
                      onChange={(e) => setPgmNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Label htmlFor="participatesFlowUp">Participa do Flow Up?</Label>
                  <input
                    type="checkbox"
                    id="participatesFlowUp"
                    checked={participatesFlowUp}
                    onChange={(e) => setParticipatesFlowUp(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="participatesIrmandade">Participa da Irmandade?</Label>
                  <input
                    type="checkbox"
                    id="participatesIrmandade"
                    checked={participatesIrmandade}
                    onChange={(e) => setParticipatesIrmandade(e.target.checked)}
                    className="w-5 h-5"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <Label htmlFor="profilePhoto">Foto de Perfil</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      id="profilePhoto"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Label htmlFor="profilePhoto" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md">
                      <Upload className="w-4 h-4 mr-2 inline-block" />
                      {uploading ? 'Enviando...' : 'Alterar Foto'}
                    </Label>
                    {profilePhotoUrl && (
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={profilePhotoUrl} />
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-xl">
                          {profile?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={handleCancelClick}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveClick}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex justify-end">
                <Button onClick={handleEditClick}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userBadges.map((badge) => {
                  const badgeInfo = getBadgeInfo(badge.badge_name);
                  if (!badgeInfo) return null;
                  
                  return (
                    <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="text-2xl">{badgeInfo.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-700">{badgeInfo.name}</h4>
                        <p className="text-sm text-gray-600">{badgeInfo.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different sections */}
        <Tabs defaultValue="missions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="missions">Missões</TabsTrigger>
            <TabsTrigger value="books">Livros</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="missions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Missões Concluídas ({completedMissions.filter(a => a.mission_type === 'mission').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedMissions.filter(a => a.mission_type === 'mission').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma missão concluída ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {completedMissions.filter(a => a.mission_type === 'mission').map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-white">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{activity.mission_name}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                +{activity.points}
                              </Badge>
                            </div>
                          </div>
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
                  Livros Lidos ({completedMissions.filter(a => a.mission_type === 'book').length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedMissions.filter(a => a.mission_type === 'book').length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum livro lido ainda</p>
                ) : (
                  <div className="space-y-2">
                    {completedMissions.filter(a => a.mission_type === 'book').map((book, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded flex items-center">
                        <BookOpen className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm flex-1">{book.mission_name}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          ✓ Lido
                        </Badge>
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
                  Cursos ({completedMissions.filter(a => a.mission_type === 'course').length} concluídos)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedMissions.filter(a => a.mission_type === 'course').length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum curso concluído ainda</p>
                ) : (
                  <div className="space-y-2">
                    {completedMissions.filter(a => a.mission_type === 'course').map((course, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded flex items-center">
                        <GraduationCap className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm flex-1">{course.mission_name}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                          ✓ Concluído
                        </Badge>
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
