import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Target, 
  BookOpen, 
  GraduationCap,
  Clock,
  ThumbsUp,
  Award,
  Flame
} from 'lucide-react';

interface FeedActivity {
  id: string;
  userId: string;
  userName: string;
  userPgm: string;
  type: 'mission' | 'book' | 'course' | 'badge' | 'phase';
  title: string;
  description: string;
  timestamp: string;
  likes: number;
  comments: number;
  bookImage?: string;
  badgeInfo?: {
    name: string;
    icon: string;
    description: string;
  };
}

const Feed = () => {
  const [activities] = useState<FeedActivity[]>([
    {
      id: "1",
      userId: "user1",
      userName: "João Silva",
      userPgm: "PGM001",
      type: "mission",
      title: "Oração Matinal",
      description: "Completou a missão de oração matinal",
      timestamp: "2024-01-15T08:30:00Z",
      likes: 5,
      comments: 2
    },
    {
      id: "2",
      userId: "user1",
      userName: "João Silva", 
      userPgm: "PGM001",
      type: "book",
      title: "Livro da Vida",
      description: "Concluiu a leitura do livro",
      timestamp: "2024-01-14T20:00:00Z",
      likes: 8,
      comments: 4,
      bookImage: "/placeholder.svg"
    },
    {
      id: "3",
      userId: "user2",
      userName: "Maria Santos",
      userPgm: "PGM002", 
      type: "badge",
      title: "Novo Badge Conquistado!",
      description: "Conquistou o badge Leitor Iniciante",
      timestamp: "2024-01-13T15:00:00Z",
      likes: 12,
      comments: 6,
      badgeInfo: {
        name: "Leitor Iniciante",
        icon: "📖",
        description: "Começando a jornada da leitura"
      }
    }
  ]);

  const getActivityIcon = (type: FeedActivity['type']) => {
    switch (type) {
      case 'mission': return <Target className="w-5 h-5 text-blue-500" />;
      case 'book': return <BookOpen className="w-5 h-5 text-green-500" />;
      case 'course': return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'badge': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'phase': return <Award className="w-5 h-5 text-orange-500" />;
      default: return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header - Mobile Optimized */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <div>
                <CardTitle className="text-lg sm:text-2xl">Feed da Comunidade</CardTitle>
                <p className="text-sm text-gray-600">Acompanhe o progresso da comunidade</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Activities Feed - Mobile Optimized */}
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-6">
                {/* User Header */}
                <div className="flex items-start gap-3 mb-3 sm:mb-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm sm:text-base font-semibold">
                      {getUserInitials(activity.userName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{activity.userName}</h3>
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

                  {/* Special Content Based on Type */}
                  {activity.type === 'book' && activity.bookImage && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <img 
                        src={activity.bookImage} 
                        alt={activity.title}
                        className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded shadow-sm flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-green-800">📚 Livro Concluído</p>
                        <p className="text-xs text-green-600">Disponível para toda a comunidade ler!</p>
                      </div>
                    </div>
                  )}

                  {activity.type === 'badge' && activity.badgeInfo && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <span className="text-2xl sm:text-3xl flex-shrink-0">{activity.badgeInfo.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-yellow-800">{activity.badgeInfo.name}</p>
                        <p className="text-xs text-yellow-600">{activity.badgeInfo.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons - Mobile Optimized */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span className="text-xs sm:text-sm">{activity.likes}</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs sm:text-sm">{activity.comments}</span>
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More - Mobile Optimized */}
        <div className="flex justify-center pt-4">
          <Button variant="outline" className="w-full sm:w-auto">
            Carregar Mais Atividades
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
