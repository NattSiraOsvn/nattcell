
import { MarketplaceProduct } from '../types';

class MarketplaceProductService {
  private static instance: MarketplaceProductService;
  private products: MarketplaceProduct[] = [
    {
      id: 'p-001',
      sku: 'NNA-ROLEX-SUPREME',
      name: 'Nhẫn Nam Rolex Kim Cương Custom (OMEGA)',
      shortDescription: 'Vàng 18K bọc kim cương toàn phần, hột chủ 7.2ly.',
      fullDescription: 'Phiên bản giới hạn chế tác thủ công bởi các nghệ nhân Tâm Luxury. Sử dụng vàng AU750 và kim cương nước D độ sạch IF. Tích hợp băm Shard định danh tài sản.',
      basePrice: 450000000,
      salePrice: 425000000,
      compareAtPrice: 480000000,
      discountPercent: 5,
      discountEndsAt: Date.now() + 86400000,
      leadTime: 14,
      moqUnit: 'chiếc',
      stock: {
        available: 2,
        reserved: 1,
        incoming: 0,
        location: 'KHO TỔNG HCM',
        warehouseId: 'WH-001',
        lastUpdated: Date.now()
      },
      media: {
        images: [
          { id: 'img1', url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80', type: 'MAIN', width: 1920, height: 1080, size: 500000, isHD: true },
          { id: 'img2', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', type: 'GALLERY', width: 1920, height: 1080, size: 450000, isHD: true },
          { id: 'img3', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', type: 'GALLERY', width: 1920, height: 1080, size: 480000, isHD: true }
        ],
        video: {
          id: 'vid1',
          url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
          duration: 15,
          quality: '4K',
          size: 15000000
        }
      },
      category: { id: 'cat-01', name: 'Nhẫn Nam Rolex' },
      tags: ['luxury', 'rolex', 'diamond'],
      specifications: { 'Chất liệu': 'Vàng 18K', 'Đá chủ': '7.2ly GIA' },
      status: 'ACTIVE',
      badges: ['NEW', 'HOT'],
      rating: 5,
      reviewCount: 42,
      slug: 'nhan-nam-rolex-diamond-supreme',
      metaTitle: 'Nhẫn Nam Rolex Diamond Supreme - Tâm Luxury',
      metaDescription: 'Nhẫn nam rolex kim cương thiên nhiên cao cấp phiên bản Omega'
    }
  ];

  static getInstance() {
    if (!MarketplaceProductService.instance) MarketplaceProductService.instance = new MarketplaceProductService();
    return MarketplaceProductService.instance;
  }

  async getMarketplaceProducts(filters: any): Promise<MarketplaceProduct[]> {
    // Giả lập filter delay
    await new Promise(r => setTimeout(r, 500));
    return this.products;
  }

  async getHotDeals(options: { limit: number }): Promise<MarketplaceProduct[]> {
    return this.products.filter(p => p.discountPercent && p.discountPercent > 0);
  }

  subscribeToStockUpdates(callback: (update: { productId: string, newStock: number }) => void) {
    const interval = setInterval(() => {
        callback({ productId: 'p-001', newStock: Math.max(0, Math.floor(Math.random() * 5)) });
    }, 15000);
    return () => clearInterval(interval);
  }
}

export const ProductProvider = MarketplaceProductService.getInstance();
