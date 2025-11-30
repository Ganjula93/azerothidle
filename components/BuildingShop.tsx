import React from 'react';
import { Building, Resources, ResourceType } from '../types';
import { Axe, Pickaxe, Store, Factory, Flame, Coins, Hammer, Shield } from 'lucide-react';

interface BuildingShopProps {
  buildings: Building[];
  currentResources: Resources;
  onBuy: (buildingId: string) => void;
  calculateCost: (baseCost: number, multiplier: number, count: number) => number;
}

const BuildingShop: React.FC<BuildingShopProps> = ({ buildings, currentResources, onBuy, calculateCost }) => {
  
  const getIcon = (iconName: string) => {
    const props = { size: 20 };
    switch (iconName) {
      case 'Axe': return <Axe {...props} />;
      case 'Pickaxe': return <Pickaxe {...props} />;
      case 'Store': return <Store {...props} />;
      case 'Factory': return <Factory {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Coins': return <Coins {...props} />;
      case 'Hammer': return <Hammer {...props} />;
      case 'Shield': return <Shield {...props} />;
      default: return <Hammer {...props} />;
    }
  };

  const renderCost = (type: ResourceType, amount: number) => {
    if (!amount) return null;
    const canAfford = currentResources[type] >= amount;
    return (
      <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 font-mono ${canAfford ? 'text-gray-300 bg-gray-800 border border-gray-600' : 'text-red-400 bg-red-900/20 border border-red-900/50'}`}>
        {amount.toLocaleString('en-US')} 
        <span className="capitalize text-[10px] tracking-wider">{type === 'gold' ? 'Gold' : type === 'wood' ? 'Wood' : 'Ore'}</span>
      </span>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4 w-full flex flex-col gap-4 scrollbar-thin">
      <div className="pb-4 border-b border-blue-900/50 mb-2">
        <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2 font-serif uppercase tracking-wider">
          <Hammer className="text-blue-400" /> 
          Build Menu
        </h2>
        <p className="text-xs text-blue-300 mt-1">Construct buildings for Stormwind</p>
      </div>
      
      {buildings.map(building => {
        const costGold = calculateCost(building.baseCost.gold || 0, building.costMultiplier, building.count);
        const costWood = calculateCost(building.baseCost.wood || 0, building.costMultiplier, building.count);
        const costOre = calculateCost(building.baseCost.ore || 0, building.costMultiplier, building.count);

        const canAfford = 
          currentResources.gold >= costGold &&
          currentResources.wood >= costWood &&
          currentResources.ore >= costOre;

        return (
          <button
            key={building.id}
            onClick={() => onBuy(building.id)}
            disabled={!canAfford}
            className={`
              group relative flex flex-col gap-2 p-3 rounded border text-left transition-all
              ${canAfford 
                ? 'border-blue-700 bg-slate-800/80 hover:bg-blue-900/30 hover:border-yellow-500 active:scale-[0.98]' 
                : 'border-slate-800 bg-slate-900 opacity-60 grayscale cursor-not-allowed'}
            `}
          >
            {/* Selection styling corner */}
            <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors ${canAfford ? 'border-blue-500 group-hover:border-yellow-400' : 'border-slate-700'}`}></div>
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors ${canAfford ? 'border-blue-500 group-hover:border-yellow-400' : 'border-slate-700'}`}></div>

            <div className="flex justify-between items-start w-full relative z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded border shadow-inner ${canAfford ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-600 text-yellow-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                  {getIcon(building.icon)}
                </div>
                <div>
                  <h4 className={`font-bold font-serif ${canAfford ? 'text-blue-100 group-hover:text-yellow-200' : 'text-slate-500'}`}>{building.name}</h4>
                  <p className="text-[10px] text-blue-300/70 leading-tight mt-0.5 max-w-[180px]">{building.description}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-700 font-serif select-none drop-shadow-sm group-hover:text-slate-600">
                {building.count}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 relative z-10">
              {costGold > 0 && renderCost('gold', costGold)}
              {costWood > 0 && renderCost('wood', costWood)}
              {costOre > 0 && renderCost('ore', costOre)}
            </div>

            <div className="text-[10px] text-slate-400 mt-2 flex gap-2 border-t border-slate-700/50 pt-1">
              <span className="uppercase tracking-widest text-slate-500">Yield:</span>
              {building.production.gold && <span className="text-yellow-500">+{building.production.gold} Gold</span>}
              {building.production.wood && <span className="text-green-500">+{building.production.wood} Wood</span>}
              {building.production.ore && <span className="text-slate-400">+{building.production.ore} Ore</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default BuildingShop;