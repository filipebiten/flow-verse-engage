export interface BadgeRequirement {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirement: {
    type: 'points' | 'missions' | 'books' | 'courses' | 'consecutive_days';
    count: number;
  };
}

export const availableBadges: BadgeRequirement[] = [
  // Points-based badges
  {
    id: 'first_points',
    name: 'Primeiros Passos',
    icon: '🌱',
    description: 'Ganhe seus primeiros 10 pontos',
    requirement: { type: 'points', count: 10 }
  },
  {
    id: 'hundred_points',
    name: 'Centurião',
    icon: '💯',
    description: 'Acumule 100 pontos',
    requirement: { type: 'points', count: 100 }
  },
  {
    id: 'five_hundred_points',
    name: 'Guerreiro',
    icon: '⚔️',
    description: 'Alcance 500 pontos',
    requirement: { type: 'points', count: 500 }
  },
  {
    id: 'thousand_points',
    name: 'Lenda',
    icon: '🏆',
    description: 'Conquiste 1000 pontos',
    requirement: { type: 'points', count: 1000 }
  },

  // Mission-based badges
  {
    id: 'first_mission',
    name: 'Iniciante',
    icon: '🎯',
    description: 'Complete sua primeira missão',
    requirement: { type: 'missions', count: 1 }
  },
  {
    id: 'five_missions',
    name: 'Dedicado',
    icon: '🏃',
    description: 'Complete 5 missões',
    requirement: { type: 'missions', count: 5 }
  },
  {
    id: 'ten_missions',
    name: 'Persistente',
    icon: '💪',
    description: 'Complete 10 missões',
    requirement: { type: 'missions', count: 10 }
  },

  // Book-based badges
  {
    id: 'first_book',
    name: 'Leitor',
    icon: '📖',
    description: 'Leia seu primeiro livro',
    requirement: { type: 'books', count: 1 }
  },
  {
    id: 'five_books',
    name: 'Bibliólogo',
    icon: '📚',
    description: 'Leia 5 livros',
    requirement: { type: 'books', count: 5 }
  },
  {
    id: 'ten_books',
    name: 'Sábio',
    icon: '🧙‍♂️',
    description: 'Leia 10 livros',
    requirement: { type: 'books', count: 10 }
  },

  // Course-based badges
  {
    id: 'first_course',
    name: 'Estudante',
    icon: '🎓',
    description: 'Complete seu primeiro curso',
    requirement: { type: 'courses', count: 1 }
  },
  {
    id: 'three_courses',
    name: 'Acadêmico',
    icon: '📜',
    description: 'Complete 3 cursos',
    requirement: { type: 'courses', count: 3 }
  },
  {
    id: 'five_courses',
    name: 'Scholar',
    icon: '🔬',
    description: 'Complete 5 cursos',
    requirement: { type: 'courses', count: 5 }
  },

  // Consecutive days badges
  {
    id: 'three_days',
    name: 'Consistente',
    icon: '🔥',
    description: '3 dias consecutivos',
    requirement: { type: 'consecutive_days', count: 3 }
  },
  {
    id: 'seven_days',
    name: 'Disciplinado',
    icon: '⭐',
    description: '7 dias consecutivos',
    requirement: { type: 'consecutive_days', count: 7 }
  },
  {
    id: 'thirty_days',
    name: 'Campeão',
    icon: '👑',
    description: '30 dias consecutivos',
    requirement: { type: 'consecutive_days', count: 30 }
  }
];

export const checkBadgeEligibility = (
  badge: BadgeRequirement,
  userStats: {
    points: number;
    missions: number;
    books: number;
    courses: number;
    consecutive_days: number;
  }
): boolean => {
  const { type, count } = badge.requirement;
  switch (type) {
    case 'points':
      return userStats.points >= count;
    case 'missions':
      return userStats.missions >= count;
    case 'books':
      return userStats.books >= count;
    case 'courses':
      return userStats.courses >= count;
    case 'consecutive_days':
      return userStats.consecutive_days >= count;
    default:
      return false;
  }
};

export const getEarnedBadges = (
  userStats: {
    points: number;
    missions: number;
    books: number;
    courses: number;
    consecutive_days: number;
  },
  earnedBadgeIds: string[] = []
): BadgeRequirement[] => {
  return availableBadges.filter(badge => 
    checkBadgeEligibility(badge, userStats) && earnedBadgeIds.includes(badge.id)
  );
};

export const getAvailableBadges = (
  userStats: {
    points: number;
    missions: number;
    books: number;
    courses: number;
    consecutive_days: number;
  },
  earnedBadgeIds: string[] = []
): BadgeRequirement[] => {
  return availableBadges.filter(badge => 
    !earnedBadgeIds.includes(badge.id) && checkBadgeEligibility(badge, userStats)
  );
};

export const getLockedBadges = (
  userStats: {
    points: number;
    missions: number;
    books: number;
    courses: number;
    consecutive_days: number;
  },
  earnedBadgeIds: string[] = []
): BadgeRequirement[] => {
  return availableBadges.filter(badge => 
    !earnedBadgeIds.includes(badge.id) && !checkBadgeEligibility(badge, userStats)
  );
};