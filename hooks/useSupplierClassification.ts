
import { useState, useCallback } from 'react';
import { Supplier } from '../types';
import { SupplierClassifier } from '../utils/supplierClassifier';
import { SupplierImportHelper } from '../utils/supplierImportHelper';
import * as XLSX from 'xlsx';

export const useSupplierClassification = () => {
  const [classifiedSuppliers, setClassifiedSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phân loại danh sách NCC
  const classifySuppliers = useCallback(async (suppliers: Supplier[], transactionData?: any[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const classified = suppliers.map(supplier => {
        // Tìm lịch sử giao dịch cho NCC này
        const supplierTransactions = transactionData?.filter(
          (t: any) => t.maNhaCungCap === supplier.maNhaCungCap
        );
        
        return SupplierClassifier.classifySupplier(supplier, supplierTransactions);
      });
      
      setClassifiedSuppliers(classified);
      return classified;
    } catch (err) {
      setError('Lỗi phân loại NCC: ' + (err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Import từ file Excel
  const importFromExcel = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      return new Promise<Supplier[]>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            
            const suppliers = rows.map((row: any) => 
              SupplierImportHelper.processImportedData(row)
            );
            
            setClassifiedSuppliers(suppliers);
            resolve(suppliers);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    } catch (err) {
      setError('Lỗi import file: ' + (err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lọc NCC theo loại
  const filterByType = useCallback((type: Supplier['loaiNCC']) => {
    return classifiedSuppliers.filter(s => s.loaiNCC === type);
  }, [classifiedSuppliers]);

  // Lọc NCC theo nhóm hàng
  const filterByProductGroup = useCallback((group: string) => {
    return classifiedSuppliers.filter(s => 
      s.nhomHangChinh?.includes(group)
    );
  }, [classifiedSuppliers]);

  // Thống kê phân loại
  const getClassificationStats = useCallback(() => {
    const stats = {
      total: classifiedSuppliers.length,
      byType: {} as Record<string, number>,
      byRegion: {} as Record<string, number>,
      byPriority: {} as Record<string, number>
    };
    
    classifiedSuppliers.forEach(supplier => {
      // Thống kê theo loại
      const type = supplier.loaiNCC || 'CHUA_PHAN_LOAI';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      // Thống kê theo khu vực
      const region = supplier.khuVuc || 'CHUA_XAC_DINH';
      stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;
      
      // Thống kê theo mức độ ưu tiên
      const priority = supplier.mucDoUuTien || 'THAP';
      stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
    });
    
    return stats;
  }, [classifiedSuppliers]);

  return {
    classifiedSuppliers,
    loading,
    error,
    classifySuppliers,
    importFromExcel,
    filterByType,
    filterByProductGroup,
    getClassificationStats,
    validateSupplier: SupplierImportHelper.validateSupplier
  };
};
