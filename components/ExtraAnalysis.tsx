import React, { useState } from 'react';
import { PlayerInfo, BmiAnalysis, PotentialAnalysis, PositionCode } from '../types';
import { POSITION_LABELS_PT } from '../constants';
import { Shield, Zap, Target, Briefcase, TrendingUp, Info } from 'lucide-react';
import CollapsibleCard from './CollapsibleCard';

interface Props {
  info: PlayerInfo;
  bmi: BmiAnalysis | null;
  potential: PotentialAnalysis | null;
}

const ExtraAnalysis: React.FC<Props> = ({ info, bmi, potential }) => {
  const [showJustification, setShowJustification] = useState(false);
  
  const hasPlayStyles = info.playStyles && info.playStyles.length > 0;
  const hasRoles = info.roles && info.roles.length > 0;

  if (!hasPlayStyles && !hasRoles && !bmi && !potential) return null;

  const getHeightColorClass = (analysis: string) => {
    if (analysis.includes("Ideal") || analysis.includes("Adequado")) {
      return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
    }
    if (analysis.includes("Baixo") || analysis.includes("Alto")) {
      return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
    }
    return 'text-slate-300 bg-slate-800 border border-slate-700';
  };

  const generateJustification = (p: PotentialAnalysis, ageStr: string) => {
    const pot = Math.round(p.average);
    const age = parseInt(ageStr) || 16;
    
    if (pot >= 90) return `💎 JOIA RARA: Com um potencial projetado de ~${pot}, este atleta pertence à elite mundial (90+). A promoção é prioritária para garantir tempo de jogo ou empréstimo imediato.`;
    
    if (pot >= 85) return `🚀 GRANDE PROMESSA: Potencial de ~${pot} indica um futuro titular indiscutível. A promoção é recomendada assim que houver vaga no plantel principal.`;
    
    if (pot >= 75) return `📈 EM DESENVOLVIMENTO: Potencial sólido de ~${pot}. Recomenda-se manter na academia para focar na evolução de atributos físicos ou técnicos específicos antes de subir.`;
    
    if (pot >= 70) return `🛡️ RESERVA ÚTIL: Potencial mediano de ~${pot}. Pode ser útil para compor elenco, mas monitore o crescimento mensal antes de oferecer contrato profissional.`;
    
    return `⚠️ BAIXO RETORNO: O potencial projetado de ~${pot} está abaixo da média competitiva da liga. Estatisticamente, recomenda-se a dispensa para libertar recursos de scouting.`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Coluna Esquerda: Estilos e Funções */}
      <div className="space-y-6">
        
        {/* Estilos de Jogo (PlayStyles) */}
        {hasPlayStyles && (
          <CollapsibleCard 
            title="Estilos de Jogo" 
            icon={<Zap className="w-4 h-4 text-yellow-500" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {info.playStyles.map((style, idx) => (
                <div key={idx} className={`flex items-center p-2.5 rounded-xl border ${style.type === 'plus' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
                  <div className={`w-3 h-3 rotate-45 mr-3 flex-shrink-0 ${style.type === 'plus' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-slate-500'}`}></div>
                  <span className={`text-xs font-bold ${style.type === 'plus' ? 'text-yellow-400' : 'text-slate-300'}`}>
                    {style.name}{style.type === 'plus' ? ' +' : ''}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleCard>
        )}

        {/* Papéis de Atleta (Roles) */}
        {hasRoles && (
          <CollapsibleCard 
            title="Papéis de Atleta" 
            icon={<Shield className="w-4 h-4 text-emerald-400" />}
          >
            <div className="space-y-2 mt-4">
              {info.roles.map((role, idx) => {
                const ptPosLabel = role.position ? (POSITION_LABELS_PT[role.position.toUpperCase() as PositionCode] || role.position) : '';
                const levelDisplay = role.level === 'plusplus' ? '++' : role.level === 'plus' ? '+' : '';
                
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 group hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="bg-emerald-500/10 p-1.5 rounded-lg">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="text-sm font-bold text-slate-200">
                        {ptPosLabel ? <span className="text-emerald-400 font-extrabold mr-1">{ptPosLabel} - </span> : ''}
                        {role.name}
                      </span>
                    </div>
                    {levelDisplay && (
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shadow-sm">
                        {levelDisplay}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CollapsibleCard>
        )}
      </div>

      {/* Coluna Direita: Análise Biofísica e Potencial */}
      <div className="space-y-6">
        
        {/* Físico / IMC */}
        {bmi && (
          <CollapsibleCard 
            title="Análise Biofísica" 
            icon={<Target className="w-4 h-4 text-cyan-400" />}
          >
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">Índice de Massa Corporal</span>
                <div className="text-right">
                  <div className={`text-sm font-bold uppercase px-3 py-1.5 rounded-lg inline-block tracking-wide ${
                    bmi.category === 'Normal' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                  }`}>
                    {bmi.category}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                 <span className="text-xs text-slate-500 font-bold uppercase">Estatura para a Posição</span>
                 <div className="text-right">
                   <div className={`text-sm font-bold uppercase px-3 py-1.5 rounded-lg inline-block tracking-wide ${getHeightColorClass(bmi.heightAnalysis)}`}>
                      {bmi.heightAnalysis.split('(')[0].replace(/ para (Defesa|Meio|Ataque)/i, '').trim()}
                   </div>
                 </div>
              </div>
            </div>
          </CollapsibleCard>
        )}

        {/* Relatório de Potencial */}
        {potential && (
          <CollapsibleCard 
            title="Relatório da Academia" 
            icon={<TrendingUp className="w-4 h-4 text-fuchsia-400" />}
          >
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-fuchsia-900/10 to-slate-900/50 border border-fuchsia-500/20">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] text-fuchsia-400 font-bold uppercase block">Potencial Médio</span>
                    <div className="text-2xl font-mono font-black text-white">{Math.round(potential.average)}</div>
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] text-slate-500 font-bold uppercase block">Status</span>
                     <div className="text-xs font-bold text-fuchsia-300">{potential.label}</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowJustification(!showJustification)}
                  className={`w-full mt-2 p-3 rounded-lg border text-center text-xs font-bold uppercase tracking-tight transition-all duration-200 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 ${potential.recommendationColor} ${showJustification ? 'ring-2 ring-white/20' : ''}`}
                >
                   {potential.recommendation}
                   <Info className="w-3 h-3 opacity-70" />
                </button>

                {showJustification && (
                  <div className="mt-3 p-3 bg-black/40 rounded-lg border border-white/5 animate-in slide-in-from-top-2 fade-in duration-300">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      {generateJustification(potential, info.age)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleCard>
        )}
      </div>
    </div>
  );
};

export default ExtraAnalysis;