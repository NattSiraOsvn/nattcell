
import { GoogleGenAI } from "@google/genai";
import { Supplier, PersonaID, EmailMessage } from '../types';

export class GmailIntelligence {
  /**
   * Phân tích Sentiment của chuỗi email (Tích hợp Gemini)
   */
  static async analyzeSupplierSentiment(supplier: Supplier, emailBody: string): Promise<{
    score: number;
    insight: string;
    actionNeeded: boolean;
  }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Bạn là KRIS - Trợ lý pháp lý vận hành của Natt-OS.
      Hãy phân tích nội dung email sau từ Nhà cung cấp: ${supplier.tenNhaCungCap}.
      
      YÊU CẦU:
      1. Đánh giá Sentiment (0.0: Cực kỳ tiêu cực/Khiếu nại - 1.0: Cực kỳ hợp tác/Nhanh chóng).
      2. Phát hiện rủi ro trễ hạn hoặc thay đổi giá.
      3. Đề xuất hành động cho Master Natt.

      NỘI DUNG EMAIL:
      ${emailBody.substring(0, 5000)}

      TRẢ VỀ JSON: { "score": number, "insight": string, "action": boolean }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || "{}");
      return {
        score: result.score || 0.5,
        insight: result.insight || "Sentiment neutral.",
        actionNeeded: !!result.action
      };
    } catch (e) {
      return { score: 0.5, insight: "Không thể bóc tách sentiment. Shard bị nhiễu.", actionNeeded: false };
    }
  }

  /**
   * Mock data cho danh sách email
   */
  static getMockEmails() {
    return [
      { id: '1', from: 'sales@worldgems.hk', subject: 'Re: Diamond Order TL-2025', snippet: 'We have confirmed the shipment. The certificate GIA 2234... is attached.', date: '2025-01-24' },
      { id: '2', from: 'inbox@vinhan.com', subject: 'Báo giá bao bì Q1', snippet: 'Chào Anh, chúng tôi xin báo giá mới tăng 5% do giá giấy thế giới...', date: '2025-01-23' }
    ];
  }

  static async fetchEmails(): Promise<EmailMessage[]> {
    return this.getMockEmails().map(e => ({
      id: e.id,
      from: e.from,
      subject: e.subject,
      snippet: e.snippet,
      date: e.date,
      category: e.subject.includes('Diamond') ? 'LOGISTICS' : 'HÓA ĐƠN',
      hasAttachment: e.snippet.includes('attached'),
      isRead: false,
      priority: 'TRUNG BÌNH'
    })) as EmailMessage[];
  }
}
