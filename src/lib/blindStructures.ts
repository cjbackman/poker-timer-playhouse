
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
  slow: {
    name: "Slow",
    levels: [
      { id: 1, smallBlind: 5, bigBlind: 10, ante: 0, duration: 1200 }, // 20 min
      { id: 2, smallBlind: 10, bigBlind: 20, ante: 0, duration: 1200 },
      { id: 3, smallBlind: 15, bigBlind: 30, ante: 0, duration: 1200 },
      { id: 4, smallBlind: 25, bigBlind: 50, ante: 0, duration: 1200 },
      { id: 5, smallBlind: 50, bigBlind: 100, ante: 10, duration: 1200 },
      { id: 6, smallBlind: 75, bigBlind: 150, ante: 15, duration: 1200 },
      { id: 7, smallBlind: 100, bigBlind: 200, ante: 25, duration: 1200 },
      { id: 8, smallBlind: 150, bigBlind: 300, ante: 25, duration: 1200 },
      { id: 9, smallBlind: 200, bigBlind: 400, ante: 50, duration: 1200 },
      { id: 10, smallBlind: 300, bigBlind: 600, ante: 75, duration: 1200 },
      { id: 11, smallBlind: 400, bigBlind: 800, ante: 100, duration: 1200 },
      { id: 12, smallBlind: 500, bigBlind: 1000, ante: 100, duration: 1200 },
      { id: 13, smallBlind: 700, bigBlind: 1400, ante: 200, duration: 1200 },
      { id: 14, smallBlind: 1000, bigBlind: 2000, ante: 300, duration: 1200 },
      { id: 15, smallBlind: 1500, bigBlind: 3000, ante: 400, duration: 1200 },
      { id: 16, smallBlind: 2000, bigBlind: 4000, ante: 500, duration: 1200 },
      { id: 17, smallBlind: 3000, bigBlind: 6000, ante: 1000, duration: 1200 },
      { id: 18, smallBlind: 5000, bigBlind: 10000, ante: 1000, duration: 1200 },
    ],
  },
  regular: {
    name: "Regular",
    levels: [
      { id: 1, smallBlind: 5, bigBlind: 10, ante: 0, duration: 900 }, // 15 min
      { id: 2, smallBlind: 10, bigBlind: 20, ante: 0, duration: 900 },
      { id: 3, smallBlind: 25, bigBlind: 50, ante: 0, duration: 900 },
      { id: 4, smallBlind: 50, bigBlind: 100, ante: 10, duration: 900 },
      { id: 5, smallBlind: 75, bigBlind: 150, ante: 15, duration: 900 },
      { id: 6, smallBlind: 100, bigBlind: 200, ante: 25, duration: 900 },
      { id: 7, smallBlind: 200, bigBlind: 400, ante: 50, duration: 900 },
      { id: 8, smallBlind: 300, bigBlind: 600, ante: 75, duration: 900 },
      { id: 9, smallBlind: 500, bigBlind: 1000, ante: 100, duration: 900 },
      { id: 10, smallBlind: 700, bigBlind: 1400, ante: 200, duration: 900 },
      { id: 11, smallBlind: 1000, bigBlind: 2000, ante: 300, duration: 900 },
      { id: 12, smallBlind: 1500, bigBlind: 3000, ante: 400, duration: 900 },
      { id: 13, smallBlind: 2500, bigBlind: 5000, ante: 500, duration: 900 },
      { id: 14, smallBlind: 3500, bigBlind: 7000, ante: 1000, duration: 900 },
      { id: 15, smallBlind: 5000, bigBlind: 10000, ante: 1000, duration: 900 },
    ],
  },
  turbo: {
    name: "Turbo",
    levels: [
      { id: 1, smallBlind: 10, bigBlind: 20, ante: 0, duration: 600 }, // 10 min
      { id: 2, smallBlind: 25, bigBlind: 50, ante: 0, duration: 600 },
      { id: 3, smallBlind: 50, bigBlind: 100, ante: 10, duration: 600 },
      { id: 4, smallBlind: 100, bigBlind: 200, ante: 25, duration: 600 },
      { id: 5, smallBlind: 200, bigBlind: 400, ante: 50, duration: 600 },
      { id: 6, smallBlind: 300, bigBlind: 600, ante: 75, duration: 600 },
      { id: 7, smallBlind: 500, bigBlind: 1000, ante: 100, duration: 600 },
      { id: 8, smallBlind: 700, bigBlind: 1400, ante: 200, duration: 600 },
      { id: 9, smallBlind: 1000, bigBlind: 2000, ante: 300, duration: 600 },
      { id: 10, smallBlind: 1500, bigBlind: 3000, ante: 400, duration: 600 },
      { id: 11, smallBlind: 2500, bigBlind: 5000, ante: 500, duration: 600 },
      { id: 12, smallBlind: 5000, bigBlind: 10000, ante: 1000, duration: 600 },
    ],
  },
};

// Helper function to get the next blind level
export const getNextLevel = (structure: BlindStructure, currentLevelId: number): BlindLevel | null => {
  const currentIndex = structure.levels.findIndex(level => level.id === currentLevelId);
  if (currentIndex === -1 || currentIndex === structure.levels.length - 1) {
    return null;
  }
  return structure.levels[currentIndex + 1];
};
