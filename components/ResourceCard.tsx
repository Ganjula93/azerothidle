import React from 'react';
import { ResourceType } from '../types';
import { Coins, Trees, Pickaxe } from 'lucide-react';

interface ResourceCardProps {
  type: ResourceType;
  amount: number;
  rate: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ type, amount, rate }) => {
  const getIcon = () => {
    switch (type) {
      case 'gold': return <Coins className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />;
      case 'wood': return <Trees className="w-6 h-6 text-green-500" />;
      case 'ore': return <Pickaxe className="w-6 h-6 text-slate-300" />;
    }
  };

  const getName = () => {
    switch (type) {
      case 'gold': return 'Gold';
      case 'wood': return 'Wood';
      case 'ore': return 'Ore';
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'gold': return 'border-yellow-600/50 bg-gradient-to-br from-yellow-900/20 to-slate-900 shadow-yellow-900/20';
      case 'wood': return 'border-green-600/50 bg-gradient-to-br from-green-900/20 to-slate-900 shadow-green-900/20';
      case 'ore': return 'border-slate-500/50 bg-gradient-to-br from-slate-800/40 to-slate-900 shadow-slate-900/20';
    }
  };

  return (
    <div className={`relative flex flex-col p-4 rounded border ${getStyles()} shadow-lg backdrop-blur-sm transition-all duration-300 group overflow-hidden`}>
      {/* Glossy effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>
      
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="p-2 bg-slate-950/80 rounded border border-slate-700 shadow-inner">
          {getIcon()}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{getName()}</span>
      </div>
      
      <div className="mt-auto relative z-10 pl-1">
        <span className="text-3xl font-bold tracking-tight block font-serif text-white drop-shadow-md">
          {Math.floor(amount).toLocaleString('en-US')}
        </span>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[10px] uppercase text-slate-500 tracking-wider">Production</span>
          <span className={`text-xs font-mono font-medium ${rate > 0 ? 'text-green-400' : 'text-slate-500'}`}>
             +{rate.toFixed(1)}/s
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;