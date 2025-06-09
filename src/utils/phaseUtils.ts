
export interface Phase {
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  phrase: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export const phases: Phase[] = [
  {
    name: "Riacho",
    minPoints: 0,
    maxPoints: 250,
    icon: "🌀",
    phrase: "Começando a fluir",
    description: "Início da caminhada com Deus e com a FLOW.",
    colors: {
      primary: "#20B2AA", // Verde menta
      secondary: "#008B8B", // Azul petróleo
      accent: "#40E0D0",
      background: "#F0FFFF"
    }
  },
  {
    name: "Correnteza",
    minPoints: 251,
    maxPoints: 500,
    icon: "🌊",
    phrase: "Sendo levado por algo maior",
    description: "Engajado no PGM, abrindo-se ao mover de Deus.",
    colors: {
      primary: "#1E90FF", // Azul
      secondary: "#90EE90", // Verde claro
      accent: "#87CEEB",
      background: "#F8FFFF"
    }
  },
  {
    name: "Cachoeira",
    minPoints: 501,
    maxPoints: 1000,
    icon: "💥",
    phrase: "Entregue ao movimento de Deus",
    description: "Servindo com intensidade e sendo transformador.",
    colors: {
      primary: "#8A2BE2", // Roxo
      secondary: "#9370DB",
      accent: "#DDA0DD",
      background: "#F8F0FF"
    }
  },
  {
    name: "Oceano",
    minPoints: 1001,
    maxPoints: Infinity,
    icon: "🌌",
    phrase: "Profundamente imerso em Deus",
    description: "Maturidade espiritual, liderança e profundidade.",
    colors: {
      primary: "#191970", // Azul escuro
      secondary: "#000000", // Preto
      accent: "#4169E1",
      background: "#F0F8FF"
    }
  }
];

export const getUserPhase = (points: number): Phase => {
  return phases.find(phase => points >= phase.minPoints && points <= phase.maxPoints) || phases[0];
};

export const getNextPhase = (points: number): Phase | null => {
  const currentPhase = getUserPhase(points);
  const currentIndex = phases.findIndex(phase => phase.name === currentPhase.name);
  return currentIndex < phases.length - 1 ? phases[currentIndex + 1] : null;
};

export const applyPhaseColors = (phase: Phase) => {
  const root = document.documentElement;
  root.style.setProperty('--primary', phase.colors.primary);
  root.style.setProperty('--primary-foreground', '#FFFFFF');
  root.style.setProperty('--secondary', phase.colors.secondary);
  root.style.setProperty('--accent', phase.colors.accent);
  root.style.setProperty('--background', phase.colors.background);
};

// Sistema de badges/bottons
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirement: number;
  type: 'books' | 'courses' | 'consecutive' | 'allstars';
}

export const badges: Badge[] = [
  // Badges de Leitura
  { id: 'leitor-iniciante', name: 'Leitor Iniciante', icon: '📖', description: 'Começando a jornada da leitura.', requirement: 1, type: 'books' },
  { id: 'leitor-fluente', name: 'Leitor Fluente', icon: '📚', description: 'Já tem o hábito da leitura.', requirement: 5, type: 'books' },
  { id: 'leitor-voraz', name: 'Leitor Voraz', icon: '🔥📚', description: 'Não larga um bom livro por nada.', requirement: 10, type: 'books' },
  { id: 'mente-brilhante', name: 'Mente Brilhante', icon: '🧠✨', description: 'Um verdadeiro devorador de sabedoria.', requirement: 20, type: 'books' },
  
  // Badges de Cursos
  { id: 'discipulo-formacao', name: 'Discípulo em Formação', icon: '🎓', description: 'Iniciando sua jornada de formação.', requirement: 1, type: 'courses' },
  { id: 'aprendiz-dedicado', name: 'Aprendiz Dedicado', icon: '📘🎓', description: 'Mostrando sede de crescimento.', requirement: 3, type: 'courses' },
  { id: 'lider-construcao', name: 'Líder em Construção', icon: '🛠️🎓', description: 'Preparando-se para grandes responsabilidades.', requirement: 5, type: 'courses' },
  { id: 'mestre-jornada', name: 'Mestre da Jornada', icon: '🧙‍♂️📘', description: 'Um veterano na trilha do aprendizado.', requirement: 8, type: 'courses' },
  
  // Badges de Consecutividade
  { id: 'fiel-pouco', name: 'Fiel no Pouco', icon: '🕊️', description: 'A fidelidade começa nos detalhes.', requirement: 7, type: 'consecutive' },
  { id: 'constante-caminho', name: 'Constante no Caminho', icon: '⛰️', description: 'Perseverando todos os dias.', requirement: 30, type: 'consecutive' },
  { id: 'incansavel-missao', name: 'Incansável na Missão', icon: '🏃‍♂️🔥', description: 'Vive e respira propósito.', requirement: 90, type: 'consecutive' },
  { id: 'exemplo-disciplina', name: 'Exemplo de Disciplina', icon: '🛡️✨', description: 'Disciplina espiritual inspiradora.', requirement: 180, type: 'consecutive' },
  
  // All-Stars
  { id: 'discipulo-completo', name: 'Discípulo Completo', icon: '🧎‍♂️🔥', description: 'Vida com Deus em ação.', requirement: 0, type: 'allstars' },
  { id: 'guerreiro-rotina', name: 'Guerreiro da Rotina', icon: '🗡️📚🎓', description: 'Treinado, equipado e engajado.', requirement: 0, type: 'allstars' },
  { id: 'lider-exemplar', name: 'Líder Exemplar', icon: '👑🧠✨', description: 'Vive o que prega e prega com vida.', requirement: 0, type: 'allstars' }
];

export const checkBadgeEligibility = (user: any): Badge[] => {
  const eligibleBadges: Badge[] = [];
  
  badges.forEach(badge => {
    let isEligible = false;
    
    switch (badge.type) {
      case 'books':
        isEligible = (user.booksRead?.length || 0) >= badge.requirement;
        break;
      case 'courses':
        isEligible = (user.coursesCompleted?.length || 0) >= badge.requirement;
        break;
      case 'consecutive':
        isEligible = (user.consecutiveDays || 0) >= badge.requirement;
        break;
      case 'allstars':
        // All-Stars badges have specific requirements
        if (badge.id === 'discipulo-completo') {
          isEligible = (user.booksRead?.length || 0) >= 5 && 
                      (user.coursesCompleted?.length || 0) >= 3 && 
                      (user.consecutiveDays || 0) >= 30;
        } else if (badge.id === 'guerreiro-rotina') {
          isEligible = (user.booksRead?.length || 0) >= 10 && 
                      (user.coursesCompleted?.length || 0) >= 5 && 
                      (user.consecutiveDays || 0) >= 90;
        } else if (badge.id === 'lider-exemplar') {
          isEligible = (user.booksRead?.length || 0) >= 15 && 
                      (user.coursesCompleted?.length || 0) >= 8 && 
                      (user.consecutiveDays || 0) >= 180;
        }
        break;
    }
    
    if (isEligible && !user.badges?.includes(badge.id)) {
      eligibleBadges.push(badge);
    }
  });
  
  return eligibleBadges;
};
