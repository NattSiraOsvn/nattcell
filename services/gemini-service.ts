
// 👑 sovereign: anh_nat
import { GoogleGenAI } from "@google/genai";

/**
 * 🧠 NATT-OS GEMINI SERVICE
 * Location: services/gemini-service.ts
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generate_blueprint(desc: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Bạn là Thiên - Tổng tham mưu trưởng AI của NATT-OS. Thiết kế kiến trúc: ${desc}`,
    config: { thinkingConfig: { thinkingBudget: 4096 } }
  });
  // Fixed: Use .text property directly instead of calling it as a method
  return response.text || "analysis_failed";
}

export async function generate_persona_response(persona_id: string, prompt: string): Promise<{ text: string }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { systemInstruction: `Bạn là ${persona_id}. Tuân thủ hiến chương NATT-OS.` }
  });
  // Fixed: Use .text property directly instead of calling it as a method
  return { text: response.text || "neural_link_failure" };
}
