
import React from 'react';

interface Props {
  activeCells?: {
    high: number[];
    medium: number[];
  };
  isMirrored?: boolean; // Se verdadeiro, espelha o grid horizontalmente (para posições da direita)
}

const TacticalPad: React.FC<Props> = ({ activeCells = { high: [], medium: [] }, isMirrored = false }) => {
  const cells = Array.from({ length: 25 }, (_, i) => i);

  // Função para espelhar o índice da coluna horizontalmente
  const getLogicalIndex = (visualIndex: number) => {
    if (!isMirrored) return visualIndex;
    
    const row = Math.floor(visualIndex / 5);
    const col = visualIndex % 5;
    const mirroredCol = 4 - col;
    
    return (row * 5) + mirroredCol;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#080a0f] rounded-xl border border-white/5 shadow-2xl relative overflow-hidden w-full max-w-[260px] mx-auto group min-h-[200px]">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 blur-[60px] pointer-events-none"></div>

      {/* 3D Perspective Grid - Enlarged */}
      <div 
        style={{ perspective: '400px' }} 
        className="w-full h-full flex items-center justify-center"
      >
        <div 
          className="grid grid-cols-5 grid-rows-5 w-44 h-44"
          style={{ 
            transform: 'rotateX(55deg) scale(1.2)', 
            transformStyle: 'preserve-3d',
          }}
        >
          {cells.map((i) => {
            const logicalIndex = getLogicalIndex(i);
            const isHigh = activeCells?.high?.includes(logicalIndex);
            const isMedium = activeCells?.medium?.includes(logicalIndex);

            return (
              <div
                key={i}
                className={`
                  relative border transition-all duration-300
                  ${isHigh 
                    ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.9)] border-emerald-300 z-10' 
                    : isMedium
                      ? 'bg-emerald-900/60 shadow-[0_0_10px_rgba(5,150,105,0.5)] border-emerald-600/50 z-0'
                      : 'bg-[#12151a]/80 border-slate-700/30 hover:bg-slate-700/50'
                  }
                `}
              >
                {/* Inner Glow for High Cells */}
                {isHigh && (
                   <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TacticalPad;
