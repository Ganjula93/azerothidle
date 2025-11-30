
import React from 'react';
import { Talent } from '../types';
import { TALENTS } from '../constants';
import { Sparkles, Crown, Hand, Mountain, Leaf, Scroll, ArrowLeft, Lock } from 'lucide-react';

interface TalentTreeProps {
  currentEssence: number;
  talents: Record<string, number>;
  onBuyTalent: (talentId: string) => void;
  onClose: () => void;
  potentialEssence: number;
  onPrestige: () => void;
}

const TalentTree: React.FC<TalentTreeProps> = ({ 
  currentEssence, 
  talents, 
  onBuyTalent, 
  onClose,
  potentialEssence,
  onPrestige
}) => {

  const getIcon = (iconName: string) => {
    const props = { size: 24, className: "text-purple-300" };
    switch (iconName) {
      case 'Crown': return <Crown {...props} />;
      case 'Hand': return <Hand {...props} />;
      case 'Mountain': return <Mountain {...props} />;
      case 'Leaf': return <Leaf {...props} />;
      case 'Scroll': return <Scroll {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const calculateCost = (base: number, mult: number, level: number) => {
    return Math.floor(base * Math.pow(mult, level));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse pointer-events-none"></div>
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border-b border-purple-900/50 shadow-lg z-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 font-serif uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="text-purple-400" /> Astral Plane
        </h2>
        <p className="text-purple-200/70 text-sm mt-2">Spend Eternal Essence to empower your faction across timelines.</p>
        
        <div className="mt-4 flex items-center gap-2 px-6 py-2 bg-purple-950/50 border border-purple-500/50 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]">
           <span className="text-purple-300 text-xs font-bold uppercase tracking-wider">Available Essence:</span>
           <span className="text-2xl font-mono font-bold text-white drop-shadow-md">{currentEssence}</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Unspent Essence grants +10% Production per point.</p>
      </div>

      {/* Talent Grid */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TALENTS.map(talent => {
            const currentLevel = talents[talent.id] || 0;
            const cost = calculateCost(talent.baseCost, talent.costMultiplier, currentLevel);
            const canAfford = currentEssence >= cost;
            const isMaxed = talent.maxLevel ? currentLevel >= talent.maxLevel : false;

            return (
              <div 
                key={talent.id}
                className={`
                  relative p-5 rounded-lg border-2 transition-all duration-300 flex flex-col gap-3 group
                  ${isMaxed 
                    ? 'bg-purple-900/20 border-purple-500/50' 
                    : canAfford 
                      ? 'bg-slate-900/80 border-purple-700 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                      : 'bg-slate-900/50 border-slate-800 opacity-70'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-full border shadow-inner ${isMaxed || canAfford ? 'bg-purple-950 border-purple-600' : 'bg-slate-800 border-slate-700 grayscale'}`}>
                    {getIcon(talent.icon)}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-purple-400 font-bold uppercase tracking-wide">Level</span>
                    <div className="text-2xl font-bold font-serif leading-none">{currentLevel}</div>
                  </div>
                </div>

                <div>
                  <h3 className={`font-bold font-serif text-lg ${canAfford ? 'text-purple-100' : 'text-slate-400'}`}>{talent.name}</h3>
                  <p className="text-xs text-slate-300/80 leading-relaxed min-h-[40px]">{talent.description}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                  {isMaxed ? (
                     <button disabled className="w-full py-2 bg-purple-500/20 text-purple-300 rounded border border-purple-500/50 font-bold text-xs uppercase cursor-default">
                       Max Level
                     </button>
                  ) : (
                    <button 
                      onClick={() => onBuyTalent(talent.id)}
                      disabled={!canAfford}
                      className={`
                        w-full py-2 rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2
                        ${canAfford 
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50 hover:translate-y-[-1px]' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                      `}
                    >
                      {canAfford ? 'Upgrade' : <Lock size={12} />} 
                      <span>{cost} Essence</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Ascension Area */}
      <div className="p-6 bg-slate-900 border-t border-purple-900/50 z-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors uppercase font-bold text-sm tracking-wide"
          >
            <ArrowLeft size={16} /> Back to Game
          </button>

          <div className="flex-1 w-full md:w-auto bg-purple-950/30 border border-purple-500/30 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
               <h4 className="text-purple-300 font-bold uppercase text-sm tracking-wider">Ascension Protocol</h4>
               <p className="text-xs text-slate-400">Reset world progress to gain new Essence.</p>
            </div>
            
            <button 
                onClick={onPrestige}
                disabled={potentialEssence <= 0}
                className={`
                  relative overflow-hidden px-8 py-3 rounded font-bold uppercase tracking-wide transition-all
                  ${potentialEssence > 0 
                    ? 'bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}
                `}
              >
                <div className="flex flex-col items-center leading-none gap-1">
                  <span className="text-[10px] opacity-80">Reset now</span>
                  <span className="text-lg flex items-center gap-2">
                    <Sparkles size={16} /> Ascend (+{potentialEssence} Essence)
                  </span>
                </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentTree;
