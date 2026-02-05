
import { Supplier } from '../types';

export class SupplierClassifier {
  // Phân loại theo loại NCC
  static classifyByType(supplier: Supplier): Supplier['loaiNCC'] {
    const { maSoThue, tenNhaCungCap } = supplier;
    
    // Kiểm tra có phải NCC nước ngoài không (dựa trên tên, địa chỉ, MST)
    if (!maSoThue || this.isForeignSupplier(supplier)) {
      return 'NUOC_NGOAI';
    }
    
    // Kiểm tra có phải cá nhân (tên có thể chứa "CN" hoặc MST có độ dài đặc biệt)
    if (maSoThue.length === 9 || maSoThue.length === 12 || 
        tenNhaCungCap.toLowerCase().includes('cá nhân') ||
        tenNhaCungCap.toLowerCase().includes('cn.')) {
      return 'CA_NHAN';
    }
    
    // Mặc định là tổ chức trong nước
    return 'TO_CHUC';
  }

  // Phân loại theo nhóm hàng chính
  static classifyByProductGroup(supplier: Supplier): string[] {
    const { tenNhaCungCap, ghiChu, maNhomNCC } = supplier;
    const groups: string[] = [];
    
    const name = tenNhaCungCap.toLowerCase();
    const note = (ghiChu || '').toLowerCase();
    
    // Kim cương/Đá quý
    if (name.includes('gem') || name.includes('diamond') || 
        name.includes('kim cương') || name.includes('đá quý') ||
        note.includes('diamond') || name.includes('prime')) {
      groups.push('KIM_CUONG_DA_QUY');
    }
    
    // Vàng/Bạc
    if (name.includes('vàng') || name.includes('gold') || 
        name.includes('sjc') || name.includes('bạc') ||
        name.includes('trang sức')) {
      groups.push('VANG_BAC');
    }
    
    // Bao bì/In ấn
    if (name.includes('in') || name.includes('bao bì') || 
        name.includes('packaging') || name.includes('túi') ||
        name.includes('hộp')) {
      groups.push('BAO_BI_IN_AN');
    }
    
    // Dịch vụ
    if (name.includes('dịch vụ') || name.includes('service') ||
        name.includes('công nghệ') || name.includes('tech') ||
        name.includes('vận chuyển') || name.includes('logistics')) {
      groups.push('DICH_VU');
    }
    
    // Thiết bị/Công cụ
    if (name.includes('thiết bị') || name.includes('equipment') ||
        name.includes('máy') || name.includes('công cụ') ||
        name.includes('tool')) {
      groups.push('THIET_BI_CONG_CU');
    }
    
    // Nếu không có nhóm nào, dựa vào mã nhóm NCC cũ
    if (groups.length === 0 && maNhomNCC) {
      groups.push(maNhomNCC);
    }
    
    return groups.length > 0 ? groups : ['KHAC'];
  }

  // Phân loại theo khu vực địa lý
  static classifyByRegion(supplier: Supplier): Supplier['khuVuc'] {
    const { tinhTP, diaChi, quocGia } = supplier;
    
    // NCC nước ngoài
    if (quocGia && quocGia !== 'Việt Nam' && quocGia !== 'VN') {
      return 'QUOC_TE';
    }
    
    const address = (diaChi || '').toLowerCase();
    const province = (tinhTP || '').toLowerCase();
    
    // Miền Bắc
    const northKeywords = ['hà nội', 'hanoi', 'hải phòng', 'quảng ninh', 
                          'bắc ninh', 'vĩnh phúc', 'thái nguyên'];
    if (northKeywords.some(keyword => address.includes(keyword) || province.includes(keyword))) {
      return 'BAC';
    }
    
    // Miền Trung
    const centralKeywords = ['đà nẵng', 'huế', 'nghệ an', 'hà tĩnh', 
                            'quảng bình', 'quảng trị', 'thừa thiên'];
    if (centralKeywords.some(keyword => address.includes(keyword) || province.includes(keyword))) {
      return 'TRUNG';
    }
    
    // Mặc định là Miền Nam (TPHCM và các tỉnh phía Nam)
    return 'NAM';
  }

  // Phân loại phương thức thanh toán
  static classifyByPaymentMethod(supplier: Supplier): Supplier['phuongThucThanhToan'] {
    const { soTaiKhoan, tenNganHang, loaiNCC } = supplier;
    
    if (!soTaiKhoan || !tenNganHang) {
      return 'TIEN_MAT';
    }
    
    if (loaiNCC === 'NUOC_NGOAI' || 
        tenNganHang.toLowerCase().includes('international') ||
        tenNganHang.toLowerCase().includes('foreign')) {
      return 'QUOC_TE';
    }
    
    return 'CHUYEN_KHOAN';
  }

