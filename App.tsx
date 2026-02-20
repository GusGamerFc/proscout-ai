
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AlertCircle, 
  RefreshCw, 
  Trophy, 
  Activity, 
  Camera, 
  Images, 
  Map as MapIcon, 
  ListChecks, 
  Settings2, 
  Download, 
  Upload,
  FileText,
  Shield 
} from 'lucide-react';
import { PlayerAttributes, PlayerInfo, AnalysisState, PositionResult, BmiAnalysis, PotentialAnalysis, DevelopmentPlan, PositionCode } from './types';
import { INITIAL_ATTRIBUTES, INITIAL_PLAYER_INFO, POSITION_LABELS_PT, ATTRIBUTE_LABELS_PT } from './constants';
import { analyzePlayerImages } from './services/geminiService';
import { calculateAllPositions, analyzeBMI, analyzePotential, getDevelopmentPlan } from './services/calculatorService';
import AttributeInput from './components/AttributeInput';
import PositionMap from './components/PositionMap';
import PlayerRadar from './components/RadarChart';
import PlayerHeader from './components/PlayerHeader';
import ExtraAnalysis from './components/ExtraAnalysis';
import DevelopmentPlanView from './components/DevelopmentPlan';
import CollapsibleCard from './components/CollapsibleCard';
import LazyImage from './components/LazyImage';

