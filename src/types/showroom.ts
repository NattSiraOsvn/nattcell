
export interface ShowroomMedia {
  type: 'IMAGE' | 'VIDEO' | '3D_MODEL';
  url: string;
  thumbnail?: string;
  isPrimary?: boolean;
}

export interface ShowroomBranch {
  id: string;
  name: string;
  address: string;
  manager: string;
  status: 'OPEN' | 'BUSY' | 'CLOSED';
}

export interface ShowroomSpec {
  key: string;
  value: string;
  isHighlight?: boolean;
}

export interface ShowroomProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  description: string;
  media: ShowroomMedia[];
  specs: ShowroomSpec[];
  branch: ShowroomBranch;
  trustScore: number;
  vaultLocation?: string;
}