  // Phân loại dịch vụ đặc thù
  static classifyBySpecialService(supplier: Supplier): string[] {
    const { tenNhaCungCap, ghiChu } = supplier;
    const services: string[] = [];
    
    const name = tenNhaCungCap.toLowerCase();
    const note = (ghiChu || '').toLowerCase();
    
    // Dịch vụ công nghệ
    if (name.includes('công nghệ') || name.includes('tech') || 
        name.includes('software') || name.includes('phần mềm')) {
      services.push('CONG_NGHE');
    }
    
    // Dịch vụ logistics
    if (name.includes('vận chuyển') || name.includes('logistics') ||
        name.includes('ship') || name.includes('giao hàng') ||
        name.includes('showtrans')) {
      services.push('LOGISTICS');
    }
    
    // Dịch vụ giám định
    if (name.includes('giám định') || name.includes('kiểm định') ||
        name.includes('appraisal') || name.includes('p.n.j') ||
        name.includes('malca')) {
      services.push('GIAM_DINH');
    }
    
    // Dịch vụ marketing
    if (name.includes('quảng cáo') || name.includes('marketing') ||
        name.includes('truyền thông') || name.includes('advertising')) {
      services.push('MARKETING');
    }
    
    return services;
  }

  // Xác định mức độ ưu tiên
  static determinePriority(supplier: Supplier, transactionCount: number = 0): Supplier['mucDoUuTien'] {
    const groups = this.classifyByProductGroup(supplier);
    
    // NCC kim cương/đá quý (giá trị cao) => ưu tiên cao
    if (groups.includes('KIM_CUONG_DA_QUY')) {
      return 'CAO';
    }
    
    // NCC có nhiều giao dịch
    if (transactionCount > 10) {
      return 'CAO';
    }
    
    // NCC dịch vụ thiết yếu
    const services = this.classifyBySpecialService(supplier);
    if (services.includes('LOGISTICS') || services.includes('CONG_NGHE')) {
      return 'TRUNG_BINH';
    }
    
    return 'THAP';
  }

  // Kiểm tra NCC nước ngoài
  private static isForeignSupplier(supplier: Supplier): boolean {
    const { tenNhaCungCap, diaChi, quocGia, maSoThue } = supplier;
    
    // Check bằng quốc gia
    if (quocGia && 
        !['Việt Nam', 'VN', 'Vietnam'].includes(quocGia) &&
        quocGia.trim() !== '') {
      return true;
    }
    
    // Check bằng địa chỉ (có chứa nước ngoài)
    const foreignAddressIndicators = [
      'hong kong', 'hongkong', 'hk', 'dubai', 'uae', 
      'singapore', 'thailand', 'usa', 'us', 'uk'
    ];
    
    const address = (diaChi || '').toLowerCase();
    if (foreignAddressIndicators.some(indicator => address.includes(indicator))) {
      return true;
    }
    
    // Check bằng tên (có mã chữ như WG, ZEN, OCEAN)
    const name = tenNhaCungCap.toUpperCase();
    if (name.length <= 5 && /^[A-Z]+$/.test(name)) {
      return true;
    }
    
    // Check MST (NCC nước ngoài thường không có MST VN 10 số)
    if (maSoThue && !/^\d{10}(-\d{3})?$/.test(maSoThue)) {
      return true;
    }
    
    return false;
  }

  // Phân loại toàn diện
  static classifySupplier(supplier: Supplier, transactionHistory?: any[]): Supplier {
    const transactionCount = transactionHistory?.length || 0;
    
    return {
      ...supplier,
      loaiNCC: this.classifyByType(supplier),
      nhomHangChinh: this.classifyByProductGroup(supplier),
      khuVuc: this.classifyByRegion(supplier),
      phuongThucThanhToan: this.classifyByPaymentMethod(supplier),
      dichVuDacThu: this.classifyBySpecialService(supplier),
      mucDoUuTien: this.determinePriority(supplier, transactionCount),
      trangThaiHopTac: 'DANG_HOAT_DONG', // Mặc định
      mucDoTinCay: transactionCount > 5 ? 'A' : transactionCount > 0 ? 'B' : 'C',
      ngayBatDauHopTac: supplier.ngayBatDauHopTac || new Date().toISOString().split('T')[0]
    };
  }
}
