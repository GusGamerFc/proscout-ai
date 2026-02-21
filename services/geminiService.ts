import { GoogleGenerativeAI } from "@google/generative-ai";
import { PlayerAttributes, PlayerInfo } from "../types";

// 1. Inicialização com a sua chave de API (vinda do Netlify)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface AnalysisResult {
  attributes: Partial<PlayerAttributes>;
  info: Partial<PlayerInfo>;
}

export const analyzePlayerImages = async (base64Images: string[]): Promise<AnalysisResult> => {
  /**
   * 2. CONFIGURAÇÃO DO MODELO
   * Usamos 'gemini-1.5-flash-latest' na 'v1beta' para garantir compatibilidade
   * com o método de análise de imagem (generateContent).
   */
  const model = genAI.getGenerativeModel(
    { model: "gemini-1.5-flash-latest" },
    { apiVersion: "v1beta" }
  );

  // 3. Preparação dos dados da imagem
  const imageParts = base64Images.map((img) => ({
    inlineData: {
      mimeType: "image/png", 
      data: img.split(",")[1], 
    },
  }));

  const prompt = `
    Aja como um especialista em scouting do EA Sports FC 26. Analise as imagens do cartão do jogador com precisão cirúrgica.
    Extraia todos os atributos e informações biográficas.
    Retorne apenas o JSON puro, conforme o schema solicitado, sem textos adicionais.
  `;

  try {
    // 4. Chamada para a API
    const result = await model.generateContent([
      ...imageParts,
      { text: prompt },
    ]);

    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("Sem resposta da IA");
    
    // 5. Tratamento do JSON retornado
    const data = JSON.parse(text.replace(/```json|```/g, "")); 
    
    const isGK = data.info?.positions?.includes('GK') || data.info?.positions?.includes('GR');
    const cleanAttributes: Partial<PlayerAttributes> = {};
    
    // 6. Lógica de filtragem de atributos (Goleiro vs Linha)
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

    // 7. Padronização dos dados biográficos
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
    console.error("Erro detalhado do Gemini:", error);
    throw new Error(error.message || "Falha na análise da imagem.");
  }
};
