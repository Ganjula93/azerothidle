
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Resources, Building, ResourceType, RaceId, BuildingUpgrade } from './types';
import { INITIAL_RESOURCES, INITIAL_BUILDINGS, TICK_RATE_MS, SAVE_KEY, RACES, TALENTS, getInitialBuildingsState } from './constants';
import ResourceCard from './components/ResourceCard';
import ClickerArea from './components/ClickerArea';
import BuildingShop from './components/BuildingShop';
import MainMenu from './components/MainMenu';
import RaceSelection from './components/RaceSelection';
import TalentTree from './components/TalentTree';
import { Shield, LogOut, ArrowLeft, Download, Upload, Trash2, CheckCircle, AlertCircle, Copy, Sparkles, FileDown, FileUp, Settings } from 'lucide-react';

type ViewState = 'menu' | 'game' | 'options' | 'info' | 'race_select' | 'talents';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('menu');
  const [resources, setResources] = useState<Resources>(INITIAL_RESOURCES);
  const [buildings, setBuildings] = useState<Building[]>(() => getInitialBuildingsState());
  const [raceId, setRaceId] = useState<RaceId | null>(null);
  const [eternalEssence, setEternalEssence] = useState<number>(0);
  const [talents, setTalents] = useState<Record<string, number>>({});
  const [hasSave, setHasSave] = useState(false);
  
  // Options/Import State
  const [importString, setImportString] = useState('');
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Prestige UI State
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);

  // --- Persistence & Initialization ---

  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      setHasSave(true);
    }
  }, []);

  const showNotification = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const serializeBuildings = (source: Building[]) => 
    source.map(b => ({
      id: b.id,
      count: b.count,
      purchasedUpgrades: b.purchasedUpgrades || [],
    }));

  const mergeBuildingsWithSave = (savedBuildings: any[]): Building[] => {
    return getInitialBuildingsState().map(initB => {
      const savedB = savedBuildings.find((b: any) => b.id === initB.id);
      return {
        ...initB,
        count: savedB?.count ?? initB.count,
        purchasedUpgrades: savedB?.purchasedUpgrades ?? [],
      };
    });
  };

  const saveGame = useCallback(() => {
    const data = {
      resources,
      buildings: serializeBuildings(buildings),
      raceId,
      eternalEssence,
      talents,
      lastTick: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    setHasSave(true);
  }, [resources, buildings, raceId, eternalEssence, talents]);

  const loadGame = () => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.resources) setResources(parsed.resources);
        if (parsed.eternalEssence) setEternalEssence(parsed.eternalEssence);
        if (parsed.raceId) setRaceId(parsed.raceId);
        if (parsed.talents) setTalents(parsed.talents);
        
        // Merge saved building counts
        if (parsed.buildings) {
           const mergedBuildings = mergeBuildingsWithSave(parsed.buildings);
           setBuildings(mergedBuildings);
        }
      } catch (e) {
        console.error("Failed to load save", e);
        showNotification("Corrupted save file found.", 'error');
      }
    }
    
    // If we loaded a game but no race is selected (legacy save or new feature), go to race select
    const currentSave = JSON.parse(savedData || "{}");
    if (!currentSave.raceId) {
       setView('race_select');
    } else {
       setView('game');
    }
  };

  // --- Export / Import Logic ---

  const handleExportClipboard = () => {
    try {
      const data = {
        resources,
        buildings: serializeBuildings(buildings),
        raceId,
        eternalEssence,
        talents,
        timestamp: Date.now()
      };
      const saveString = btoa(JSON.stringify(data));
      navigator.clipboard.writeText(saveString);
      showNotification("Save string copied to clipboard!", 'success');
    } catch (e) {
      showNotification("Failed to export save.", 'error');
    }
  };

  const handleExportFile = () => {
    try {
      const data = {
        resources,
        buildings: serializeBuildings(buildings),
        raceId,
        eternalEssence,
        talents,
        timestamp: Date.now()
      };
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `azeroth-idle-save-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification("Save file downloaded!", 'success');
    } catch (e) {
      showNotification("Failed to download save file.", 'error');
    }
  };

  const processImportData = (rawData: string) => {
    try {
      let parsed;
      // Try parsing as JSON first (File format)
      try {
        parsed = JSON.parse(rawData);
      } catch {
        // If failed, try parsing as Base64 (Clipboard format)
        try {
          parsed = JSON.parse(atob(rawData));
        } catch {
          throw new Error("Invalid format");
        }
      }

      if (!parsed.resources || !Array.isArray(parsed.buildings)) throw new Error("Invalid structure");

      setResources(parsed.resources);
      setEternalEssence(parsed.eternalEssence || 0);
      setRaceId(parsed.raceId || null);
      setTalents(parsed.talents || {});
      
      const mergedBuildings = mergeBuildingsWithSave(parsed.buildings);
      setBuildings(mergedBuildings);
      
      // Update persistent storage
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        resources: parsed.resources,
        buildings: serializeBuildings(mergedBuildings),
        raceId: parsed.raceId,
        eternalEssence: parsed.eternalEssence,
        talents: parsed.talents,
        lastTick: Date.now()
      }));
      
      setHasSave(true);
      setImportString('');
      showNotification("Save loaded successfully!", 'success');
      
      if (!parsed.raceId) {
        setView('race_select');
      } else {
        setTimeout(() => setView('game'), 500);
      }
    } catch (e) {
      showNotification("Invalid save data.", 'error');
    }
  };

  const handleImportString = () => {
    if (!importString) return;
    processImportData(importString);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        processImportData(result);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  const handleResetSave = () => {
    if (window.confirm("Are you sure? This will delete your local save permanently.")) {
      localStorage.removeItem(SAVE_KEY);
      setResources(INITIAL_RESOURCES);
      setBuildings(getInitialBuildingsState());
      setRaceId(null);
      setEternalEssence(0);
      setTalents({});
      setHasSave(false);
      showNotification("Save data deleted.", 'success');
    }
  };

  const startNewGame = () => {
    setResources(INITIAL_RESOURCES);
    setBuildings(getInitialBuildingsState());
    setEternalEssence(0); 
    setRaceId(null);
    setTalents({});
    localStorage.removeItem(SAVE_KEY);
    setHasSave(false);
    setView('race_select');
  };

  const handleRaceSelection = (selectedRaceId: RaceId) => {
    setRaceId(selectedRaceId);
    setResources(INITIAL_RESOURCES); 
    
    const newSaveState = {
      resources: INITIAL_RESOURCES,
      buildings: INITIAL_BUILDINGS.map(b => ({ id: b.id, count: 0, purchasedUpgrades: [] })),
      raceId: selectedRaceId,
      eternalEssence: eternalEssence,
      talents: talents,
      lastTick: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(newSaveState));
    setHasSave(true);

    setView('game');
  };

  // --- Prestige Logic ---

  const calculatePrestigeEssence = () => {
    return Math.floor(Math.sqrt(resources.gold / 100));
  };

  const onPrestigeClick = () => {
    const gainedEssence = calculatePrestigeEssence();
    if (gainedEssence <= 0) {
      showNotification("Not enough Gold to ascend properly!", 'error');
      return;
    }
    setShowPrestigeModal(true);
  };

  const confirmPrestige = () => {
    const gainedEssence = calculatePrestigeEssence();
    
    setEternalEssence(prev => prev + gainedEssence);
    setResources(INITIAL_RESOURCES);
    setBuildings(getInitialBuildingsState());
    setRaceId(null); 
    
    setShowPrestigeModal(false);
    setView('race_select');
  };

  // --- Talents Logic ---

  const handleBuyTalent = (talentId: string) => {
    const talent = TALENTS.find(t => t.id === talentId);
    if (!talent) return;

    const currentLevel = talents[talentId] || 0;
    if (talent.maxLevel && currentLevel >= talent.maxLevel) return;

    const cost = Math.floor(talent.baseCost * Math.pow(talent.costMultiplier, currentLevel));
    
    if (eternalEssence >= cost) {
      setEternalEssence(prev => prev - cost);
      setTalents(prev => ({
        ...prev,
        [talentId]: currentLevel + 1
      }));
      showNotification(`Upgraded ${talent.name}!`, 'success');
    } else {
      showNotification("Not enough Eternal Essence!", 'error');
    }
  };

  // --- Game Loop & Math ---

  const getBuildingOutputMultiplier = (building: Building) => {
    if (!building.upgrades || building.upgrades.length === 0) return 1;
    return building.upgrades.reduce((mult, upgrade) => {
      return building.purchasedUpgrades?.includes(upgrade.id) ? mult * upgrade.multiplier : mult;
    }, 1);
  };

  const getProductionRates = useCallback(() => {
    let rates = { gold: 0, wood: 0, ore: 0 };
    
    // Base Production
    buildings.forEach(b => {
      const upgradeMult = getBuildingOutputMultiplier(b);
      if (b.production.gold) rates.gold += b.production.gold * b.count * upgradeMult;
      if (b.production.wood) rates.wood += b.production.wood * b.count * upgradeMult;
      if (b.production.ore) rates.ore += b.production.ore * b.count * upgradeMult;
    });

    // Race Modifiers
    if (raceId === 'human') rates.gold *= 1.1;
    if (raceId === 'dwarf') rates.ore *= 1.1;
    if (raceId === 'nelf') rates.wood *= 1.1;

    // Essence Modifier (Passive: 10% per unspent point)
    // NOTE: Game design choice, usually upgrades are stronger than passive bonus, so spending is good.
    const passiveEssenceMult = 1 + (eternalEssence * 0.1);
    rates.gold *= passiveEssenceMult;
    rates.wood *= passiveEssenceMult;
    rates.ore *= passiveEssenceMult;

    // Talent Modifiers
    const kingsHonorLevel = talents['kings_honor'] || 0;
    const globalTalentMult = 1 + (kingsHonorLevel * 0.05);
    
    const oreTalentLevel = talents['deep_mining'] || 0;
    const woodTalentLevel = talents['elven_grace'] || 0;
    const goldTalentLevel = talents['goblin_deals'] || 0;

    rates.gold *= globalTalentMult * (1 + (goldTalentLevel * 0.1));
    rates.wood *= globalTalentMult * (1 + (woodTalentLevel * 0.1));
    rates.ore *= globalTalentMult * (1 + (oreTalentLevel * 0.1));

    return rates;
  }, [buildings, raceId, eternalEssence, talents]);

  useEffect(() => {
    if (view !== 'game') return;
    const interval = setInterval(() => {
      const rates = getProductionRates();
      setResources(prev => ({
        gold: prev.gold + rates.gold,
        wood: prev.wood + rates.wood,
        ore: prev.ore + rates.ore,
      }));
    }, TICK_RATE_MS);
    return () => clearInterval(interval);
  }, [getProductionRates, view]);

  // Auto-save
  useEffect(() => {
    if (view === 'game') {
      const saveInterval = setInterval(saveGame, 5000);
      return () => clearInterval(saveInterval);
    }
  }, [view, saveGame]);

  // --- Interaction Handlers ---

  const handleManualGather = (type: ResourceType) => {
    let amount = 1;
    // Simple manual click bonus from essence
    amount += Math.floor(eternalEssence * 0.5);
    
    // Talent bonus
    const peonLevel = talents['peon_union'] || 0;
    if (peonLevel > 0) {
      amount = Math.floor(amount * (1 + (peonLevel * 0.2)));
    }
    
    setResources(prev => ({ ...prev, [type]: prev[type] + amount }));
  };

  const calculateCost = (base: number, multiplier: number, count: number) => {
    let cost = Math.floor(base * Math.pow(multiplier, count));
    if (raceId === 'gnome') {
      cost = Math.floor(cost * 0.9); // 10% discount
    }
    return cost;
  };

  const calculateUpgradeCost = useCallback((building: Building, upgrade: BuildingUpgrade): Resources => {
    const scale = Math.max(1, Math.floor(upgrade.threshold / 2));
    const discount = raceId === 'gnome' ? 0.9 : 1;

    const gold = building.baseCost.gold ? Math.floor(building.baseCost.gold * scale * discount) : 0;
    const wood = building.baseCost.wood ? Math.floor(building.baseCost.wood * scale * discount) : 0;
    const ore = building.baseCost.ore ? Math.floor(building.baseCost.ore * scale * discount) : 0;

    return { gold, wood, ore };
  }, [raceId]);

  const handleBuyBuilding = (buildingId: string) => {
    const buildingIndex = buildings.findIndex(b => b.id === buildingId);
    if (buildingIndex === -1) return;

    const building = buildings[buildingIndex];
    const costGold = calculateCost(building.baseCost.gold || 0, building.costMultiplier, building.count);
    const costWood = calculateCost(building.baseCost.wood || 0, building.costMultiplier, building.count);
    const costOre = calculateCost(building.baseCost.ore || 0, building.costMultiplier, building.count);

    if (resources.gold >= costGold && resources.wood >= costWood && resources.ore >= costOre) {
      setResources(prev => ({
        gold: prev.gold - costGold,
        wood: prev.wood - costWood,
        ore: prev.ore - costOre,
      }));

      const newBuildings = [...buildings];
      newBuildings[buildingIndex] = { ...building, count: building.count + 1 };
      setBuildings(newBuildings);
    }
  };

  const handleBuyUpgrade = (buildingId: string, upgradeId: string) => {
    const buildingIndex = buildings.findIndex(b => b.id === buildingId);
    if (buildingIndex === -1) return;

    const building = buildings[buildingIndex];
    const upgrade = building.upgrades?.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const isUnlocked = building.count >= upgrade.threshold;
    const alreadyPurchased = building.purchasedUpgrades?.includes(upgradeId);
    if (!isUnlocked || alreadyPurchased) return;

    const cost = calculateUpgradeCost(building, upgrade);
    const canAfford = 
      resources.gold >= cost.gold &&
      resources.wood >= cost.wood &&
      resources.ore >= cost.ore;

    if (!canAfford) {
      showNotification("Not enough resources for that upgrade.", 'error');
      return;
    }

    setResources(prev => ({
      gold: prev.gold - cost.gold,
      wood: prev.wood - cost.wood,
      ore: prev.ore - cost.ore,
    }));

    const newBuildings = [...buildings];
    const purchased = building.purchasedUpgrades ? [...building.purchasedUpgrades] : [];
    purchased.push(upgradeId);
    newBuildings[buildingIndex] = { ...building, purchasedUpgrades: purchased };
    setBuildings(newBuildings);
  };

  // --- Render Helpers ---
  
  const renderNotification = () => {
    if (!notification) return null;
    return (
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-xl z-[100] flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300 ${notification.type === 'success' ? 'bg-green-900/90 text-green-100 border border-green-700' : 'bg-red-900/90 text-red-100 border border-red-700'}`}>
        {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        <span className="font-bold font-serif tracking-wide">{notification.msg}</span>
      </div>
    );
  };

  const currentRaceConfig = RACES.find(r => r.id === raceId);
  const potentialEssence = calculatePrestigeEssence();

  // --- Views ---

  if (view === 'menu') {
    return (
      <>
        {renderNotification()}
        <MainMenu 
          onNewGame={startNewGame}
          onResume={loadGame}
          canResume={hasSave}
          onOptions={() => setView('options')}
          onInfo={() => setView('info')}
        />
      </>
    );
  }

  if (view === 'race_select') {
    return (
      <RaceSelection 
        onSelectRace={handleRaceSelection} 
        eternalEssence={eternalEssence}
      />
    );
  }

  if (view === 'talents') {
    return (
      <>
        {renderNotification()}
        {/* Prestige Confirmation Modal reused inside view flow if needed, but for now specific to bottom button */}
        {showPrestigeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border-2 border-purple-500 rounded-lg max-w-md w-full p-6 shadow-2xl relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-purple-900 rounded-full p-3 border-4 border-slate-900">
                <Sparkles size={32} className="text-purple-300 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-purple-300 text-center mt-4 mb-2 font-serif uppercase tracking-wide">Ascension</h3>
              <p className="text-center text-slate-300 mb-6">
                Are you sure? You will lose all resources and buildings.<br/>
                You will return to the race selection screen and gain:
                <br/>
                <span className="text-3xl font-bold text-white block mt-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  +{potentialEssence} Essence
                </span>
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPrestigeModal(false)}
                  className="flex-1 py-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-wide transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmPrestige}
                  className="flex-1 py-3 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wide transition-colors shadow-lg shadow-purple-900/50"
                >
                  Ascend
                </button>
              </div>
            </div>
          </div>
        )}
        <TalentTree 
          currentEssence={eternalEssence}
          talents={talents}
          onBuyTalent={handleBuyTalent}
          onClose={() => setView('game')}
          potentialEssence={potentialEssence}
          onPrestige={() => onPrestigeClick()}
        />
      </>
    );
  }

  if (view === 'options') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans overflow-y-auto p-4 relative">
        {renderNotification()}

        <div className="bg-slate-900 p-8 rounded-lg border-2 border-slate-700 max-w-2xl w-full shadow-2xl relative">
          
          <h2 className="text-3xl text-yellow-500 mb-6 font-bold uppercase tracking-wider font-serif text-center border-b border-slate-700 pb-4">
            Options
          </h2>

          <div className="space-y-8">
            
            {/* Export Section */}
            <div className="space-y-3">
              <h3 className="text-blue-200 font-bold flex items-center gap-2">
                <Download size={18} /> Export Save
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleExportClipboard}
                  className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-blue-900/30 hover:bg-blue-800/50 text-blue-100 rounded border border-blue-800/50 transition-colors"
                >
                  <Copy size={20} /> 
                  <span className="text-xs font-bold uppercase">To Clipboard</span>
                </button>
                <button 
                  onClick={handleExportFile}
                  className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-blue-900/30 hover:bg-blue-800/50 text-blue-100 rounded border border-blue-800/50 transition-colors"
                >
                  <FileDown size={20} />
                  <span className="text-xs font-bold uppercase">To File (.json)</span>
                </button>
              </div>
            </div>

            {/* Import Section */}
            <div className="space-y-3">
              <h3 className="text-yellow-200 font-bold flex items-center gap-2">
                <Upload size={18} /> Import Save
              </h3>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-900/30 hover:bg-yellow-800/50 text-yellow-100 rounded border border-yellow-800/50 transition-colors w-1/2"
                >
                  <FileUp size={16} /> <span className="text-xs font-bold uppercase">Upload File</span>
                </button>
                <input 
                  type="file" 
                  accept=".json" 
                  ref={fileInputRef} 
                  onChange={handleImportFile} 
                  className="hidden" 
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-slate-500 text-xs">Or paste string:</span>
                </div>
                <input
                  type="text"
                  value={importString}
                  onChange={(e) => setImportString(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-2 pl-24 pr-20 text-xs font-mono text-slate-300 focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <button 
                  onClick={handleImportString}
                  disabled={!importString}
                  className="absolute inset-y-1 right-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 rounded text-xs font-bold uppercase"
                >
                  Load
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-slate-700">
               <button 
                onClick={handleResetSave}
                className="flex items-center gap-2 px-4 py-2 bg-red-950 hover:bg-red-900 text-red-200 rounded border border-red-900/50 transition-colors text-xs font-bold uppercase"
              >
                <Trash2 size={16} /> Delete Local Save
              </button>
            </div>

          </div>

          <div className="mt-8 pt-4 border-t border-slate-700 flex justify-center">
            <button 
              onClick={() => {
                if (raceId) setView('game');
                else setView('menu');
              }}
              className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors uppercase font-bold text-sm tracking-wide"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'info') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white font-serif">
        <div className="bg-slate-900 p-8 rounded-lg border-2 border-slate-700 max-w-md w-full text-center shadow-2xl">
          <h2 className="text-3xl text-yellow-500 mb-4 font-bold uppercase tracking-wider">Info</h2>
          <div className="text-slate-400 mb-8 font-sans space-y-4 text-sm">
            <p><strong className="text-blue-200">Azeroth Idle: Alliance Edition</strong> v1.3.0</p>
            <p>Rebuild the Kingdom! Gather resources, construct buildings, and ascend to lead new races.</p>
          </div>
          <button 
            onClick={() => setView('menu')}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-900 hover:bg-blue-800 text-blue-100 rounded mx-auto transition-colors uppercase font-bold text-sm tracking-wide"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>
    );
  }

  const rates = getProductionRates();

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-gray-100 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      {renderNotification()}

      {/* Header */}
      <header className="flex-none p-4 border-b-4 border-yellow-600 bg-blue-950/90 backdrop-blur z-20 flex justify-between items-center shadow-lg shadow-black/50">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-2 rounded border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Shield size={32} className="text-yellow-400" fill="currentColor" fillOpacity={0.2} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500 drop-shadow-md tracking-wide uppercase font-serif">
              The Alliance
            </h1>
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold tracking-wider">
              <span className="bg-blue-900/80 px-2 py-0.5 rounded border border-blue-700 uppercase">{currentRaceConfig?.name || 'Unknown'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {/* Essence / Talent Button */}
           <button 
             onClick={() => { saveGame(); setView('talents'); }}
             className="flex items-center gap-2 px-3 h-10 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-purple-100 rounded border border-purple-800 hover:border-purple-500 transition-all shadow-sm"
             title="Talent Tree"
           >
             <Sparkles size={16} /> 
             <span className="font-bold font-mono">{eternalEssence}</span>
           </button>

           {/* Settings / Cog Button */}
           <button 
             onClick={() => { saveGame(); setView('options'); }}
             className="flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-blue-900 text-slate-300 hover:text-blue-100 rounded border border-slate-700 hover:border-blue-500 transition-all shadow-sm"
             title="Options"
           >
             <Settings size={20} /> 
           </button>
           
           {/* Menu / Exit Button */}
           <button 
             onClick={() => { saveGame(); setView('menu'); }}
             className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-200 rounded border border-slate-700 hover:border-red-800 transition-all text-xs uppercase font-bold tracking-wider h-10"
           >
             <LogOut size={14} /> <span className="hidden sm:inline">Menu</span>
           </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-y-auto p-4 lg:p-8 relative scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <ResourceCard type="gold" amount={resources.gold} rate={rates.gold} />
            <ResourceCard type="wood" amount={resources.wood} rate={rates.wood} />
            <ResourceCard type="ore" amount={resources.ore} rate={rates.ore} />
          </div>

          <div className="flex-none mb-12">
            <h2 className="text-xl font-bold text-blue-200 mb-6 flex items-center gap-2 font-serif">
              Actions
            </h2>
            <ClickerArea onGather={handleManualGather} raceId={raceId} />
          </div>
        </main>

        <aside className="w-full md:w-80 lg:w-96 flex-none z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-l border-slate-800 bg-slate-900">
          <BuildingShop 
            buildings={buildings} 
            currentResources={resources} 
            onBuy={handleBuyBuilding}
            calculateCost={calculateCost}
            onBuyUpgrade={handleBuyUpgrade}
            calculateUpgradeCost={calculateUpgradeCost}
          />
        </aside>
      </div>
    </div>
  );
};

export default App;
