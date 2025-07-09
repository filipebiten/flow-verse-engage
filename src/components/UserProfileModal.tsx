import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target, BookOpen, Award } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  phase: string;
  pgm_role?: string;
  pgm_number?: string;
  participates_flow_up: boolean;
  participates_irmandade: boolean;
  profile_photo_url?: string;
}

interface UserBadge {
  id: string;
  badge_name: string;
  badge_icon: string;
  earned_at: string;
}

interface CompletedMission {
  id: string;
  mission_name: string;
  mission_type: string;
  points: number;
  completed_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  badges: UserBadge[];
  completedMissions: CompletedMission[];
}

const getPhaseInfo = (phase: string) => {
  const phases = {
    "Riacho": { emoji: "🌀", color: "from-green-400 to-blue-400" },
    "Correnteza": { emoji: "🌊", color: "from-blue-500 to-teal-500" },
    "Cachoeira": { emoji: "💥", color: "from-purple-600 to-blue-600" },
    "Oceano": { emoji: "🌌", color: "from-blue-900 to-indigo-900" }
  };
  return phases[phase as keyof typeof phases] || phases["Riacho"];
};

export const UserProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  badges,
  completedMissions
}) => {
  const phaseInfo = getPhaseInfo(profile.phase);
  const booksCount = completedMissions.filter(m => m.mission_type === 'book').length;
  const coursesCount = completedMissions.filter(m => m.mission_type === 'course').length;
  const missionsCount = completedMissions.filter(m => m.mission_type === 'mission').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil do Usuário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <Card className="overflow-hidden">
            <div className={`bg-gradient-to-r ${phaseInfo.color} p-6 text-white`}>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-4 border-white">
                  {profile.profile_photo_url ? (
                    <AvatarImage src={profile.profile_photo_url} alt={profile.name} />
                  ) : (
                    <AvatarFallback className="bg-white text-gray-800 text-xl font-bold">
                      {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-white text-gray-800">
                      {phaseInfo.emoji} {profile.phase}
                    </Badge>
                    <span className="text-white/90">{profile.points || 0} pontos</span>
                  </div>
                  {profile.pgm_number && (
                    <p className="text-white/80">{profile.pgm_number}</p>
                  )}
                  {profile.pgm_role && (
                    <p className="text-white/80">{profile.pgm_role}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Participações */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Participações</h3>
                <div className="space-y-2">
                  {profile.participates_flow_up && (
                    <Badge variant="secondary" className="mr-2">Flow Up</Badge>
                  )}
                  {profile.participates_irmandade && (
                    <Badge variant="secondary">Irmandade</Badge>
                  )}
                  {!profile.participates_flow_up && !profile.participates_irmandade && (
                    <span className="text-sm text-gray-500">Nenhuma participação</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <BookOpen className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">{booksCount}</div>
                    <p className="text-xs text-gray-600">Livros</p>
                  </div>
                  <div>
                    <Target className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">{missionsCount}</div>
                    <p className="text-xs text-gray-600">Missões</p>
                  </div>
                  <div>
                    <Award className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-600">{coursesCount}</div>
                    <p className="text-xs text-gray-600">Cursos</p>
                  </div>
                  <div>
                    <Trophy className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-yellow-600">{badges.length}</div>
                    <p className="text-xs text-gray-600">Badges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Badges Conquistados</h3>
                <div className="grid grid-cols-3 gap-3">
                  {badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className="text-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg"
                    >
                      <div className="text-2xl mb-1">{badge.badge_icon}</div>
                      <h4 className="font-semibold text-xs text-yellow-800">{badge.badge_name}</h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activities */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Atividades Recentes</h3>
              {completedMissions.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma atividade recente</p>
              ) : (
                <div className="space-y-2">
                  {completedMissions.slice(0, 5).map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{mission.mission_name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(mission.completed_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        +{mission.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};