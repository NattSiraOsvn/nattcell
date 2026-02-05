
// src/services/ingestion/extractors.ts
import * as XLSX from 'xlsx';
import { GoogleGenAI } from "@google/genai";
import { CustomsUtils } from '../customsUtils';

// --- INTERFACES ---
export interface ExtractedData {
  text: string;
  tables: any[];
  extractedFields: Record<string, any>;
  raw?: any;
}

// --- STRATEGIES ---

export const ExcelExtractor = {
  async extract(file: File): Promise<ExtractedData> {
    console.log(`[ExcelExtractor] Processing: ${file.name}`);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          // Convert to standardized format
          resolve({
            text: JSON.stringify(jsonData),
            tables: [{ name: firstSheetName, rows: jsonData }],
            extractedFields: {} 
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
};

export const OCRExtractor = {
  async extract(file: File): Promise<ExtractedData> {
    console.log(`[OCRExtractor] Sending to Vision API: ${file.name}`);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Convert File to Base64
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
    });

    const model = 'gemini-3-flash-preview'; // Faster for OCR
    const prompt = `Trích xuất dữ liệu từ hình ảnh này. Trả về JSON với các trường: SKU, amount, weight, description. Nếu là bảng, hãy trả về mảng 'items'.`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          role: 'user',
          parts: [{ inlineData: { data: base64Data, mimeType: file.type } }, { text: prompt }]
        }
      });
      
      const text = response.text || "";
      let fields = {};
      try {
        const jsonBlock = text.match(/```json\n([\s\S]*?)\n```/)?.[1] || text;
        fields = JSON.parse(jsonBlock);
      } catch (e) {
        console.warn("AI Raw JSON parse failed, using raw text");
      }

      return {
        text: text,
        tables: [],
        extractedFields: fields
      };
    } catch (e) {
      console.error("OCR Failed", e);
      return { text: "", tables: [], extractedFields: {} };
    }
  }
};

// PDF uses OCR for simplicity in this demo environment
export const PDFExtractor = OCRExtractor; 
