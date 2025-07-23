import { create } from 'zustand';
import { v4 } from 'uuid';
import { Shoplist, ShoplistItem } from './components/types';
import { supabase } from './lib/supabaseClient';
import { devtools } from 'zustand/middleware';

type State = {
  shoplists: Shoplist[];
  lastSaved: number | null;
};

type Action = {
  setShoplists: (newShoplists: Shoplist[]) => void;
  addShoplist: (newShoplist: Shoplist) => Promise<void>;
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
  setLastSaved: (timestamp: number) => void;
  saveShoplistToSupabase: (shoplistId: string) => Promise<void>;
  fetchShoplists: (userId: string) => Promise<void>;
};

export const useStore = create<State & Action>()(
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

    addShoplist: async (newShoplist) => {
      const createdShoplist = {
        ...newShoplist,
        created: Math.floor(new Date().getTime() / 1000),
        updated: Math.floor(new Date().getTime() / 1000),
      };
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data, error } = await supabase
        .from('shoplists')
        .insert([{ ...createdShoplist, user_id: user.id }])
        .select();
      if (!error && data) {
        set((state) => ({ shoplists: [...state.shoplists, data[0]] }));
      }
    },
    deleteShoplist: async (shoplistId) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data, error } = await supabase
        .from('shoplists')
        .delete()
        .eq('id', shoplistId)
        .eq('user_id', user.id);
      if (!error && data) {
        set((state) => ({
          shoplists: state.shoplists.filter((s) => s.id !== shoplistId),
        }));
      }
    },
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
