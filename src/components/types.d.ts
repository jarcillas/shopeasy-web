export interface ShoplistItem {
  id: number;
  qty: number;
  unitPrice: number;
  unit?: string;
  title: string;
}

export interface ShoplistItemInput {
  qty: number | null;
  unitPrice: number | null;
  unit: string;
  title: string;
}

export interface Shoplist {
  id: number;
  title: string;
  items: ShoplistItem[];
}
