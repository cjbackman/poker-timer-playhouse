
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TournamentProvider } from '@/hooks/useTournament';
import Timer from './Timer';
import * as audioModule from '@/lib/audio';

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
    
    // The initial time should be visible and formatted correctly (15:00 by default)
    const timeDisplay = screen.getByText(/\d{2}:\d{2}/);
    expect(timeDisplay).toBeInTheDocument();
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
});
