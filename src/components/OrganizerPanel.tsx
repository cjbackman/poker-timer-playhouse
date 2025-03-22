
import { useState } from 'react';
import { useTournament } from '@/hooks/useTournament';
import { Settings, X, ChevronRight, ChevronDown, Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { blindStructures } from '@/lib/blindStructures';
import { playButtonClickSound } from '@/lib/audio';

const OrganizerPanel = () => {
  const { 
    tournament, 
    updateSettings, 
    updateBlindStructure, 
    updatePrizeDistribution, 
    toggleSettingsPanel 
  } = useTournament();
  
  const { settings, isPanelOpen } = tournament;
  const { buyInAmount, reBuyAmount, currency, prizeDistribution } = settings;
  
  // Local state for form fields
  const [localCurrency, setLocalCurrency] = useState(currency);
  const [localBuyInAmount, setLocalBuyInAmount] = useState(buyInAmount.toString());
  const [localReBuyAmount, setLocalReBuyAmount] = useState(reBuyAmount.toString());
  const [expandedSections, setExpandedSections] = useState({
    buyins: true,
    structure: false,
    prizes: false,
  });
  
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    playButtonClickSound();
  };
  
  // Handle saving buy-in and rebuy amounts
  const saveBuyInSettings = () => {
    const newBuyInAmount = parseInt(localBuyInAmount) || 0;
    const newReBuyAmount = parseInt(localReBuyAmount) || 0;
    
    updateSettings({
      buyInAmount: newBuyInAmount > 0 ? newBuyInAmount : 1,
      reBuyAmount: newReBuyAmount > 0 ? newReBuyAmount : 1,
      currency: localCurrency || '$',
    });
    
    playButtonClickSound();
  };
  
  // Handle changes to prize distribution type
  const handlePrizeDistributionTypeChange = (type: 'percentage' | 'fixed') => {
    updatePrizeDistribution({ type });
    playButtonClickSound();
  };
  
  if (!isPanelOpen) {
    return (
      <Button
        variant="outline"
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-button hover:shadow-button-hover transition-all"
        onClick={toggleSettingsPanel}
      >
        <Settings className="h-5 w-5" />
        <span className="sr-only">Settings</span>
      </Button>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      {/* Panel */}
      <div className="w-full max-w-md bg-background border-l shadow-lg overflow-y-auto animate-slide-in-right">
        <div className="p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Organizer Settings
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={toggleSettingsPanel}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Buy-in & Rebuy Settings */}
          <div className="space-y-3">
            <button 
              className="w-full flex items-center justify-between"
              onClick={() => toggleSection('buyins')}
            >
              <h3 className="text-lg font-medium">Buy-in & Rebuy Settings</h3>
              {expandedSections.buyins ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            
            {expandedSections.buyins && (
              <div className="space-y-4 pt-2 pl-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency Symbol</Label>
                  <Select 
                    value={localCurrency} 
                    onValueChange={setLocalCurrency}
                  >
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ (Dollar)</SelectItem>
                      <SelectItem value="€">€ (Euro)</SelectItem>
                      <SelectItem value="£">£ (Pound)</SelectItem>
                      <SelectItem value="¥">¥ (Yen)</SelectItem>
                      <SelectItem value="₹">₹ (Rupee)</SelectItem>
                      <SelectItem value="">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buy-in-amount">Buy-in Amount</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="buy-in-amount"
                      type="number"
                      min="1"
                      value={localBuyInAmount}
                      onChange={(e) => setLocalBuyInAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rebuy-amount">Rebuy Amount</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="rebuy-amount"
                      type="number"
                      min="1"
                      value={localReBuyAmount}
                      onChange={(e) => setLocalReBuyAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <Button className="w-full" onClick={saveBuyInSettings}>
                  Save Settings
                </Button>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Blind Structure Settings */}
          <div className="space-y-3">
            <button 
              className="w-full flex items-center justify-between"
              onClick={() => toggleSection('structure')}
            >
              <h3 className="text-lg font-medium">Blind Structure</h3>
              {expandedSections.structure ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            
            {expandedSections.structure && (
              <div className="space-y-4 pt-2 pl-2">
                <div className="space-y-2">
                  <Label>Select Blind Structure</Label>
                  <div className="space-y-2">
                    <RadioGroup 
                      defaultValue={settings.blindStructure.name.toLowerCase()}
                      onValueChange={(value) => {
                        updateBlindStructure(value);
                        playButtonClickSound();
                      }}
                    >
                      {Object.keys(blindStructures).map((key) => (
                        <div key={key} className="flex items-center space-x-2">
                          <RadioGroupItem value={key} id={`structure-${key}`} />
                          <Label htmlFor={`structure-${key}`} className="cursor-pointer">
                            {blindStructures[key].name} 
                            <span className="text-xs text-muted-foreground ml-1">
                              ({blindStructures[key].levels.length} levels)
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Prize Distribution Settings */}
          <div className="space-y-3">
            <button 
              className="w-full flex items-center justify-between"
              onClick={() => toggleSection('prizes')}
            >
              <h3 className="text-lg font-medium">Prize Distribution</h3>
              {expandedSections.prizes ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            
            {expandedSections.prizes && (
              <div className="space-y-4 pt-2 pl-2">
                <div className="space-y-2">
                  <Label>Distribution Type</Label>
                  <Tabs
                    defaultValue={prizeDistribution.type}
                    onValueChange={(value) => handlePrizeDistributionTypeChange(value as 'percentage' | 'fixed')}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="percentage" className="flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        Percentage
                      </TabsTrigger>
                      <TabsTrigger value="fixed" className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Fixed Amount
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="percentage" className="space-y-4 mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="first-place-pct">1st Place: {prizeDistribution.first}%</Label>
                          </div>
                          <Slider
                            id="first-place-pct"
                            min={0}
                            max={100}
                            step={1}
                            value={[prizeDistribution.first]}
                            onValueChange={([value]) => updatePrizeDistribution({ first: value })}
                            className="py-2"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="second-place-pct">2nd Place: {prizeDistribution.second}%</Label>
                          </div>
                          <Slider
                            id="second-place-pct"
                            min={0}
                            max={100}
                            step={1}
                            value={[prizeDistribution.second]}
                            onValueChange={([value]) => updatePrizeDistribution({ second: value })}
                            className="py-2"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="third-place-pct">3rd Place: {prizeDistribution.third}%</Label>
                          </div>
                          <Slider
                            id="third-place-pct"
                            min={0}
                            max={100}
                            step={1}
                            value={[prizeDistribution.third]}
                            onValueChange={([value]) => updatePrizeDistribution({ third: value })}
                            className="py-2"
                          />
                        </div>
                        
                        <div className="text-sm">
                          <div className={`${
                            prizeDistribution.first + prizeDistribution.second + prizeDistribution.third !== 100 
                            ? 'text-poker-red' : 'text-muted-foreground'
                          }`}>
                            Total: {prizeDistribution.first + prizeDistribution.second + prizeDistribution.third}%
                            {prizeDistribution.first + prizeDistribution.second + prizeDistribution.third !== 100 && 
                              " (should equal 100%)"}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="fixed" className="mt-4 space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-place-fixed">1st Place Amount</Label>
                          <div className="flex gap-2 items-center">
                            <span className="text-muted-foreground">{currency}</span>
                            <Input
                              id="first-place-fixed"
                              type="number"
                              min="0"
                              value={prizeDistribution.first}
                              onChange={(e) => updatePrizeDistribution({ first: parseFloat(e.target.value) || 0 })}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="second-place-fixed">2nd Place Amount</Label>
                          <div className="flex gap-2 items-center">
                            <span className="text-muted-foreground">{currency}</span>
                            <Input
                              id="second-place-fixed"
                              type="number"
                              min="0"
                              value={prizeDistribution.second}
                              onChange={(e) => updatePrizeDistribution({ second: parseFloat(e.target.value) || 0 })}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="third-place-fixed">3rd Place Amount</Label>
                          <div className="flex gap-2 items-center">
                            <span className="text-muted-foreground">{currency}</span>
                            <Input
                              id="third-place-fixed"
                              type="number"
                              min="0"
                              value={prizeDistribution.third}
                              onChange={(e) => updatePrizeDistribution({ third: parseFloat(e.target.value) || 0 })}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerPanel;
