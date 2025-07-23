import { create } from 'zustand';
import { v4 } from 'uuid';
import { Shoplist, ShoplistItem } from './components/types';
import { supabase } from './lib/supabaseClient';
import { devtools } from 'zustand/middleware';

type State = {
  shoplists: Shoplist[];
};

type Action = {
  setShoplists: (newShoplists: Shoplist[]) => void;
  addShoplist: (newShoplist: Shoplist) => void;
  deleteShoplist: (shoplistId: Shoplist['id']) => void;
  editShoplist: (shoplistId: Shoplist['id'], updatedShoplist: Shoplist) => void;
  addShoplistItem: (
    shoplistId: Shoplist['id'],
    newShoplistItem: Omit<ShoplistItem, 'id'>
  ) => void;
  deleteShoplistItem: (
    shoplistId: Shoplist['id'],
    shoplistItemId: ShoplistItem['id']
  ) => void;
  editShoplistItem: (
    shoplistId: Shoplist['id'],
    shoplistItemId: ShoplistItem['id'],
    updatedShoplistItem: ShoplistItem
  ) => void;
};

// helper function for updating a shoplist
const updateShoplist = (
  state: State,
  shoplistId: Shoplist['id'],
  updatedShoplist: Shoplist
) => {
  const shoplists = [...state.shoplists];
  const updatedShoplistIdx = shoplists.findIndex(
    (shoplist) => shoplist.id === shoplistId
  );
  shoplists.splice(updatedShoplistIdx, 1, updatedShoplist);
  return {
    ...state,
    shoplists,
  };
};

export const useStore = create<
  State &
    Action & {
      lastSaved: number | null;
      setLastSaved: (timestamp: number) => void;
      saveShoplistToSupabase: (shoplistId: string) => Promise<void>;
      fetchShoplists: (userId: string) => Promise<void>;
    }
>()(
  devtools((set, get) => ({
    shoplists: [],
    lastSaved: null,

    setShoplists: (newShoplists) => set({ shoplists: newShoplists }),
    setLastSaved: (timestamp) => set({ lastSaved: timestamp }),

    fetchShoplists: async (userId: string) => {
      const { data, error } = await supabase
        .from('shoplists')
        .select('*')
        .eq('user_id', userId)
        .order('created', { ascending: true });
      if (!error && data) {
        set({ shoplists: data });
      }
    },

    // All actions below are local only
    addShoplist: (newShoplist) =>
      set((state) => ({
        shoplists: [...state.shoplists, newShoplist],
      })),
    deleteShoplist: (shoplistId) =>
      set((state) => ({
        shoplists: state.shoplists.filter((s) => s.id !== shoplistId),
      })),
    editShoplist: (shoplistId, updatedShoplist) =>
      set((state) => ({
        shoplists: state.shoplists.map((s) =>
          s.id === shoplistId ? updatedShoplist : s
        ),
      })),
    addShoplistItem: (shoplistId, newShoplistItem) =>
      set((state) => {
        const shoplist = state.shoplists.find((s) => s.id === shoplistId);
        if (!shoplist) return {};
        const updatedShoplist = {
          ...shoplist,
          items: [...shoplist.items, { id: v4(), ...newShoplistItem }],
        };
        return {
          shoplists: state.shoplists.map((s) =>
            s.id === shoplistId ? updatedShoplist : s
          ),
        };
      }),
    deleteShoplistItem: (shoplistId, shoplistItemId) =>
      set((state) => {
        const shoplist = state.shoplists.find((s) => s.id === shoplistId);
        if (!shoplist) return {};
        const updatedShoplist = {
          ...shoplist,
          items: shoplist.items.filter((item) => item.id !== shoplistItemId),
        };
        return {
          shoplists: state.shoplists.map((s) =>
            s.id === shoplistId ? updatedShoplist : s
          ),
        };
      }),
    editShoplistItem: (shoplistId, shoplistItemId, updatedShoplistItem) =>
      set((state) => {
        const shoplist = state.shoplists.find((s) => s.id === shoplistId);
        if (!shoplist) return {};
        const updatedShoplist = {
          ...shoplist,
          items: shoplist.items.map((item) =>
            item.id === shoplistItemId ? updatedShoplistItem : item
          ),
        };
        return {
          shoplists: state.shoplists.map((s) =>
            s.id === shoplistId ? updatedShoplist : s
          ),
        };
      }),

    // Save to Supabase only when user clicks Save
    saveShoplistToSupabase: async (shoplistId) => {
      const state = get();
      const shoplist = state.shoplists.find((s) => s.id === shoplistId);
      if (!shoplist) return;
      const { data, error } = await supabase
        .from('shoplists')
        .update({
          ...shoplist,
          updated: Math.floor(Date.now() / 1000),
        })
        .eq('id', shoplistId)
        .select();
      if (!error && data) {
        set({
          shoplists: state.shoplists.map((s) =>
            s.id === shoplistId ? data[0] : s
          ),
          lastSaved: Date.now(),
        });
      }
    },
  }))
);
