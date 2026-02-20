import React from 'react';
import { Zap } from 'lucide-react';
import { PlayerInfo, PositionResult, PlayerAttributes, PositionCode } from '../types';
import { POSITION_LABELS_PT } from '../constants';
import LazyImage from './LazyImage';

interface Props {
  info: PlayerInfo;
  topPositions?: PositionResult[];
  attributes: PlayerAttributes;
  onInfoChange?: (key: keyof PlayerInfo, value: any) => void;
}

const StarRating: React.FC<{ 
  count: number; 
  label: string; 
  onChange?: (val: number) => void;
}> = ({ count, label, onChange }) => (
  <div className="flex flex-col">
    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{label}</span>
    <div className="flex space-x-1 group">
      {[1, 2, 3, 4, 5].map((i) => (
        <button 
          key={i}
          onClick={() => onChange && onChange(i)}
          className={`focus:outline-none transition-all duration-200 ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          type="button"
        >
          <svg 
            className={`w-3.5 h-3.5 ${i <= count ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-700 text-slate-700'}`} 
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  </div>
);

const PlayerHeader: React.FC<Props> = ({ info, topPositions = [], attributes, onInfoChange }) => {
  if (!info.name && !info.age && !info.height) return null;

  // Atributos de Destaque (>= 80)
  const highlightAttributes = [
    { key: 'finishing', label: 'Finalização' },
    { key: 'dribbling', label: 'Drible' },
    { key: 'acceleration', label: 'Aceleração' },
    { key: 'sprintSpeed', label: 'Sprint' },
    { key: 'agility', label: 'Agilidade' },
    { key: 'shotPower', label: 'Potência' },
    { key: 'vision', label: 'Visão' },
    { key: 'interceptions', label: 'Interceção' },
    { key: 'strength', label: 'Força' },
  ].filter(item => {
    const val = attributes[item.key as keyof PlayerAttributes];
    return typeof val === 'number' && val >= 80;
  }).slice(0, 6); // Max 6 tags

  const getPosLabel = (pos: string) => POSITION_LABELS_PT[pos as PositionCode] || pos;
  
  const getFootLabel = (foot: string) => {
    if (!foot) return "-";
    const lower = foot.toLowerCase();
    if (lower === 'left' || lower === 'esquerdo') return 'Esquerdo';
    if (lower === 'right' || lower === 'direito') return 'Direito';
    return foot;
  };

  // SOFIFA Standard Color Scale (Updated)
  // 80-99: Verde
  // 70-79: Amarelo
  // 50-69: Laranja
  // 0-49:  Laranja Escuro (Vermelho)
  const getRatingColor = (val: number) => {
    if (val >= 80) return "text-emerald-500"; 
    if (val >= 70) return "text-yellow-400";
    if (val >= 50) return "text-orange-400";
    return "text-red-500"; 
  };

  // Name splitting logic: "VÍCTOR IGNACIO" (small) "MALCORRA" (big)
  const fullName = info.name || "NOME DO ATLETA";
  const nameParts = fullName.trim().split(" ");
  let firstName = "";
  let lastName = fullName;

  if (nameParts.length > 1) {
    lastName = nameParts.pop() || "";
    firstName = nameParts.join(" ");
  }

  const renderPotential = (range: string) => {
    const nums = range.match(/\d+/g)?.map(Number);
    if (nums && nums.length >= 2) {
      return (
        <span className="text-lg font-black leading-tight flex items-center gap-1">
          <span className={getRatingColor(nums[0])}>{nums[0]}</span>
          <span className="text-slate-600 font-medium text-sm">-</span>
          <span className={getRatingColor(nums[1])}>{nums[1]}</span>
        </span>
      );
    }
    return <span className="text-slate-200 text-lg font-black leading-tight">{range}</span>;
  };

  return (
    <div className="w-full bg-[#1e232d] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
       {/* Background accent */}
       <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>

       <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
          
          {/* LEFT: INFO CARD STYLE */}
          <div className="flex-1 min-w-0">
              
              {/* Row 1: Rating & Positions */}
              <div className="flex items-center gap-4 mb-2">
                 <div className="relative">
                    {/* Boost Badge - Exibe se overallBoost for diferente de 0 */}
                    {info.overallBoost && info.overallBoost !== 0 ? (
                      <span className={`absolute -top-3 left-0 text-xs font-black tracking-tighter ${info.overallBoost > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {info.overallBoost > 0 ? '+' : ''}{info.overallBoost}
                      </span>
                    ) : null}
                    
                    <div className={`text-4xl font-black leading-none ${getRatingColor(info.overall)}`}>
                        {info.overall || 0}
                    </div>
                 </div>

                 <div className="w-px h-8 bg-white/10"></div>
                 <div className="text-slate-300 font-semibold text-sm tracking-wide flex flex-wrap gap-2">
                    {info.positions.length > 0 ? (
                      info.positions.map((pos, i) => (
                        <span key={pos} className="uppercase">
                          {getPosLabel(pos)}
                          {i < info.positions.length - 1 && <span className="text-slate-600 mx-2">•</span>}
                        </span>
                      ))
                    ) : "POS"}
                 </div>
              </div>

              {/* Row 2: Name & Flag */}
              <div className="mb-6">
                 {firstName && (
                   <div className="text-sm text-slate-400 font-medium tracking-widest uppercase mb-0.5 ml-1">
                     {firstName}
                   </div>
                 )}
                 <div className="flex items-center gap-3">
                   {info.countryCode && (
                     <div className="w-9 h-6 rounded shadow-sm overflow-hidden flex-shrink-0 border border-white/10">
                        <LazyImage 
                          src={`https://flagcdn.com/w160/${info.countryCode.toLowerCase()}.png`} 
                          alt={info.countryCode}
                          className="w-full h-full object-cover"
                        />
                     </div>
                   )}
                   <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                     {lastName}
                   </h1>
                 </div>
              </div>

              {/* Row 3: Meta Grid */}
              <div className="flex flex-wrap items-center gap-y-4 gap-x-8 border-t border-white/5 pt-4">
                 
                 {/* Potential Section - Exibe apenas se disponível */}
                 {info.potentialRange && (
                   <>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Potencial</span>
                        {renderPotential(info.potentialRange)}
                     </div>
                     <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                   </>
                 )}

                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Idade</span>
                    <span className="text-slate-200 text-lg font-bold leading-tight">{info.age || "-"}</span>
                 </div>

                 <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Altura e peso</span>
                    <span className="text-slate-200 text-lg font-bold leading-tight">
                       {info.height || "-"} <span className="text-slate-600 text-sm mx-1">/</span> {info.weight || "-"}
                    </span>
                 </div>

                 <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Pé pref.</span>
                    <span className="text-emerald-400 text-lg font-bold leading-tight capitalize">
                      {getFootLabel(info.preferredFoot)}
                    </span>
                 </div>
              </div>

          </div>

          {/* RIGHT: TECHNICAL & HIGHLIGHTS */}
          <div className="flex-shrink-0 lg:w-72 flex flex-col gap-4">
             {/* Tech Stars */}
             <div className="bg-[#151921] rounded-xl p-4 border border-white/5 flex justify-between gap-4">
                <StarRating 
                  count={info.skillMoves} 
                  label="Mov. Técnicos" 
                  onChange={(val) => onInfoChange && onInfoChange('skillMoves', val)}
                />
                <div className="w-px bg-white/5"></div>
                <StarRating 
                  count={info.weakFoot} 
                  label="Pior Pé" 
                  onChange={(val) => onInfoChange && onInfoChange('weakFoot', val)}
                />
             </div>

             {/* Highlights Tags */}
             {highlightAttributes.length > 0 && (
               <div className="bg-[#151921] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Especialidades</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {highlightAttributes.map(attr => (
                      <div key={attr.key} className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-slate-300 border border-white/5">
                        {attr.label} <span className="text-white ml-1">{attributes[attr.key as keyof PlayerAttributes]}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>

       </div>
    </div>
  );
};

export default PlayerHeader;