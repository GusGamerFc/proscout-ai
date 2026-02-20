
import React from 'react';
import { PlayerAttributes } from '../types';
import { ATTRIBUTE_LABELS_PT } from '../constants';

interface Props {
  attributes: PlayerAttributes;
  onChange: (key: keyof PlayerAttributes, value: number) => void;
}

const groups = [
  { 
    name: 'RAPIDEZ', 
    keys: ['sprintSpeed', 'acceleration'] 
  },
  { 
    name: 'REMATE', 
    keys: ['finishing', 'positioning', 'shotPower', 'longShots', 'penalties', 'volleys'] 
  },
  { 
    name: 'PASSE', 
    keys: ['vision', 'crossing', 'fkAccuracy', 'longPassing', 'shortPassing', 'curve'] 
  },
  { 
    name: 'DRIBLE', 
    keys: ['agility', 'balance', 'reactions', 'composure', 'ballControl', 'dribbling'] 
  },
  { 
    name: 'DEFESA', 
    keys: ['interceptions', 'headingAccuracy', 'defensiveAwareness', 'standingTackle', 'slidingTackle'] 
  },
  { 
    name: 'FÍSICO', 
    keys: ['jumping', 'stamina', 'strength', 'aggression'] 
  },
  { 
    name: 'GUARDA-REDES', 
    keys: ['gkDiving', 'gkHandling', 'gkKicking', 'gkPositioning', 'gkReflexes'] 
  },
];

const AttributeInput: React.FC<Props> = ({ attributes, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <div key={group.name} className="relative bg-white/5 border border-white/5 p-5 rounded-2xl backdrop-blur-sm hover:border-white/10 transition-colors group">
          
          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-black mb-4 uppercase text-[10px] tracking-[0.2em] border-b border-white/5 pb-2">
            {group.name}
          </h3>
          
          <div className="space-y-3">
            {group.keys.map((key) => {
              const attrKey = key as keyof PlayerAttributes;
              const val = attributes[attrKey] || 0;
              const label = ATTRIBUTE_LABELS_PT[attrKey] || key;
              
              // Color Logic (Updated)
              // 80-99: Verde
              // 70-79: Amarelo
              // 50-69: Laranja
              // 0-49:  Laranja Escuro (Vermelho)
              let colorClass = "text-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.3)]"; 
              if (val >= 80) colorClass = "text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.4)]"; 
              else if (val >= 70) colorClass = "text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.3)]";
              else if (val >= 50) colorClass = "text-orange-400 drop-shadow-[0_0_3px_rgba(251,146,60,0.3)]";

              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <label 
                    className="text-slate-400 text-xs font-semibold uppercase tracking-wide cursor-pointer hover:text-slate-200 transition-colors flex-1" 
                    htmlFor={`attr-${key}`}
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      id={`attr-${key}`}
                      type="number"
                      min="1"
                      max="99"
                      value={val}
                      onChange={(e) => onChange(attrKey, parseInt(e.target.value) || 0)}
                      className={`
                        w-14 bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 
                        text-center font-mono font-bold text-sm
                        focus:border-emerald-500/50 focus:bg-emerald-500/5 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none 
                        transition-all duration-300
                        ${colorClass}
                      `}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttributeInput;
