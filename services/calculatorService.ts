
import { POSITION_WEIGHTS, POSITION_GROUP_MAP, POSITION_ROLES, ATTRIBUTE_LABELS_PT, POSITION_BONUS_WEIGHTS } from '../constants';
import { PlayerAttributes, PositionCode, PositionResult, BmiAnalysis, PotentialAnalysis, DevelopmentPlan, RoleDefinition, PlayerInfo } from '../types';

interface CalculatedRating {
  total: number;
  base: number;
  bonus: number;
}

export const calculateRating = (
  attributes: PlayerAttributes,
  position: PositionCode,
  playerInfo?: PlayerInfo // Required for ProScout Logic
): CalculatedRating => {
  const weights = POSITION_WEIGHTS[position];
  if (!weights) return { total: 0, base: 0, bonus: 0 };

  // 1. Calculate Base Rating (Weighted Average)
  let rawTotal = 0;
  let weightSum = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const attrValue = attributes[key as keyof PlayerAttributes] || 0;
    rawTotal += attrValue * (weight as number);
    weightSum += (weight as number);
  }

  // Normalize if weights don't sum exactly to 1
  const baseScore = weightSum > 0 ? rawTotal / weightSum : 0;
  
  // --- PRO SCOUT ELITE LOGIC ---
  let eliteBonus = 0;

  if (playerInfo) {
    // A. Role Mastery Bonus (Bônus por Maestria de Papel)
    if (playerInfo.roles && playerInfo.roles.length > 0) {
      const matchingRole = playerInfo.roles.find(r => r.position === position);
      
      if (matchingRole) {
        if (matchingRole.level === 'plusplus') eliteBonus += 3.0;
        else if (matchingRole.level === 'plus') eliteBonus += 1.5;
        else eliteBonus += 0.5; 
      }
    }

    // B. Elite Attributes Bonus (Bônus por Atributos de Elite)
    for (const [key, weight] of Object.entries(weights)) {
      const w = weight as number;
      const val = attributes[key as keyof PlayerAttributes] || 0;
      if (w >= 0.10 && val >= 90) {
        eliteBonus += 1.0; 
      }
    }

    // C. Legacy Logic (Skill Moves / Weak Foot / PlayStyles)
    const importance = POSITION_BONUS_WEIGHTS[position];
    if (importance) {
      let legacyBonus = 0;
      if (importance.skillMoves >= 2) {
        if (playerInfo.skillMoves === 5) legacyBonus += (importance.skillMoves === 3 ? 1.0 : 0.5);
        else if (playerInfo.skillMoves === 4) legacyBonus += (importance.skillMoves === 3 ? 0.5 : 0.2);
      }
      if (importance.weakFoot >= 2) {
        if (playerInfo.weakFoot === 5) legacyBonus += (importance.weakFoot === 3 ? 1.0 : 0.5);
        else if (playerInfo.weakFoot === 4) legacyBonus += (importance.weakFoot === 3 ? 0.5 : 0.2);
      }
      if (playerInfo.playStyles) {
         playerInfo.playStyles.forEach(style => {
           if (style.type === 'plus') legacyBonus += 0.5;
         });
      }
      eliteBonus += Math.min(2.0, legacyBonus);
    }
  }

  const finalBase = Math.round(baseScore);
  const finalBonus = Math.round(eliteBonus); 
  const totalScore = Math.min(99, finalBase + finalBonus);

  return {
    total: totalScore,
    base: finalBase,
    bonus: finalBonus
  };
};

export const calculateAllPositions = (attributes: PlayerAttributes, playerInfo?: PlayerInfo): PositionResult[] => {
  const positions = Object.keys(POSITION_WEIGHTS) as PositionCode[];
  
  const results: PositionResult[] = positions.map(pos => {
    const calc = calculateRating(attributes, pos, playerInfo);
    return {
      position: pos,
      rating: calc.total,
      baseRating: calc.base,
      bonus: calc.bonus,
      isBest: false
    };
  });

  const maxRating = Math.max(...results.map(r => r.rating));
  
  return results.map(r => ({
    ...r,
    isBest: r.rating === maxRating
  })).sort((a, b) => b.rating - a.rating);
};

