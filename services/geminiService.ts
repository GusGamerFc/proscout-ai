
import { GoogleGenAI, Type } from "@google/genai";
import { PlayerAttributes, PlayerInfo } from "../types";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
interface AnalysisResult {
  attributes: Partial<PlayerAttributes>;
  info: Partial<PlayerInfo>;
}

export const analyzePlayerImages = async (base64Images: string[]): Promise<AnalysisResult> => {
  const modelId = "gemini-3-flash-preview";

  const imageParts = base64Images.map((img) => ({
    inlineData: {
      mimeType: "image/png", 
      data: img.split(",")[1], 
    },
  }));

  const prompt = `
    Aja como um especialista em scouting do EA Sports FC 26. Analise as imagens do cartão do jogador com precisão cirúrgica.
    
    **REGRA DE OURO - DISTINÇÃO DE CATEGORIA:**
    1. Identifique primeiro se o jogador é um Guarda-Redes (GR/GK) ou um Jogador de Linha (ST, CM, CB, etc.).
    
    **MAPEAMENTO DE POSIÇÕES (FC 26 STANDARD):**
    Converta as siglas visíveis para códigos padrão EN atuais.
    - GR -> GK (Guarda-Redes)
    - PL -> ST (Ponta de Lança)
    - EE -> LW | ED -> RW
    - MCO -> CAM | MC -> CM | MDC -> CDM
    - ME -> LM | MD -> RM
    - DE -> LB | DD -> RB | DC -> CB
    
    **OBSOLESCÊNCIA:** 
    Ignore posições como AC, AE, AD, LEO, LDO. 
    - Se encontrar LEO mapeie para LB. 
    - Se encontrar LDO mapeie para RB. 
    - Se encontrar AE/AD mapeie para LW/RW ou ST.
    - Se encontrar AC mapeie para ST ou CAM.

    **DETALHES DO JOGADOR:**
    - Extraia o valor de 'boost' ou 'forma' (ex: +1, -1, +2) que aparece geralmente pequeno e colorido próximo ao overall ou ao nome, se existir. Use 'overallBoost'.
    - Extraia a 'potentialRange' (Faixa de Potencial) sempre que disponível para jogadores jovens.

    **ATRIBUTOS:** 
    Extraia apenas números de 1 a 99 localizados nas áreas de atributos detalhados.
    Para GR: Extraia gkDiving, gkHandling, gkKicking, gkPositioning, gkReflexes.

    Retorne apenas o JSON puro, sem markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          ...imageParts,
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            attributes: {
              type: Type.OBJECT,
              properties: {
                crossing: { type: Type.INTEGER, nullable: true },
                finishing: { type: Type.INTEGER, nullable: true },
                headingAccuracy: { type: Type.INTEGER, nullable: true },
                shortPassing: { type: Type.INTEGER, nullable: true },
                volleys: { type: Type.INTEGER, nullable: true },
                dribbling: { type: Type.INTEGER, nullable: true },
                curve: { type: Type.INTEGER, nullable: true },
                fkAccuracy: { type: Type.INTEGER, nullable: true },
                longPassing: { type: Type.INTEGER, nullable: true },
                ballControl: { type: Type.INTEGER, nullable: true },
                acceleration: { type: Type.INTEGER, nullable: true },
                sprintSpeed: { type: Type.INTEGER, nullable: true },
                agility: { type: Type.INTEGER, nullable: true },
                reactions: { type: Type.INTEGER, nullable: true },
                balance: { type: Type.INTEGER, nullable: true },
                shotPower: { type: Type.INTEGER, nullable: true },
                jumping: { type: Type.INTEGER, nullable: true },
                stamina: { type: Type.INTEGER, nullable: true },
                strength: { type: Type.INTEGER, nullable: true },
                longShots: { type: Type.INTEGER, nullable: true },
                aggression: { type: Type.INTEGER, nullable: true },
                interceptions: { type: Type.INTEGER, nullable: true },
                positioning: { type: Type.INTEGER, nullable: true },
                vision: { type: Type.INTEGER, nullable: true },
                penalties: { type: Type.INTEGER, nullable: true },
                composure: { type: Type.INTEGER, nullable: true },
                defensiveAwareness: { type: Type.INTEGER, nullable: true },
                standingTackle: { type: Type.INTEGER, nullable: true },
                slidingTackle: { type: Type.INTEGER, nullable: true },
                gkDiving: { type: Type.INTEGER, nullable: true },
                gkHandling: { type: Type.INTEGER, nullable: true },
                gkKicking: { type: Type.INTEGER, nullable: true },
                gkPositioning: { type: Type.INTEGER, nullable: true },
                gkReflexes: { type: Type.INTEGER, nullable: true },
              },
            },
            info: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, nullable: true },
                countryCode: { type: Type.STRING, nullable: true },
                age: { type: Type.STRING, nullable: true },
                height: { type: Type.STRING, nullable: true },
                weight: { type: Type.STRING, nullable: true },
                preferredFoot: { type: Type.STRING, nullable: true },
                overall: { type: Type.INTEGER, nullable: true },
                overallBoost: { type: Type.INTEGER, nullable: true },
                skillMoves: { type: Type.INTEGER, nullable: true },
                weakFoot: { type: Type.INTEGER, nullable: true },
                potentialRange: { type: Type.STRING, nullable: true },
                positions: { type: Type.ARRAY, items: { type: Type.STRING } },
                playStyles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['regular', 'plus'] }
                    }
                  }
                },
                roles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      level: { type: Type.STRING, enum: ['base', 'plus', 'plusplus'] },
                      position: { type: Type.STRING, nullable: true }
                    }
                  }
                }
              },
            }
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");
    
    const data = JSON.parse(text);
    
    const isGK = data.info?.positions?.includes('GK');
    const cleanAttributes: Partial<PlayerAttributes> = {};
    
    if (data.attributes) {
      for (const key in data.attributes) {
        const val = data.attributes[key];
        if (val !== null && typeof val === 'number') {
          const isGKAttr = key.startsWith('gk');
          if (isGK) {
            const allowedGKStats = [
              'gkDiving', 'gkHandling', 'gkKicking', 'gkPositioning', 'gkReflexes', 
              'acceleration', 'agility', 'balance', 'strength', 'stamina', 'jumping', 'sprintSpeed', 'aggression', 'composure', 'interceptions', 'positioning', 'reactions', 'vision'
            ];
            if (allowedGKStats.includes(key)) {
              cleanAttributes[key as keyof PlayerAttributes] = val;
            }
          } else {
            if (!isGKAttr) {
              cleanAttributes[key as keyof PlayerAttributes] = val;
            }
          }
        }
      }
    }

    const cleanInfo: Partial<PlayerInfo> = {};
    if (data.info) {
      cleanInfo.name = data.info.name || '';
      cleanInfo.countryCode = data.info.countryCode || '';
      cleanInfo.age = data.info.age ? String(data.info.age) : '';
      cleanInfo.height = data.info.height ? String(data.info.height) : '';
      cleanInfo.weight = data.info.weight ? String(data.info.weight) : '';
      cleanInfo.preferredFoot = data.info.preferredFoot || '';
      cleanInfo.overall = data.info.overall || 0;
      cleanInfo.overallBoost = data.info.overallBoost || 0;
      cleanInfo.skillMoves = data.info.skillMoves || 1;
      cleanInfo.weakFoot = data.info.weakFoot || 1;
      cleanInfo.potentialRange = data.info.potentialRange || '';
      cleanInfo.positions = data.info.positions || [];
      cleanInfo.playStyles = data.info.playStyles || [];
      cleanInfo.roles = data.info.roles || [];
    }

    return { attributes: cleanAttributes, info: cleanInfo };
  } catch (error: any) {
    console.error("Erro Gemini:", error);
    throw new Error(error.message || "Falha na análise da imagem.");
  }
};
