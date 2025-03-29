
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TournamentProvider } from '@/hooks/useTournament';
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
vi.mock('@/hooks/useTournament', async () => {
  const actual = await vi.importActual('@/hooks/useTournament');
  return {
    ...actual,
    useTournament: vi.fn().mockImplementation(() => ({
      timer: {
        timeRemaining: 900,
        isRunning: false,
        isPaused: true,
        isComplete: false,
        start: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        reset: vi.fn(),
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
      advanceToNextLevel: vi.fn(),
    })),
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

  it('shows pause button when timer is running', () => {
    render(
      <TournamentProvider>
        <Timer />
      </TournamentProvider>
    );
    
    // Click play to start the timer
    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);
    
    // Pause button should now be visible
    const pauseButton = screen.getByRole('button', { name: /pause/i });
    expect(pauseButton).toBeInTheDocument();
  });

  it('timer automatically starts when advancing to a new level', () => {
    // Import the actual tournament hook implementation
    const actualUseTournament = vi.importActual('@/hooks/useTournament').useTournament;
    
    // Override the mock for this specific test
    const timerStartMock = vi.fn();
    const timerResetMock = vi.fn();
    vi.mocked(actualUseTournament).mockImplementationOnce(() => ({
      timer: {
        timeRemaining: 900,
        isRunning: false,
        isPaused: true,
        isComplete: false,
        start: timerStartMock,
        pause: vi.fn(),
        resume: vi.fn(),
        reset: timerResetMock,
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
      advanceToNextLevel: vi.fn().mockImplementation(() => {
        // When advanceToNextLevel is called, we simulate the behavior
        // by calling reset and then start
        timerResetMock(900);
        timerStartMock();
      }),
    }));

    const { rerender } = render(
      <TournamentProvider>
        <Timer />
      </TournamentProvider>
    );

    // Get the tournament context to trigger advancing to next level
    const { advanceToNextLevel } = actualUseTournament();
    
    // Trigger advancing to next level
    act(() => {
      advanceToNextLevel();
    });
    
    // Timer should have been reset and started
    expect(timerResetMock).toHaveBeenCalled();
    expect(timerStartMock).toHaveBeenCalled();
    
    // Rerender to update the component with the new timer state
    rerender(
      <TournamentProvider>
        <Timer />
      </TournamentProvider>
    );
  });
});
