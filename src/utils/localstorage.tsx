import { ShoplistItem } from '../components/types';

const saveShoplist = (shoplist: ShoplistItem[]) => {
  const prevShoplistsJson = localStorage.getItem(`shoplists`);
  if (prevShoplistsJson) {
    const prevShoplists = JSON.parse(prevShoplistsJson);
    localStorage.setItem(
      `shoplists`,
      JSON.stringify([...prevShoplists, shoplist])
    );
  }
};

export { saveShoplist };
