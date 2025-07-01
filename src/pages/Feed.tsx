
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Share2, 
  Trophy, 
  Target, 
  BookOpen, 
  GraduationCap,
  Clock,
  ThumbsUp,
  Award,
  Flame,
  Crown,
  TrendingUp
} from 'lucide-react';

interface FeedActivity {
  id: string;
  userId: string;
  userName: string;
  userPgm: string;
  userPhoto?: string;
  type: 'mission' | 'book' | 'course' | 'badge' | 'phase';
  title: string;
  description: string;
  timestamp: string;
  likes: number;
  missionName?: string;
  points?: number;
  period?: string;
  school?: string;
  badgeIcon?: string;
  badgeName?: string;
  phaseIcon?: string;
  phaseName?: string;
  previousPhase?: string;
}

const Feed = () => {
  const navigate = useNavigate();
  
  // Load activities from localStorage
  const [activities] = useState<FeedActivity[]>(() => {
    const missionActivities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
    const phaseChanges = JSON.parse(localStorage.getItem('phaseChanges') || '[]');
    const badgeEarned = JSON.parse(localStorage.getItem('badgeEarned') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const allActivities = [];
    
    // Convert mission activities to feed activities
    missionActivities.forEach((activity: any) => {
      const user = users.find((u: any) => u.id === activity.userId);
      allActivities.push({
        id: activity.id,
        userId: activity.userId,
        userName: activity.userName,
        userPgm: user?.pgmNumber || 'PGM000',
        userPhoto: user?.profilePhoto,
        type: activity.type || 'mission',
        title: activity.missionName,
        description: `Completou: ${activity.missionName}`,
        timestamp: activity.timestamp,
        likes: Math.floor(Math.random() * 10),
        missionName: activity.missionName,
        points: activity.points,
        period: activity.period,
        school: activity.school
      });
    });
    
    // Add phase changes
    phaseChanges.forEach((change: any) => {
      const user = users.find((u: any) => u.id === change.userId);
      allActivities.push({
        id: `phase-${change.id}`,
        userId: change.userId,
        userName: change.userName,
        userPgm: user?.pgmNumber || 'PGM000',
        userPhoto: user?.profilePhoto,
        type: 'phase' as const,
        title: `Avançou para a fase ${change.newPhase}!`,
        description: `Passou de ${change.previousPhase} para ${change.newPhase}`,
        timestamp: change.timestamp,
        likes: Math.floor(Math.random() * 15) + 5,
        phaseIcon: change.phaseIcon,
        phaseName: change.newPhase,
        previousPhase: change.previousPhase,
        points: change.totalPoints
      });
    });
    
    // Add badge achievements
    badgeEarned.forEach((badge: any) => {
      const user = users.find((u: any) => u.id === badge.userId);
      allActivities.push({
        id: `badge-${badge.id}`,
        userId: badge.userId,
        userName: badge.userName,
        userPgm: user?.pgmNumber || 'PGM000',
        userPhoto: user?.profilePhoto,
        type: 'badge' as const,
        title: `Conquistou um novo badge!`,
        description: `Ganhou o badge: ${badge.badgeName}`,
        timestamp: badge.timestamp,
        likes: Math.floor(Math.random() * 12) + 3,
        badgeIcon: badge.badgeIcon,
        badgeName: badge.badgeName
      });
    });
    
    return allActivities.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  const getActivityIcon = (type: FeedActivity['type']) => {
    switch (type) {
      case 'mission': return <Target className="w-5 h-5 text-blue-500" />;
      case 'book': return <BookOpen className="w-5 h-5 text-green-500" />;
      case 'course': return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'badge': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'phase': return <TrendingUp className="w-5 h-5 text-orange-500" />;
      default: return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: FeedActivity['type']) => {
    switch (type) {
      case 'mission': return 'border-l-blue-500 bg-blue-50';
      case 'book': return 'border-l-green-500 bg-green-50';
      case 'course': return 'border-l-purple-500 bg-purple-50';
      case 'badge': return 'border-l-yellow-500 bg-yellow-50';
      case 'phase': return 'border-l-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <div>
                <CardTitle className="text-lg sm:text-2xl">Feed da Rede FLOW</CardTitle>
                <p className="text-sm text-gray-600">Acompanhe o progresso da comunidade</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Activities Feed */}
        <div className="space-y-3 sm:space-y-4">
          {activities.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma atividade ainda</p>
              <p className="text-sm text-muted-foreground mt-2">
                As atividades da comunidade aparecerão aqui
              </p>
            </Card>
          ) : (
            activities.map((activity) => (
              <Card key={activity.id} className={`hover:shadow-md transition-shadow border-l-4 ${getActivityColor(activity.type)}`}>
                <CardContent className="p-3 sm:p-6">
                  {/* User Header */}
                  <div className="flex items-start gap-3 mb-3 sm:mb-4">
                    <Avatar 
                      className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 cursor-pointer"
                      onClick={() => handleUserClick(activity.userId)}
                    >
                      {activity.userPhoto ? (
                        <AvatarImage src={activity.userPhoto} alt={activity.userName} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm sm:text-base font-semibold">
                          {getUserInitials(activity.userName)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                        <div className="min-w-0">
                          <h3 
                            className="font-semibold text-sm sm:text-base truncate cursor-pointer hover:text-blue-600"
                            onClick={() => handleUserClick(activity.userId)}
                          >
                            {activity.userName}
                          </h3>
                          <p className="text-xs text-gray-500">{activity.userPgm}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {getActivityIcon(activity.type)}
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm sm:text-base mb-1">{activity.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{activity.description}</p>
                    </div>

                    {/* Special Content for Phase and Badge */}
                    {activity.type === 'phase' && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg border border-orange-200">
                        <span className="text-3xl">{activity.phaseIcon}</span>
                        <div>
                          <h5 className="font-semibold text-orange-800">Nova Fase: {activity.phaseName}</h5>
                          <p className="text-sm text-orange-600">Alcançou {activity.points} pontos!</p>
                        </div>
                      </div>
                    )}

                    {activity.type === 'badge' && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg border border-yellow-200">
                        <span className="text-3xl">{activity.badgeIcon}</span>
                        <div>
                          <h5 className="font-semibold text-yellow-800">Novo Badge: {activity.badgeName}</h5>
                          <p className="text-sm text-yellow-600">Conquista desbloqueada!</p>
                        </div>
                      </div>
                    )}

                    {/* Points and Metadata */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {activity.points && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          +{activity.points} pontos
                        </Badge>
                      )}
                      {activity.period && (
                        <Badge variant="outline">{activity.period}</Badge>
                      )}
                      {activity.school && (
                        <Badge variant="outline">{activity.school}</Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span className="text-xs sm:text-sm">{activity.likes}</span>
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {activities.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" className="w-full sm:w-auto">
              Carregar Mais Atividades
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
