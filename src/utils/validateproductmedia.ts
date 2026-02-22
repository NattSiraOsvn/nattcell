export interface ProductMedia { url: string; type?: string; isPrimary?: boolean; }
export function getPrimaryMedia(mediaList: ProductMedia[]): ProductMedia | undefined {
  return mediaList?.find(m => m.isPrimary) || mediaList?.[0];
}
