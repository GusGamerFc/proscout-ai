
export interface PlayerAttributes {
  // Attacking
  crossing: number;
  finishing: number;
  headingAccuracy: number;
  shortPassing: number;
  volleys: number;
  // Skill
  dribbling: number;
  curve: number;
  fkAccuracy: number;
  longPassing: number;
  ballControl: number;
  // Movement
  acceleration: number;
  sprintSpeed: number;
  agility: number;
  reactions: number;
  balance: number;
  // Power
  shotPower: number;
  jumping: number;
  stamina: number;
  strength: number;
  longShots: number;
  // Mentality
  aggression: number;
  interceptions: number;
  positioning: number;
  vision: number;
  penalties: number;
  composure: number;
  // Defending
  defensiveAwareness: number; // Marking in older games
  standingTackle: number;
  slidingTackle: number;
  // Goalkeeping (Optional/Separate logic usually, but included for completeness)
  gkDiving?: number;
  gkHandling?: number;
  gkKicking?: number;
  gkPositioning?: number;
  gkReflexes?: number;
}

export interface PlayStyle {
  name: string;
  type: 'regular' | 'plus'; // Diamond (white/silver) or Plus (Gold)
}

export interface PlayerRole {
  name: string;
  level: 'base' | 'plus' | 'plusplus'; // none, + or ++
  position?: string; // e.g., 'ST', 'LW', etc.
}

export interface PlayerInfo {
  name: string;
  countryCode?: string; // ISO 2-letter code (e.g. AR, PT, BR)
  age: string; // number in string format usually
  height: string; // e.g., "180 cm"
  weight: string; // e.g., "75 kg"
  preferredFoot: string;
  skillMoves: number; // 1-5 stars
  weakFoot: number; // 1-5 stars
  potentialRange?: string; // e.g., "82-86"
  playStyles: PlayStyle[];
  roles: PlayerRole[];
  positions: string[]; // Scanned positions from the card (e.g., ['CAM', 'CM', 'RW'])
  overall: number; // Current rating (GER)
  overallBoost?: number; // Value like +1, -1 found near overall rating
}

export type PositionCode = 
  | 'ST' | 'RW' | 'LW' | 'CAM' | 'CM' | 'RM' | 'LM' | 'CDM' | 'CB' | 'LB' | 'RB' | 'GK';

export interface PositionResult {
  position: PositionCode;
  rating: number; // Final Total (Base + Bonus)
  baseRating: number; // Raw weighted average
  bonus: number; // ProScout Elite Bonus
  isBest: boolean;
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
  error?: string;
}

export interface BmiAnalysis {
  value: number;
  category: string;
  heightAnalysis: string; // Text description based on position group
}

export interface PotentialAnalysis {
  average: number;
  label: string;
  recommendation: string; // e.g. "Subir ao Profissional"
  recommendationColor: string; // Tailswind class for color (e.g. "text-red-400")
}

export interface RoleDefinition {
  name: string;
  focusLabel?: string; // e.g. "Equilibrado", "Defender", "Ataque"
  description?: string;
  attributes: (keyof PlayerAttributes)[];
  focus: 'MT' | 'PP';
  isRecommended?: boolean;
  focusGrid?: {
    high: number[];   // Primary Focus (Bright Green)
    medium: number[]; // Secondary Focus (Dark Green)
  };
}

export interface DevelopmentPlan {
  position: PositionCode;
  role: RoleDefinition;
  attributeNames: string[];
}
