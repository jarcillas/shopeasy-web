import {
  Shoplist as ShoplistType,
  ShoplistItem as ShoplistItemType,
} from './types';
import { Button } from './ui/button';
import { ValueInput } from './ValueInput';
import { X } from 'lucide-react';
import { currencyFormatter } from '../util/number';
import { useStore } from '../store';

const Shoplist = ({ shoplist }: { shoplist: ShoplistType }) => {
  const formatter = currencyFormatter('en-ph', 'PHP');

  const addShoplistItem = useStore((state) => state.addShoplistItem);
  const editShoplist = useStore((state) => state.editShoplist);
  const editShoplistItem = useStore((state) => state.editShoplistItem);
  const deleteShoplistItem = useStore((state) => state.deleteShoplistItem);

  const updateShoplist = (
    key: keyof ShoplistType,
    value: ShoplistType[keyof ShoplistType]
  ) => {
    const newShoplist = { ...shoplist, [key]: value };
    editShoplist(shoplist.id, newShoplist);
  };

  const updateShoplistItem = (
    id: ShoplistItemType['id'],
    key: keyof ShoplistItemType,
    value: ShoplistItemType[keyof ShoplistItemType]
  ) => {
    const shoplistItem = shoplist.items?.find((item) => item.id === id);
    // check first that shoplistItem exists
    if (shoplistItem) {
      const updatedShoplistItem = { ...shoplistItem, [key]: value };
      editShoplistItem(shoplist.id, id, updatedShoplistItem);
    }
  };

  return (
    <>
      <h2 className="text-lg font-bold h-8 my-2">
        <ValueInput
          value={shoplist.name}
          handleBlur={(e: Event) => {
            updateShoplist('name', (e.target as HTMLInputElement).value);
          }}
          customClasses="hover:bg-slate-700"
          hideTooltip
        />
      </h2>
      <Button
        variant="outline"
        className="text-slate-700 mt-2"
        onClick={() => {
          addShoplistItem(shoplist.id, {
            qty: 1,
            unitPrice: 0,
            name: '',
          });
        }}
      >
        New Item
      </Button>
      <div className="flex flex-row w-[800px] justify-between h-12 items-center px-2">
        <div className="basis-1/3 font-bold">NAME</div>
        <div className="basis-1/6 font-bold">QTY</div>
        <div className="basis-1/6 font-bold">UNIT</div>
        <div className="basis-1/6 font-bold text-right">UNIT PRICE</div>
        <div className="basis-1/6 font-bold text-right">PRICE</div>
      </div>
      <ul className="w-full divide-y divide-slate-400 border-b border-b-slate-400 border-slate-400">
        {shoplist.items.map((shoplistItem, shoplistItemIdx) => (
          <li
            key={shoplistItemIdx}
            className="flex relative flex-row w-[800px] justify-between h-12 items-center"
          >
            <div className="basis-1/3 h-full px-2">
              <ValueInput
                value={shoplistItem.name}
                handleBlur={(e: Event) => {
                  updateShoplistItem(
                    shoplistItem.id,
                    'name',
                    (e.target as HTMLInputElement).value
                  );
                }}
                customClasses="hover:bg-slate-700"
              />
            </div>
            <div className="basis-1/6 h-full px-2">
              <ValueInput
                value={shoplistItem.qty}
                handleBlur={(e: Event) => {
                  updateShoplistItem(
                    shoplistItem.id,
                    'qty',
                    Number((e.target as HTMLInputElement).value)
                  );
                }}
                customClasses="hover:bg-slate-700"
              />
            </div>
            <div className="basis-1/6 h-full px-2">
              <ValueInput
                value={shoplistItem.unit}
                handleBlur={(e: Event) => {
                  updateShoplistItem(
                    shoplistItem.id,
                    'unit',
                    (e.target as HTMLInputElement).value
                  );
                }}
                customClasses="hover:bg-slate-700"
              />
            </div>
            <div className="basis-1/6 h-full px-2">
              <ValueInput
                value={shoplistItem.unitPrice}
                handleBlur={(e: Event) => {
                  updateShoplistItem(
                    shoplistItem.id,
                    'unitPrice',
                    (e.target as HTMLInputElement).value
                  );
                }}
                customClasses="hover:bg-slate-700 text-right"
                customInputClasses="text-right"
                customDisplay={formatter.format(shoplistItem.unitPrice)}
              />
            </div>
            <div className="basis-1/6 h-full px-2 flex items-center justify-end">
              {formatter.format(shoplistItem.qty * shoplistItem.unitPrice)}
            </div>
            <Button
              onClick={() => {
                deleteShoplistItem(shoplist.id, shoplistItem.id);
              }}
              className="absolute text-transparent -right-10 size-8 rounded-full hover:bg-white hover:text-slate-700"
            >
              <X strokeWidth={2.5} />
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};

export { Shoplist };
