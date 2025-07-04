
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  BookOpen, 
  GraduationCap,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

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

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    try {
      // Load recent activities with user info
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('missions_completed')
        .select(`
          *,
          profiles!inner(name, profile_photo_url, phase)
        `)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (activitiesError) {
        console.error('Error loading activities:', activitiesError);
      } else {
        const formattedActivities = (activitiesData || []).map(activity => ({
          id: activity.id,
          user_id: activity.user_id,
          mission_name: activity.mission_name,
          mission_type: activity.mission_type,
          points: activity.points,
          completed_at: activity.completed_at,
          period: activity.period,
          school: activity.school,
          user_name: activity.profiles.name,
          user_photo: activity.profiles.profile_photo_url,
          user_phase: activity.profiles.phase
        }));
        setActivities(formattedActivities);
      }

      // Load recent phase changes
      const { data: phaseData, error: phaseError } = await supabase
        .from('phase_changes')
        .select(`
          *,
          profiles!inner(name, profile_photo_url)
        `)
        .order('changed_at', { ascending: false })
        .limit(10);

      if (phaseError) {
        console.error('Error loading phase changes:', phaseError);
      } else {
        const formattedPhaseChanges = (phaseData || []).map(change => ({
          id: change.id,
          user_id: change.user_id,
          previous_phase: change.previous_phase,
          new_phase: change.new_phase,
          phase_icon: change.phase_icon,
          total_points: change.total_points,
          changed_at: change.changed_at,
          user_name: change.profiles.name,
          user_photo: change.profiles.profile_photo_url
        }));
        setPhaseChanges(formattedPhaseChanges);
      }

      // Load recent badge activities
      const { data: badgeData, error: badgeError } = await supabase
        .from('user_badges')
        .select(`
          *,
          profiles!inner(name, profile_photo_url)
        `)
        .order('earned_at', { ascending: false })
        .limit(10);

      if (badgeError) {
        console.error('Error loading badges:', badgeError);
      } else {
        const formattedBadges = (badgeData || []).map(badge => ({
          id: badge.id,
          user_id: badge.user_id,
          badge_name: badge.badge_name,
          badge_icon: badge.badge_icon,
          earned_at: badge.earned_at,
          user_name: badge.profiles.name,
          user_photo: badge.profiles.profile_photo_url
        }));
        setBadgeActivities(formattedBadges);
      }

      // Load stats
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('name, points, phase, profile_photo_url')
        .order('points', { ascending: false });

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
      } else {
        const totalUsers = profilesData?.length || 0;
        const totalPoints = profilesData?.reduce((sum, profile) => sum + (profile.points || 0), 0) || 0;
        const topUsers = (profilesData || []).slice(0, 5).map(profile => ({
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
      console.error('Error loading feed data:', error);
    } finally {
      setLoading(false);
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

  const getMissionTypeLabel = (type: string) => {
    switch (type) {
      case 'book':
        return 'livro';
      case 'course':
        return 'curso';
      default:
        return 'missão';
    }
  };

  const getPhaseInfo = (phase: string) => {
    const phases = {
      "Riacho": { emoji: "🌀", color: "bg-green-100 text-green-800" },
      "Correnteza": { emoji: "🌊", color: "bg-blue-100 text-blue-800" },
      "Cachoeira": { emoji: "💥", color: "bg-purple-100 text-purple-800" },
      "Oceano": { emoji: "🌌", color: "bg-gray-900 text-white" }
    };
    return phases[phase as keyof typeof phases] || phases["Riacho"];
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
      type: 'mission',
      data: activity,
      timestamp: activity.completed_at
    })),
    ...phaseChanges.map(change => ({
      type: 'phase',
      data: change,
      timestamp: change.changed_at
    })),
    ...badgeActivities.map(badge => ({
      type: 'badge',
      data: badge,
      timestamp: badge.earned_at
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Stats */}
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
                  <p className="text-sm text-gray-600">Pontos Totais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">Top Usuários</p>
                <div className="flex -space-x-2 justify-center mt-2">
                  {stats.topUsers.slice(0, 3).map((user, index) => (
                    <Avatar key={index} className="w-8 h-8 border-2 border-white">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Feed de Atividades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {allActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma atividade recente encontrada.</p>
                  </div>
                ) : (
                  allActivities.map((item, index) => (
                    <div key={`${item.type}-${index}`} className="flex items-start space-x-3 p-3 rounded-lg border bg-white">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={item.data.user_photo || ''} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {item.data.user_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        {item.type === 'mission' && (
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{item.data.user_name}</span>
                              {' '}completou o {getMissionTypeLabel(item.data.mission_type)} {' '}
                              <span className="font-medium">{item.data.mission_name}</span>
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {getMissionIcon(item.data.mission_type)}
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                +{item.data.points} pts
                              </Badge>
                              {item.data.period && (
                                <Badge variant="outline" className="text-xs">
                                  {item.data.period}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(item.timestamp)}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {item.type === 'phase' && (
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{item.data.user_name}</span>
                              {' '}avançou de fase: {item.data.previous_phase} → {item.data.new_phase}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-lg">{item.data.phase_icon}</span>
                              <Badge className={getPhaseInfo(item.data.new_phase).color}>
                                {item.data.new_phase}
                              </Badge>
                              <Badge variant="secondary">
                                {item.data.total_points} pts total
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(item.timestamp)}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {item.type === 'badge' && (
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{item.data.user_name}</span>
                              {' '}conquistou um novo badge!
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-lg">{item.data.badge_icon}</span>
                              <Badge className="bg-purple-100 text-purple-700">
                                {item.data.badge_name}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(item.timestamp)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            
            {/* Top Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Top Membros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.topUsers.map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.photo || ''} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getPhaseInfo(user.phase).color} text-xs`}>
                          {getPhaseInfo(user.phase).emoji} {user.phase}
                        </Badge>
                        <span className="text-xs text-gray-500">{user.points} pts</span>
                      </div>
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
                  className="w-full" 
                  onClick={() => navigate('/missions')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Ver Missões
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/profile')}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Meu Perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
