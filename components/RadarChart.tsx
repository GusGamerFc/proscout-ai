import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { PlayerAttributes } from '../types';

interface Props {
  attributes: PlayerAttributes;
  isGoalkeeper?: boolean;
}

// Custom Tick Component to render Label + Value with specific coloring
const CustomTick = ({ payload, x, y, cx, cy, textAnchor, data }: any) => {
  const entry = data[payload.index];
  const value = Math.round(entry.value);
  
  // Find max value for relative coloring logic
  const maxValue = Math.max(...data.map((d: any) => d.value));
  const diff = maxValue - value;
  
  // Logic:
  // Green (Ideal): Diff 0
  // Yellow (Good): Diff <= 4
  // Orange (Okay): Diff <= 10
  // Red (Weak): Diff > 10
  
  let color = '#ef4444'; // Red-500
  
  if (value === 0) {
      color = '#ef4444'; 
  } else {
      if (diff === 0) color = '#10b981'; // Emerald-500
      else if (diff <= 4) color = '#facc15'; // Yellow-400
      else if (diff <= 10) color = '#fb923c'; // Orange-400
      else color = '#ef4444'; // Red-500
  }
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={0}
        textAnchor={textAnchor}
        className="select-none"
      >
        <tspan x={0} dy="-0.5em" fill={color} fontSize="10" fontWeight="800" letterSpacing="0.05em">{entry.subject}</tspan>
        <tspan x={0} dy="1.4em" fill="#e2e8f0" fontSize="14" fontWeight="900">{value}</tspan>
      </text>
    </g>
  );
};

const PlayerRadar: React.FC<Props> = ({ attributes, isGoalkeeper = false }) => {
  
  // Helper to ensure value is within 0-99
  const cap = (val: number) => Math.min(99, Math.max(0, val));

  let data = [];

  if (isGoalkeeper) {
    // Goalkeeper Face Stats Logic
    data = [
      {
        subject: 'MER', // Mergulho (Diving)
        value: cap(attributes.gkDiving || 0),
        full: 100
      },
      {
        subject: 'MÃOS', // Jogo de Mãos (Handling)
        value: cap(attributes.gkHandling || 0),
        full: 100
      },
      {
        subject: 'PÉ', // Pontapé (Kicking)
        value: cap(attributes.gkKicking || 0),
        full: 100
      },
      {
        subject: 'REF', // Reflexos (Reflexes)
        value: cap(attributes.gkReflexes || 0),
        full: 100
      },
      {
        subject: 'VEL', // Velocidade (Speed)
        value: cap((attributes.acceleration * 0.45) + (attributes.sprintSpeed * 0.55)),
        full: 100
      },
      {
        subject: 'POS', // Posicionamento (Positioning)
        value: cap(attributes.gkPositioning || 0),
        full: 100
      },
    ];
  } else {
    // Outfield Player Face Stats Logic
    data = [
      {
        subject: 'VEL', // Pace
        value: cap((attributes.acceleration * 0.45) + (attributes.sprintSpeed * 0.55)),
        full: 100
      },
      {
        subject: 'REM', // Shooting
        value: cap((attributes.finishing * 0.45) + (attributes.longShots * 0.20) + (attributes.shotPower * 0.20) + (attributes.volleys * 0.05) + (attributes.penalties * 0.05) + (attributes.positioning * 0.05)),
        full: 100
      },
      {
        subject: 'PAS', // Passing
        value: cap((attributes.shortPassing * 0.35) + (attributes.vision * 0.20) + (attributes.crossing * 0.20) + (attributes.longPassing * 0.15) + (attributes.curve * 0.05) + (attributes.fkAccuracy * 0.05)),
        full: 100
      },
      {
        subject: 'DRI', // Dribbling
        value: cap((attributes.dribbling * 0.50) + (attributes.ballControl * 0.35) + (attributes.agility * 0.10) + (attributes.balance * 0.05)),
        full: 100
      },
      {
        subject: 'DEF', // Defending
        value: cap((attributes.defensiveAwareness * 0.30) + (attributes.standingTackle * 0.30) + (attributes.interceptions * 0.20) + (attributes.headingAccuracy * 0.10) + (attributes.slidingTackle * 0.10)),
        full: 100
      },
      {
        subject: 'FIS', // Physical
        value: cap((attributes.strength * 0.50) + (attributes.stamina * 0.25) + (attributes.aggression * 0.20) + (attributes.jumping * 0.05)),
        full: 100
      },
    ];
  }

  return (
    <div className="w-full h-80 sm:h-96 flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid 
            gridType="polygon" 
            stroke="#334155" 
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={(props) => <CustomTick {...props} data={data} />} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Player Stats"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={3}
            fill="#10b981"
            fillOpacity={0.25}
            isAnimationActive={true}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Center Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] pointer-events-none"></div>
    </div>
  );
};

export default PlayerRadar;