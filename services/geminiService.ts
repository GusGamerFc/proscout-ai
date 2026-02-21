
import { GoogleGenerativeAI, Type } from "@google/generative-ai"; // Ajustei o import para a versão mais recente
import { PlayerAttributes, PlayerInfo } from "../types";

// 1. Aqui você define o genAI usando a chave do Netlify
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface AnalysisResult {
  attributes: Partial<PlayerAttributes>;
  info: Partial<PlayerInfo>;
}

export const analyzePlayerImages = async (base64Images: string[]): Promise<AnalysisResult> => {
  // 2. Usamos o modelo 'gemini-1.5-flash' que é o mais estável para imagens
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

  const imageParts = base64Images.map((img) => ({
    inlineData: {
      mimeType: "image/png", 
      data: img.split(",")[1], 
    },
  }));

  const prompt = `
    Aja como um especialista em scouting do EA Sports FC 26. Analise as imagens do cartão do jogador com precisão cirúrgica.
    Retorne apenas o JSON puro, conforme o schema solicitado.
  `;

  try {
    // 3. CORREÇÃO AQUI: Mudamos 'ai.models' para 'model.generateContent'
    const result = await model.generateContent([
      ...imageParts,
      { text: prompt },
    ]);

    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("Sem resposta da IA");
    
    // O restante do seu código de processamento de dados (JSON.parse, etc) continua igual abaixo...
    const data = JSON.parse(text.replace(/```json|```/g, "")); // Remove possíveis blocos de código
    
    const isGK = data.info?.positions?.includes('GK') || data.info?.positions?.includes('GR');
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
