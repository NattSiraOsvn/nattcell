
import { GoogleGenAI } from "@google/genai";
import { FileMetadata, IngestStatus } from '../../../types';
import { Ingestion } from '../../ingestion/IngestionService';

export class AICoreProcessor {
  async process(metadata: FileMetadata, fileContent: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    Ingestion.updateStatus(metadata.id, IngestStatus.EXTRACTING);

    const model = 'gemini-3-flash-preview';
    const prompt = `
      Bạn là chuyên gia bóc tách dữ liệu doanh nghiệp Omega.
      Phân tích nội dung sau và trích xuất thành JSON có cấu trúc:
      1. Xác định loại chứng từ (Context).
      2. Trích xuất các trường dữ liệu quan trọng.
      3. Tính toán Confidence Score (0.0 - 1.0) dựa trên độ rõ nét và tính hợp lý của dữ liệu.

      NỘI DUNG:
      ${fileContent.substring(0, 20000)}
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || "{}");
      
      Ingestion.updateStatus(metadata.id, IngestStatus.MAPPING, {
        confidence: result.confidence || 0.8,
        context: result.context
      });

      return result;
    } catch (error) {
      Ingestion.updateStatus(metadata.id, IngestStatus.FAILED);
      throw error;
    }
  }

  determineNextStep(confidence: number): IngestStatus {
    if (confidence >= 0.85) return IngestStatus.COMMITTED;
    return IngestStatus.PENDING_APPROVAL;
  }
}

export const AIProcessor = new AICoreProcessor();
