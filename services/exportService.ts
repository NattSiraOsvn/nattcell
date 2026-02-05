
import * as XLSX from 'xlsx';

export type ExportFormat = 'PDF' | 'XML' | 'EXCEL';

export class ExportEngine {
  /**
   * Xuất báo cáo NCC đa tầng (Workbook 4 Sheet)
   */
  static async toExcel(data: any[], fileName: string) {
    const workbook = XLSX.utils.book_new();
    
    // Sheet 1: TỔNG QUAN (Overview Metrics)
    const summaryData = [
      { 'Chỉ số': 'Tổng số Node đối tác', 'Giá trị': data.length },
      { 'Chỉ số': 'Node Nước Ngoài', 'Giá trị': data.filter(s => s.loaiNCC === 'NUOC_NGOAI').length },
      { 'Chỉ số': 'Node Tiềm Năng', 'Giá trị': data.filter(s => s.coTienNang).length },
      { 'Chỉ số': 'Tổng giá trị giao dịch', 'Giá trị': data.reduce((s, i) => s + (i.transactionAmount || 0), 0).toLocaleString() + ' đ' }
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, wsSummary, '1. TỔNG QUAN');

    // Sheet 2: CHI TIẾT NODE (Node Details)
    const wsDetails = XLSX.utils.json_to_sheet(data.map(s => ({
      'Mã Node': s.maNhaCungCap,
      'Tên Đối Tác': s.tenNhaCungCap,
      'Loại': s.loaiNCC === 'NUOC_NGOAI' ? 'Quốc tế' : 'Trong nước',
      'Nhóm hàng': s.nhomHangChinh?.join(', '),
      'Quy mô': s.quyMo,
      'Xu hướng': s.xuHuong,
      'Sentiment': `${((s.sentimentScore || 0) * 100).toFixed(0)}%`,
      'Doanh số (Net)': s.transactionAmount,
      'Email': s.email || 'N/A'
    })));
    XLSX.utils.book_append_sheet(workbook, wsDetails, '2. CHI TIẾT NODE');

    // Sheet 3: PHÂN TÍCH NHÓM (Group Analysis)
    const groupDist = data.reduce((acc: any, s) => {
       s.nhomHangChinh?.forEach((g: string) => {
          acc[g] = (acc[g] || 0) + 1;
       });
       return acc;
    }, {});
    const groupData = Object.entries(groupDist).map(([key, val]) => ({ 'Ngành hàng': key, 'Số lượng Node': val }));
    const wsGroup = XLSX.utils.json_to_sheet(groupData);
    XLSX.utils.book_append_sheet(workbook, wsGroup, '3. PHÂN TÍCH NHÓM');

    // Sheet 4: RỦI RO & TIỀM NĂNG (Audit Insight)
    const potentialData = data.filter(s => s.coTienNang || (s.sentimentScore && s.sentimentScore < 0.5)).map(s => ({
      'Đối tác': s.tenNhaCungCap,
      'Trạng thái': s.coTienNang ? 'TIỀM NĂNG' : 'RỦI RO',
      'Điểm': s.diemDanhGia,
      'Ghi chú': s.sentimentScore < 0.5 ? 'Sentiment thấp - Cần rà soát' : 'Quy mô lớn - Ưu tiên hợp tác'
    }));
    const wsAudit = XLSX.utils.json_to_sheet(potentialData);
    XLSX.utils.book_append_sheet(workbook, wsAudit, '4. RỦI RO & TIỀM NĂNG');

    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    return this.generateFileHash(fileName);
  }

  static toPdf() {
    window.print();
  }

  static async toXml(data: any, fileName: string, rootElement: string = 'NattOS_Shard') {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement} version="2.0">\n`;
    xml += JSON.stringify(data); 
    xml += `</${rootElement}>`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xml`;
    link.click();
  }

  private static generateFileHash(name: string): string {
    return '0x' + Math.random().toString(16).slice(2, 10).toUpperCase();
  }
}
