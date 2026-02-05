// ... (Giữ nguyên các enums trước đó)

export const superdictionary = deepFreeze({
  meta: {
    name: "Tâm Luxury Enterprise Edition - Mega Ultimate",
    version: "2026.V11.1 Fiscal-Patch",
    scale_capacity: "Unlimited (Cloud-Native)",
    updated: new Date().toISOString()
  },

  // ⚖️ CẤU HÌNH THUẾ & HDĐT (Fiscal Standard)
  tax_authority: {
    invoice_forms: ["01GTKT0/001", "02GTTT0/001"],
    series_format: "1C26TLL",
    xml_standard: "TCT-XML-v2.0",
    tax_rates: [0, 5, 8, 10],
    submission_gateways: ["DIRECT-API-TCT", "VNPT-INV", "VIETTEL-SINVOICE"],
    token_providers: ["SafeCA", "Viettel-CA", "VNPT-CA"]
  },

  // ⚖️ GIAO THỨC GIẢI QUYẾT XUNG ĐỘT (Conflict Resolution Rules)
  conflict_resolution_rules: {
    SALES: {
      dataType: 'SALES_ORDER',
      threshold: 0.2,
      defaultMethod: 'priority_based',
      fallbackMethod: 'timestamp_based'
    },
    INVENTORY: {
      dataType: 'STOCK_LEVEL',
      threshold: 0.1,
      defaultMethod: 'priority_based',
      fallbackMethod: 'manual_review'
    },
    FINANCE: {
      dataType: 'ACCOUNTING_ENTRY',
      threshold: 0.05,
      defaultMethod: 'manual_review',
      fallbackMethod: 'priority_based'
    }
  },

  document_definitions: {
    HOA_DON: {
      label: "Hóa đơn điện tử / Chứng từ mua bán",
      keywords: ["HOA DON", "INVOICE", "BILL", "VAT", "GTGT", "PHIEU THU", "E-INVOICE", "01GTKT"],
      actions: ["Bóc tách thuế GTGT", "Mapping SKU Master", "Xác thực chữ ký số"]
    },
    SAO_KE: {
      label: "Sao kê ngân hàng / Sổ phụ",
      keywords: ["SAO KE", "STATEMENT", "GIAO DICH", "TRANSACTION", "BANK", "SO PHU", "CREDIT ADVICE", "DEBIT ADVICE"],
      actions: ["Phân loại dòng tiền WAC", "Đối soát công nợ", "Phát hiện rủi ro thuế"]
    },
    TO_KHAI: {
      label: "Tờ khai hải quan / XNK (Customs)",
      keywords: [
        "TO KHAI", "DECLARATION", "CUSTOMS", "HQ", "NHAP KHAU", "XUAT KHAU", 
        "A11", "B11", "E31", "H11", 
        "LUONG XANH", "LUONG DO", "LUONG VANG", "GREEN STREAM", "RED STREAM", "YELLOW STREAM",
        "THONG QUAN"
      ],
      actions: ["Kiểm tra mã HS Code", "Tính thuế nhập khẩu", "Lưu trữ Shard Logistics", "Phân luồng kiểm hóa"]
    },
    VAN_DON: {
      label: "Vận đơn / Bill of Lading",
      keywords: ["BILL OF LADING", "AIR WAYBILL", "VAN DON", "MA VAN DON", "CONSIGNEE", "SHIPPER", "NOTIFY PARTY", "AWB", "HBL", "MBL"],
      actions: ["Tra cứu hành trình", "Đối soát phí vận chuyển", "Lưu trữ hồ sơ nhập khẩu"]
    },
    PACKING_LIST: {
      label: "Phiếu đóng gói / Packing List",
      keywords: ["PACKING LIST", "PHIEU DONG GOI", "NET WEIGHT", "GROSS WEIGHT", "SO KIEN", "DIMENSION", "CUBIC METER", "CBM"],
      actions: ["Kiểm tra quy cách đóng gói", "Đối chiếu trọng lượng", "Lên kế hoạch kho"]
    },
    CO: {
      label: "Chứng nhận xuất xứ / C/O",
      keywords: ["CERTIFICATE OF ORIGIN", "C/O", "XUAT XU", "FORM E", "FORM D", "FORM AK", "CO FORM"],
      actions: ["Xác định ưu đãi thuế", "Kiểm tra tính hợp lệ", "Đối chiếu tờ khai"]
    },
    PHIEU_KIEM_DINH: {
      label: "Phiếu Kiểm Định Đá Quý (GIA/Internal)",
      keywords: ["GIA REPORT", "GEMOLOGICAL", "KIEM DINH", "CERTIFICATE", "DO TINH KHIET", "CLARITY", "COLOR GRADE", "DIAMOND DOSSIER", "PNJ LAB", "SJC CERT"],
      actions: ["Map thông số 4C", "Cập nhật giá trị tài sản", "Lưu trữ Vault", "Tạo NFT Identity"]
    },
    LENH_SAN_XUAT: {
      label: "Lệnh Sản Xuất / Job Bag",
      keywords: ["LENH SAN XUAT", "PRODUCTION ORDER", "JOB BAG", "PHIEU GIAO VIEC", "MAU SAP", "CASTING", "THO KIM HOAN", "TIEN DO SAN XUAT"],
      actions: ["Tạo Job ID", "Gán thợ", "Tính định mức vàng", "Theo dõi tiến độ"]
    },
    BAO_CAO_KHO: {
      label: "Báo Cáo Tồn Kho / Inventory",
      keywords: ["TON KHO", "INVENTORY", "STOCK REPORT", "XUAT NHAP TON", "THE KHO", "SO CHI TIET VAT LIEU", "KIEM KE"],
      actions: ["Đối soát số lượng", "Cảnh báo Min/Max", "Định giá tồn kho"]
    },
    HOP_DONG: {
      label: "Hợp đồng / Văn bản pháp lý",
      keywords: ["HOP DONG", "CONTRACT", "AGREEMENT", "KY KET", "MEMORANDUM", "THOA THUAN"],
      actions: ["Rà soát điều khoản rủi ro", "Theo dõi thời hạn hiệu lực", "Trích xuất giá trị cam kết"]
    },
    QUY_TRINH: {
      label: "Quy trình vận hành / SOP",
      keywords: ["QUY TRINH", "PROTOCOL", "SOP", "HUONG DAN", "GUIDELINE", "CHINH SACH"],
      actions: ["Xây dựng Daily Active Protocol", "Thiết lập KPI nhân sự", "Bóc tách bước trọng yếu"]
    }
  },
  business_units: {
    PRODUCTION: {
      sheets: ["SẢN XUẤT", "CHẾ TÁC", "XƯỞNG", "DAILY_REPORT", "PRODUCTION", "JOB_BAG"],
    },
    SALES: {
      sheets: ["BÁN HÀNG", "SALES", "REVENUE", "DOANH THU", "POS"],
    },
    LOGISTICS: {
      sheets: ["XUẤT NHẬP KHẨU", "CUSTOMS", "KHO", "INVENTORY", "PACKING", "SHIPPING"],
    }
  },
  priority_logic: [
    "document_definitions",
    "certification_authority",
    "sku_master",
    "signatures",
    "business_units",
    "headers",
    "fields"
  ],
  module_mapping: {
    MODULE_2: ["WAREHOUSE", "KHO", "KPD", "KNL", "KTP", "STOCK", "ASSET"], 
    MODULE_3: ["THỢ", "NGUỘI", "HỘT", "NHÁM", "XI", "CHẾ TÁC", "SẢN XUẤT"],
    MODULE_4: ["CHÊNH GRAM", "TRỌNG LƯỢNG", "LOSS", "HAO HỤT"],
    MODULE_5: ["ĐẠT", "KHÔNG ĐẠT", "LỖI", "QC", "KCS"],
    MODULE_6: ["SỬA", "BẢO HÀNH", "FIX", "REPAIR"],
    MODULE_7: ["PHÔI", "BỤI", "THU HỒI", "PHÂN KIM", "TI"],
    MODULE_8: ["GIÁ", "CHI PHÍ", "AMOUNT", "COST", "THÀNH TIỀN"],
    MODULE_9: ["TỔNG HỢP", "KPI", "REPORT", "DASHBOARD"]
  },
  language_packs: {
    "VI": {
      headers: {
        packlist: "PACKING LIST",
        invoice: "COMMERCIAL INVOICE",
        seller: "NGƯỜI BÁN (XUẤT KHẨU):",
        buyer: "NGƯỜI MUA (NHẬP KHẨU):",
        total: "TỔNG CỘNG:",
        remarks: "GHI CHÚ: DANH SÁCH CHỨNG CHỈ GIA",
        giaFormat: "– GIA ",
        declaration: "TÔI XÁC NHẬN RẰNG THÔNG TIN TRÊN LÀ CHÍNH XÁC VÀ ĐẦY ĐỦ",
        total_certs: "TỔNG SỐ CHỨNG CHỈ:"
      }
    }
  },
  certification_authority: {
    INTERNATIONAL: [
      { id: 'GIA', name: 'Viện Đá Quý Hoa Kỳ | GIA', pattern: "GIA\\s*(\\d{7,12})", color: '#3b82f6' },
      { id: 'IGI', name: 'Viện Kiểm Định Quốc Tế | IGI', pattern: "IGI\\s*(\\d{7,12})", color: '#ef4444' },
      { id: 'HRD', name: 'Hội Đồng Kim Cương | HRD', pattern: "HRD\\s*(\\d{7,12})", color: '#10b981' },
      { id: 'GRS', name: 'Lab Nghiên Cứu Thụy Sĩ | GRS', pattern: "GRS\\d{4}-\\d{6}", color: '#6366f1' }
    ],
    INTERNAL: {
      prefix: "TL-",
      structure: "TL-[LOẠI]-[NĂM][ID]",
      types: {
        D: "KIM CƯƠNG | DIAMOND",
        G: "VÀNG | GOLD",
        S: "XAPHIA | SAPPHIRE",
        E: "LỤC BẢO | EMERALD",
        R: "HỒNG NGỌC | RUBY"
      }
    }
  },
  sku_master: [
    { prefix: "NNA#", name: "Nhẫn Nam" },
    { prefix: "NNU#", name: "Nhẫn Nữ" },
    { prefix: "BT#", name: "Bông Tai" },
    { prefix: "VT#", name: "Vòng Tay" },
    { prefix: "NC#", name: "Nhẫn Cưới" },
    { prefix: "LT#", name: "Lắc Tay" },
    { prefix: "MD#", name: "Mặt Dây" },
  ],
  signatures: {
    SALES: {
      keywords: ["DOANH THU", "BÁN HÀNG", "BILL", "HÓA ĐƠN", "DOANHTHU", "THU NGAN", "POS"],
      patterns: { invoice: "INV-\\d+", receipt: "HD\\d+" },
      actions: ["Tích hợp CRM", "Tính hoa hồng", "Cập nhật tồn kho"]
    },
    PRODUCTION: {
      keywords: ["SẢN XUẤT", "THỢ", "NGUỘI", "XI MẠ", "PHÔI", "TIEN DO", "GIAO VIEC"],
      patterns: { job: "JOB-\\d+", worker: "NV-\\d+" },
      actions: ["Tính hao hụt", "Cập nhật BTP", "Check tiến độ"]
    }
  },
  headers: {
    SKU: ["MÃ SP", "PRODUCT CODE", "SKU", "MÃ HÀNG", "MODEL"],
    PRICE: ["GIÁ", "HTC", "AMOUNT", "THÀNH TIỀN", "GIÁ BÁN"],
    CUSTOMER: ["KHÁCH HÀNG", "CUSTOMER", "TÊN KHÁCH", "NGƯỜI MUA"],
    PHONE: ["SĐT", "PHONE", "DI ĐỘNG", "SỐ ĐIỆN THOẠI"],
    WORKER: ["THỢ", "WORKER", "NHÂN VIÊN THỰC HIỆN", "KỸ THUẬT"]
  }
});

