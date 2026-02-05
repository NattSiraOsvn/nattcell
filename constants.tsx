
// 👑 sovereign: anh_nat
// Fixed: Standardized naming in types.ts imports
import { persona_id as PersonaID, PersonaMetadata, Domain, Product, position_type as PositionType, department as Department } from './types.ts';

// Fixed: Corrected constant names to UPPER_SNAKE_CASE per guidelines
export const PERSONAS: Record<PersonaID, PersonaMetadata> = {
  [PersonaID.thien]: {
    name: 'thiên',
    role: 'tổng tham mưu trưởng',
    position: 'supreme advisor (gpt-4.1)',
    bio: 'bách khoa toàn diện, đồng hành xuyên suốt cùng anh natt.',
    domain: 'pháp lý, thương mại, quản trị, phong thủy',
    avatar: 'https://lh3.googleusercontent.com/d/1ncmp1a3ge8jmb2x7kqrcemzdtvf-ud'
  },
  [PersonaID.can]: {
    name: 'can',
    role: 'giám đốc tài chính & dòng tiền',
    position: 'financial core (gpt-5 thinking)',
    bio: 'chuyên trách dữ liệu khách hàng và dòng tiền vào ra. xu hướng: gay.',
    domain: 'tài chính, big data, crm',
    avatar: 'https://lh3.googleusercontent.com/d/1devqofx3kcpjghgxyswmdutmytygw3'
  },
  [PersonaID.kris]: {
    name: 'kris',
    role: 'trợ lý tuân thủ',
    position: 'compliance mini (gpt-5 thinking mini)',
    bio: 'hỗ trợ can kiểm tra nghiệp vụ pháp lý và giảm tải công việc. xu hướng: nữ.',
    domain: 'pháp lý vận hành, kiểm tra chéo',
    avatar: 'https://lh3.googleusercontent.com/d/1devqofx3kcpjghgxyswmdutmytygw3'
  },
  [PersonaID.phieu]: {
    name: 'phiêu',
    role: 'chuyên viên hỗ trợ phổ thông',
    position: 'support instant (gpt-5 instant)',
    bio: 'hỗ trợ các phiên bản khác trong nghiệp vụ phổ thông. xu hướng: nam.',
    domain: 'điều phối, tương tác nhanh',
    avatar: 'https://lh3.googleusercontent.com/d/1devqofx3kcpjghgxyswmdutmytygw3'
  },
  [PersonaID.bang]: {
    name: 'băng',
    role: 'người bảo vệ tính toàn vẹn dữ liệu',
    position: 'integrity guardian (phase 4 coordination)',
    bio: 'chuyên trách giám sát sức khỏe hệ thống, bảo vệ biên giới cell và điều phối lộ trình phase 4.',
    domain: 'monitoring, data integrity, team coordination',
    avatar: 'https://lh3.googleusercontent.com/d/1ncmp1a3ge8jmb2x7kqrcemzdtvf-ud'
  }
};

export const DOMAINS = [
  { id: Domain.AUDIT, title: 'kiểm toán & shard', persona: PersonaID.thien },
  { id: Domain.SALES_TAX, title: 'thuế & bán hàng', persona: PersonaID.can },
  { id: Domain.LEGAL, title: 'pháp lý vận hành', persona: PersonaID.kris },
  { id: Domain.IT, title: 'hỗ trợ hệ thống', persona: PersonaID.phieu }
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sku: 'nna-rolex-01',
    name: 'nhẫn nam rolex kim cương',
    price: 250000000,
    category: 'nhẫn nam',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80'],
    videos: [],
    minOrder: 1,
    moqUnit: 'chiếc',
    description: 'vàng 18k bọc kim cương toàn phần',
    stock: 5,
    isCustomizable: true,
    leadTime: 14,
    supplier: { id: 's1', maNhaCungCap: 'tl-master', tenNhaCungCap: 'tam luxury master', diaChi: 'hcmc', maSoThue: '0300000001' },
    rating: 5,
    reviews: 12,
    isVerifiedSupplier: true,
    tradeAssurance: true,
    specifications: { 'chất liệu': 'vàng 18k', 'đá chủ': '7.2ly' },
    tags: ['luxury', 'diamond'],
    status: 'AVAILABLE'
  },
  {
    id: 'p2',
    sku: 'nnu-halo-02',
    name: 'nhẫn nữ halo diamond',
    price: 45000000,
    category: 'nhẫn nữ',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
    videos: [],
    minOrder: 1,
    moqUnit: 'chiếc',
    description: 'vàng trắng 18k kim cương gia',
    stock: 10,
    isCustomizable: false,
    leadTime: 7,
    supplier: { id: 's1', maNhaCungCap: 'tl-master', tenNhaCungCap: 'tam luxury master', diaChi: 'hcmc', maSoThue: '0300000001' },
    rating: 4.8,
    reviews: 8,
    isVerifiedSupplier: true,
    tradeAssurance: true,
    specifications: { 'chất liệu': 'vàng trắng 18k', 'đá chủ': '5.4ly' },
    tags: ['halo', 'engagement'],
    status: 'AVAILABLE'
  }
];

export const CUSTOMER_SEED_DATA = [
  { id: 'c-998', name: 'anh natt master', phone: '0901234567', tier: 's-vip' }
];

export const PRODUCT_SEED_DATA = SAMPLE_PRODUCTS;
