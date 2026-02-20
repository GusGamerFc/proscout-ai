
import { PlayerAttributes, PlayerInfo, PositionCode, RoleDefinition } from './types';

export const INITIAL_ATTRIBUTES: PlayerAttributes = {
  // Attacking
  crossing: 9, finishing: 9, headingAccuracy: 9, shortPassing: 9, volleys: 9,
  // Skill
  dribbling: 9, curve: 9, fkAccuracy: 9, longPassing: 9, ballControl: 9,
  // Movement
  acceleration: 9, sprintSpeed: 9, agility: 9, reactions: 9, balance: 9,
  // Power
  shotPower: 9, jumping: 9, stamina: 9, strength: 9, longShots: 9,
  // Mentality
  aggression: 9, interceptions: 9, positioning: 9, vision: 9, penalties: 9, composure: 9,
  // Defending
  defensiveAwareness: 9, standingTackle: 9, slidingTackle: 9,
  // Goalkeeping
  gkDiving: 9, gkHandling: 9, gkKicking: 9, gkPositioning: 9, gkReflexes: 9
};

export const INITIAL_PLAYER_INFO: PlayerInfo = {
  name: '',
  age: '',
  height: '',
  weight: '',
  preferredFoot: '',
  skillMoves: 0,
  weakFoot: 0,
  playStyles: [],
  roles: [],
  positions: [],
  overall: 0,
  overallBoost: 0,
  potentialRange: ''
};

export const ATTRIBUTE_LABELS_PT: Record<keyof PlayerAttributes, string> = {
  crossing: 'Cruzamentos',
  finishing: 'Finalização',
  headingAccuracy: 'Cabeceamentos',
  shortPassing: 'Passe Curto',
  volleys: 'Volleys',
  dribbling: 'Drible',
  curve: 'Efeito',
  fkAccuracy: 'Precisão de Livres',
  longPassing: 'Passe Longo',
  ballControl: 'Controlo de Bola',
  acceleration: 'Aceleração',
  sprintSpeed: 'Sprint',
  agility: 'Agilidade',
  reactions: 'Reações',
  balance: 'Equilíbrio',
  shotPower: 'Potência de Remate',
  jumping: 'Salto',
  stamina: 'Resistência',
  strength: 'Força',
  longShots: 'Remate de Longe',
  aggression: 'Agressividade',
  interceptions: 'Interceções',
  positioning: 'Posicionamento de Ataque',
  vision: 'Visão',
  penalties: 'Penáltis',
  composure: 'Compostura',
  defensiveAwareness: 'Propensão Defensiva',
  standingTackle: 'Desarme em Pé',
  slidingTackle: 'Desarme de Carrinho',
  gkDiving: 'Mergulhos GR',
  gkHandling: 'Jogo Mãos GR',
  gkKicking: 'Jogo Pés GR',
  gkPositioning: 'Posicionamento GR',
  gkReflexes: 'Reflexos GR'
};

export const POSITION_LABELS_PT: Record<PositionCode, string> = {
  ST: 'PL',   // Ponta de Lança
  LW: 'EE',   // Extremo Esquerdo
  RW: 'ED',   // Extremo Direito
  CAM: 'MCO', // Médio Centro Ofensivo
  CM: 'MC',   // Médio Centro
  LM: 'ME',   // Médio Esquerdo
  RM: 'MD',   // Médio Direito
  CDM: 'MDC', // Médio Defensivo Centro
  LB: 'DE',   // Defesa Esquerdo
  RB: 'DD',   // Defesa Direito
  CB: 'DC',   // Defesa Central
  GK: 'GR',   // Guarda-Redes
};

