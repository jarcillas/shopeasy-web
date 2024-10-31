export interface ShoplistItem {
  id: number;
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
  id: number;
  name: string;
  description?: string;
  items: ShoplistItem[];
  created?: number;
  updated?: number;
}
