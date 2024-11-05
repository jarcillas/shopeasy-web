import {
  Shoplist as ShoplistType,
  ShoplistItem as ShoplistItemType,
  ShoplistItem,
} from './types';
import { ValueInput } from './ValueInput';
import { currencyFormatter } from '../util/number';
import { useStore } from '../store';

const Shoplist = ({ shoplist }: { shoplist: ShoplistType }) => {
  const formatter = currencyFormatter('en-ph', 'PHP');

  const editShoplist = useStore((state) => state.editShoplist);
  const editShoplistItem = useStore((state) => state.editShoplistItem);

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
    const newShoplistItem = { ...shoplist.items[id], [key]: value };
    editShoplistItem(shoplist.id, id, newShoplistItem);
  };

  return (
    <>
      <h2 className="text-lg font-bold my-2">
        <ValueInput
          value={shoplist.name}
          handleBlur={(e: Event) => {
            updateShoplist('name', (e.target as HTMLInputElement).value);
          }}
          customClasses="hover:bg-slate-700"
          hideTooltip
        />
      </h2>
      <div className="flex flex-row w-[800px] justify-between h-12 items-center px-2">
        <div className="basis-1/3 font-bold"></div>
        <div className="basis-1/6 font-bold">QTY</div>
        <div className="basis-1/6 font-bold">UNIT</div>
        <div className="basis-1/6 font-bold text-right">UNIT PRICE</div>
        <div className="basis-1/6 font-bold text-right">PRICE</div>
      </div>
      <ul className="w-full divide-y divide-slate-400 border-b border-b-slate-400 border-slate-400">
        {shoplist.items.map((shoplistItem, shoplistItemIdx) => (
          <li
            key={shoplistItemIdx}
            className="flex flex-row w-[800px] justify-between h-12 items-center px-2"
          >
            <div className="basis-1/3">
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
            <div className="basis-1/6">
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
            <div className="basis-1/6">
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
            <div className="basis-1/6">
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
            <div className="basis-1/6 text-right">
              {formatter.format(shoplistItem.qty * shoplistItem.unitPrice)}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export { Shoplist };
