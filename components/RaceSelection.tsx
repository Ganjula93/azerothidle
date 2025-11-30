import React from 'react';
import { RaceId } from '../types';
import { RACES } from '../constants';
import { Shield, Hammer, Trees, Zap } from 'lucide-react';

interface RaceSelectionProps {
  onSelectRace: (raceId: RaceId) => void;
  eternalEssence: number;
}

const RaceSelection: React.FC<RaceSelectionProps> = ({ onSelectRace, eternalEssence }) => {
  
  const getIcon = (iconName: string, size: number) => {
    const props = { size, className: "text-current" };
    switch (iconName) {
      case 'Shield': return <Shield {...props} />;
      case 'Hammer': return <Hammer {...props} />;
      case 'Trees': return <Trees {...props} />;
      case 'Zap': return <Zap {...props} />;
      default: return <Shield {...props} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4 font-sans bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
      <div className="max-w-4xl w-full z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-md font-serif tracking-widest uppercase mb-4">
            Select Your Race
          </h1>
          <p className="text-blue-300 font-serif text-lg">Who will you lead to glory?</p>
          {eternalEssence > 0 && (
             <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-900/40 border border-purple-500/50 rounded-full">
               <span className="text-purple-300 text-sm font-bold uppercase tracking-wider">Eternal Essence:</span>
               <span className="text-purple-100 font-mono font-bold text-lg">{eternalEssence}</span>
               <span className="text-xs text-purple-400 ml-1">(+{eternalEssence * 10}% Production)</span>
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RACES.map((race) => (
            <button
              key={race.id}
              onClick={() => onSelectRace(race.id)}
              className="group relative overflow-hidden bg-slate-900 border-2 border-slate-700 hover:border-yellow-500 rounded-lg p-6 text-left transition-all hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:-translate-y-1 active:scale-[0.99]"
            >
              <div className="flex items-start gap-4 z-10 relative">
                <div className="p-4 rounded bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-700 text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  {getIcon(race.icon, 40)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-serif text-slate-100 group-hover:text-yellow-200">{race.name}</h3>
                  <p className="text-sm text-slate-400 mt-1 mb-3 leading-relaxed">{race.description}</p>
                  <div className="inline-block px-2 py-1 bg-green-900/30 border border-green-800 rounded text-xs text-green-400 font-bold uppercase tracking-wider">
                    Bonus: {race.bonusDescription}
                  </div>
                </div>
              </div>
              
              {/* Background Icon Watermark */}
              <div className="absolute -bottom-6 -right-6 text-slate-800/30 group-hover:text-blue-900/20 transition-colors pointer-events-none">
                {getIcon(race.icon, 150)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaceSelection;