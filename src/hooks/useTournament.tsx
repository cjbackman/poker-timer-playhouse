import { useState, useCallback, createContext, useContext, ReactNode, useEffect } from 'react';
import { BlindLevel, BlindStructure, blindStructures, getNextLevel } from '@/lib/blindStructures';
import { useTimer } from './useTimer';
import { playBlindChangeSound, playSuccessSound, playNotificationSound } from '@/lib/audio';
import { useToast } from '@/components/ui/use-toast';
import { saveTournamentState, loadTournamentState } from '@/lib/storage';

// Define types
export type PrizeDistributionType = 'percentage' | 'fixed';

export interface PrizeDistribution {
  type: PrizeDistributionType;
  first: number;
  second: number;
  third: number;
}

export interface TournamentSettings {
  title: string;
  buyInAmount: number;
  reBuyAmount: number;
  blindStructure: BlindStructure;
  prizeDistribution: PrizeDistribution;
}

export interface TournamentState {
  settings: TournamentSettings;
  buyIns: number;
  reBuys: number;
  currentLevelId: number;
  isBlindChangeAlert: boolean;
  isPanelOpen: boolean;
}

export interface TournamentContextValue {
  // State
  tournament: TournamentState;
  timer: ReturnType<typeof useTimer>;
  
  // Current info
  currentLevel: BlindLevel;
  nextLevel: BlindLevel | null;
  prizePool: number;
  prizes: { first: number; second: number; third: number };
  
  // Actions
  updateSettings: (settings: Partial<TournamentSettings>) => void;
  updateBlindStructure: (structureKey: string) => void;
  addBuyIn: () => void;
  removeBuyIn: () => void;
  addReBuy: () => void;
  removeReBuy: () => void;
  advanceToNextLevel: () => void;
  resetTournament: () => void;
  toggleSettingsPanel: () => void;
  dismissAlert: () => void;
  
  // Prize distribution
  updatePrizeDistribution: (distribution: Partial<PrizeDistribution>) => void;
  
  // Custom blind structure management
  updateCustomBlindStructure: (levels: BlindLevel[]) => void;
  addBlindLevel: (level: BlindLevel) => void;
  removeBlindLevel: (levelId: number) => void;
  updateBlindLevel: (levelId: number, field: keyof BlindLevel, value: number) => void;
}

// Default settings
const defaultSettings: TournamentSettings = {
  title: 'Poker Tournament',
  buyInAmount: 20,
  reBuyAmount: 20,
  blindStructure: blindStructures.regular,
  prizeDistribution: {
    type: 'percentage',
    first: 60,
    second: 30,
    third: 10,
  },
};

// Create context with a default value
const TournamentContext = createContext<TournamentContextValue | undefined>(undefined);

// Custom hook to use the tournament context
export const useTournament = (): TournamentContextValue => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};

