
import { Product } from '../shared-kernel/shared.types';

export const PRODUCT_SEED_DATA: Product[] = [
  {
    id: 'p1',
    sku: 'NNA-ROLEX-01',
    name: 'Nhẫn Nam Rolex Kim Cương',
    price: 250000000,
    category: 'Nhẫn Nam',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
    stock: 5
  }
];

export const CUSTOMER_SEED_DATA = [
  { id: 'C-998', name: 'ANH NATT MASTER', phone: '0901234567', tier: 'S-VIP' }
];
