
import { ShowroomMedia } from '@/types/showroom';

export const validateProductMedia = (mediaList: ShowroomMedia[]): boolean => {
  return mediaList && mediaList.length > 0;
};

export const getPrimaryMedia = (mediaList: ShowroomMedia[]): ShowroomMedia | undefined => {
  return mediaList?.find(m => m.isPrimary) || mediaList?.[0];
};
