
import { Certification, PersonaID } from '../../types.ts';
import { ShardingService } from '../blockchainService.ts';
import { NotifyBus } from '../notificationService.ts';

class CertificationService {
  private static instance: CertificationService;
  private certs: Certification[] = [];
  private sequence: number = 42;
  private renewalReminderDays = 30;

  constructor() {
    this.seedInitialData();
    this.startSimulationCron();
  }

  static getInstance() {
    if (!CertificationService.instance) CertificationService.instance = new CertificationService();
    return CertificationService.instance;
  }

  private seedInitialData() {
    const now = Date.now();
    this.certs = [
      {
        id: 'cert-001',
        certificateNumber: 'CERT-2025-000042',
        title: 'GIA Diamond Report - Natural Diamond',
        description: 'Chứng chỉ giám định kim cương thiên nhiên từ GIA.',
        type: 'QUALITY',
        issuingBody: 'Gemological Institute of America',
        issueDate: now - (90 * 86400000),
        expiryDate: now + (15 * 86400000), // Sắp hết hạn trong 15 ngày
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        createdAt: now - (90 * 86400000),
        updatedAt: now - (90 * 86400000)
      }
    ];
  }

  private startSimulationCron() {
    // Giả lập Cron Job chạy định kỳ để kiểm tra hết hạn (daily 8 AM)
    setInterval(() => {
      this.checkExpiringCertifications();
    }, 60000); // Check mỗi phút cho demo
  }

  private async checkExpiringCertifications() {
    const now = Date.now();
    let hasChanges = false;

    this.certs = this.certs.map(cert => {
      // Fix: Use type assertion as string to resolve "unintentional comparison" error caused by incomplete union inference
      if ((cert.status as string) === 'ARCHIVED' || (cert.status as string) === 'EXPIRED') return cert;

      const daysToExpiry = cert.expiryDate 
        ? Math.ceil((cert.expiryDate - now) / 86400000) 
        : Infinity;

      // Logic Cảnh báo
      if (daysToExpiry <= this.renewalReminderDays && daysToExpiry > 0) {
        NotifyBus.push({
          type: 'RISK',
          title: 'CHỨNG CHỈ SẮP HẾT HẠN',
          content: `Chứng chỉ ${cert.certificateNumber} (${cert.title}) còn ${daysToExpiry} ngày. Vui lòng làm mới.`,
          persona: PersonaID.KRIS,
          priority: 'HIGH'
        });
      }

      // Logic Quá hạn
      if (cert.expiryDate && cert.expiryDate < now && cert.status !== 'EXPIRED') {
        hasChanges = true;
        NotifyBus.push({
          type: 'RISK',
          title: 'CHỨNG CHỈ ĐÃ HẾT HẠN',
          content: `Chứng chỉ ${cert.certificateNumber} đã quá hạn vào ngày ${new Date(cert.expiryDate).toLocaleDateString()}.`,
          persona: PersonaID.KRIS,
          priority: 'HIGH'
        });
        return { ...cert, status: 'EXPIRED', updatedAt: now };
      }

      return cert;
    });
  }

  async getCerts() { return [...this.certs]; }

  async createCertification(data: Omit<Certification, 'id' | 'certificateNumber' | 'createdAt' | 'updatedAt'>) {
    const now = Date.now();
    this.sequence++;
    const certNumber = `CERT-${new Date().getFullYear()}-${this.sequence.toString().padStart(6, '0')}`;
    
    const newCert: Certification = {
      ...data,
      id: `CERT-${now}`,
      certificateNumber: certNumber,
      createdAt: now,
      updatedAt: now,
      status: data.status || 'PENDING'
    };

    this.certs.unshift(newCert);
    return newCert;
  }

  async renewCertification(certId: string, renewalData: { issueDate: number; expiryDate: number }) {
    const now = Date.now();
    const oldCert = this.certs.find(c => c.id === certId);
    if (!oldCert) throw new Error("Certification not found");

    // 1. Tạo bản gia hạn mới
    const renewed = await this.createCertification({
      ...oldCert,
      issueDate: renewalData.issueDate,
      expiryDate: renewalData.expiryDate,
      status: 'PENDING',
      verificationStatus: 'PENDING',
      renewalOf: oldCert.id
    });

    // 2. Lưu trữ bản cũ
    this.certs = this.certs.map(c => 
      c.id === certId ? { ...c, status: 'ARCHIVED', replacedBy: renewed.id, updatedAt: now } : c
    );

    return renewed;
  }

  async getStatistics() {
    return {
      total: this.certs.length,
      active: this.certs.filter(c => c.status === 'ACTIVE').length,
      expiringSoon: this.certs.filter(c => {
          if (!c.expiryDate || c.status !== 'ACTIVE') return false;
          const diff = c.expiryDate - Date.now();
          return diff > 0 && diff < 30 * 86400000;
      }).length,
      expired: this.certs.filter(c => c.status === 'EXPIRED').length,
      pendingVerification: this.certs.filter(c => c.verificationStatus === 'PENDING').length,
      activePercent: (this.certs.filter(c => c.status === 'ACTIVE').length / (this.certs.length || 1)) * 100
    };
  }
}

export const CertificationProvider = CertificationService.getInstance();
