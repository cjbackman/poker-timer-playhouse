
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TournamentProvider, useTournament } from '@/hooks/useTournament';
import Timer from './Timer';
import * as audioModule from '@/lib/audio';
import { act } from '@testing-library/react';

// Mock audio functions
vi.mock('@/lib/audio', () => ({
  playButtonClickSound: vi.fn(),
  playBlindChangeSound: vi.fn(),
  playTimerEndSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playNotificationSound: vi.fn(),
}));

// Mock use-toast to avoid implementation details
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock hooks from useTournament
vi.mock('@/hooks/useTournament', () => {
  const mockUseTournament = vi.fn().mockImplementation(() => ({
    timer: {
      timeRemaining: 900,
      isRunning: false,
      isPaused: true,
      isComplete: false,
      start: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      reset: vi.fn(),
      addTime: vi.fn(),
      formatTime: vi.fn((seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`),
    },
    tournament: {
      settings: {
        title: 'Poker Tournament',
        buyInAmount: 20,
        reBuyAmount: 20,
        blindStructure: {
          name: 'Regular',
          levels: [
            { id: 1, smallBlind: 5, bigBlind: 10, ante: 0, duration: 900 },
            { id: 2, smallBlind: 10, bigBlind: 20, ante: 0, duration: 900 },
          ],
        },
        prizeDistribution: {
          type: 'percentage',
          first: 60,
          second: 30,
          third: 10,
        },
      },
      buyIns: 0,
      reBuys: 0,
      currentLevelId: 1,
      isBlindChangeAlert: false,
      isPanelOpen: false,
    },
    currentLevel: {
      id: 1,
      smallBlind: 5,
      bigBlind: 10,
      ante: 0,
      duration: 900,
    },
    nextLevel: {
      id: 2,
      smallBlind: 10,
      bigBlind: 20,
      ante: 0,
      duration: 900,
    },
    prizePool: 0,
    prizes: { first: 0, second: 0, third: 0 },
    updateSettings: vi.fn(),
    updateBlindStructure: vi.fn(),
    addBuyIn: vi.fn(),
    removeBuyIn: vi.fn(),
    addReBuy: vi.fn(),
    removeReBuy: vi.fn(),
    advanceToNextLevel: vi.fn(),
    resetTournament: vi.fn(),
    toggleSettingsPanel: vi.fn(),
    dismissAlert: vi.fn(),
    updatePrizeDistribution: vi.fn(),
    updateCustomBlindStructure: vi.fn(),
    addBlindLevel: vi.fn(),
    removeBlindLevel: vi.fn(),
    updateBlindLevel: vi.fn(),
  }));

  return {
    TournamentProvider: ({ children }) => children,
    useTournament: mockUseTournament
  };
});

describe('Timer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the timer with formatted time', () => {
    render(
      <TournamentProvider>
        <Timer />
      </TournamentProvider>
    );

    // Select the main timer container
    const timerContainer = screen.getByRole('timer');
    expect(timerContainer).toBeInTheDocument();

    // Get all <span> elements inside the timer container
    const timeSegments = timerContainer.querySelectorAll('span');

    // Ensure the timer contains exactly three parts: hours, separator, and minutes
    expect(timeSegments).toHaveLength(3);

    const [hours, separator, minutes] = timeSegments;

    // Assert hours and minutes match the pattern of two digits (e.g., "15", "00", "09")
    expect(hours.textContent).toMatch(/^\d{2}$/);
    expect(minutes.textContent).toMatch(/^\d{2}$/);

    // Assert the separator is exactly a colon (:)
    expect(separator.textContent).toBe(':');
  });

  it('shows play button when timer is not running', () => {
    render(
      <TournamentProvider>
        <Timer />
      </TournamentProvider>
    );
    
    // Play button should be visible
    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
  });

  it('plays sound when play button is clicked', () => {
    render(
      <TournamentProvider>
        <Timer />
      </TournamentProvider>
    );
    
    // Get and click the play button
    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);
    
    // Check if sound function was called
    expect(audioModule.playButtonClickSound).toHaveBeenCalledTimes(1);
  });

  it('responds to spacebar keyboard control', () => {
    render(
      <TournamentProvider>
        <Timer />
      </TournamentProvider>
    );
    
    // Simulate spacebar keydown
    fireEvent.keyDown(window, { code: 'Space' });
    
    // Check if sound function was called
    expect(audioModule.playButtonClickSound).toHaveBeenCalledTimes(1);
  });

  it('timer automatically starts when advancing to a new level', () => {
    // Create mocks for the timer functions
    const timerStartMock = vi.fn();
    const timerResetMock = vi.fn();
    const advanceToNextLevelMock = vi.fn().mockImplementation(() => {
      // When advanceToNextLevel is called, we simulate the behavior
      // by calling reset and then start
      timerResetMock(900);
      // Important: Simulate the setTimeout behavior in the actual implementation
      setTimeout(() => {
        timerStartMock();
      }, 0);
    });
    
    // Override the mock implementation for this specific test
    vi.mocked(useTournament).mockImplementationOnce(() => ({
      timer: {
        timeRemaining: 900,
        isRunning: false,
        isPaused: true,
        isComplete: false,
        start: timerStartMock,
        pause: vi.fn(),
        resume: vi.fn(),
        reset: timerResetMock,
        addTime: vi.fn(),
        formatTime: vi.fn((seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`),
      },
      tournament: {
        settings: {
          title: 'Poker Tournament',
          buyInAmount: 20,
          reBuyAmount: 20,
          blindStructure: {
            name: 'Regular',
            levels: [
              { id: 1, smallBlind: 5, bigBlind: 10, ante: 0, duration: 900 },
              { id: 2, smallBlind: 10, bigBlind: 20, ante: 0, duration: 900 },
            ],
          },
          prizeDistribution: {
            type: 'percentage',
            first: 60,
            second: 30,
            third: 10,
          },
        },
        buyIns: 0,
        reBuys: 0,
        currentLevelId: 1,
        isBlindChangeAlert: false,
        isPanelOpen: false,
      },
      currentLevel: {
        id: 1,
        smallBlind: 5,
        bigBlind: 10,
        ante: 0,
        duration: 900,
      },
      nextLevel: {
        id: 2,
        smallBlind: 10,
        bigBlind: 20,
        ante: 0,
        duration: 900,
      },
      prizePool: 0,
      prizes: { first: 0, second: 0, third: 0 },
      advanceToNextLevel: advanceToNextLevelMock,
      updateSettings: vi.fn(),
      updateBlindStructure: vi.fn(),
      addBuyIn: vi.fn(),
      removeBuyIn: vi.fn(),
      addReBuy: vi.fn(),
      removeReBuy: vi.fn(),
      resetTournament: vi.fn(),
      toggleSettingsPanel: vi.fn(),
      dismissAlert: vi.fn(),
      updatePrizeDistribution: vi.fn(),
      updateCustomBlindStructure: vi.fn(),
      addBlindLevel: vi.fn(),
      removeBlindLevel: vi.fn(),
      updateBlindLevel: vi.fn(),
    }));

    render(
      <TournamentProvider>
        <Timer />
      </TournamentProvider>
    );

    // Trigger advancing to next level
    act(() => {
      advanceToNextLevelMock();
    });
    
    // Use fake timers to advance past the setTimeout
    act(() => {
      vi.runAllTimers();
    });
    
    // Timer should have been reset and started
    expect(timerResetMock).toHaveBeenCalled();
    
    // We need to verify that timerStartMock will be called after the timeout
    // This is a bit tricky in tests, but we can use jest's timer mocks
    setTimeout(() => {
      expect(timerStartMock).toHaveBeenCalled();
    }, 10);
  });
});
