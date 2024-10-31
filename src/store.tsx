import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Shoplist, ShoplistItem } from './components/types';
import { shoplists } from './data.json';

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
    newShoplistItem: ShoplistItem
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

export const useStore = create<State & Action>()(
  devtools((set) => ({
    // State
    shoplists: shoplists,

    // Actions
    setShoplists: (newShoplists) =>
      set((state: State) => {
        console.log(`Setting shoplists to:`);
        console.log(newShoplists);
        return { ...state, shoplists: newShoplists };
      }),
    addShoplist: (newShoplist) =>
      set((state: State) => {
        const createdShoplist = {
          ...newShoplist,
          created: Math.floor(new Date().getTime() / 1000),
        };
        return {
          ...state,
          shoplists: [...state.shoplists, createdShoplist],
        };
      }),
    deleteShoplist: (shoplistId) =>
      set((state: State) => {
        const shoplists = [...state.shoplists];
        const deletedShoplistIdx = shoplists.findIndex(
          (shoplist) => shoplist.id === shoplistId
        );
        shoplists.splice(deletedShoplistIdx, 1);
        return {
          ...state,
          shoplists,
        };
      }),
    editShoplist: (shoplistId, updatedShoplist) =>
      set((state: State) => {
        console.log(`Updating shoplist ${shoplistId} to:`);
        console.log(updatedShoplist);
        return updateShoplist(state, shoplistId, updatedShoplist);
      }),
    addShoplistItem: (shoplistId, newShoplistItem) =>
      set((state: State) => {
        console.log('Adding shoplist item:');
        console.log(newShoplistItem);
        const shoplist = state.shoplists?.find((sl) => sl.id === shoplistId);
        if (!shoplist) return state;
        const updatedShoplist: Shoplist = {
          ...shoplist,
          items: [...shoplist.items, newShoplistItem],
        };
        return updateShoplist(state, shoplistId, updatedShoplist);
      }),
    deleteShoplistItem: (shoplistId, shoplistItemId) =>
      set((state: State) => {
        console.log(
          `Deleting shoplist item ${shoplistItemId} from shoplist ${shoplistId}`
        );
        const shoplist = state.shoplists?.find((sl) => sl.id === shoplistId);
        if (!shoplist) return state;
        const deletedShoplistItemIdx = shoplist.items.findIndex(
          (shoplistItem) => shoplistItem.id === shoplistItemId
        );
        shoplist.items.splice(deletedShoplistItemIdx, 1);
        return updateShoplist(state, shoplistId, shoplist);
      }),
    editShoplistItem: (shoplistId, shoplistItemId, updatedShoplistItem) =>
      set((state: State) => {
        console.log('Updating shoplist item:');
        console.log(updatedShoplistItem);
        const shoplist = state.shoplists?.find((sl) => sl.id === shoplistId);
        if (!shoplist) return state;
        const updatedShoplistItemIdx = shoplist.items?.findIndex(
          (shoplistItem) => shoplistItem.id === shoplistItemId
        );
        shoplist.items.splice(updatedShoplistItemIdx, 1, updatedShoplistItem);
        return updateShoplist(state, shoplistId, shoplist);
      }),
  }))
);
