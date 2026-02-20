
import React, { useState } from 'react';
import { DevelopmentPlan, PositionCode } from '../types';
import { POSITION_LABELS_PT } from '../constants';
import { ChevronDown, ChevronUp, Star, FileText, Dumbbell, Zap, Target, Crosshair } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';
import TacticalPad from './TacticalPad';

interface Props {
  plans: DevelopmentPlan[];
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}

const DevelopmentPlanView: React.FC<Props> = ({ 
  plans,
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown
}) => {
  const [expandedPos, setExpandedPos] = useState<string | null>(null);

  if (plans.length === 0) return null;

  const toggleExpand = (pos: string) => {
    setExpandedPos(expandedPos === pos ? null : pos);
  };

  // List of Right-sided positions that need grid mirroring
  // Fix: Removed 'RWB' from the array as it is not present in the PositionCode type definition.
  const rightSidedPositions: PositionCode[] = ['RB', 'RM', 'RW'];

  return (
    <CollapsibleCard 
      title="Plano de Desenvolvimento" 
      icon={<Dumbbell className="w-5 h-5 text-cyan-400" />}
      className="mb-8"
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      disableUp={disableUp}
      disableDown={disableDown}
    >
      <div className="flex flex-col space-y-3 mt-4">
        {plans.map((plan, idx) => {
          const isExpanded = expandedPos === plan.position;
          const isMirrored = rightSidedPositions.includes(plan.position);
          
          return (
            <div 
              key={`${plan.position}-${idx}`} 
              className={`bg-slate-800/40 rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer hover:border-cyan-500/30
                ${isExpanded ? 'border-cyan-500/50 bg-slate-800/80 shadow-lg' : 'border-slate-700/50'}
              `}
              onClick={() => toggleExpand(plan.position)}
            >
              {/* Header - Always Visible */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border
                    ${isExpanded ? 'bg-cyan-900/20 border-cyan-500/30 text-cyan-400' : 'bg-slate-700/30 border-slate-600 text-slate-400'}`}>
                    {POSITION_LABELS_PT[plan.position]}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Plano de Evolução</div>
                    <div className={`font-bold flex items-center gap-2 ${isExpanded ? 'text-white' : 'text-slate-300'}`}>
                      {plan.role.name}
                      {plan.role.focusLabel && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                          {plan.role.focusLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {!isExpanded && (
                    <div className="hidden sm:flex items-center space-x-2 text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-700">
                      {plan.role.focus === 'MT' && <span className="flex items-center text-yellow-500"><Star className="w-3 h-3 mr-1 fill-yellow-500"/> Skill Moves</span>}
                      {plan.role.focus === 'PP' && <span className="flex items-center text-blue-400"><Zap className="w-3 h-3 mr-1 fill-blue-400"/> Pior Pé</span>}
                    </div>
                  )}
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {/* Body */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                  <div className="h-px w-full bg-slate-700/50 mb-4"></div>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column: Text & Stats */}
                    <div className="flex-1 space-y-4">
                       {plan.role.description && (
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                          <h4 className="text-xs text-slate-400 uppercase mb-1 flex items-center font-bold">
                            <FileText className="w-3 h-3 mr-1" />
                            Diretriz Tática
                          </h4>
                          <p className="text-sm text-slate-300 italic">"{plan.role.description}"</p>
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        <div>
                          <h4 className="text-xs text-cyan-400 uppercase mb-2 flex items-center font-bold">
                            <Target className="w-3 h-3 mr-1" />
                            Treino de Atributos
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.attributeNames.map(attr => (
                              <span key={attr} className="px-2.5 py-1 bg-cyan-950/30 text-cyan-200 text-xs font-medium rounded border border-cyan-900/50">
                                {attr}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <h4 className="text-xs text-slate-500 uppercase mb-2 font-bold flex items-center gap-1">
                                <Crosshair className="w-3 h-3" /> Foco Tático
                              </h4>
                              <div className="text-xs font-black text-white bg-slate-900 p-2 rounded border border-slate-700 uppercase tracking-tighter">
                                {plan.role.focusLabel || 'Equilibrado'}
                              </div>
                           </div>
                           <div>
                              <h4 className="text-xs text-slate-500 uppercase mb-2 font-bold flex items-center gap-1">
                                <Star className="w-3 h-3" /> Evolução Técnica
                              </h4>
                              {plan.role.focus === 'MT' ? (
                                <div className="text-xs font-black text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/20 uppercase tracking-tighter">
                                  Skill Moves
                                </div>
                              ) : (
                                <div className="text-xs font-black text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-400/20 uppercase tracking-tighter">
                                  Weak Foot
                                </div>
                              )}
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Tactical Pad (Image) */}
                    <div className="flex-shrink-0 flex items-center justify-center md:border-l md:border-slate-700/50 md:pl-6">
                      <TacticalPad activeCells={plan.role.focusGrid} isMirrored={isMirrored} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </CollapsibleCard>
  );
};

export default DevelopmentPlanView;