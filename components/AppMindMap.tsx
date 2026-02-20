
import React from 'react';
import { Camera, Keyboard, FileJson, Cpu, Database, Activity, Map as MapIcon, Dumbbell, ArrowDown, Zap } from 'lucide-react';

const Node: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  desc?: string; 
  color: string;
  borderColor: string;
}> = ({ icon, title, desc, color, borderColor }) => (
  <div className={`flex flex-col items-center p-4 rounded-xl border bg-slate-900/80 backdrop-blur-sm shadow-xl z-10 w-full md:w-48 transition-all hover:scale-105 ${borderColor}`}>
    <div className={`p-3 rounded-full mb-3 ${color} shadow-lg`}>
      {icon}
    </div>
    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-center">{title}</h4>
    {desc && <p className="text-[10px] text-slate-500 text-center mt-1 leading-tight">{desc}</p>}
  </div>
);

const Connector: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-2">
    <div className="h-6 w-px bg-slate-700"></div>
    <ArrowDown className="w-4 h-4 text-slate-600" />
  </div>
);

const AppMindMap: React.FC = () => {
  return (
    <div className="relative p-6 rounded-2xl bg-[#0b0f13] border border-slate-800 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-2">
        
        {/* Nível 1: Entradas */}
        <div className="w-full flex flex-col md:flex-row justify-center gap-4 md:gap-8">
          <Node 
            icon={<Camera className="w-5 h-5 text-white" />} 
            title="Gemini Vision AI" 
            desc="OCR & Análise de Imagem" 
            color="bg-emerald-600"
            borderColor="border-emerald-500/30"
          />
          <Node 
            icon={<Keyboard className="w-5 h-5 text-white" />} 
            title="Entrada Manual" 
            desc="Edição de Atributos" 
            color="bg-slate-700"
            borderColor="border-slate-600"
          />
          <Node 
            icon={<FileJson className="w-5 h-5 text-white" />} 
            title="Importação JSON" 
            desc="Dados Salvos" 
            color="bg-blue-600"
            borderColor="border-blue-500/30"
          />
        </div>

        {/* Conector Combinado */}
        <div className="flex flex-col items-center">
          <div className="hidden md:block w-3/4 h-4 border-b border-l border-r border-slate-700 rounded-b-xl mb-1"></div>
          <ArrowDown className="w-5 h-5 text-slate-500" />
        </div>

        {/* Nível 2: O Cérebro (Processamento) */}
        <div className="p-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 animate-pulse">
            <div className="flex flex-col items-center p-6 rounded-xl bg-[#0f141a] border border-slate-700 md:w-96 text-center">
                <div className="bg-slate-800 p-3 rounded-full mb-2">
                    <Cpu className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase tracking-widest">
                    ProScout Engine
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                    Algoritmo de ponderação posicional oficial FC 26 + Lógica de Scouting Personalizada
                </p>
                <div className="flex gap-2 mt-3">
                    <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">Cálculo de Rating</span>
                    <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">Análise de Potencial</span>
                    <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">Biofísica (IMC)</span>
                </div>
            </div>
        </div>

        <Connector />

        {/* Nível 3: Saídas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <Node 
                icon={<MapIcon className="w-4 h-4 text-white" />} 
                title="Melhor Posição" 
                desc="Mapa de Calor & Rating Real" 
                color="bg-orange-500"
                borderColor="border-orange-500/30"
            />
            <Node 
                icon={<Activity className="w-4 h-4 text-white" />} 
                title="Radar de Atributos" 
                desc="Visualização Hexagonal" 
                color="bg-lime-600"
                borderColor="border-lime-500/30"
            />
            <Node 
                icon={<Dumbbell className="w-4 h-4 text-white" />} 
                title="Plano de Treino" 
                desc="Papéis & Focos de Evolução" 
                color="bg-cyan-600"
                borderColor="border-cyan-500/30"
            />
             <Node 
                icon={<Zap className="w-4 h-4 text-white" />} 
                title="Relatório Academia" 
                desc="PlayStyles & Potencial" 
                color="bg-fuchsia-600"
                borderColor="border-fuchsia-500/30"
            />
        </div>

      </div>
    </div>
  );
};

export default AppMindMap;