// Provider component
export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  // Initialize tournament state, checking local storage first
  const [tournament, setTournament] = useState<TournamentState>(() => {
    const savedState = loadTournamentState();
    if (savedState) {
      return savedState;
    }
    return {
      settings: defaultSettings,
      buyIns: 0,
      reBuys: 0,
      currentLevelId: 1,
      isBlindChangeAlert: false,
      isPanelOpen: false,
    };
  });
  
  // Get the current blind level
  const currentLevel = tournament.settings.blindStructure.levels.find(
    (level) => level.id === tournament.currentLevelId
  ) || tournament.settings.blindStructure.levels[0];
  
  // Get the next blind level (if any)
  const nextLevel = getNextLevel(tournament.settings.blindStructure, tournament.currentLevelId);
  
  // Timer setup with callbacks
  const timer = useTimer({
    initialTime: currentLevel.duration,
    onComplete: () => {
      // When the timer completes, show the blind change alert and play a sound
      setTournament((prev) => ({ ...prev, isBlindChangeAlert: true }));
      playBlindChangeSound();
      
      // Show a toast notification
      toast({
        title: 'Blind Level Complete',
        description: nextLevel 
          ? `New blinds: ${nextLevel.smallBlind}/${nextLevel.bigBlind}`
          : 'This is the final level',
        variant: 'default',
      });
      
      // Auto-advance to the next level
      if (nextLevel) {
        advanceToNextLevel();
      }
    },
  });
  
  // Save tournament state to local storage whenever it changes
  useEffect(() => {
    saveTournamentState(tournament);
  }, [tournament]);
  
  // Calculate prize pool
  const prizePool = tournament.buyIns * tournament.settings.buyInAmount + 
                    tournament.reBuys * tournament.settings.reBuyAmount;
  
  // Calculate prizes based on distribution type
  const calculatePrizes = useCallback(() => {
    const { type, first, second, third } = tournament.settings.prizeDistribution;
    
    if (type === 'percentage') {
      return {
        first: (prizePool * first) / 100,
        second: (prizePool * second) / 100,
        third: (prizePool * third) / 100,
      };
    } else {
      return { first, second, third };
    }
  }, [prizePool, tournament.settings.prizeDistribution]);
  
  const prizes = calculatePrizes();
  
  // Update tournament settings
  const updateSettings = useCallback((settings: Partial<TournamentSettings>) => {
    setTournament((prev) => ({ 
      ...prev, 
      settings: { ...prev.settings, ...settings } 
    }));
  }, []);
  
  // Update the blind structure
  const updateBlindStructure = useCallback((structureKey: string) => {
    if (blindStructures[structureKey]) {
      setTournament((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          blindStructure: blindStructures[structureKey],
        },
        currentLevelId: 1,
      }));
      
      // Reset the timer to the new first level's duration
      timer.reset(blindStructures[structureKey].levels[0].duration);
    }
  }, [timer]);
  
  // Custom blind structure management
  const updateCustomBlindStructure = useCallback((levels: BlindLevel[]) => {
    setTournament((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        blindStructure: {
          ...prev.settings.blindStructure,
          levels,
        },
      },
    }));
  }, []);
  
  // Add a new blind level
  const addBlindLevel = useCallback((level: BlindLevel) => {
    setTournament((prev) => {
      const updatedLevels = [...prev.settings.blindStructure.levels, level];
      // Sort levels by ID to ensure they appear in order
      updatedLevels.sort((a, b) => a.id - b.id);
      
      return {
        ...prev,
        settings: {
          ...prev.settings,
          blindStructure: {
            ...prev.settings.blindStructure,
            levels: updatedLevels,
          },
        },
      };
    });
  }, []);
  
  // Remove a blind level
  const removeBlindLevel = useCallback((levelId: number) => {
    setTournament((prev) => {
      // Don't remove if it's the only level or if it's the current level
      if (
        prev.settings.blindStructure.levels.length <= 1 ||
        levelId === prev.currentLevelId
      ) {
        return prev;
      }
      
      const updatedLevels = prev.settings.blindStructure.levels.filter(
        (level) => level.id !== levelId
      );
      
      return {
        ...prev,
        settings: {
          ...prev.settings,
          blindStructure: {
            ...prev.settings.blindStructure,
            levels: updatedLevels,
          },
        },
      };
    });
  }, []);
  
  // Update a specific blind level field
  const updateBlindLevel = useCallback((levelId: number, field: keyof BlindLevel, value: number) => {
    setTournament((prev) => {
      const updatedLevels = prev.settings.blindStructure.levels.map((level) => {
        if (level.id === levelId) {
          return {
            ...level,
            [field]: value,
          };
        }
        return level;
      });
      
      return {
        ...prev,
        settings: {
          ...prev.settings,
          blindStructure: {
            ...prev.settings.blindStructure,
            levels: updatedLevels,
          },
        },
      };
    });
  }, []);
  
  // Add a buy-in
  const addBuyIn = useCallback(() => {
    setTournament((prev) => ({ ...prev, buyIns: prev.buyIns + 1 }));
    playSuccessSound();
  }, []);
  
  // Remove a buy-in
  const removeBuyIn = useCallback(() => {
    setTournament((prev) => ({ 
      ...prev, 
      buyIns: Math.max(0, prev.buyIns - 1) 
    }));
  }, []);
  
  // Add a re-buy
  const addReBuy = useCallback(() => {
    setTournament((prev) => ({ ...prev, reBuys: prev.reBuys + 1 }));
    playSuccessSound();
  }, []);
  
  // Remove a re-buy
  const removeReBuy = useCallback(() => {
    setTournament((prev) => ({ 
      ...prev, 
      reBuys: Math.max(0, prev.reBuys - 1) 
    }));
  }, []);
  
  // Advance to the next blind level
  const advanceToNextLevel = useCallback(() => {
    if (nextLevel) {
      setTournament((prev) => ({
        ...prev,
        currentLevelId: nextLevel.id,
        isBlindChangeAlert: false,
      }));
      
      // Reset the timer to the new level's duration
      timer.reset(nextLevel.duration);
      
      // Play a notification sound
      playNotificationSound();
      
      // Show a toast notification
      toast({
        title: 'New Blind Level',
        description: `Level ${nextLevel.id}: ${nextLevel.smallBlind}/${nextLevel.bigBlind}`,
        variant: 'default',
      });
    }
  }, [nextLevel, timer, toast]);
  
  // Reset the tournament
  const resetTournament = useCallback(() => {
    setTournament((prev) => ({
      ...prev,
      currentLevelId: 1,
      isBlindChangeAlert: false,
    }));
    
    // Reset the timer to the first level's duration
    timer.reset(tournament.settings.blindStructure.levels[0].duration);
    
    // Show a toast notification
    toast({
      title: 'Tournament Reset',
      description: 'Tournament has been reset to the first level',
      variant: 'default',
    });
  }, [timer, toast, tournament.settings.blindStructure.levels]);
  
  // Toggle the settings panel
  const toggleSettingsPanel = useCallback(() => {
    setTournament((prev) => ({ ...prev, isPanelOpen: !prev.isPanelOpen }));
  }, []);
  
  // Dismiss the blind change alert
  const dismissAlert = useCallback(() => {
    setTournament((prev) => ({ ...prev, isBlindChangeAlert: false }));
  }, []);
  
  // Update prize distribution
  const updatePrizeDistribution = useCallback((distribution: Partial<PrizeDistribution>) => {
    setTournament((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        prizeDistribution: {
          ...prev.settings.prizeDistribution,
          ...distribution,
        },
      },
    }));
  }, []);
  
  // Reset timer when current level changes
  useEffect(() => {
    timer.reset(currentLevel.duration);
  }, [currentLevel.duration]);
  
  // Create the context value
  const contextValue: TournamentContextValue = {
    tournament,
    timer,
    currentLevel,
    nextLevel,
    prizePool,
    prizes,
    updateSettings,
    updateBlindStructure,
    addBuyIn,
    removeBuyIn,
    addReBuy,
    removeReBuy,
    advanceToNextLevel,
    resetTournament,
    toggleSettingsPanel,
    dismissAlert,
    updatePrizeDistribution,
    updateCustomBlindStructure,
    addBlindLevel,
    removeBlindLevel,
    updateBlindLevel,
  };
  
  return (
    <TournamentContext.Provider value={contextValue}>
      {children}
    </TournamentContext.Provider>
  );
};
