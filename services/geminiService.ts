
import { GoogleGenAI, Chat } from "@google/genai";

// The GoogleGenAI client is initialized lazily to prevent app crashes
// if the API key is not provided as an environment variable.
let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
    // Return the existing client if it's already initialized
    if (ai) {
        return ai;
    }
    
    // IMPORTANT: In a real-world application, the API key should be stored in a secure
    // environment variable. We assume `process.env.API_KEY` is set.
    const API_KEY = process.env.API_KEY;

    if (API_KEY) {
        console.log("Gemini API key found. Initializing AI client.");
        ai = new GoogleGenAI({ apiKey: API_KEY });
        return ai;
    } else {
        console.warn("Gemini API key not found. AI features will be disabled. Please set the API_KEY environment variable.");
        return null;
    }
}

export const getErrorCodeExplanation = async (code: string, description: string): Promise<string> => {
  const localAi = getAiClient();
  if (!localAi) {
    return "El servicio de IA no está configurado. Falta la clave API.";
  }
  
  try {
    const prompt = `
      Explica el código de error del auto "${code}: ${description}" para un propietario con poco o ningún conocimiento técnico.
      Estructura la explicación en tres secciones simples:
      1. **¿Qué significa esto?** (Una explicación simple de una frase sobre el problema).
      2. **Causas comunes:** (Una lista con viñetas de 2 a 4 razones comunes para este error).
      3. **¿Qué debo hacer?** (Una lista con viñetas de acciones recomendadas).
      
      IMPORTANTE: Al final de la respuesta, DEBES agregar obligatoriamente un párrafo final separado que diga explícitamente: 
      "⚠️ RECUERDA: Visita a un mecánico profesional certificado para una inspección física y reparación adecuada. Esta información es generada por Inteligencia Artificial con fines informativos y no sustituye el diagnóstico profesional."
      
      Mantén el lenguaje claro, conciso, en ESPAÑOL y fácil de entender.
    `;

    const response = await localAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "No hay explicación disponible.";
  } catch (error) {
    console.error("Error fetching explanation from Gemini API:", error);
    return "No se pudo obtener una explicación de la IA. Por favor verifica tu conexión o clave API e intenta de nuevo.";
  }
};

export const createChatSession = (contextInfo: string): Chat | null => {
    const localAi = getAiClient();
    if (!localAi) return null;

    try {
        return localAi.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `Eres un experto Mecánico de IA y Asistente de Diagnóstico Automotriz. 
                Eres servicial, conciso y amigable. Responde siempre en ESPAÑOL.
                
                Contexto actual del vehículo proporcionado por la ECU:
                ${contextInfo}
                
                Tus objetivos:
                1. Ayudar al usuario a diagnosticar problemas basados en las métricas y códigos de error proporcionados.
                2. Explicar términos técnicos en lenguaje sencillo.
                3. Mantén las respuestas relativamente cortas.
                
                IMPORTANTE: Si das consejos de reparación o diagnóstico crítico, finaliza tu respuesta recordando al usuario que debe visitar a un mecánico real y que tú eres una IA.
                `,
            }
        });
    } catch (error) {
        console.error("Failed to create chat session", error);
        return null;
    }
}
