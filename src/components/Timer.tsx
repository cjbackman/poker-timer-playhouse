
import { useState, useEffect } from 'react';
import { useTournament } from '@/hooks/useTournament';
import { Play, Pause, SkipForward, RefreshCw } from 'lucide-react';
import { playButtonClickSound } from '@/lib/audio';
import { Button } from '@/components/ui/button';

const Timer = () => {
  const { timer, currentLevel, nextLevel, advanceToNextLevel, resetTournament } = useTournament();
  const [animate, setAnimate] = useState(false);
  
  // Add animation effect when time changes
  useEffect(() => {
    // Trigger animation only for significant changes (every 10 seconds)
    if (timer.timeRemaining % 10 === 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [timer.timeRemaining]);
  
  // Create a visual timer display
  const minutes = Math.floor(timer.timeRemaining / 60);
  const seconds = timer.timeRemaining % 60;
  
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  
  // Determine if we're near the end of the timer (last 10% of the time)
  const isNearEnd = timer.timeRemaining < currentLevel.duration * 0.1 && timer.timeRemaining > 0;
  
  return (
    <div className="flex flex-col items-center justify-center gap-10 h-full">
      {/* Timer Display - Even Larger for the new layout */}
      <div 
        className={`text-8xl md:text-[12rem] xl:text-[14rem] font-mono tracking-tight transition-all duration-300 ease-in-out
          ${animate ? 'scale-105 text-primary' : 'scale-100'} 
          ${isNearEnd ? 'text-poker-red' : 'text-foreground'}`}
      >
        <span className={`inline-block ${animate ? 'digit-change' : ''}`}>
          {formattedMinutes}
        </span>
        <span className="mx-1">:</span>
        <span className={`inline-block ${animate ? 'digit-change' : ''}`}>
          {formattedSeconds}
        </span>
      </div>
      
      {/* Timer Controls - Larger and more spaced */}
      <div className="flex gap-5 items-center">
        {/* Play/Pause Button */}
        {timer.isRunning ? (
          <Button 
            variant="outline" 
            size="lg" 
            className="h-16 w-16 rounded-full shadow-button hover:shadow-button-hover transition-all duration-300 border-2"
            onClick={() => {
              timer.pause();
              playButtonClickSound();
            }}
          >
            <Pause className="h-8 w-8" />
            <span className="sr-only">Pause</span>
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="lg" 
            className="h-16 w-16 rounded-full shadow-button hover:shadow-button-hover transition-all duration-300 bg-poker-accent hover:bg-poker-accent/90 border-2 border-poker-accent/20"
            onClick={() => {
              if (timer.isPaused) {
                timer.resume();
              } else {
                timer.start();
              }
              playButtonClickSound();
            }}
          >
            <Play className="h-8 w-8 ml-1" />
            <span className="sr-only">Play</span>
          </Button>
        )}
        
        {/* Next Level Button */}
        <Button 
          variant="outline" 
          size="lg"
          className="h-16 px-6 rounded-full shadow-button hover:shadow-button-hover transition-all duration-300"
          onClick={() => {
            advanceToNextLevel();
            playButtonClickSound();
          }}
          disabled={!nextLevel}
        >
          <SkipForward className="h-6 w-6 mr-2" />
          <span className="hidden sm:inline">Next Level</span>
        </Button>
        
        {/* Reset Button */}
        <Button 
          variant="outline" 
          size="lg" 
          className="h-16 w-16 rounded-full shadow-button hover:shadow-button-hover transition-all duration-300"
          onClick={() => {
            resetTournament();
            playButtonClickSound();
          }}
        >
          <RefreshCw className="h-6 w-6" />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
    </div>
  );
};

export default Timer;