const App: React.FC = () => {
  const [attributes, setAttributes] = useState<PlayerAttributes>(INITIAL_ATTRIBUTES);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>(INITIAL_PLAYER_INFO);
  const [results, setResults] = useState<PositionResult[]>([]);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({ status: 'idle' });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'attributes_dist',
    'field_map',
    'dev_plan',
    'all_positions',
    'attr_editor'
  ]);

  const [showImages, setShowImages] = useState<boolean>(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const dataImportRef = useRef<HTMLInputElement>(null);
  
  const [bmiAnalysis, setBmiAnalysis] = useState<BmiAnalysis | null>(null);
  const [potentialAnalysis, setPotentialAnalysis] = useState<PotentialAnalysis | null>(null);
  const [devPlans, setDevPlans] = useState<DevelopmentPlan[]>([]);

  useEffect(() => {
    const newResults = calculateAllPositions(attributes, playerInfo);
    setResults(newResults);
    
    const bestPos = newResults.find(r => r.isBest)?.position;
    setBmiAnalysis(analyzeBMI(playerInfo.height, playerInfo.weight, bestPos));
    setPotentialAnalysis(analyzePotential(playerInfo.potentialRange || '', playerInfo.age, playerInfo.overall));
    setDevPlans(getDevelopmentPlan(newResults));
  }, [attributes, playerInfo]);

  const handleAttributeChange = useCallback((key: keyof PlayerAttributes, value: number) => {
    setAttributes(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleInfoChange = useCallback((key: keyof PlayerInfo, value: any) => {
    setPlayerInfo(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setAnalysisState({ status: 'uploading' });
    const base64Images: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        base64Images.push(base64);
      }

      setImageUrls(base64Images);
      setAnalysisState({ status: 'analyzing' });
      
      const result = await analyzePlayerImages(base64Images);
      
      if (result.attributes) {
        setAttributes(prev => ({ ...prev, ...result.attributes }));
      }
      if (result.info) {
        setPlayerInfo(prev => ({ ...prev, ...result.info }));
      }
      
      setAnalysisState({ status: 'success' });
    } catch (error: any) {
      setAnalysisState({ status: 'error', error: error.message });
    }
  };

  const exportData = () => {
    const dataToSave = {
      attributes,
      playerInfo,
      sectionOrder,
      exportedAt: new Date().toISOString()
    };
    
    const name = (playerInfo.name || 'Jogador').replace(/\s+/g, '_');
    const overall = playerInfo.overall || 0;
    const age = (playerInfo.age || '0').replace(/\D/g, '');
    const country = playerInfo.countryCode || 'UNK';
    
    const fileName = `${name}_${overall}_${age}_${country}.json`;
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDataImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.attributes) setAttributes(json.attributes);
        if (json.playerInfo) setPlayerInfo(json.playerInfo);
        if (json.sectionOrder && Array.isArray(json.sectionOrder)) {
          setSectionOrder(json.sectionOrder);
        }
        setAnalysisState({ status: 'success' });
      } catch (err) {
        setAnalysisState({ status: 'error', error: 'Arquivo JSON inválido ou corrompido.' });
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sectionOrder.length - 1) return;

    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setSectionOrder(newOrder);
  };

  const getRatingColorClass = (rating: number) => {
    if (rating >= 80) return 'text-emerald-500';
    if (rating >= 70) return 'text-yellow-400';
    if (rating >= 50) return 'text-orange-400';
    return 'text-red-500';
  };

  const generateReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const bestPos = results.find(r => r.isBest);
    const bestPosLabel = bestPos ? POSITION_LABELS_PT[bestPos.position] : '-';
    const bestBaseRating = bestPos ? bestPos.baseRating : '-';
    const bestBonus = bestPos ? bestPos.bonus : 0;
    
    const attrGroups = [
      { name: 'Rapidez', keys: ['acceleration', 'sprintSpeed'] },
      { name: 'Remate', keys: ['finishing', 'shotPower', 'longShots', 'volleys', 'penalties', 'positioning'] },
      { name: 'Passe', keys: ['shortPassing', 'longPassing', 'crossing', 'vision', 'curve', 'fkAccuracy'] },
      { name: 'Drible', keys: ['dribbling', 'ballControl', 'agility', 'balance', 'reactions', 'composure'] },
      { name: 'Defesa', keys: ['defensiveAwareness', 'standingTackle', 'slidingTackle', 'interceptions', 'headingAccuracy'] },
      { name: 'Físico', keys: ['strength', 'stamina', 'jumping', 'aggression'] },
    ];
    if (playerInfo.positions.includes('GK') || bestPos?.position === 'GK') {
      attrGroups.push({ name: 'Guarda-Redes', keys: ['gkDiving', 'gkHandling', 'gkKicking', 'gkReflexes', 'gkPositioning'] });
    }

    const getColor = (v: number) => {
        if (v >= 80) return '#10b981';
        if (v >= 70) return '#eab308';
        if (v >= 50) return '#f97316';
        return '#ef4444';
    };

    const renderAttrGroup = (group: {name: string, keys: string[]}) => {
      const rows = group.keys.map(key => {
        const val = attributes[key as keyof PlayerAttributes] || 0;
        const color = getColor(val); 
        const label = ATTRIBUTE_LABELS_PT[key as keyof PlayerAttributes] || key;
        return `
          <div class="attr-row">
            <span class="attr-name">${label}</span>
            <span class="attr-val" style="color: ${color}; background: ${color}15; padding: 1px 4px; border-radius: 2px;">${val}</span>
          </div>
        `;
      }).join('');
      return `
        <div class="attr-group">
          <div class="group-title">${group.name}</div>
          ${rows}
        </div>`;
    };

    const renderDevPlanHTML = (plan: DevelopmentPlan) => {
      return `
        <div class="dev-card">
          <div class="dev-header">
            <span class="dev-role">${POSITION_LABELS_PT[plan.position]} - ${plan.role.name}</span>
            <span class="dev-focus">${plan.role.focus === 'MT' ? 'Skill Moves' : 'Pior Pé'}</span>
          </div>
          <div class="dev-attrs">
            <span style="color: #64748b; font-size: 9px; margin-right: 4px;">FOCO:</span>
            ${plan.attributeNames.slice(0, 4).join(', ')}
          </div>
        </div>
      `;
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório - ${playerInfo.name || 'Jogador'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
          @page { size: A4; margin: 10mm; }
          body { 
            font-family: 'Inter', sans-serif; 
            color: #0f172a; 
            background: white; 
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
          }
          .container { width: 100%; max-width: 190mm; margin: 0 auto; }
          
          /* Header Compacto */
          header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 15px; }
          .logo { font-size: 16px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; color: #1e293b; }
          .logo span { color: #059669; }
          .meta-date { font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase; }

          /* Player Profile Section */
          .profile-grid { display: grid; grid-template-columns: 70px 1fr 180px; gap: 15px; margin-bottom: 15px; align-items: center; }
          .flag-box { width: 70px; height: 46px; border-radius: 4px; overflow: hidden; border: 1px solid #e2e8f0; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 24px; }
          .player-name { font-size: 28px; font-weight: 900; line-height: 1; text-transform: uppercase; color: #0f172a; }
          .player-meta { font-size: 10px; color: #64748b; font-weight: 600; margin-top: 4px; text-transform: uppercase; }
          
          /* Best Position Card */
          .best-pos-card { background: #064e3b; color: white; padding: 10px 15px; border-radius: 6px; text-align: right; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .best-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #6ee7b7; font-weight: 700; }
          .best-val-row { display: flex; align-items: baseline; justify-content: flex-end; gap: 8px; line-height: 1; margin-top: 2px; }
          .pos-code { font-size: 24px; font-weight: 900; }
          .pos-rat { font-size: 24px; font-weight: 900; color: #34d399; }
          .pos-bonus { background: #059669; font-size: 10px; padding: 2px 5px; border-radius: 3px; font-weight: bold; transform: translateY(-3px); }

          /* Quick Stats Bar */
          .quick-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 20px; }
          .q-stat { background: #f1f5f9; padding: 6px 10px; border-radius: 4px; border-left: 3px solid #cbd5e1; }
          .q-label { font-size: 8px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block; margin-bottom: 2px; }
          .q-val { font-size: 11px; font-weight: 800; color: #0f172a; }
          
          /* Main Content Grid (Asymmetrical) */
          .main-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
          
          /* Attributes Grid */
          .attr-section { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .attr-group { margin-bottom: 5px; page-break-inside: avoid; }
          .group-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #059669; border-bottom: 1px solid #e2e8f0; margin-bottom: 4px; padding-bottom: 2px; }
          .attr-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; font-size: 9px; }
          .attr-name { color: #334155; font-weight: 600; }
          .attr-val { font-family: 'Courier New', monospace; font-weight: 700; min-width: 20px; text-align: center; }

          /* Sidebar (Analysis) */
          .sidebar h3 { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-left: 3px solid #059669; padding-left: 8px; margin: 0 0 10px 0; background: #f0fdf4; padding-top: 3px; padding-bottom: 3px; }
          
          /* Dev Plan Cards */
          .dev-card { border: 1px solid #e2e8f0; border-radius: 5px; padding: 8px; margin-bottom: 8px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
          .dev-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
          .dev-role { font-size: 10px; font-weight: 800; color: #0f172a; }
          .dev-focus { font-size: 8px; background: #f0fdf4; color: #166534; padding: 1px 5px; border-radius: 3px; border: 1px solid #bbf7d0; font-weight: 700; }
          .dev-attrs { font-size: 9px; color: #059669; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

          /* Top Alternatives Table */
          .alt-table { width: 100%; border-collapse: collapse; font-size: 9px; }
          .alt-table th { text-align: left; color: #64748b; font-weight: 700; padding: 4px; border-bottom: 1px solid #e2e8f0; }
          .alt-table td { padding: 4px; border-bottom: 1px dashed #f1f5f9; font-weight: 600; color: #334155; }
          .alt-row-best { background: #ecfdf5; }
          .alt-rating { font-weight: 800; color: #0f172a; text-align: right; }
          .alt-bonus { font-size: 8px; color: #10b981; margin-left: 2px; }

          /* Footer */
          footer { margin-top: 25px; padding-top: 10px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="logo">ProScout <span>AI</span> Vision</div>
            <div class="meta-date">Relatório Técnico • ${new Date().toLocaleDateString()}</div>
          </header>

          <div class="profile-grid">
            <div class="flag-box">
              ${playerInfo.countryCode ? `<img src="https://flagcdn.com/w80/${playerInfo.countryCode.toLowerCase()}.png" style="width: 100%; height: 100%; object-fit: cover;">` : '🏳️'}
            </div>
            <div>
              <div class="player-name">${playerInfo.name || 'JOGADOR DESCONHECIDO'}</div>
              <div class="player-meta">
                ${playerInfo.age ? `${playerInfo.age} ANOS` : 'ID N/A'} • 
                ${playerInfo.height || '-'} • 
                ${playerInfo.weight || '-'} • 
                ${playerInfo.preferredFoot || '-'}
              </div>
            </div>
            <div class="best-pos-card">
              <div class="best-label">Melhor Posição</div>
              <div class="best-val-row">
                <span class="pos-code">${bestPosLabel}</span>
                <span class="pos-rat">${bestBaseRating}</span>
                ${bestBonus > 0 ? `<span class="pos-bonus">+${bestBonus}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="quick-stats">
            <div class="q-stat" style="border-color: #fbbf24;">
              <span class="q-label">Técnica</span>
              <span class="q-val">${playerInfo.skillMoves}★ SM / ${playerInfo.weakFoot}★ WF</span>
            </div>
            <div class="q-stat" style="border-color: #38bdf8;">
              <span class="q-label">Biofísica</span>
              <span class="q-val">${bmiAnalysis?.category || '-'} (${bmiAnalysis?.value || '-'})</span>
            </div>
            <div class="q-stat" style="border-color: #c084fc;">
              <span class="q-label">Potencial</span>
              <span class="q-val">${potentialAnalysis ? Math.round(potentialAnalysis.average) : '-'} <span style="font-weight:400; font-size:9px; color:#64748b">AVG</span></span>
            </div>
            <div class="q-stat" style="border-color: #10b981;">
              <span class="q-label">Papel Atual</span>
              <span class="q-val">${playerInfo.roles[0]?.name || 'Base'}</span>
            </div>
          </div>

          <div class="main-grid">
            <!-- Coluna Esquerda: Atributos -->
            <div class="attr-section">
              ${attrGroups.map(g => renderAttrGroup(g)).join('')}
            </div>

            <!-- Coluna Direita: Análise -->
            <div class="sidebar">
              <h3>Planos de Desenvolvimento</h3>
              ${devPlans.length > 0 ? devPlans.slice(0, 3).map(p => renderDevPlanHTML(p)).join('') : '<div style="font-size:9px; color:#94a3b8; font-style:italic;">Sem planos disponíveis.</div>'}
              
              <h3 style="margin-top: 20px;">Ranking Posicional</h3>
              <table class="alt-table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>OVR</th>
                  </tr>
                </thead>
                <tbody>
                  ${results.slice(0, 10).map((res, idx) => `
                    <tr class="${res.isBest ? 'alt-row-best' : ''}">
                      <td>${idx + 1}. ${POSITION_LABELS_PT[res.position]} <span style="color:#94a3b8; font-size:8px;">(${res.position})</span></td>
                      <td class="alt-rating">
                        ${res.baseRating}
                        ${res.bonus > 0 ? `<sup class="alt-bonus">+${res.bonus}</sup>` : ''}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              ${potentialAnalysis ? `
                <div style="margin-top: 20px; padding: 10px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 5px;">
                  <div style="font-size: 8px; font-weight: 700; color: #64748b; text-transform: uppercase;">Veredito da Academia</div>
                  <div style="font-size: 10px; font-weight: 600; color: #334155; margin-top: 3px; line-height: 1.4;">
                    ${potentialAnalysis.recommendation}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>

          <footer>
            <div>Gerado por ProScout AI 2026</div>
            <div>www.proscout.ai</div>
          </footer>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const bestPosition = results.find(r => r.isBest);
  const isGoalkeeper = playerInfo.positions.includes('GK') || bestPosition?.position === 'GK';

  const renderSection = (id: string, index: number) => {
    const isFirst = index === 0;
    const isLast = index === sectionOrder.length - 1;
    
    const moveProps = {
      onMoveUp: () => moveSection(index, 'up'),
      onMoveDown: () => moveSection(index, 'down'),
      disableUp: isFirst,
      disableDown: isLast
    };

    switch (id) {
      case 'attributes_dist':
        return (
          <CollapsibleCard 
            key={id}
            title="Distribuição de Atributos" 
            icon={<Activity className="w-4 h-4" />}
            defaultOpen={false}
            {...moveProps}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 py-4">
              <div className="w-full md:w-1/2">
                 <PlayerRadar attributes={attributes} isGoalkeeper={isGoalkeeper} />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Trophy className="w-3 h-3 text-emerald-500" />
                    Melhor Posição Sugerida
                  </h4>
                  {bestPosition && (
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            {POSITION_LABELS_PT[bestPosition.position]}
                        </span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Classificação Geral</span>
                      </div>
                      <div className="flex items-end">
                        <div className="text-6xl font-mono font-black text-white leading-none drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            {bestPosition.baseRating}
                        </div>
                        {bestPosition.bonus > 0 && (
                            <span className="text-lg font-bold text-emerald-400 mb-1 ml-1">
                                +{bestPosition.bonus}
                            </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleCard>
        );
      case 'field_map':
        return (
          <CollapsibleCard 
            key={id}
            title="Mapa de Campo" 
            icon={<MapIcon className="w-4 h-4" />}
            defaultOpen={false}
            {...moveProps}
          >
            <PositionMap results={results} />
          </CollapsibleCard>
        );
      case 'dev_plan':
        return (
          <DevelopmentPlanView 
            key={id} 
            plans={devPlans} 
            {...moveProps} 
          />
        );
      case 'all_positions':
        return (
          <CollapsibleCard 
            key={id}
            title="Classificação em Todas as Posições" 
            icon={<ListChecks className="w-4 h-4" />}
            defaultOpen={false}
            {...moveProps}
          >
            <div className="space-y-2 mt-4">
              {results.map((res) => (
                <div 
                  key={res.position}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    res.isBest 
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                    : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      res.isBest 
                      ? 'bg-emerald-500 border-emerald-400 text-white' 
                      : 'bg-black/40 border-white/10 text-slate-400'
                    }`}>
                      {POSITION_LABELS_PT[res.position]}
                    </div>
                    <span className={`font-bold text-xs uppercase ${res.isBest ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {res.position}
                    </span>
                  </div>
                  <div className="flex items-center justify-end w-14">
                      <span className={`font-mono font-black text-xl ${getRatingColorClass(res.rating)}`}>
                        {res.baseRating}
                      </span>
                      {res.bonus > 0 && (
                        <span className="text-[10px] font-bold text-emerald-500 ml-1">
                          +{res.bonus}
                        </span>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleCard>
        );
      case 'attr_editor':
        return (
          <CollapsibleCard 
            key={id}
            title="Editor de Atributos" 
            icon={<Settings2 className="w-4 h-4" />}
            defaultOpen={false}
            {...moveProps}
          >
            <div className="mt-4">
              <AttributeInput attributes={attributes} onChange={handleAttributeChange} />
            </div>
          </CollapsibleCard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-200 pb-12">
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050505]/80 border-b border-white/5 py-4 px-4 mb-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
               <Shield className="w-full h-full text-emerald-500 fill-emerald-500/10 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" strokeWidth={1.5} />
               <Trophy className="absolute w-4 h-4 text-emerald-100 mb-0.5" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">
                PROSCOUT <span className="text-emerald-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                FC Position Calculator <span className="text-emerald-500">Beta 1.12.7</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => dataImportRef.current?.click()}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider border border-white/5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Abrir</span>
            </button>
            <input type="file" ref={dataImportRef} onChange={handleDataImport} className="hidden" accept=".json" />

            <button 
              onClick={exportData}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider border border-white/5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salvar</span>
            </button>

            <button 
              onClick={generateReport}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider border border-white/5 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Relatório</span>
            </button>

            <button 
              onClick={() => importInputRef.current?.click()}
              disabled={analysisState.status === 'analyzing' || analysisState.status === 'uploading'}
              className="relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#059669_0%,#ffffff_50%,#059669_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white backdrop-blur-3xl transition-all hover:bg-emerald-500 uppercase tracking-wider space-x-2">
                {analysisState.status === 'analyzing' || analysisState.status === 'uploading' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
                <span>Digitalizar</span>
              </span>
            </button>
            <input type="file" ref={importInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" multiple />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 space-y-8">
        {analysisState.status === 'error' && (
          <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-xl flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-400 font-bold text-sm uppercase">Erro</h4>
              <p className="text-red-300/80 text-xs mt-1">{analysisState.error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <PlayerHeader 
            info={playerInfo} 
            topPositions={results} 
            attributes={attributes} 
            onInfoChange={handleInfoChange}
          />
          <ExtraAnalysis info={playerInfo} bmi={bmiAnalysis} potential={potentialAnalysis} />
        </div>

        {sectionOrder.map((sectionId, index) => renderSection(sectionId, index))}

        {imageUrls.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <button 
              onClick={() => setShowImages(!showImages)}
              className="bg-black/60 backdrop-blur-lg border border-white/10 p-3 rounded-full text-slate-300"
            >
              <Images className="w-6 h-6" />
            </button>
            {showImages && (
              <div className="absolute bottom-16 right-0 w-72 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 origin-bottom-right">
                <div className="grid grid-cols-2 gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/5">
                        <LazyImage src={url} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-20 text-center text-[10px] text-slate-700 font-bold uppercase tracking-[0.2em] border-t border-white/5 pt-8 mb-8">
        ProScout AI © 2026 • Ferramenta de Análise Competitiva
      </footer>
    </div>
  );
};

export default App;
