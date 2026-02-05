
import { Supplier } from '../types';
import { SupplierClassifier } from './supplierClassifier';

export class SupplierImportHelper {
  // Xử lý import từ file Excel (dựa trên mẫu AMIS)
  static processImportedData(row: any): Supplier {
    // Map từ cột Excel sang object Supplier
    const supplier: Supplier = {
      id: row['Mã nhà cung cấp (*)'] || Math.random().toString(36).substring(7),
      maNhaCungCap: row['Mã nhà cung cấp (*)'] || '',
      tenNhaCungCap: row['Tên nhà cung cấp (*)'] || '',
      diaChi: row['Địa chỉ'] || '',
      maSoThue: row['Mã số thuế'] || '',
      maNhomNCC: row['Mã nhóm nhà cung cấp'] || '',
      dienThoai: row['Điện thoại'] || '',
      website: row['Website'] || '',
      email: row['Email'] || '',
      quocGia: row['Quốc gia'] || 'Việt Nam',
      tinhTP: row['Tỉnh/TP'] || '',
      soTaiKhoan: row['Số tài khoản'] || '',
      tenNganHang: row['Tên ngân hàng'] || '',
      ghiChu: row['Ghi chú'] || ''
    };
    
    return SupplierClassifier.classifySupplier(supplier);
  }

  // Validate dữ liệu NCC trước khi lưu
  static validateSupplier(supplier: Supplier): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Kiểm tra bắt buộc
    if (!supplier.maNhaCungCap.trim()) {
      errors.push('Mã NCC là bắt buộc');
    }
    
    if (!supplier.tenNhaCungCap.trim()) {
      errors.push('Tên NCC là bắt buộc');
    }
    
    // Validate MST cho NCC trong nước
    if (supplier.loaiNCC === 'TO_CHUC' || supplier.loaiNCC === 'CA_NHAN') {
      if (!supplier.maSoThue) {
        errors.push('Mã số thuế là bắt buộc cho NCC trong nước');
      } else if (!/^\d{10}(-\d{3})?$/.test(supplier.maSoThue)) {
        errors.push('Mã số thuế không đúng định dạng (10 số hoặc 10 số-3 số)');
      }
    }
    
    // Validate email
    if (supplier.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplier.email)) {
      errors.push('Email không hợp lệ');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
