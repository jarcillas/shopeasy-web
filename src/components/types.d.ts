export interface ShoplistItem {
  id: string;
  qty: number;
  unitPrice: number;
  unit?: string;
  name: string;
  done?: boolean;
  created?: number;
  updated?: number;
}

export interface ShoplistItemInput {
  qty?: number;
  unitPrice?: number;
  unit?: string;
  name?: string;
}

export interface Shoplist {
  id: string;
  name: string;
  description?: string;
  items: ShoplistItem[];
  created?: number;
  updated?: number;
}

// Utility to make one property optional
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
