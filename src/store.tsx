import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Shoplist } from './components/types';
import { shoplists } from './data.json';

type State = {
  shoplists: Shoplist[];
};

type Action = {
  setShoplists: (newShoplists: Shoplist[]) => void;
  addShoplist: (newShoplist: Shoplist) => void;
  deleteShoplist: (shoplistId: Shoplist['id']) => void;
  editShoplist: (shoplistId: Shoplist['id'], updatedShoplist: Shoplist) => void;
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
        const shoplists = [...state.shoplists];
        const updatedShoplistIdx = shoplists.findIndex(
          (shoplist) => shoplist.id === shoplistId
        );
        shoplists.splice(updatedShoplistIdx, 1, updatedShoplist);
        return {
          ...state,
          shoplists,
        };
      }),
  }))
);