export const POSITION_WEIGHTS: Record<PositionCode, Partial<Record<keyof PlayerAttributes, number>>> = {
  ST: { finishing: 0.20, positioning: 0.12, headingAccuracy: 0.10, shotPower: 0.10, reactions: 0.10, dribbling: 0.08, ballControl: 0.08, volleys: 0.05, shortPassing: 0.05, acceleration: 0.05, sprintSpeed: 0.05, strength: 0.05 },
  RW: { crossing: 0.16, dribbling: 0.16, ballControl: 0.13, shortPassing: 0.10, positioning: 0.09, acceleration: 0.06, sprintSpeed: 0.06, reactions: 0.07, finishing: 0.10, vision: 0.06, stamina: 0.05, agility: 0.04 },
  LW: { crossing: 0.16, dribbling: 0.16, ballControl: 0.13, shortPassing: 0.10, positioning: 0.09, acceleration: 0.06, sprintSpeed: 0.06, reactions: 0.07, finishing: 0.10, vision: 0.06, stamina: 0.05, agility: 0.04 },
  RM: { crossing: 0.14, shortPassing: 0.12, dribbling: 0.12, ballControl: 0.12, positioning: 0.08, vision: 0.07, reactions: 0.07, stamina: 0.08, acceleration: 0.07, sprintSpeed: 0.07, longPassing: 0.05, finishing: 0.05 },
  LM: { crossing: 0.14, shortPassing: 0.12, dribbling: 0.12, ballControl: 0.12, positioning: 0.08, vision: 0.07, reactions: 0.07, stamina: 0.08, acceleration: 0.07, sprintSpeed: 0.07, longPassing: 0.05, finishing: 0.05 },
  CAM: { shortPassing: 0.16, ballControl: 0.15, vision: 0.14, dribbling: 0.13, positioning: 0.12, reactions: 0.08, finishing: 0.07, longShots: 0.05, acceleration: 0.04, sprintSpeed: 0.04, agility: 0.03 },
  CM: { shortPassing: 0.17, ballControl: 0.14, vision: 0.13, longPassing: 0.13, reactions: 0.08, dribbling: 0.07, stamina: 0.06, defensiveAwareness: 0.05, interceptions: 0.05, standingTackle: 0.05, positioning: 0.06, shotPower: 0.02, longShots: 0.02 },
  CDM: { defensiveAwareness: 0.14, standingTackle: 0.12, interceptions: 0.12, shortPassing: 0.10, stamina: 0.09, reactions: 0.07, ballControl: 0.09, longPassing: 0.08, strength: 0.07, aggression: 0.05, slidingTackle: 0.04, headingAccuracy: 0.02 },
  CB: { defensiveAwareness: 0.17, standingTackle: 0.17, slidingTackle: 0.13, headingAccuracy: 0.10, strength: 0.10, aggression: 0.07, interceptions: 0.13, reactions: 0.05, shortPassing: 0.05, ballControl: 0.04, sprintSpeed: 0.02, jumping: 0.03 },
  LB: { slidingTackle: 0.11, standingTackle: 0.11, defensiveAwareness: 0.11, interceptions: 0.12, crossing: 0.09, stamina: 0.08, reactions: 0.08, shortPassing: 0.07, ballControl: 0.07, sprintSpeed: 0.07, acceleration: 0.05, dribbling: 0.04 },
  RB: { slidingTackle: 0.11, standingTackle: 0.11, defensiveAwareness: 0.11, interceptions: 0.12, crossing: 0.09, stamina: 0.08, reactions: 0.08, shortPassing: 0.07, ballControl: 0.07, sprintSpeed: 0.07, acceleration: 0.05, dribbling: 0.04 },
  GK: { gkDiving: 0.21, gkHandling: 0.21, gkReflexes: 0.21, gkPositioning: 0.21, reactions: 0.11, gkKicking: 0.05 }
};

export const POSITION_BONUS_WEIGHTS: Record<PositionCode, { skillMoves: number, weakFoot: number }> = {
  ST: { skillMoves: 2, weakFoot: 3 }, 
  LW: { skillMoves: 3, weakFoot: 2 }, 
  RW: { skillMoves: 3, weakFoot: 2 },
  CAM: { skillMoves: 3, weakFoot: 3 }, 
  LM: { skillMoves: 2, weakFoot: 2 },
  RM: { skillMoves: 2, weakFoot: 2 },
  CM: { skillMoves: 2, weakFoot: 3 }, 
  CDM: { skillMoves: 1, weakFoot: 2 },
  LB: { skillMoves: 1, weakFoot: 2 },
  RB: { skillMoves: 1, weakFoot: 2 },
  CB: { skillMoves: 0, weakFoot: 1 }, 
  GK: { skillMoves: 0, weakFoot: 1 }
};

