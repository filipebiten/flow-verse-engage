
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  Trophy, 
  BookOpen, 
  Target,
  Award,
  Camera
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  phase: string;
  whatsapp?: string;
  birth_date?: string;
  gender?: string;
  pgm_role?: string;
  pgm_number?: string;
  participates_flow_up: boolean;
  participates_irmandade: boolean;
  profile_photo_url?: string;
  consecutive_days?: number;
}

interface CompletedMission {
  id: string;
  mission_name: string;
  mission_type: string;
  points: number;
  completed_at: string;
}

interface UserBadge {
  id: string;
  badge_name: string;
  badge_icon: string;
  earned_at: string;
}

const getPhaseInfo = (points: number) => {
  if (points >= 1000) return { name: 'Oceano', icon: '🌊', phrase: 'Profundamente imerso em Deus', color: 'from-blue-900 to-indigo-900' };
  if (points >= 500) return { name: 'Cachoeira', icon: '💥', phrase: 'Entregue ao movimento de Deus', color: 'from-purple-600 to-blue-600' };
  if (points >= 250) return { name: 'Correnteza', icon: '🌊', phrase: 'Sendo levado por algo maior', color: 'from-blue-500 to-teal-500' };
  return { name: 'Riacho', icon: '🌀', phrase: 'Começando a fluir', color: 'from-green-400 to-blue-400' };
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedMissions, setCompletedMissions] = useState<CompletedMission[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      console.log('Loading user data for:', user.id);
      
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o perfil.",
          variant: "destructive"
        });
        return;
      }

      console.log('Profile loaded:', profileData);
      setProfile(profileData);
      setFormData(profileData);

      // Load completed missions
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions_completed')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (missionsError) {
        console.error('Error loading completed missions:', missionsError);
      } else {
        console.log('Completed missions loaded:', missionsData);
        setCompletedMissions(missionsData || []);
      }

      // Load user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (badgesError) {
        console.error('Error loading badges:', badgesError);
      } else {
        console.log('User badges loaded:', badgesData);
        setUserBadges(badgesData || []);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
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

      setProfile({ ...profile, ...formData });
      setEditing(false);
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil.",
        variant: "destructive"
      });
    }
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
          <p className="text-gray-600">Perfil não encontrado.</p>
          <Button onClick={loadUserData} className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const currentPhase = getPhaseInfo(profile.points || 0);
  const booksCount = completedMissions.filter(m => m.mission_type === 'book').length;
  const coursesCount = completedMissions.filter(m => m.mission_type === 'course').length;
  const missionsCount = completedMissions.filter(m => m.mission_type === 'mission').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${currentPhase.color} p-6 text-white`}>
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20 border-4 border-white">
                {profile.profile_photo_url ? (
                  <AvatarImage src={profile.profile_photo_url} alt={profile.name} />
                ) : (
                  <AvatarFallback className="bg-white text-gray-800 text-2xl font-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                <p className="text-white/90 mb-2">{profile.email}</p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-white text-gray-800">
                    {currentPhase.icon} {currentPhase.name}
                  </Badge>
                  <span className="text-white/90">{profile.points || 0} pontos</span>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => setEditing(!editing)}
                className="bg-white text-gray-800 hover:bg-gray-100"
              >
                {editing ? 'Cancelar' : 'Editar Perfil'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp || ''}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date || ''}
                      onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select value={formData.gender || ''} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleUpdateProfile} className="w-full">
                    Salvar Alterações
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{profile.whatsapp || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('pt-BR') : 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{profile.gender || 'Não informado'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{booksCount}</div>
                  <p className="text-sm text-gray-600">Livros Lidos</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{missionsCount}</div>
                  <p className="text-sm text-gray-600">Missões</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{coursesCount}</div>
                  <p className="text-sm text-gray-600">Cursos</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{userBadges.length}</div>
                  <p className="text-sm text-gray-600">Badges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {completedMissions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma atividade encontrada</p>
            ) : (
              <div className="space-y-3">
                {completedMissions.slice(0, 5).map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{mission.mission_name}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(mission.completed_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant="secondary">+{mission.points} pts</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badges */}
        {userBadges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Badges Conquistados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userBadges.map((badge) => (
                  <div key={badge.id} className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg">
                    <div className="text-3xl mb-2">{badge.badge_icon}</div>
                    <h4 className="font-semibold text-sm text-yellow-800">{badge.badge_name}</h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      {new Date(badge.earned_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
