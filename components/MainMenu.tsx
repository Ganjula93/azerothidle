import React from 'react';
import { Shield, Play, RotateCcw, Settings, Info, Scroll } from 'lucide-react';

interface MainMenuProps {
  onNewGame: () => void;
  onResume: () => void;
  canResume: boolean;
  onOptions: () => void;
  onInfo: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onResume, canResume, onOptions, onInfo }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 animate-pulse pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center gap-8 p-6 md:p-12 max-w-md w-full animate-in fade-in zoom-in duration-500">
        {/* Title */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-4 rounded-full bg-blue-900/50 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)] relative group">
             <div className="absolute inset-0 rounded-full border-4 border-yellow-200/50 animate-ping opacity-20"></div>
             <Shield size={64} className="text-yellow-400 drop-shadow-lg" fill="currentColor" fillOpacity={0.2} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-sm font-serif tracking-widest text-center uppercase">
            Azeroth<br/><span className="text-3xl tracking-[0.5em] text-blue-300">Idle</span>
          </h1>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 w-full">
          {canResume && (
            <button 
              onClick={onResume}
              className="group relative w-full py-4 px-6 bg-blue-900/80 hover:bg-blue-800 border-2 border-yellow-600 rounded flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg hover:shadow-yellow-500/20 active:scale-95"
            >
              <Play className="text-yellow-400 fill-yellow-400" size={24} />
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold font-serif text-yellow-100 uppercase tracking-wider leading-none">Resume Game</span>
                <span className="text-[10px] text-yellow-500/80 uppercase tracking-widest">Continue your journey</span>
              </div>
            </button>
          )}

          <button 
            onClick={onNewGame}
            className="group w-full py-3 px-6 bg-slate-900/80 hover:bg-slate-800 border border-slate-600 hover:border-red-500/50 rounded flex items-center justify-center gap-3 transition-all hover:translate-x-1 active:scale-95"
          >
            <RotateCcw size={18} className="text-slate-400 group-hover:text-red-400 transition-colors" />
            <span className="text-lg font-bold font-serif text-slate-300 group-hover:text-red-100 uppercase tracking-wide transition-colors">New Game</span>
          </button>

          <div className="grid grid-cols-2 gap-4">
             <button 
              onClick={onOptions}
              className="group py-3 px-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Settings size={16} className="text-slate-500 group-hover:text-slate-300" />
              <span className="text-sm font-bold font-serif text-slate-500 group-hover:text-slate-300 uppercase">Options</span>
            </button>
             <button 
              onClick={onInfo}
              className="group py-3 px-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Scroll size={16} className="text-slate-500 group-hover:text-slate-300" />
              <span className="text-sm font-bold font-serif text-slate-500 group-hover:text-slate-300 uppercase">Info</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-8 font-serif italic opacity-50 select-none">"For the Alliance!"</p>
      </div>
    </div>
  );
};

export default MainMenu;