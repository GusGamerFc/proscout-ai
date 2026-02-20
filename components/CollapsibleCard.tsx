
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  badge?: React.ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}

const CollapsibleCard: React.FC<Props> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = false, 
  className = "",
  badge,
  onMoveUp,
  onMoveDown,
  disableUp = false,
  disableDown = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`
      relative group
      bg-[#0f1216]/60 backdrop-blur-md 
      rounded-2xl overflow-hidden 
      border border-white/5 
      hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)]
      transition-all duration-500
      ${className}
    `}>
      {/* Decorative Glow on Hover */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-700"></div>

      <div 
        className="w-full flex items-center justify-between p-5 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-4 flex-1">
          {icon && (
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 shadow-inner group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300">
              {icon}
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase tracking-widest drop-shadow-sm">
              {title}
            </h3>
          </div>
          {badge && <div className="ml-2">{badge}</div>}
        </div>

        <div className="flex items-center space-x-2">
          {/* Controles de Reordenação */}
          {(onMoveUp || onMoveDown) && (
            <div className="flex items-center mr-2 bg-black/20 rounded-lg border border-white/5 p-0.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {onMoveUp && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                  disabled={disableUp}
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${disableUp ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-emerald-400'}`}
                  title="Mover para Cima"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              )}
              {onMoveDown && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                  disabled={disableDown}
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${disableDown ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-emerald-400'}`}
                  title="Mover para Baixo"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Botão de Colapso */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className={`
              p-2 rounded-lg border transition-all duration-300
              ${isOpen 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
              }
            `}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="p-5 pt-0 border-t border-white/5">
          <div className="mt-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCard;
