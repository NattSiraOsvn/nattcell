
import { GDBData, GDBDocument, DiamondSpecs } from '../types';

class GDBPatternDatabase {
  static readonly GDB_KEYWORDS = {
    DOCUMENT_TYPES: ['GIẤY ĐẢM BẢO', 'THÔNG TIN KHÁCH HÀNG', 'CÔNG TY TNHH TÂM LUXURY', 'CHUYÊN KIM CƯƠNG THIÊN NHIÊN', 'TÂM LUXURY - DIAMOND & JEWELRY'],
    CUSTOMER_INFO: ['TÊN KHÁCH HÀNG', 'Tên Khách Hàng', 'SĐT KHÁCH HÀNG', 'SĐT Khách Hàng', 'Số điện thoại', 'KHÁCH HÀNG'],
    PRODUCT_INFO: ['MÃ SẢN PHẨM', 'THÔNG SỐ', 'SIZE', 'GIÁ TRỊ', 'Trị Giá', 'Vòng trang sức', 'Bông tai', 'Nhẫn', 'Dây chuyền'],
    VALUE_INFO: ['TỔNG GIÁ TRỊ', 'Tổng Trị Giá', 'Viết Bằng Chữ', 'Bằng chữ', 'BẢNG CHỮ', 'triệu đồng', 'đồng chẵn'],
    EXCHANGE_POLICY: ['CHẾ ĐỘ THU ĐỐI', 'Giá Trị Thu Đối', 'Thu lại', 'Đổi lớn', 'Vàng thu lại', 'Vàng đổi lớn', 'Kim cương thu lại', 'Kim cương đổi lớn'],
    WARRANTY: ['CHẾ ĐỘ BẢO HÀNH', 'Bảo hành', 'rơi rớt kim cương', 'dưới 3mm', 'làm mới, làm sạch, làm bóng'],
    COMPANY_INFO: ['SHOWROOM', 'WEBSITE', 'FACEBOOK', 'YOUTUBE', 'Hotline', 'Địa chỉ', 'TP.HCM'],
    SIGNATURE: ['Ngày', 'Tháng', 'Năm', 'CHỮ KÝ', 'Ký tên', 'Người Bán', 'Xác nhận']
  };

  static readonly REGEX_PATTERNS = {
    PHONE: /(\+?84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}/g,
    MONEY: /(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*(?:VNĐ|đồng|vnd)/gi,
    PERCENTAGE: /[-+]?\d+\s*%/g,
    DATE: /(Ngày\s+\d{1,2}\s+Tháng\s+\d{1,2}\s+Năm\s+\d{4})|(\d{1,2}\/\d{1,2}\/\d{4})/gi,
    PRODUCT_CODE: /(?:MÃ SẢN PHẨM|Mã sản phẩm)[:\s]*([A-Z0-9]+)/i,
    GOLD_WEIGHT: /(\d+(?:[.,]\d+)?)\s*(?:chỉ|gram|g|gam)/i
  };

  static readonly KNOWN_TEMPLATES = [
    { name: 'Tâm Luxury Template 2022', keywords: ['TÂM LUXURY', 'CHUYÊN KIM CƯƠNG THIÊN NHIÊN', 'NNU428'] },
    { name: 'Tâm Luxury Template 2021', keywords: ['CÔNG TY TNHH TÂM LUXURY', 'GIẤY ĐẢM BÁO', 'Bông tai'] }
  ];
}

export class GDBRecognitionEngine {
  private confidenceThreshold = 0.6;
  private patterns = GDBPatternDatabase;
  private ocrText: string;
  private lines: string[];
  
  constructor(ocrText: string) {
    this.ocrText = this.preprocessText(ocrText);
    this.lines = this.ocrText.split('\n').map(line => line.trim()).filter(l => l.length > 0);
  }
  
  private preprocessText(text: string): string {
    return text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').replace(/[^\S\n]+/g, ' ').trim();
  }
  
  public analyze(): GDBDocument {
    const gdbScore = this.calculateGDBScore();
    const isGDB = gdbScore >= this.confidenceThreshold;
    
    if (!isGDB) {
      return {
        type: 'OTHER',
        confidence: gdbScore,
        extractedData: {} as any,
        metadata: {
          template: 'Unknown',
          extractionQuality: 0,
          ocrQuality: 0,
          matchedKeywords: this.getMatchedKeywords(),
          reason: 'Low confidence score',
          score: gdbScore
        }
      };
    }
    
    return {
      type: 'GDB',
      confidence: gdbScore,
      extractedData: this.extractGDBData(),
      metadata: {
        template: this.identifyTemplate(),
        extractionQuality: 0.8, // Placeholder
        ocrQuality: this.lines.length > 5 ? 0.9 : 0.4,
        matchedKeywords: this.getMatchedKeywords()
      }
    };
  }
  
