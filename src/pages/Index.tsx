
import { useState, useEffect } from 'react';
import { TournamentProvider } from '@/hooks/useTournament';
import Layout from '@/components/Layout';
import Timer from '@/components/Timer';
import BlindDisplay from '@/components/BlindDisplay';
import PrizePool from '@/components/PrizePool';
import BuyInsPanel from '@/components/BuyInsPanel';
import OrganizerPanel from '@/components/OrganizerPanel';
import { Loader2 } from 'lucide-react';

const PokerClock = () => {
  const [loading, setLoading] = useState(true);
  
  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <h1 className="text-2xl font-medium">Loading Poker Clock...</h1>
        </div>
      </div>
    );
  }
  
  return (
    <TournamentProvider>
      <Layout>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Prize Pool - Left Side */}
          <div className="md:col-span-2 order-3 md:order-1">
            <PrizePool />
          </div>
          
          {/* Timer and Blind Display - Center */}
          <div className="md:col-span-8 order-1 md:order-2 flex flex-col items-center justify-center gap-8">
            <div className="glass rounded-3xl p-6 md:p-8 w-full max-w-xl mx-auto">
              <Timer />
            </div>
            
            <div className="w-full max-w-lg mx-auto">
              <BlindDisplay />
            </div>
          </div>
          
          {/* Buy-ins Panel - Right Side */}
          <div className="md:col-span-2 order-2 md:order-3">
            <BuyInsPanel />
          </div>
        </div>
        
        {/* Organizer Panel (Settings) */}
        <OrganizerPanel />
      </Layout>
    </TournamentProvider>
  );
};

export default PokerClock;
