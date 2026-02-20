
import React from 'react';
import { PositionResult, PositionCode } from '../types';

interface Props {
  results: PositionResult[];
}

const PositionMap: React.FC<Props> = ({ results }) => {
  const getResult = (pos: PositionCode) => results.find(r => r.position === pos);
  
  const maxRating = results.length > 0 ? Math.max(...results.map(r => r.rating)) : 0;

  const getRatingBackground = (rating: number) => {
    if (rating === 0) return 'bg-slate-800';
    const diff = maxRating - rating;
    if (diff === 0) return 'bg-emerald-500'; 
    if (diff <= 4) return 'bg-yellow-400';   
    if (diff <= 10) return 'bg-orange-400';  
    return 'bg-red-500';                     
  };

  const COL_ATTACK = "text-blue-400";   
  const COL_MID = "text-emerald-400";   
  const COL_DEF = "text-orange-400";    
  const COL_GK = "text-red-400";       

  const positions = [
    // --- ROW 1: STRIKERS (ATTACK) ---
    { label: 'PLE', code: 'ST', top: '8%', left: '30%', color: COL_ATTACK },
    { label: 'PL',  code: 'ST', top: '8%', left: '50%', color: COL_ATTACK },
    { label: 'PLD', code: 'ST', top: '8%', left: '70%', color: COL_ATTACK },

    // --- ROW 2: WINGERS (ATTACK) ---
    { label: 'EE', code: 'LW', top: '22%', left: '10%', color: COL_ATTACK },
    { label: 'ED', code: 'RW', top: '22%', left: '90%', color: COL_ATTACK },

    // --- ROW 3: ATTACKING MIDS (MID) ---
    { label: 'MOE', code: 'CAM', top: '36%', left: '30%', color: COL_MID },
    { label: 'MCO', code: 'CAM', top: '36%', left: '50%', color: COL_MID },
    { label: 'MOD', code: 'CAM', top: '36%', left: '70%', color: COL_MID },

    // --- ROW 4: MIDS (MID) ---
    { label: 'ME',  code: 'LM', top: '50%', left: '10%', color: COL_MID },
    { label: 'MCE', code: 'CM', top: '50%', left: '30%', color: COL_MID },
    { label: 'MC',  code: 'CM', top: '50%', left: '50%', color: COL_MID },
    { label: 'MCD', code: 'CM', top: '50%', left: '70%', color: COL_MID },
    { label: 'MD',  code: 'RM', top: '50%', left: '90%', color: COL_MID },

    // --- ROW 5: DEF MIDS (MID) ---
    { label: 'MDE', code: 'CDM', top: '64%', left: '30%', color: COL_MID }, 
    { label: 'MDC', code: 'CDM', top: '64%', left: '50%', color: COL_MID },
    { label: 'MDD', code: 'CDM', top: '64%', left: '70%', color: COL_MID },

    // --- ROW 6: DEFENDERS (DEF) ---
    { label: 'DE',  code: 'LB', top: '78%', left: '10%', color: COL_DEF },
    { label: 'DCE', code: 'CB', top: '78%', left: '30%', color: COL_DEF },
    { label: 'DC',  code: 'CB', top: '78%', left: '50%', color: COL_DEF },
    { label: 'DCD', code: 'CB', top: '78%', left: '70%', color: COL_DEF },
    { label: 'DD',  code: 'RB', top: '78%', left: '90%', color: COL_DEF },

    // --- ROW 7: GK (VERMELHO) ---
    { label: 'GR',  code: 'GK', top: '90%', left: '50%', color: COL_GK },
  ] as const;

  return (
    <div className="relative w-full aspect-[3/4] bg-[#4a8a2a] rounded-xl overflow-hidden border border-[#3a6a20] shadow-2xl mt-4">
      <div className="absolute inset-0 pointer-events-none" 
           style={{ 
             backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(0,0,0,0.05) 10%, rgba(0,0,0,0.05) 20%)',
           }}>
      </div>
      <div className="absolute inset-3 border border-white/40 rounded-sm pointer-events-none opacity-60"></div>
      <div className="absolute top-1/2 left-3 right-3 h-px bg-white/40 transform -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-white/40 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-3 left-1/2 w-1/2 h-[14%] border border-t-0 border-white/40 transform -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-3 left-1/2 w-1/2 h-[14%] border border-b-0 border-white/40 transform -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute top-3 left-1/2 w-1/4 h-[5%] border border-t-0 border-white/40 transform -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-3 left-1/2 w-1/4 h-[5%] border border-b-0 border-white/40 transform -translate-x-1/2 pointer-events-none"></div>

      {positions.map((pos, idx) => {
        const result = getResult(pos.code as PositionCode);
        const rating = result ? result.rating : 0;
        const bgClass = getRatingBackground(rating);
        const base = result ? result.baseRating : 0;
        const bonus = result ? result.bonus : 0;

        return (
          <div 
            key={`${pos.label}-${idx}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-[16%] h-[10%] sm:h-[11%] flex flex-col items-center rounded-md shadow-lg z-10 hover:z-20 hover:scale-110 transition-transform cursor-default overflow-hidden"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="flex-1 flex items-center justify-center w-full bg-black border-b border-black/20">
               <span className={`text-[9px] sm:text-[10px] md:text-xs font-black leading-none tracking-tight ${pos.color}`}>
                {pos.label}
              </span>
            </div>
            <div className={`w-full h-[55%] flex items-center justify-center ${bgClass}`}>
              {rating > 0 ? (
                <div className="flex items-center leading-none text-slate-950">
                  <span className="text-sm sm:text-base font-black">{base}</span>
                  {bonus > 0 && (
                    <span className="text-[10px] font-extrabold ml-0.5 opacity-80 align-top">
                      +{bonus}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm sm:text-base font-black text-slate-900/50">-</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PositionMap;
