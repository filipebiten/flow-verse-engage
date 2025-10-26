import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { supabase } from '@/integrations/supabase/client.ts';
import { useAuth } from '@/hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import { UserProfileModal } from '@/components/UserProfileModal.tsx';
import {
  Trophy,
  Target,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import {PhaseBadge} from "@/components/PhaseBadge.tsx";
import {definePeriodBadgeColor} from "@/helpers/colorHelper.ts";
import {getPhaseInfo} from "@/utils/phaseUtils.ts";
import {MissionSugestionsForm} from "@/pages/feed/missionSugestionsForm.tsx";

interface FeedActivity {
  id: string;
  user_id: string;
  mission_name: string;
  mission_type: string;
  points: number;
  completed_at: string;
  period?: string;
  school?: string;
  user_name: string;
  user_photo?: string;
  user_phase: string;
  comment?: string;
}

interface PhaseChange {
  id: string;
  user_id: string;
  previous_phase: string;
  new_phase: string;
  phase_icon?: string;
  total_points: number;
  changed_at: string;
  user_name: string;
  user_photo?: string;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_name: string;
  badge_icon: string;
  earned_at: string;
  user_name: string;
  user_photo?: string;
}

interface FeedStats {
  totalUsers: number;
  totalActivities: number;
  totalPoints: number;
  topUsers: Array<{
    id: string;
    name: string;
    points: number;
    phase: string;
    photo?: string;
  }>;
}

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [phaseChanges, setPhaseChanges] = useState<PhaseChange[]>([]);
  const [badgeActivities, setBadgeActivities] = useState<UserBadge[]>([]);
  const [stats, setStats] = useState<FeedStats>({
    totalUsers: 0,
    totalActivities: 0,
    totalPoints: 0,
    topUsers: []
  });

  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [userMissions, setUserMissions] = useState<any[]>([]);
  const [missionSugestionFormVisible, setMissionSugestionFormVisible] = useState<boolean>(false);

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    try {

      const { data: activitiesData, error: activitiesError } = await supabase
          .from('missions_completed')
          .select('*')
          .order('completed_at', { ascending: false })
          .limit(50)

      const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('points', { ascending: false });

      const profilesMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }

      const formattedActivities: FeedActivity[] = [];
      if (activitiesData) {
        activitiesData.forEach(activity => {
          const userProfile = profilesMap.get(activity.user_id);
          if (userProfile) {
            formattedActivities.push({
              id: activity.id,
              user_id: activity.user_id,
              mission_name: activity.mission_name,
              mission_type: activity.mission_type,
              points: activity.points,
              completed_at: activity.completed_at,
              period: activity.period,
              school: activity.school,
              user_name: userProfile.name,
              user_photo: userProfile.profile_photo_url,
              user_phase: userProfile.phase,
              comment: activity?.comment || ""
            });
          }
        });
      }
      setActivities(formattedActivities);

      const { data: phaseData, error: phaseError } = await supabase
          .from('phase_changes')
          .select('*')
          .order('changed_at', { ascending: false })
          .limit(30);

      const formattedPhaseChanges: PhaseChange[] = [];
      if (phaseData) {
        phaseData.forEach(change => {
          const userProfile = profilesMap.get(change.user_id);
          if (userProfile) {
            formattedPhaseChanges.push({
              id: change.id,
              user_id: change.user_id,
              previous_phase: change.previous_phase,
              new_phase: change.new_phase,
              phase_icon: change.phase_icon,
              total_points: change.total_points,
              changed_at: change.changed_at,
              user_name: userProfile.name,
              user_photo: userProfile.profile_photo_url
            });
          }
        });
      }
      setPhaseChanges(formattedPhaseChanges);

      const { data: badgeData, error: badgeError } = await supabase
          .from('user_badges')
          .select('*, badges ( id, name, icon, description)')
          .order('earned_at', { ascending: false })
          .limit(30);

      const formattedBadges: UserBadge[] = [];
      if (badgeData) {
        badgeData.forEach(badge => {
          const userProfile = profilesMap.get(badge.user_id);
          if (userProfile) {
            formattedBadges.push({
              id: badge.id,
              user_id: badge.badges.user_id,
              badge_name: badge.badges.name,
              badge_icon: badge.badges.icon,
              earned_at: badge.earned_at,
              user_name: userProfile.name,
              user_photo: userProfile.profile_photo_url
            });
          }
        });
      }
      setBadgeActivities(formattedBadges);

      if (profilesData) {
        const totalUsers = profilesData.length;
        const totalPoints = profilesData.reduce((sum, profile) => sum + (profile.points || 0), 0);
        const topUsers = profilesData.slice(0, 5).map(profile => ({
          id: profile.id,
          name: profile.name,
          points: profile.points || 0,
          phase: profile.phase || 'Riacho',
          photo: profile.profile_photo_url
        }));

        setStats({
          totalUsers,
          totalActivities: formattedActivities.length,
          totalPoints,
          topUsers
        });
      }

    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const openUserProfile = async (userId: string) => {
    try {

      const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

      if (profile) {
        setSelectedUser(profile);

        const { data: badges } = await supabase
            .from('user_badges')
            .select('*, badges (id, name, icon)')
            .eq('user_id', userId);

        setUserBadges(badges || []);

        const { data: missions } = await supabase
            .from('missions_completed')
            .select('*')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        setUserMissions(missions || []);

        setUserModalOpen(true);
      }
    } catch (error) {
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
    return new Date(timestamp).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'course':
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      default:
        return <Target className="w-4 h-4 text-purple-600" />;
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando feed...</p>
          </div>
        </div>
    );
  }

  // Combine all activities for timeline
  const allActivities = [
    ...activities.map(activity => ({
      type: 'mission' as const,
      data: activity,
      timestamp: activity.completed_at
    })),
    ...phaseChanges.map(change => ({
      type: 'phase' as const,
      data: change,
      timestamp: change.changed_at
    })),
    ...badgeActivities.map(badge => ({
      type: 'badge' as const,
      data: badge,
      timestamp: badge.earned_at
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  function selectMissionTypeColor(mission_type: string) {
    return mission_type === "mission" ? "text-purple-500" : mission_type === "book" ? "text-green-500" : "text-blue-500";
  }

  return (
      <>
        <MissionSugestionsForm open={missionSugestionFormVisible} onOpenChange={setMissionSugestionFormVisible}></MissionSugestionsForm>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 p-4">
          <div className="max-w-6xl mx-auto flex flex-1 flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                      <p className="text-sm text-gray-600">Membros</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.totalActivities}</p>
                      <p className="text-sm text-gray-600">Atividades</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{stats.totalPoints}</p>
                      <p className="text-sm text-gray-600">Pontos Totais da Rede</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">Top Usuários</p>
                    <div className="flex -space-x-2 justify-center mt-2">
                      {stats.topUsers.slice(0, 5).map((user, index) => (
                          <Avatar key={index} className="w-12 h-12 border-2 border-white">
                            <AvatarImage src={user.photo || ''} />
                            <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
              <div className="lg:col-span-2 space-y-1 flex flex-col p-2">
                {allActivities.map((item, index) => {
                  const user = item.data.user_name;
                  const photo = item.data.user_photo || '';
                  const timeAgo = formatTimeAgo(item.timestamp);

                  return (
                      <div key={`${item.type}-${index}`} className="relative pb-4">
                        <div
                            className="relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md
                              transition-all duration-200 p-4 pl-6 flex space-x-3 items-center"
                        >
                          <div
                              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white
                                 rounded-full w-10 h-10 flex items-center justify-center"
                          >
                            {item.type === 'phase' && <Trophy className="w-5 h-5 text-amber-500" />}
                            {item.type === 'badge' && <Award className="w-5 h-5 text-pink-500" />}
                            {item.type === 'mission' && (
                                <>
                                  {(item.data as FeedActivity).mission_type === 'mission' && (
                                      <Target className="w-5 h-5 text-purple-500" />
                                  )}
                                  {(item.data as FeedActivity).mission_type === 'book' && (
                                      <BookOpen className="w-5 h-5 text-green-500" />
                                  )}
                                  {(item.data as FeedActivity).mission_type === 'course' && (
                                      <GraduationCap className="w-5 h-5 text-blue-500" />
                                  )}
                                </>
                            )}
                          </div>

                          {/* Avatar */}
                          <Avatar
                              className="w-14 h-14 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                              onClick={() => openUserProfile(item.data.user_id)}
                          >
                            <AvatarImage src={photo} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {user.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-1">
                            {item.type === 'mission' && (
                                <>
                                  <p className="text-sm text-gray-800">
                                  <span
                                      className="font-semibold text-blue-900 cursor-pointer hover:text-blue-600 transition-colors"
                                      onClick={() => openUserProfile(item.data.user_id)}
                                  >
                                    {user}
                                  </span>{' '}
                                    completou uma missão:{" "}
                                    <span
                                        className={`font-bold ${selectMissionTypeColor(
                                            (item.data as FeedActivity).mission_type
                                        )}`}
                                    >
                                    {(item.data as FeedActivity).mission_name}
                                  </span>
                                  </p>

                                  {item.data?.comment && (
                                      <p className="text-gray-600 text-sm italic">
                                        “{item.data.comment}”
                                      </p>
                                  )}

                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge className="bg-green-100 hover:bg-green-100 text-green-700 text-xs">
                                      +{(item.data as FeedActivity).points} pontos
                                    </Badge>
                                    {(item.data as FeedActivity).mission_type === 'course' && (
                                        <Badge className="bg-blue-700 hover:bg-blue-700 text-xs">
                                          {(item.data as FeedActivity).school}
                                        </Badge>
                                    )}
                                    <span className="text-xs text-gray-600">{timeAgo}</span>
                                  </div>
                                </>
                            )}

                            {item.type === 'phase' && (
                                <>
                                  <p className="text-sm text-gray-800">
                                    <span
                                        className="font-semibold text-blue-900 cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => openUserProfile(item.data.user_id)}
                                    >
                                      {user}
                                    </span>{' '}
                                    avançou para a fase{" "}
                                    <span className="font-bold text-amber-600">
                                      {(item.data as PhaseChange).new_phase}
                                    </span> 🎉
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge className="bg-amber-100 text-amber-700 text-xs">
                                      {(item.data as PhaseChange).total_points} pontos totais
                                    </Badge>
                                    <span className="text-xs text-gray-600">{timeAgo}</span>
                                  </div>
                                </>
                            )}

                            {item.type === 'badge' && (
                                <>
                                  <p className="text-sm text-gray-800">
                                    <span
                                        className="font-semibold text-blue-900 cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => openUserProfile(item.data.user_id)}
                                    >
                                      {user}
                                    </span>{' '}
                                    conquistou o título:{" "}
                                    <span className="font-bold text-pink-600">
                                      {(item.data as UserBadge).badge_name}
                                    </span>{' '}
                                    🏅
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge className="bg-pink-100 hover:bg-pink-100 text-pink-700 text-xs">
                                      Novo título
                                    </Badge>
                                    <span className="text-xs text-gray-600">{timeAgo}</span>
                                  </div>
                                </>
                            )}
                          </div>
                        </div>
                      </div>
                  );
                })}

              </div>

              {/* Sidebar */}
              <div className="space-y-4">

                {/* Top Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2"/>
                      Top Membros
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats.topUsers.map((user, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">
                            {index + 1}
                          </div>
                          <Avatar
                              className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                              onClick={() => openUserProfile(user.id)}
                          >
                            <AvatarImage src={user.photo || ''} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex-1 ${user.name.includes(" ") ? "break-words" : "break-all"}`}>
                            <p
                                className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => openUserProfile(user.id)}
                            >
                              {user.name}
                            </p>
                            <PhaseBadge userPhase={user.phase}></PhaseBadge>
                          </div>
                        </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setMissionSugestionFormVisible(true)}
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Sugerir Missões
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* User Profile Modal */}
          {selectedUser && (
              <UserProfileModal
                  isOpen={userModalOpen}
                  onClose={() => setUserModalOpen(false)}
                  profile={selectedUser}
                  badges={userBadges}
                  completedMissions={userMissions}
              />
          )}
        </div>
      </>
  );
};

export default Feed;
