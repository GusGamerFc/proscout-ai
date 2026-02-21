import { GoogleGenerativeAI } from "@google/generative-ai";
import { PlayerAttributes, PlayerInfo } from "../types";

// 1. Configuração da API com a chave do ambiente (Netlify/Vite)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// 2. Interface que define o que a função retorna
export interface AnalysisResult {
  attributes: Partial<PlayerAttributes>;
  info: Partial<PlayerInfo>;
}

export const analyzePlayerImages = async (base64Images: string[]): Promise<AnalysisResult> => {
  // 3. Modelo 'gemini-1.5-flash' é o mais estável para evitar o erro 404
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 4. Preparação das imagens para a IA
  const imageParts = base64Images.map((img) => ({
    inlineData: {
      mimeType: "image/png", 
      data: img.split(",")[1], 
    },
  }));

  const prompt = `
    Aja como um especialista em scouting do EA Sports FC 26. Analise as imagens do cartão do jogador com precisão cirúrgica.
    Extraia todos os atributos (ritmo, finalização, passe, drible, defesa, físico) e informações biográficas.
    Retorne apenas o JSON puro, conforme o schema solicitado, sem comentários ou explicações.
  `;

  try {
    // 5. Chamada oficial para geração de conteúdo
    const result = await model.generateContent([
      ...imageParts,
      { text: prompt },
    ]);

    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("Sem resposta da IA");
    
    // 6. Limpeza de Markdown para garantir que o JSON.parse não falhe
    const data = JSON.parse(text.replace(/```json|```/g, "")); 
    
    const isGK = data.info?.positions?.includes('GK') || data.info?.positions?.includes('GR');
    const cleanAttributes: Partial<PlayerAttributes> = {};
    
    // 7. Lógica de filtragem de atributos (Goleiro vs Linha)
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

    // 8. Limpeza e padronização das informações do jogador
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
