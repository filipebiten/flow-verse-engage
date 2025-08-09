
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
  Camera,
  Lock,
  Star
} from 'lucide-react';
import { availableBadges, getAvailableBadges, getLockedBadges, type BadgeRequirement } from '@/utils/badgeUtils';
import {phases} from "@/utils/phaseUtils.ts";

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
  period?: string;
  school?: string;
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
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Loading user data for:', user);

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o perfil.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (!profileData) {
        console.log('No profile found, user might need to complete setup');
        toast({
          title: "Perfil não encontrado",
          description: "Por favor, complete seu cadastro.",
          variant: "destructive"
        });
        setLoading(false);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Você precisa estar logado para ver esta página.</p>
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
              <Avatar className="w-40 h-40 border-4 border-white">
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
                  <div className="space-y-2">
                    <Label htmlFor="pgm_role">Cargo no PGM</Label>
                    <Input
                      id="pgm_role"
                      value={formData.pgm_role || ''}
                      onChange={(e) => setFormData({...formData, pgm_role: e.target.value})}
                      placeholder="Ex: Líder, Auxiliar, Participante"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pgm_number">Número PGM</Label>
                    <Input
                      id="pgm_number"
                      value={formData.pgm_number || ''}
                      onChange={(e) => setFormData({...formData, pgm_number: e.target.value})}
                      placeholder="Ex: PGM 01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Participações</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.participates_flow_up || false}
                          onChange={(e) => setFormData({...formData, participates_flow_up: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Participa do Flow Up</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.participates_irmandade || false}
                          onChange={(e) => setFormData({...formData, participates_irmandade: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Participa da Irmandade</span>
                      </label>
                    </div>
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
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{profile.pgm_role || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{profile.pgm_number || 'Não informado'}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Participações:</p>
                    <div className="flex gap-2">
                      {profile.participates_flow_up && (
                        <Badge variant="secondary">Flow Up</Badge>
                      )}
                      {profile.participates_irmandade && (
                        <Badge variant="secondary">Irmandade</Badge>
                      )}
                      {!profile.participates_flow_up && !profile.participates_irmandade && (
                        <span className="text-sm text-gray-500">Nenhuma</span>
                      )}
                    </div>
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

        {/* Tabs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades e Conquistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Livros Completados */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Livros Lidos
                </h3>
                {completedMissions.filter(m => m.mission_type === 'book').length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum livro lido ainda</p>
                ) : (
                  <div className="space-y-2">
                    {completedMissions.filter(m => m.mission_type === 'book').slice(0, 5).map((mission) => (
                      <div key={mission.id} className="p-2 bg-blue-50 rounded border">
                        <p className="font-medium text-sm">{mission.mission_name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(mission.completed_at).toLocaleDateString('pt-BR')} • +{mission.points} pts
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cursos Completados */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Cursos Feitos
                </h3>
                {completedMissions.filter(m => m.mission_type === 'course').length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum curso feito ainda</p>
                ) : (
                  <div className="space-y-2">
                    {completedMissions.filter(m => m.mission_type === 'course').slice(0, 5).map((mission) => (
                      <div key={mission.id} className="p-2 bg-purple-50 rounded border">
                        <p className="font-medium text-sm">{mission.mission_name}</p>
                        <p className="text-xs text-gray-600">
                          {mission.school && `${mission.school} • `}
                          {new Date(mission.completed_at).toLocaleDateString('pt-BR')} • +{mission.points} pts
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Missões Completadas */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Missões Feitas
                </h3>
                {completedMissions.filter(m => m.mission_type === 'mission').length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma missão feita ainda</p>
                ) : (
                  <div className="space-y-2">
                    {completedMissions.filter(m => m.mission_type === 'mission').slice(0, 5).map((mission) => (
                      <div key={mission.id} className="p-2 bg-green-50 rounded border">
                        <p className="font-medium text-sm">{mission.mission_name}</p>
                        <p className="text-xs text-gray-600">
                          {mission.period && `${mission.period} • `}
                          {new Date(mission.completed_at).toLocaleDateString('pt-BR')} • +{mission.points} pts
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Badges e Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              {/* Earned Badges */}
              {userBadges.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-green-700">Badges Conquistados</h3>
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
                </div>
              )}

              {(() => {
                const userStats = {
                  points: profile?.points || 0,
                  missions: missionsCount,
                  books: booksCount,
                  courses: coursesCount,
                  consecutive_days: profile?.consecutive_days || 0
                };

                const earnedBadgeIds = userBadges.map(b => {
                  // Map current badge names to available badge IDs
                  const foundBadge = availableBadges.find(ab => ab.name === b.badge_name);
                  return foundBadge?.id || '';
                }).filter(id => id !== '');

                const availableForUnlock = getAvailableBadges(userStats, earnedBadgeIds);
                const lockedBadges = getLockedBadges(userStats, earnedBadgeIds);

                return (
                  <>
                    {/* Available to Unlock */}
                    {availableForUnlock.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-blue-700">Prontos para Desbloquear!</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {availableForUnlock.map((badge) => (
                            <div key={badge.id} className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-300 rounded-lg">
                              <div className="text-3xl mb-2">{badge.icon}</div>
                              <h4 className="font-semibold text-sm text-blue-800">{badge.name}</h4>
                              <p className="text-xs text-blue-700 mt-1">{badge.description}</p>
                              <Badge className="mt-2 bg-green-100 text-green-800">Desbloqueável!</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Locked Badges */}
                    {lockedBadges.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-700">Próximos Objetivos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {lockedBadges.slice(0, 8).map((badge) => (
                            <div key={badge.id} className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg opacity-75">
                              <div className="relative">
                                <div className="text-3xl mb-2 filter grayscale">{badge.icon}</div>
                                <Lock className="w-4 h-4 text-gray-500 absolute top-0 right-0" />
                              </div>
                              <h4 className="font-semibold text-sm text-gray-700">{badge.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                              <Badge variant="outline" className="mt-2 text-gray-500">
                                {badge.requirement.type === 'points' ? `${badge.requirement.count} pontos` :
                                badge.requirement.type === 'missions' ? `${badge.requirement.count} missões` :
                                badge.requirement.type === 'books' ? `${badge.requirement.count} livros` :
                                badge.requirement.type === 'courses' ? `${badge.requirement.count} cursos` :
                                `${badge.requirement.count} dias consecutivos`}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
