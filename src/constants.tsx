import { PersonaID, PersonaMetadata, Domain, Product, PositionType, Department } from './types';

export const PERSONAS: Record<PersonaID, PersonaMetadata> = {
  [PersonaID.THIEN]: {
    name: 'Thiên',
    role: 'Tổng tham mưu trưởng',
    position: 'Supreme Advisor (GPT-4.1)',
    bio: 'Bách khoa toàn diện, đồng hành xuyên suốt cùng Anh Natt.',
    domain: 'Pháp lý, Thương mại, Quản trị, Phong thủy',
    avatar: 'https://lh3.googleusercontent.com/d/1nCMP1A3Ge8JMb2X7K6fQrcemZDTvF-ud'
  },
  [PersonaID.CAN]: {
    name: 'Can',
    role: 'Giám đốc Tài chính & Dòng tiền',
    position: 'Financial Core (GPT-5 Thinking)',
    bio: 'Chuyên trách dữ liệu khách hàng và dòng tiền vào ra. Xu hướng: Gay.',
    domain: 'Tài chính, Big Data, CRM',
    avatar: 'https://lh3.googleusercontent.com/d/1DevqOFX3Kc4pJGHgXysWmdU8tMYTigw3'
  },
  [PersonaID.KRIS]: {
    name: 'Kris',
    role: 'Trợ lý Tuân thủ',
    position: 'Compliance Mini (GPT-5 Thinking Mini)',
    bio: 'Hỗ trợ Can kiểm tra nghiệp vụ pháp lý và giảm tải công việc. Xu hướng: Nữ.',
    domain: 'Pháp lý vận hành, Kiểm tra chéo',
    avatar: 'https://lh3.googleusercontent.com/d/1DevqOFX3Kc4pJGHgXysWmdU8tMYTigw3'
  },
  [PersonaID.PHIEU]: {
    name: 'Phiêu',
    role: 'Chuyên viên Hỗ trợ Phổ thông',
    position: 'Support Instant (GPT-5 Instant)',
    bio: 'Hỗ trợ các phiên bản khác trong nghiệp vụ phổ thông. Xu hướng: Nam.',
    domain: 'Điều phối, Tương tác nhanh',
    avatar: 'https://lh3.googleusercontent.com/d/1DevqOFX3Kc4pJGHgXysWmdU8tMYTigw3'
  },
  [PersonaID.NA]: { name: 'Na', role: 'Trợ lý', position: 'Assistant', bio: '', domain: '', avatar: '' },
  [PersonaID.BOI_BOI]: { name: 'Bối Bối', role: 'Trợ lý', position: 'Assistant', bio: '', domain: '', avatar: '' },
  [PersonaID.KIM]: { name: 'Kim', role: 'Developer', position: 'Dev', bio: '', domain: '', avatar: '' },
  [PersonaID.SYSTEM]: { name: 'System', role: 'Hệ thống', position: 'System', bio: '', domain: '', avatar: '' },
  [PersonaID.BANG]: {
    name: 'Băng',
    role: 'Người Bảo vệ Tính Toàn vẹn Dữ liệu',
    position: 'Integrity Guardian (Phase 4 Coordination)',
    bio: 'Chuyên trách giám sát sức khỏe hệ thống, bảo vệ biên giới Cell và điều phối lộ trình Phase 4.',
    domain: 'Monitoring, Data Integrity, Team Coordination',
    avatar: 'https://lh3.googleusercontent.com/d/1nCMP1A3Ge8JMb2X7K6fQrcemZDTvF-ud'
  }
};

export const DOMAINS = [
  { id: Domain.AUDIT, title: 'Kiểm toán & Shard', persona: PersonaID.THIEN },
  { id: Domain.SALES_TAX, title: 'Thuế & Bán hàng', persona: PersonaID.CAN },
  { id: Domain.LEGAL, title: 'Pháp lý vận hành', persona: PersonaID.KRIS },
  { id: Domain.IT, title: 'Hỗ trợ Hệ thống', persona: PersonaID.PHIEU }
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sku: 'NNA-ROLEX-01',
    name: 'Nhẫn Nam Rolex Kim Cương',
    price: 250000000,
    category: 'Nhẫn Nam',
    images: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80'],
    videos: [],
    minOrder: 1,
    moqUnit: 'chiếc',
    description: 'Vàng 18K bọc kim cương toàn phần',
    stock: 5,
    isCustomizable: true,
    leadTime: 14,
    supplier: { id: 's1', maNhaCungCap: 'TL-ADMIN', tenNhaCungCap: 'Tam Luxury Master', diaChi: 'HCMC', maSoThue: '0300000001' },
    rating: 5,
    reviews: 12,
    isVerifiedSupplier: true,
    tradeAssurance: true,
    specifications: { 'Chất liệu': 'Vàng 18K', 'Đá chủ': '7.2ly' },
    tags: ['luxury', 'diamond'],
    status: 'AVAILABLE'
  },
  {
    id: 'p2',
    sku: 'NNU-HALO-02',
    name: 'Nhẫn Nữ Halo Diamond',
    price: 45000000,
    category: 'Nhẫn Nữ',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
    videos: [],
    minOrder: 1,
    moqUnit: 'chiếc',
    description: 'Vàng trắng 18K kim cương GIA',
    stock: 10,
    isCustomizable: false,
    leadTime: 7,
    supplier: { id: 's1', maNhaCungCap: 'TL-ADMIN', tenNhaCungCap: 'Tam Luxury Master', diaChi: 'HCMC', maSoThue: '0300000001' },
    rating: 4.8,
    reviews: 8,
    isVerifiedSupplier: true,
    tradeAssurance: true,
    specifications: { 'Chất liệu': 'Vàng trắng 18K', 'Đá chủ': '5.4ly' },
    tags: ['halo', 'engagement'],
    status: 'AVAILABLE'
  }
];

export const CUSTOMER_SEED_DATA = [
  { id: 'C-998', name: 'ANH NATT ADMIN', phone: '0901234567', tier: 'S-VIP' }
];

export const PRODUCT_SEED_DATA = SAMPLE_PRODUCTS;