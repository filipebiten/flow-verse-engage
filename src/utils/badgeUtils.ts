
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