// 5x5 Grid Logic (0-24 Indices)
// DATA DEFINED FOR **LEFT-SIDED/CENTER** POSITIONS.
// UI MIRRORS AUTOMATICALLY FOR RIGHT-SIDED POSITIONS.
export const POSITION_ROLES: Record<string, RoleDefinition[]> = {
  CB: [
    { 
      name: 'Defesa', 
      focusLabel: 'Equilibrado',
      description: 'Papel focado em segurar a linha defensiva.',
      attributes: ['defensiveAwareness', 'standingTackle', 'strength', 'headingAccuracy'], 
      focus: 'PP',
      isRecommended: true,
      focusGrid: { high: [22], medium: [16, 17, 18, 21, 23] } // Based on Page 4
    },
    { 
      name: 'Defesa', 
      focusLabel: 'Defender',
      attributes: ['defensiveAwareness', 'standingTackle', 'strength'], 
      focus: 'PP',
      focusGrid: { high: [22], medium: [21, 23] } // Based on Page 5
    },
    { 
      name: 'Defesa Líbero', 
      focusLabel: 'Construção',
      attributes: ['longPassing', 'shortPassing', 'vision', 'defensiveAwareness'], 
      focus: 'MT', 
      focusGrid: { high: [17, 22], medium: [12, 16, 18, 21, 23] } // Based on Page 6
    },
    { 
      name: 'Implacável', 
      focusLabel: 'Equilibrado',
      attributes: ['aggression', 'strength', 'standingTackle', 'acceleration'], 
      focus: 'PP',
      focusGrid: { high: [22], medium: [16, 17, 18, 21, 23] } // Based on Page 8
    }
  ],
  FB: [
    { 
      name: 'Lateral', 
      focusLabel: 'Equilibrado',
      attributes: ['sprintSpeed', 'acceleration', 'crossing', 'stamina'], 
      focus: 'MT',
      isRecommended: true,
      focusGrid: { high: [15, 20, 21], medium: [10, 16] } // Based on Page 9 (Mirrored to Left)
    },
    { 
      name: 'Lateral', 
      focusLabel: 'Defender',
      attributes: ['defensiveAwareness', 'standingTackle', 'interceptions', 'stamina'], 
      focus: 'PP',
      focusGrid: { high: [20, 21], medium: [15, 16, 22] } // Based on Page 10 (Mirrored to Left)
    },
    { 
      name: 'Lateral Invertido', 
      focusLabel: 'Equilibrado',
      attributes: ['shortPassing', 'ballControl', 'vision', 'stamina'], 
      focus: 'PP',
      focusGrid: { high: [11], medium: [10, 12, 15, 16, 17, 20] } // Based on Page 11 (Mirrored to Left)
    },
    { 
      name: 'Lateral Invertido', 
      focusLabel: 'Defender',
      attributes: ['defensiveAwareness', 'interceptions', 'shortPassing', 'strength'], 
      focus: 'PP',
      focusGrid: { high: [16, 20], medium: [11, 12, 15, 17, 21] } // Based on Page 12 (Mirrored to Left)
    },
    { 
      name: 'Ala Ofensivo', 
      focusLabel: 'Ataque',
      attributes: ['sprintSpeed', 'acceleration', 'crossing', 'dribbling'], 
      focus: 'PP',
      focusGrid: { high: [0], medium: [5, 10, 15, 20] } // Based on Page 13 (Mirrored to Left)
    },
    {
      name: 'Ala Ofensivo',
      focusLabel: 'Equilibrado',
      attributes: ['sprintSpeed', 'crossing', 'stamina', 'positioning'],
      focus: 'PP',
      focusGrid: { high: [5], medium: [0, 10, 15, 20] } // Based on Page 14 (Mirrored to Left)
    },
    {
      name: 'Ala',
      focusLabel: 'Equilibrado',
      attributes: ['acceleration', 'crossing', 'shortPassing', 'defensiveAwareness'],
      focus: 'MT',
      focusGrid: { high: [10, 15], medium: [5, 20] } // Based on Page 15 (Mirrored to Left)
    }
  ],
  CDM_WB: [
    { 
      name: 'Contenção', 
      focusLabel: 'Lib. de Movimentos',
      attributes: ['defensiveAwareness', 'interceptions', 'stamina', 'strength'], 
      focus: 'PP',
      isRecommended: true,
      focusGrid: { high: [16, 17, 18], medium: [11, 12, 13, 15, 19] } 
    },
    { 
      name: 'Contenção', 
      focusLabel: 'Defender',
      attributes: ['defensiveAwareness', 'standingTackle', 'strength'], 
      focus: 'PP',
      focusGrid: { high: [17], medium: [12, 16, 18, 22] } // Based on Page 17
    },
    { 
      name: 'Pivô Recuado', 
      focusLabel: 'Lib. de Movimentos',
      attributes: ['longPassing', 'vision', 'ballControl', 'composure'], 
      focus: 'MT',
      focusGrid: { high: [], medium: [6, 7, 8, 11, 12, 13, 16, 17, 18] } // Based on Page 18
    },
    { 
      name: 'Pivô Recuado', 
      focusLabel: 'Defender',
      attributes: ['longPassing', 'defensiveAwareness', 'interceptions'], 
      focus: 'MT',
      focusGrid: { high: [22], medium: [16, 17, 18, 21, 23] } // Based on Page 19
    },
    { 
      name: 'Central', 
      focusLabel: 'Defender',
      attributes: ['defensiveAwareness', 'headingAccuracy', 'jumping', 'strength'], 
      focus: 'PP',
      focusGrid: { high: [17, 22], medium: [16, 18, 21, 23] } // Based on Page 20
    }
  ],
  CM: [
    { 
      name: 'Distribuidor', 
      focusLabel: 'Lib. de Movimentos',
      attributes: ['vision', 'longPassing', 'shortPassing', 'ballControl'], 
      focus: 'MT',
      focusGrid: { high: [17], medium: [10, 11, 12, 13, 14, 15, 16, 18, 19] } // Based on Page 21
    },
    { 
      name: 'Distribuidor', 
      focusLabel: 'Ataque',
      attributes: ['vision', 'shortPassing', 'longShots', 'positioning'], 
      focus: 'MT',
      focusGrid: { high: [12], medium: [6, 7, 8, 11, 13] } // Based on Page 22
    },
    { 
      name: 'Mezzala', 
      focusLabel: 'Equilibrado',
      attributes: ['acceleration', 'dribbling', 'crossing', 'shortPassing'], 
      focus: 'MT',
      focusGrid: { high: [], medium: [10, 14, 15, 16, 17, 18, 19, 20, 24] } // Based on Page 23
    },
    { 
      name: 'Mezzala', 
      focusLabel: 'Ataque',
      attributes: ['acceleration', 'finishing', 'positioning', 'vision'], 
      focus: 'MT',
      focusGrid: { high: [], medium: [0, 4, 5, 9, 10, 11, 12, 13, 14] } // Based on Page 24
    },
    { 
      name: 'Área a Área', 
      focusLabel: 'Equilibrado',
      attributes: ['stamina', 'interceptions', 'positioning', 'shortPassing'], 
      focus: 'PP',
      isRecommended: true,
      focusGrid: { high: [7, 12, 17], medium: [2, 11, 13, 22] } // Based on Page 25
    },
    { 
      name: 'Contenção', 
      focusLabel: 'Defender',
      attributes: ['defensiveAwareness', 'standingTackle', 'interceptions', 'stamina'], 
      focus: 'PP',
      focusGrid: { high: [17], medium: [16, 18, 21, 22, 23] } // Based on Page 26
    },
    { 
      name: 'Pivô Recuado', 
      focusLabel: 'Defender',
      attributes: ['defensiveAwareness', 'longPassing', 'vision', 'strength'], 
      focus: 'MT',
      focusGrid: { high: [17], medium: [16, 18, 22] } // Based on Page 27
    }
  ],
  CAM: [
    { 
      name: 'Distribuidor', 
      focusLabel: 'Lib. de Movimentos',
      attributes: ['vision', 'shortPassing', 'dribbling', 'ballControl'], 
      focus: 'MT',
      focusGrid: { high: [12], medium: [6, 7, 8, 11, 13, 16, 17, 18] } // Based on Page 28
    },
    { 
      name: 'Distribuidor', // Title "Equilibrado" in Page 29 but implies Playmaker
      focusLabel: 'Equilibrado',
      attributes: ['vision', 'shortPassing', 'positioning'], 
      focus: 'MT',
      focusGrid: { high: [7], medium: [2, 6, 8, 12] } // Based on Page 29
    },
    { 
      name: 'Mezzala', 
      focusLabel: 'Equilibrado',
      attributes: ['acceleration', 'dribbling', 'longShots'], 
      focus: 'MT',
      focusGrid: { high: [], medium: [5, 9, 10, 11, 12, 13, 14, 15, 19] } // Based on Page 30
    },
    { 
      name: 'Mezzala', // Title "Ataque" in Page 31
      focusLabel: 'Ataque',
      attributes: ['finishing', 'acceleration', 'positioning'], 
      focus: 'MT',
      focusGrid: { high: [], medium: [0, 4, 5, 6, 7, 8, 9] } // Based on Page 31
    },
    { 
      name: 'Avançado Sombra', 
      focusLabel: 'Ataque',
      attributes: ['finishing', 'positioning', 'acceleration', 'volleys'], 
      focus: 'MT', 
      isRecommended: true,
      focusGrid: { high: [2, 7], medium: [1, 3] } // Based on Page 32
    }
  ],
  SIDE_MID: [
    { 
      name: 'Extremo', 
      focusLabel: 'Ataque',
      attributes: ['sprintSpeed', 'acceleration', 'dribbling', 'crossing'], 
      focus: 'MT', 
      isRecommended: true,
      focusGrid: { high: [0, 5], medium: [10] } // Based on Page 33 (Mirrored)
    },
    { 
      name: 'Extremo', 
      focusLabel: 'Equilibrado',
      attributes: ['sprintSpeed', 'crossing', 'stamina'], 
      focus: 'MT', 
      focusGrid: { high: [5, 10], medium: [0, 15] } // Based on Page 34 (Mirrored)
    },
    { 
      name: 'Médio Ala', 
      focusLabel: 'Defender',
      attributes: ['stamina', 'interceptions', 'defensiveAwareness', 'crossing'], 
      focus: 'MT',
      focusGrid: { high: [15, 20], medium: [16, 21] } // Based on Page 35 (Mirrored)
    },
    { 
      name: 'Médio Ala', 
      focusLabel: 'Equilibrado',
      attributes: ['crossing', 'shortPassing', 'stamina'], 
      focus: 'MT',
      focusGrid: { high: [10], medium: [5, 11, 15] } // Based on Page 36 (Mirrored)
    },
    { 
      name: 'Avançado Interior', 
      focusLabel: 'Ataque',
      attributes: ['finishing', 'positioning', 'dribbling', 'shotPower'], 
      focus: 'PP',
      focusGrid: { high: [1], medium: [0, 2, 5, 6, 7, 10] } // Based on Page 37 (Mirrored)
    },
    { 
      name: 'Avançado Interior', 
      focusLabel: 'Equilibrado',
      attributes: ['finishing', 'ballControl', 'vision', 'shortPassing'], 
      focus: 'PP',
      focusGrid: { high: [6, 10], medium: [1, 2, 5, 7] } // Based on Page 38 (Mirrored)
    },
    { 
      name: 'Distribuidor Aberto', 
      focusLabel: 'Ataque',
      attributes: ['crossing', 'vision', 'curve', 'longPassing'], 
      focus: 'MT',
      focusGrid: { high: [], medium: [5, 6, 10, 11] } // Based on Page 39 (Mirrored)
    }
  ],
  WING: [
    { 
      name: 'Avançado Interior', 
      focusLabel: 'Lib. de Movimentos',
      attributes: ['dribbling', 'agility', 'vision', 'shortPassing'], 
      focus: 'PP',
      focusGrid: { high: [6], medium: [0, 1, 2, 5, 7] } // Based on Page 40 (Mirrored)
    },
    { 
      name: 'Avançado Interior', 
      focusLabel: 'Equilibrado',
      attributes: ['finishing', 'positioning', 'dribbling'], 
      focus: 'PP',
      focusGrid: { high: [6], medium: [1, 2, 5, 7, 10, 11] } // Based on Page 41 (Mirrored)
    },
    { 
      name: 'Avançado Interior', 
      focusLabel: 'Ataque',
      attributes: ['finishing', 'shotPower', 'acceleration'], 
      focus: 'PP',
      focusGrid: { high: [1], medium: [2, 5, 6, 7] } // Based on Page 42 (Mirrored)
    },
    { 
      name: 'Extremo',
      focusLabel: 'Ataque',
      attributes: ['sprintSpeed', 'acceleration', 'dribbling'],
      focus: 'MT',
      isRecommended: true,
      focusGrid: { high: [0, 5], medium: [1, 10] } // Based on Page 43 (Mirrored)
    },
    { 
      name: 'Extremo',
      focusLabel: 'Equilibrado',
      attributes: ['sprintSpeed', 'crossing', 'stamina'],
      focus: 'MT',
      focusGrid: { high: [5], medium: [0, 10, 15] } // Based on Page 44 (Mirrored)
    },
    { 
      name: 'Distribuidor Aberto', 
      focusLabel: 'Ataque',
      attributes: ['crossing', 'vision', 'longPassing', 'curve'], 
      focus: 'MT',
      focusGrid: { high: [0], medium: [1, 5, 6, 10] } // Based on Page 45 (Mirrored)
    }
  ],
  ST: [
    { 
      name: 'Avançado de Referência', 
      focusLabel: 'Largo',
      attributes: ['strength', 'headingAccuracy', 'ballControl', 'shortPassing'], 
      focus: 'PP',
      focusGrid: { high: [], medium: [0, 1, 2, 3, 4] } // Based on Page 46
    },
    { 
      name: 'Avançado de Referência', 
      focusLabel: 'Equilibrado',
      attributes: ['strength', 'headingAccuracy', 'finishing'], 
      focus: 'PP',
      focusGrid: { high: [2], medium: [7] } // Based on Page 47
    },
    { 
      name: 'Avançado de Referência', 
      focusLabel: 'Ataque',
      attributes: ['finishing', 'headingAccuracy', 'strength', 'positioning'], 
      focus: 'PP',
      focusGrid: { high: [2], medium: [1, 3] } // Based on Page 48
    },
    { 
      name: 'Avançado Ofensivo', 
      focusLabel: 'Completo',
      attributes: ['sprintSpeed', 'finishing', 'dribbling', 'stamina'], 
      focus: 'MT',
      isRecommended: true,
      focusGrid: { high: [2], medium: [0, 1, 3, 4, 7] } // Based on Page 49
    },
    { 
      name: 'Avançado Ofensivo', 
      focusLabel: 'Ataque',
      attributes: ['sprintSpeed', 'finishing', 'positioning'], 
      focus: 'MT',
      focusGrid: { high: [2], medium: [1, 3, 7] } // Based on Page 50
    },
    { 
      name: 'Finalizador', 
      focusLabel: 'Ataque',
      attributes: ['finishing', 'positioning', 'reactions', 'composure'], 
      focus: 'PP',
      focusGrid: { high: [2], medium: [1, 3] } // Based on Page 51
    },
    { 
      name: 'Falso 9', 
      focusLabel: 'Construção',
      attributes: ['vision', 'shortPassing', 'dribbling', 'acceleration'],
      focus: 'MT',
      focusGrid: { high: [7], medium: [2, 6, 8] } // Based on Page 52
    }
  ],
  GK: [
    {
      name: 'Guarda-Redes',
      focusLabel: 'Equilibrado',
      attributes: ['gkDiving', 'gkHandling', 'gkReflexes', 'gkPositioning'],
      focus: 'PP',
      isRecommended: true,
      focusGrid: { high: [22], medium: [17, 21, 23] } // Based on Page 1 analysis
    },
    {
      name: 'Guarda-Redes',
      focusLabel: 'Defender',
      attributes: ['gkDiving', 'gkReflexes'],
      focus: 'PP',
      focusGrid: { high: [22], medium: [21, 23] } // Based on Page 2
    },
    {
      name: 'Guarda-Redes Líbero',
      focusLabel: 'Equilibrado',
      attributes: ['gkDiving', 'gkKicking', 'gkReflexes', 'vision'],
      focus: 'PP',
      focusGrid: { high: [22], medium: [16, 17, 18, 21, 23] } // Based on Page 3
    }
  ]
};

// Helper to map PositionCode to Key in POSITION_ROLES
export const POSITION_GROUP_MAP: Record<PositionCode, string> = {
  CB: 'CB',
  LB: 'FB', RB: 'FB',
  CDM: 'CDM_WB',
  LM: 'SIDE_MID', RM: 'SIDE_MID',
  CM: 'CM',
  CAM: 'CAM',
  LW: 'WING', RW: 'WING',
  ST: 'ST',
  GK: 'GK'
};
