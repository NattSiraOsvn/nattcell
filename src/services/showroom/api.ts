
import { ShowroomProduct } from '@/types/showroom';

export class ShowroomService {
  private static instance: ShowroomService;

  static getInstance() {
    if (!ShowroomService.instance) ShowroomService.instance = new ShowroomService();
    return ShowroomService.instance;
  }

  async getProduct(sku: string): Promise<ShowroomProduct> {
    // Mock latency
    await new Promise(r => setTimeout(r, 600));

    return {
      id: 'prod-sr-001',
      sku: sku || 'NNA-ROLEX-OMEGA',
      name: 'Nhẫn Nam Rolex Custom Diamond (Omega Edition)',
      price: 450000000,
      currency: 'VND',
      status: 'AVAILABLE',
      description: 'Phiên bản giới hạn chế tác thủ công bởi nghệ nhân Master. Vàng 18K bọc kim cương toàn phần, hột chủ 7.2ly nước D.',
      media: [
        { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
        { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80' }
      ],
      specs: [
        { key: 'Chất liệu', value: 'Vàng 18K (Au750)', isHighlight: true },
        { key: 'Đá chủ', value: 'Kim cương GIA 7.2mm' },
        { key: 'Trọng lượng', value: '3.5 Chỉ' },
        { key: 'Ni tay', value: '18 mm' }
      ],
      branch: {
        id: 'br-hcm',
        name: 'Showroom HCM Master',
        address: 'Quận 5, TP.HCM',
        manager: 'Trần Hoài Phúc',
        status: 'OPEN'
      },
      trustScore: 98,
      vaultLocation: 'Két A-01 (Tầng 2)'
    };
  }

  async getRelatedProducts(): Promise<ShowroomProduct[]> {
    return [
      {
        id: 'prod-sr-002',
        sku: 'NNU-HALO-QUEEN',
        name: 'Nhẫn Nữ Halo Queen',
        price: 85000000,
        currency: 'VND',
        status: 'AVAILABLE',
        description: 'Vẻ đẹp quý phái.',
        media: [{ type: 'IMAGE', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80', isPrimary: true }],
        specs: [],
        branch: { id: 'br-hcm', name: 'HCM', address: '', manager: '', status: 'OPEN' },
        trustScore: 95
      },
      {
        id: 'prod-sr-003',
        sku: 'BT-DIAMOND-03',
        name: 'Bông Tai Solitaire',
        price: 32000000,
        currency: 'VND',
        status: 'AVAILABLE',
        description: 'Đơn giản tinh tế.',
        media: [{ type: 'IMAGE', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', isPrimary: true }],
        specs: [],
        branch: { id: 'br-hcm', name: 'HCM', address: '', manager: '', status: 'OPEN' },
        trustScore: 92
      }
    ];
  }
}

export const ShowroomAPI = ShowroomService.getInstance();
