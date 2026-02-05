
import * as XLSX from 'xlsx';

/**
 * CUSTOMS UTILITIES & DICTIONARY
 * Nâng cấp: Tích hợp logic bóc tách Kim Cương Deep-Regex với Proximity Scanning.
 * Khắc phục lỗi match nhầm viên đá tấm với chứng chỉ GIA viên chủ.
 */

export const REGEX_PATTERNS = {
  // Regex nâng cao từ Master Code để bóc tách mô tả hàng hóa
  GIA_NUMBER: [
    /GIA\s*[:#.-]?\s*(\d+)/i,
    /GI\s*A\s*(\d+)/i,
    /Số\s*GIA\s*[:.]?\s*(\d+)/i,
    /Certificate\s*[:.]?\s*(\d+)/i
  ],
  HS_CODE: /^\d{8,10}$/,
  DIAMOND_SPECS: {
    COLOR: [
      /mã màu\s*[:.]?\s*([D-Z])/i,
      /màu\s*[:.]?\s*([D-Z])/i,
      /color\s*[:.]?\s*([D-Z])/i,
      /Màu sắc\s*[:.]?\s*([D-Z])/i,
      /\b([D-M])\b(?=\s*[,-;])/i
    ],
    CLARITY: [
      /\b(FL|IF|VVS1|VVS2|VS1|VS2|SI1|SI2|I1|I2|I3)\b/i,
      /Độ\s*trong\s*suốt\s*[:.]?\s*([A-Z0-9]+)/i,
      /Clarity\s*[:.]?\s*([A-Z0-9]+)/i
    ],
    DIMENSIONS: [
      /(\d{1,2}[.,]\d+)\s*[-–]\s*(\d{1,2}[.,]\d+)\s*[xX*]\s*(\d{1,2}[.,]\d+)\s*mm/i,
      /(\d+[.,]?\d*)\s*[-–]\s*(\d+[.,]?\d*)\s*×\s*(\d+[.,]?\d*)\s*mm/i,
      /(\d+[.,]?\d*)[xX](\d+[.,]?\d*)[xX](\d+[.,]?\d*)\s*mm/i
    ],
    WEIGHT: [
      /(\d+[.,]\d+)\s*ct/i,
      /(\d+[.,]\d+)\s*carat/i,
      /(\d+[.,]?\d*)\s*ct/i,
      /trọng lượng\s*[:.]?\s*(\d+[.,]?\d*)/i,
      /weight\s*[:.]?\s*(\d+[.,]?\d*)/i
    ]
  },
  SHAPES: {
    'tròn|round': 'Round',
    'vuông|princess': 'Princess',
    'oval|oval-cut': 'Oval',
    'emerald|emerald-cut': 'Emerald',
    'pear|pear-shaped': 'Pear',
    'cushion|cushion-cut': 'Cushion',
    'marquise|marquise-cut': 'Marquise',
    'heart|heart-shaped': 'Heart',
    'radiant|radiant-cut': 'Radiant'
  }
};

export const ITEM_DICTIONARY: Record<string, string> = {
  'mã số hàng hóa': 'hsCode',
  'mã hs': 'hsCode',
  'hs code': 'hsCode',
  'mô tả hàng hóa': 'description',
  'description': 'description',
  'tên hàng': 'description',
  'số lượng': 'qtyActual',
  'quantity': 'qtyActual',
  'sl': 'qtyActual',
  'trị giá hóa đơn': 'invoiceValue',
  'invoice value': 'invoiceValue',
  'đơn vị tính': 'unit',
  'unit': 'unit',
  'nước xuất xứ': 'originCountry',
  'origin': 'originCountry'
};

export class CustomsUtils {
  
  static readExcelFile(file: File): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  static normalizeString(str: string): string {
    if (!str) return '';
    return str
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }

  static findKeyword(text: string, dictionary: Record<string, string>): string | null {
    const normalizedText = this.normalizeString(text);
    for (const [keyword, field] of Object.entries(dictionary)) {
      if (normalizedText.includes(keyword)) {
        return field;
      }
    }
    return null;
  }

  static parseNumber(value: any): number {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    
    let cleanStr = value.toString().trim().replace(/\s+/g, '');
    const hasDot = cleanStr.includes('.');
    const hasComma = cleanStr.includes(',');
    
    if (hasDot && hasComma) {
      const dotIndex = cleanStr.indexOf('.');
      const commaIndex = cleanStr.indexOf(',');
      if (dotIndex < commaIndex) {
        cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
      } else {
        cleanStr = cleanStr.replace(/,/g, '');
      }
    } else if (hasComma && !hasDot) {
      if (cleanStr.split(',').length > 2) {
        cleanStr = cleanStr.replace(/,/g, '');
      } else {
        const parts = cleanStr.split(',');
        if (parts[1] && parts[1].length === 3) {
          cleanStr = cleanStr.replace(',', '');
        } else {
          cleanStr = cleanStr.replace(',', '.');
        }
      }
    } else if (hasDot && !hasComma) {
      const parts = cleanStr.split('.');
      if (parts.length > 2) {
        cleanStr = cleanStr.replace(/\./g, '');
      }
    }
    const val = parseFloat(cleanStr);
    return isNaN(val) ? 0 : val;
  }

  /**
   * Proximity Scan: Quét xung quanh vị trí GIA tìm thấy
   * @param text Văn bản gốc
   * @param giaIndex Vị trí tìm thấy mã GIA
   * @param patterns Bộ Regex cần tìm
   * @param range Phạm vi quét (số ký tự trước/sau)
   */
  private static findAttributesNearCert(text: string, giaIndex: number, patterns: RegExp[], range: number = 50): string | null {
    const start = Math.max(0, giaIndex - range);
    const end = Math.min(text.length, giaIndex + range + 20); // +20 cho độ dài mã GIA
    const substring = text.substring(start, end);

    for (const pattern of patterns) {
      const match = substring.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  /**
   * Bóc tách thông số Kim Cương
   * Logic mới: Ưu tiên tìm mã GIA trước, sau đó tìm các thuộc tính *gần* mã GIA đó nhất.
   * Tránh trường hợp lấy nhầm trọng lượng của đá tấm (vd: 0.05ct) cho đá chủ.
   */
  static extractDiamondAttributes(description: string) {
    const specs = {
      color: '',
      clarity: '',
      dimensions: '',
      weight: 0,
      cert: '',
      shape: ''
    };

    if (!description) return specs;
    const desc = description;
    const lowerDesc = description.toLowerCase();

    // 1. Tìm GIA / Certificate Number trước
    let giaMatchIndex = -1;
    for (const pattern of REGEX_PATTERNS.GIA_NUMBER) {
      const match = desc.match(pattern);
      if (match) {
        specs.cert = `GIA ${match[1]}`;
        giaMatchIndex = match.index || -1;
        break;
      }
    }

    // Nếu tìm thấy GIA, ưu tiên quét xung quanh nó (Proximity Scan)
    if (giaMatchIndex !== -1) {
       // --- Weight (Proximity) ---
       const weightStr = this.findAttributesNearCert(desc, giaMatchIndex, REGEX_PATTERNS.DIAMOND_SPECS.WEIGHT);
       if (weightStr) specs.weight = this.parseNumber(weightStr);

       // --- Color (Proximity) ---
       const colorStr = this.findAttributesNearCert(desc, giaMatchIndex, REGEX_PATTERNS.DIAMOND_SPECS.COLOR);
       if (colorStr) specs.color = colorStr.toUpperCase();

       // --- Clarity (Proximity) ---
       const clarityStr = this.findAttributesNearCert(desc, giaMatchIndex, REGEX_PATTERNS.DIAMOND_SPECS.CLARITY);
       if (clarityStr) specs.clarity = clarityStr.toUpperCase();
    } 
    
    // Nếu không tìm thấy bằng Proximity (hoặc không có GIA), quét toàn bộ chuỗi (Fallback)
    if (specs.weight === 0) {
       for (const pattern of REGEX_PATTERNS.DIAMOND_SPECS.WEIGHT) {
          const match = desc.match(pattern);
          if (match) {
             specs.weight = this.parseNumber(match[1]);
             break;
          }
       }
    }
    if (!specs.color) {
       for (const pattern of REGEX_PATTERNS.DIAMOND_SPECS.COLOR) {
          const match = desc.match(pattern);
          if (match) {
             specs.color = match[1].toUpperCase();
             break;
          }
       }
    }
    if (!specs.clarity) {
       for (const pattern of REGEX_PATTERNS.DIAMOND_SPECS.CLARITY) {
          const match = desc.match(pattern);
          if (match) {
             specs.clarity = match[1].toUpperCase();
             break;
          }
       }
    }

    // 4. Dimensions Parsing (Thường ít bị trùng lặp, quét toàn bộ ok)
    for (const pattern of REGEX_PATTERNS.DIAMOND_SPECS.DIMENSIONS) {
      const match = desc.match(pattern);
      if (match) {
        specs.dimensions = `${match[1]}-${match[2]}x${match[3]} mm`;
        break;
      }
    }

    // 6. Shape Parsing
    for (const [keywords, shapeName] of Object.entries(REGEX_PATTERNS.SHAPES)) {
      const keywordList = keywords.split('|');
      if (keywordList.some(kw => lowerDesc.includes(kw))) {
        specs.shape = shapeName;
        break;
      }
    }

    return specs;
  }

  static validateItem(item: any): string[] {
    const errors: string[] = [];
    if (!item.hsCode) errors.push('Thiếu mã HS');
    if (!item.description || item.description.length < 5) errors.push('Mô tả quá ngắn');
    
    // Validate Kim cương đặc thù (Mã HS 7102)
    if (item.hsCode.startsWith('7102')) {
        if (!item.certNumber) errors.push('Thiếu mã GIA');
        if (!item.weightCT) errors.push('Thiếu trọng lượng CT');
    }
    
    return errors;
  }
}