  private calculateGDBScore(): number {
    let score = 0;
    
    const importantKeywords = [
      ...this.patterns.GDB_KEYWORDS.DOCUMENT_TYPES,
      ...this.patterns.GDB_KEYWORDS.CUSTOMER_INFO,
      ...this.patterns.GDB_KEYWORDS.VALUE_INFO
    ];
    
    const foundImportant = importantKeywords.filter(keyword => this.ocrText.includes(keyword)).length;
    score += Math.min(40, (foundImportant / 3) * 40); // Cap at 40
    
    const hasCustomerInfo = this.patterns.GDB_KEYWORDS.CUSTOMER_INFO.some(kw => this.ocrText.includes(kw));
    const hasProductInfo = this.patterns.GDB_KEYWORDS.PRODUCT_INFO.some(kw => this.ocrText.includes(kw));
    const hasValueInfo = this.patterns.GDB_KEYWORDS.VALUE_INFO.some(kw => this.ocrText.includes(kw));
    
    if (hasCustomerInfo && hasProductInfo && hasValueInfo) score += 30;
    else if (hasCustomerInfo && (hasProductInfo || hasValueInfo)) score += 20;
    
    if (this.patterns.GDB_KEYWORDS.EXCHANGE_POLICY.some(kw => this.ocrText.includes(kw))) score += 10;
    if (this.patterns.GDB_KEYWORDS.WARRANTY.some(kw => this.ocrText.includes(kw))) score += 10;
    if (this.patterns.GDB_KEYWORDS.SIGNATURE.some(kw => this.ocrText.includes(kw))) score += 10;
    
    return Math.min(100, score) / 100;
  }
  
  private extractGDBData(): GDBData {
    return {
      customer: this.extractCustomerInfo(),
      product: this.extractProductInfo(),
      valuation: this.extractValuationInfo(),
      exchangePolicy: this.extractExchangePolicy(),
      warranty: this.extractWarrantyInfo(),
      company: this.extractCompanyInfo(),
      documentInfo: this.extractDocumentInfo()
    };
  }

  private extractCustomerInfo() {
    const customer = { name: '', phone: '', normalizedPhone: '' };
    for (const line of this.lines) {
      if (line.match(/TÊN KHÁCH HÀNG|Tên Khách Hàng/i)) {
        const parts = line.split(':');
        if (parts.length > 1) customer.name = parts[1].trim().replace(/[._-]+/g, ' ').trim();
      }
      if (line.match(/SĐT KHÁCH HÀNG|Số điện thoại/i)) {
        const phoneMatch = line.match(this.patterns.REGEX_PATTERNS.PHONE);
        if (phoneMatch) {
          customer.phone = phoneMatch[0];
          customer.normalizedPhone = phoneMatch[0].replace(/\s+/g, '').replace(/^0/, '84');
        }
      }
    }
    return customer;
  }

  private extractProductInfo() {
    const product = {
      code: '',
      type: 'KHAC' as any,
      description: '',
      specifications: [] as string[],
      weight: 0,
      diamondSpecs: undefined as DiamondSpecs | undefined
    };
    
    for (const line of this.lines) {
      const codeMatch = line.match(this.patterns.REGEX_PATTERNS.PRODUCT_CODE);
      if (codeMatch) product.code = codeMatch[1];
      
      if (line.match(/Vòng trang sức/i)) product.type = 'VONG_TRANG_SUC';
      else if (line.match(/Bông tai/i)) product.type = 'BONG_TAI';
      else if (line.match(/Nhẫn/i)) product.type = 'NHAN';
      else if (line.match(/Dây chuyền/i)) product.type = 'DAY_CHUYEN';
      
      if (line.match(/THÔNG SỐ|Thông số/i)) {
        const specs = line.split(':')[1]?.trim();
        if (specs) product.specifications = specs.split('-').map(s => s.trim());
      }
      
      const weightMatch = line.match(this.patterns.REGEX_PATTERNS.GOLD_WEIGHT);
      if (weightMatch) product.weight = parseFloat(weightMatch[1].replace(',', '.'));

      if (line.match(/kim cương|Kim cương/i)) {
        product.diamondSpecs = this.extractDiamondSpecs(line);
      }
    }
    // Fallback description
    product.description = `${product.type} ${product.code}`;
    return product;
  }

