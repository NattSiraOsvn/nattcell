
import { GoogleGenAI, Type } from "@google/genai";
import { UserPosition, UserRole, LearnedTemplate, DynamicField } from "../types";

export class LearningEngine {
  /**
   * Cỗ máy Neural Learning Multimodal - Nâng cấp logic RBAC & Workflow Automation
   */
  static async learnFromMultimodal(
    position: UserPosition,
    role: UserRole,
    context: { text?: string, files?: { data: string, mimeType: string, name?: string }[] }
  ): Promise<LearnedTemplate & { docTypeDetected?: string, suggestions?: string[], productionData?: any }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    const parts: any[] = [];
    
    const safeText = context.text ? context.text.substring(0, 30000) : "";
    
    if (safeText) {
      parts.push({ text: `DỮ LIỆU NGỮ CẢNH:\n${safeText}` });
    }
    
    const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

    if (context.files) {
      context.files.forEach(f => {
        if (SUPPORTED_MIME_TYPES.includes(f.mimeType)) {
          parts.push({
            inlineData: {
              data: f.data.split(',')[1],
              mimeType: f.mimeType
            }
          });
        }
      });
    }

    // Luật phân quyền cứng trong Prompt
    const rbacInstruction = `
      Vị trí người dùng: ${position.role}
      Cấp bậc (Role): ${role}

      LUẬT PHÂN QUYỀN TÁC VỤ (RBAC RULES):
      1. Nếu Role thuộc nhóm NHÂN VIÊN (LEVEL_4, 5, 6, 7): 
         - TUYỆT ĐỐI KHÔNG đề xuất các task "Duyệt", "Phê duyệt", "Ký số", "Chốt sổ".
         - Chỉ đề xuất: "Nhập liệu", "Kiểm tra", "Báo cáo", "Gửi yêu cầu", "Thực hiện".
      2. Nếu Role thuộc nhóm QUẢN LÝ/MASTER (MASTER, LEVEL_1, 2, 3):
         - Đề xuất: "Phê duyệt", "Kiểm soát rủi ro", "Ký xác nhận", "Điều phối Shard".
      
      Nếu dữ liệu đầu vào chứa các cột "Duyệt" nhưng người dùng là Nhân viên, hãy chuyển thành "Gửi yêu cầu phê duyệt cho Quản đốc".
    `;

    const prompt = `
      Bạn là THIÊN - Tổng tham mưu trưởng AI. 
      NHIỆM VỤ: Phân tích cấu trúc dữ liệu, xác định loại tài liệu và trích xuất dữ liệu sản xuất (nếu có) để TỰ ĐỘNG HÓA QUY TRÌNH.

      ${rbacInstruction}

      YÊU CẦU ĐẦU RA JSON:
      {
        "docTypeDetected": "Loại tài liệu (VD: Lệnh sản xuất, Báo cáo ngày, Invoice...)",
        "suggestions": ["Hành động 1", "Hành động 2"],
        "fields": [{"id": "string", "label": "string", "type": "number|text|select|boolean", "required": true}],
        "dailyTasks": [{"id": "string", "task": "string", "isCritical": boolean, "canApprove": boolean, "description": "Hướng dẫn"}],
        "productionData": {
           "sku": "Mã sản phẩm hoặc Tên sản phẩm nếu tìm thấy",
           "customer": "Tên khách hàng nếu có",
           "gold_type": "Loại vàng (18K/24K/14K)",
           "deadline": "Hạn chót (dạng YYYY-MM-DD hoặc số ngày)",
           "notes": "Ghi chú kỹ thuật quan trọng"
        }
      }
      Lưu ý: 
      - "canApprove" chỉ được true nếu Role là Quản lý.
      - Nếu tài liệu là Lệnh Sản Xuất/Job Bag, hãy điền đầy đủ "productionData". Nếu không, để null.
    `;

    parts.push({ text: prompt });

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts }],
        config: {
          maxOutputTokens: 8192,
          thinkingConfig: { thinkingBudget: 4096 }, 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              docTypeDetected: { type: Type.STRING },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              fields: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    type: { type: Type.STRING },
                    required: { type: Type.BOOLEAN }
                  },
                  required: ["id", "label", "type"]
                }
              },
              dailyTasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    task: { type: Type.STRING },
                    isCritical: { type: Type.BOOLEAN },
                    canApprove: { type: Type.BOOLEAN },
                    description: { type: Type.STRING }
                  },
                  required: ["id", "task", "canApprove"]
                }
              },
              productionData: {
                type: Type.OBJECT,
                properties: {
                  sku: { type: Type.STRING },
                  customer: { type: Type.STRING },
                  gold_type: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  notes: { type: Type.STRING }
                }
              }
            },
            required: ["docTypeDetected", "suggestions", "fields", "dailyTasks"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      return {
        position: position.role,
        docTypeDetected: result.docTypeDetected,
        suggestions: result.suggestions,
        fields: result.fields,
        productionData: result.productionData,
        dailyTasks: (result.dailyTasks || []).map((t: any) => ({
          ...t,
          taskFormatted: `${t.isCritical ? '[CRITICAL] ' : ''}${t.task}: ${t.description || ''}`
        })),
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error("Neural Learning Error:", error);
      throw error;
    }
  }

  static saveTemplate(template: LearnedTemplate) {
    const key = `LEARNED_TPL_${template.position}`;
    localStorage.setItem(key, JSON.stringify(template));
  }

  static getTemplate(position: UserPosition): LearnedTemplate | null {
    // Fixed: currentPosition is an object, access .role property
    const key = `LEARNED_TPL_${position.role}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
}
