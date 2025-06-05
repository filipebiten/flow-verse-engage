
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