export const superdictionarycontrpl = {
  ai_permission: "READ_ONLY",
  sync_interval: 5000,
  max_retry: 3
};

function deepFreeze<T>(obj: T): T {
  const propNames = Object.getOwnPropertyNames(obj);
  for (const name of propNames) {
    const value = (obj as any)[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
}

export interface BusinessTerm {
  code: string;
  name: string;
  description: string;
  category: string;
  synonyms?: string[];
  relatedTerms?: string[];
  metadata?: any;
}

class superdfictionaryclass {
  private static instance: superdfictionaryclass;
  private dictionary: Map<string, BusinessTerm> = new Map();
  private version: string = superdictionary.meta.version;
  private lastSync: number = Date.now();

  private constructor() {
    this.initDictionary();
  }

  static getInstance(): superdfictionaryclass {
    if (!superdfictionaryclass.instance) {
      superdfictionaryclass.instance = new superdfictionaryclass();
    }
    return superdfictionaryclass.instance;
  }

  private initDictionary(): void {
    const initialTerms: BusinessTerm[] = [
      {
        code: 'HS_CODE',
        name: 'Harmonized System Code',
        description: 'Mã phân loại hàng hóa theo hệ thống hài hòa',
        category: 'Customs',
        synonyms: ['Mã HS', 'HS Code'],
        relatedTerms: ['Customs Declaration', 'Tariff']
      }
    ];

    initialTerms.forEach(term => {
      this.dictionary.set(term.code, term);
    });

    this.ingestLegacyData();
  }

  private ingestLegacyData(): void {
    Object.entries(superdictionary.document_definitions).forEach(([key, val]) => {
      this.addTerm({
        code: key,
        name: val.label,
        description: `Định nghĩa tài liệu loại ${key}`,
        category: 'DOCUMENT_TYPE',
        synonyms: val.keywords as string[],
        metadata: { actions: val.actions }
      });
    });

    superdictionary.certification_authority.INTERNATIONAL.forEach(cert => {
      this.addTerm({
        code: cert.id,
        name: cert.name,
        description: `Tổ chức kiểm định quốc tế ${cert.id}`,
        category: 'CERTIFICATION',
        synonyms: [cert.id, cert.name.split('|')[0].trim()],
        metadata: { pattern: cert.pattern, color: cert.color }
      });
    });

    Object.entries(superdictionary.business_units).forEach(([key, val]) => {
      this.addTerm({
        code: `UNIT_${key}`,
        name: `Khối ${key}`,
        description: `Đơn vị nghiệp vụ ${key}`,
        category: 'BUSINESS_UNIT',
        synonyms: val.sheets as string[]
      });
    });
  }

  addTerm(term: BusinessTerm): void {
    this.dictionary.set(term.code, term);
  }

  getTerm(code: string): BusinessTerm | undefined {
    return this.dictionary.get(code);
  }

  searchTerm(query: string): BusinessTerm[] {
    const results: BusinessTerm[] = [];
    const lowerQuery = query.toLowerCase();

    this.dictionary.forEach(term => {
      const matchName = term.name.toLowerCase().includes(lowerQuery);
      const matchDesc = term.description.toLowerCase().includes(lowerQuery);
      const matchSyn = term.synonyms?.some(syn => syn.toLowerCase().includes(lowerQuery));
      const matchCode = term.code.toLowerCase().includes(lowerQuery);

      if (matchName || matchDesc || matchSyn || matchCode) {
        results.push(term);
      }
    });

    return deepFreeze(results);
  }

  async fetchRemoteUpdates(): Promise<boolean> {
    try {
      await new Promise(r => setTimeout(r, 1500));
      this.lastSync = Date.now();
      return true;
    } catch (e) {
      console.error("[SuperDictionary] Remote sync failed", e);
      return false;
    }
  }

  exportDictionary(): BusinessTerm[] {
    return deepFreeze(Array.from(this.dictionary.values()));
  }

  importdictionary(terms: BusinessTerm[]): void {
    terms.forEach(term => {
      this.dictionary.set(term.code, term);
    });
  }

  getVersion(): string { return this.version; }
  getLastSync(): number { return this.lastSync; }
}

export default superdfictionaryclass.getInstance();