  private extractDiamondSpecs(line: string): DiamondSpecs {
    const specs: DiamondSpecs = { size: '', clarity: '', color: '', quantity: 0 };
    const sizeMatch = line.match(/(\d+(?:[.,]\d+)?)\s*ly/);
    if (sizeMatch) specs.size = sizeMatch[1];
    
    if (line.includes('VVS')) specs.clarity = 'VVS';
    else if (line.includes('VS')) specs.clarity = 'VS';
    else if (line.includes('SI')) specs.clarity = 'SI';
    
    const colorMatch = line.match(/\b([D-F])\b/);
    if (colorMatch) specs.color = colorMatch[1];
    
    const countMatch = line.match(/(\d+)\s*(?:viên|hột)/);
    if (countMatch) specs.quantity = parseInt(countMatch[1]);
    
    return specs;
  }

  private extractValuationInfo() {
    const valuation = { productValue: 0, totalValue: 0, totalValueInWords: '', exchangeRate: 0 };
    for (const line of this.lines) {
      if (line.match(/TỔNG GIÁ TRỊ|Tổng Trị Giá/i)) {
        const matches = line.match(this.patterns.REGEX_PATTERNS.MONEY);
        if (matches) valuation.totalValue = this.parseMoney(matches[0]);
      }
      if (line.match(/Bằng chữ|Viết Bằng Chữ/i)) {
        const parts = line.split(':');
        if (parts.length > 1) valuation.totalValueInWords = parts[1].trim();
      }
    }
    return valuation;
  }

  private extractExchangePolicy() {
    const policy = { gold: { returnRate: 0, exchangeRate: 0 }, diamond: { returnRate: 0, exchangeRate: 0 } };
    for (const line of this.lines) {
      const percentMatches = line.match(this.patterns.REGEX_PATTERNS.PERCENTAGE);
      if (!percentMatches) continue;
      
      const val = parseInt(percentMatches[0].replace('%','').trim());
      if (line.match(/Vàng|vàng/i) && line.match(/Thu lại/i)) policy.gold.returnRate = val;
      if (line.match(/Vàng|vàng/i) && line.match(/Đổi lớn/i)) policy.gold.exchangeRate = val;
      if (line.match(/Kim cương|kim cương/i) && line.match(/Thu lại/i)) policy.diamond.returnRate = val;
      if (line.match(/Kim cương|kim cương/i) && line.match(/Đổi lớn/i)) policy.diamond.exchangeRate = val;
    }
    return policy;
  }

  private extractWarrantyInfo() {
    const warranty = { diamondLossUnder3mm: false, freeMaintenance: false, conditions: [] as string[] };
    const text = this.ocrText.toLowerCase();
    if (text.includes('rơi rớt kim cương') && text.includes('3mm')) warranty.diamondLossUnder3mm = true;
    if (text.includes('làm mới') || text.includes('làm sạch')) warranty.freeMaintenance = true;
    return warranty;
  }

  private extractCompanyInfo() {
    const company = { name: 'Tâm Luxury', address: '', phoneNumbers: [] as string[], website: '', email: '' };
    for (const line of this.lines) {
      if (line.match(/Quận 5|TP.HCM/i)) company.address = line.trim();
      const phoneMatches = line.match(this.patterns.REGEX_PATTERNS.PHONE);
      if (phoneMatches) company.phoneNumbers.push(...phoneMatches);
    }
    return company;
  }

  private extractDocumentInfo() {
    const info = { issueDate: new Date(), sellerName: '', signature: '' };
    for (const line of this.lines) {
      const dateMatch = line.match(this.patterns.REGEX_PATTERNS.DATE);
      if (dateMatch) {
         // Simple parsing, improvements needed for full locale date
         info.issueDate = new Date(); 
      }
      if (line.match(/TRẦN LÊ VĂN TÂM|Tâm Luxury/i)) info.sellerName = 'Trần Lê Văn Tâm';
    }
    return info;
  }

  private parseMoney(str: string): number {
    return parseFloat(str.replace(/[^\d]/g, ''));
  }
  
  private getMatchedKeywords(): string[] {
    const matched: string[] = [];
    const allKeywords = Object.values(this.patterns.GDB_KEYWORDS).flat();
    for (const keyword of allKeywords) {
      if (this.ocrText.includes(keyword)) matched.push(keyword);
    }
    return matched;
  }
  
  private identifyTemplate(): string {
    for (const template of this.patterns.KNOWN_TEMPLATES) {
      if (template.keywords.every(keyword => this.ocrText.includes(keyword))) return template.name;
    }
    return 'Unknown Template';
  }
}
