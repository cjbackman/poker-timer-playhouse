
export type BlindLevel = {
  id: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  duration: number; // in seconds
};

export type BlindStructure = {
  name: string;
  levels: BlindLevel[];
};

// Predefined blind structures
export const blindStructures: { [key: string]: BlindStructure } = {
  regular: {
    name: "Juldagspokern",
    levels: [
      { id: 1, smallBlind: 10, bigBlind: 25, ante: 0, duration: 1200 },
      { id: 2, smallBlind: 25, bigBlind: 50, ante: 0, duration: 1200 },
      { id: 3, smallBlind: 50, bigBlind: 100, ante: 0, duration: 1200 },
      { id: 4, smallBlind: 75, bigBlind: 150, ante: 0, duration: 1200 },
      { id: 5, smallBlind: 100, bigBlind: 200, ante: 0, duration: 1200 },
      { id: 6, smallBlind: 150, bigBlind: 300, ante: 0, duration: 1200 },
      { id: 7, smallBlind: 200, bigBlind: 400, ante: 0, duration: 1200 },
      { id: 8, smallBlind: 300, bigBlind: 600, ante: 0, duration: 1200 },
      { id: 9, smallBlind: 400, bigBlind: 800, ante: 0, duration: 1200 },
      { id: 10, smallBlind: 500, bigBlind: 1000, ante: 0, duration: 1200 },
      { id: 11, smallBlind: 700, bigBlind: 1400, ante: 0, duration: 1200 },
      { id: 12, smallBlind: 1000, bigBlind: 2000, ante: 0, duration: 1200 },
      { id: 13, smallBlind: 1500, bigBlind: 3000, ante: 0, duration: 1200 },
      { id: 14, smallBlind: 2000, bigBlind: 4000, ante: 0, duration: 1200 },
      { id: 15, smallBlind: 3000, bigBlind: 6000, ante: 0, duration: 1200 },
      { id: 16, smallBlind: 5000, bigBlind: 10000, ante: 0, duration: 1200 },
      { id: 17, smallBlind: 7500, bigBlind: 14000, ante: 0, duration: 1200 },
      { id: 18, smallBlind: 10000, bigBlind: 20000, ante: 0, duration: 1200 },
      { id: 19, smallBlind: 15000, bigBlind: 30000, ante: 0, duration: 1200 },
      { id: 20, smallBlind: 20000, bigBlind: 40000, ante: 0, duration: 1200 },
    ],
  },
};

// Helper function to get the next blind level
export const getNextLevel = (
  structure: BlindStructure,
  currentLevelId: number
): BlindLevel | null => {
  const currentIndex = structure.levels.findIndex(
    (level) => level.id === currentLevelId
  );
  if (currentIndex === -1 || currentIndex === structure.levels.length - 1) {
    return null;
  }
  return structure.levels[currentIndex + 1];
};
