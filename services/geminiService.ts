
import { GoogleGenAI } from "@google/genai";

/**
 * 🧠 NATT-OS GEMINI SERVICE
 * Logic bóc tách tri thức và tham mưu chiến lược.
 */
// Fixed: Initialization with named parameter apiKey from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateBlueprint(desc: string): Promise<string> {
  // Use gemini-3-pro-preview for complex architectural tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Bạn là Thiên - Tổng tham mưu trưởng AI của NATT-OS. Hãy thiết kế kiến trúc hệ thống dựa trên mô tả nhu cầu nghiệp vụ sau: ${desc}. Trả về bản thảo kỹ thuật chi tiết.`,
    config: { thinkingConfig: { thinkingBudget: 4096 } }
  });
  // Fixed: Accessed .text property directly
  return response.text || "Phân tích kiến trúc thất bại.";
}

export async function generatePatentContent(type: string, prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 4096 } }
  });
  // Fixed: Accessed .text property directly
  return response.text || "Không thể khởi tạo dữ liệu bằng sáng chế.";
}

export async function generatePersonaResponse(personaId: string, prompt: string): Promise<{ text: string }> {
  // Use gemini-3-flash-preview for quick interaction and persona-based support
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      systemInstruction: `Bạn là ${personaId} - Một thành viên trong hệ sinh thái NATT-OS. Hãy phản hồi Anh Natt một cách thông minh và tuân thủ hiến chương.` 
    }
  });
  // Fixed: Accessed .text property directly
  return { text: response.text || "Neural Link Failure." };
}