export const analyzeBMI = (heightStr: string, weightStr: string, bestPos?: PositionCode): BmiAnalysis | null => {
  if (!heightStr || !weightStr) return null;

  const cleanHeight = heightStr.replace(',', '.');
  const cleanWeight = weightStr.replace(',', '.');

  const heightMatch = cleanHeight.match(/(\d+(\.\d+)?)/);
  const weightMatch = cleanWeight.match(/(\d+(\.\d+)?)/);

  if (!heightMatch || !weightMatch) return null;

  let h_val = parseFloat(heightMatch[0]);
  const w_kg = parseFloat(weightMatch[0]);

  let h_m = h_val;
  let h_cm = h_val;

  if (h_val > 3) {
    h_m = h_val / 100;
  } else {
    h_cm = h_val * 100;
  }

  if (h_m === 0) return null;

  const bmi = w_kg / (h_m * h_m);
  const bmiFixed = parseFloat(bmi.toFixed(2));

  let category = "Normal";
  if (bmiFixed < 18.5) category = "Magreza";
  else if (bmiFixed < 25) category = "Normal";
  else if (bmiFixed < 30) category = "Sobrepeso";
  else category = "Obesidade";

  let heightAnalysis = "Adequado";
  if (bestPos) {
    const isDef = ['CB', 'LB', 'RB', 'CDM'].includes(bestPos);
    const isMid = ['CM', 'CAM', 'RM', 'LM'].includes(bestPos);
    const isAtt = ['ST', 'RW', 'LW'].includes(bestPos);
    const isGK = bestPos === 'GK';

    if (isDef) {
      if (h_cm >= 180 && h_cm <= 190) heightAnalysis = "Ideal (1,80-1,90m)";
      else if (h_cm < 180) heightAnalysis = "Baixo para Defesa";
      else heightAnalysis = "Alto para Defesa";
    } else if (isMid) {
      if (h_cm >= 175 && h_cm <= 185) heightAnalysis = "Ideal (1,75-1,85m)";
      else if (h_cm < 175) heightAnalysis = "Baixo para Meio";
      else heightAnalysis = "Alto para Meio";
    } else if (isAtt) {
      if (h_cm >= 170 && h_cm <= 180) heightAnalysis = "Ideal (1,70-1,80m)";
      else if (h_cm < 170) heightAnalysis = "Baixo para Ataque";
      else heightAnalysis = "Alto para Ataque";
    } else if (isGK) {
      if (h_cm >= 186 && h_cm <= 196) heightAnalysis = "Ideal para GR (1,86-1,96m)";
      else if (h_cm < 186) heightAnalysis = "Baixo para GR";
      else heightAnalysis = "Alto para GR";
    }
  }

  return { value: bmiFixed, category, heightAnalysis };
};

export const analyzePotential = (potentialRange: string, ageStr: string, currentOverall: number): PotentialAnalysis | null => {
  if (!potentialRange) return null;
  const nums = potentialRange.split(/[-\s]+/).map(Number).filter(n => !isNaN(n));
  if (nums.length < 2) return null;
  const ageMatch = ageStr.match(/(\d+)/);
  const age = ageMatch ? parseInt(ageMatch[0]) : 0;
  if (age > 18) return null;
  const avgPotential = (nums[0] + nums[1]) / 2;
  
  let label = "Potencial Normal";
  if (avgPotential >= 91) label = "Pode ir muito longe";
  else if (avgPotential >= 86) label = "Uma grande promessa";
  else if (avgPotential >= 80) label = "Mostra Grande Potencial";

  let recommendation = "";
  let recommendationColor = "";
  const MIN_POTENTIAL_THRESHOLD = 70; 

  if (avgPotential < MIN_POTENTIAL_THRESHOLD) {
    recommendation = "Dispensar (Potencial Baixo)";
    recommendationColor = "text-red-400 border-red-500/30 bg-red-900/20";
  } 
  else {
    if (avgPotential >= 85) {
       recommendation = "Promessa da Academia (Manter)";
       recommendationColor = "text-emerald-400 border-emerald-500/30 bg-emerald-900/20";
    } else {
       recommendation = "Manter na Academia";
       recommendationColor = "text-cyan-400 border-cyan-500/30 bg-cyan-900/20";
    }
  }

  return { average: avgPotential, label, recommendation, recommendationColor };
};

export const getDevelopmentPlan = (topPositions: PositionResult[]): DevelopmentPlan[] => {
  if (topPositions.length === 0) return [];
  const isGoalkeeper = topPositions[0].position === 'GK';
  const limit = isGoalkeeper ? 1 : 5;
  const selectedPositions = topPositions.slice(0, limit);

  return selectedPositions.map(pos => {
    const groupKey = POSITION_GROUP_MAP[pos.position];
    const roles = POSITION_ROLES[groupKey];
    if (!roles) return null;
    const recommendedRole = roles.find(r => r.isRecommended) || roles[0];
    const attributeNames = recommendedRole.attributes.map(key => {
      return ATTRIBUTE_LABELS_PT[key] || key;
    });
    return {
      position: pos.position,
      role: recommendedRole,
      attributeNames
    };
  }).filter(plan => plan !== null) as DevelopmentPlan[];
};
