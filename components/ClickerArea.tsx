import React, { useState, useCallback } from 'react';
import { RaceId, ResourceType } from '../types';
import { Pickaxe, Trees, Coins } from 'lucide-react';
import { RACES } from '../constants';

interface ClickerAreaProps {
  onGather: (type: ResourceType) => void;
  raceId: RaceId | null;
}

const ClickerArea: React.FC<ClickerAreaProps> = ({ onGather, raceId }) => {
  // Simple visual feedback state
  const [activeBtn, setActiveBtn] = useState<ResourceType | null>(null);

  const handleClick = useCallback((type: ResourceType) => {
    onGather(type);
    setActiveBtn(type);
    setTimeout(() => setActiveBtn(null), 100);
  }, [onGather]);

  const currentRace = RACES.find(r => r.id === raceId) || RACES[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
      {/* Wood Button */}
      <button
        onClick={() => handleClick('wood')}
        className={`
          group relative h-40 rounded-lg border-2 border-blue-800 bg-slate-900 
          flex flex-col items-center justify-center gap-2 transition-all duration-75
          hover:bg-slate-800 hover:border-yellow-500 shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1
          ${activeBtn === 'wood' ? 'bg-slate-800 border-yellow-500 translate-y-1 shadow-none' : ''}
        `}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 pointer-events-none"></div>
        <div className="p-3 rounded-full bg-green-900/50 text-green-400 group-hover:text-green-300 ring-2 ring-green-900/30 group-hover:ring-green-500/50 transition-all">
          <Trees size={40} />
        </div>
        <div className="text-center z-10">
          <h3 className="text-lg font-bold text-blue-100 font-serif tracking-wide">Gather Timber</h3>
          <p className="text-green-500 text-xs uppercase font-bold tracking-wider">{currentRace.woodLabel}</p>
        </div>
      </button>

      {/* Ore Button */}
      <button
        onClick={() => handleClick('ore')}
        className={`
          group relative h-40 rounded-lg border-2 border-blue-800 bg-slate-900 
          flex flex-col items-center justify-center gap-2 transition-all duration-75
          hover:bg-slate-800 hover:border-yellow-500 shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1
          ${activeBtn === 'ore' ? 'bg-slate-800 border-yellow-500 translate-y-1 shadow-none' : ''}
        `}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="p-3 rounded-full bg-slate-800 text-slate-400 group-hover:text-slate-200 ring-2 ring-slate-700 group-hover:ring-slate-500 transition-all">
          <Pickaxe size={40} />
        </div>
        <div className="text-center z-10">
          <h3 className="text-lg font-bold text-blue-100 font-serif tracking-wide">Mine Ore</h3>
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{currentRace.oreLabel}</p>
        </div>
      </button>

      {/* Gold Button */}
      <button
        onClick={() => handleClick('gold')}
        className={`
          group relative h-40 rounded-lg border-2 border-blue-800 bg-slate-900 
          flex flex-col items-center justify-center gap-2 transition-all duration-75
          hover:bg-slate-800 hover:border-yellow-500 shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1
          ${activeBtn === 'gold' ? 'bg-slate-800 border-yellow-500 translate-y-1 shadow-none' : ''}
        `}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-5 pointer-events-none"></div>
        <div className="p-3 rounded-full bg-yellow-900/30 text-yellow-500 group-hover:text-yellow-400 ring-2 ring-yellow-900/50 group-hover:ring-yellow-500/50 transition-all">
          <Coins size={40} />
        </div>
        <div className="text-center z-10">
          <h3 className="text-lg font-bold text-blue-100 font-serif tracking-wide">Collect Taxes</h3>
          <p className="text-yellow-500 text-xs uppercase font-bold tracking-wider">{currentRace.goldLabel}</p>
        </div>
      </button>
    </div>
  );
};

export default ClickerArea;