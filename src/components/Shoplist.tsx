import {
  Shoplist as ShoplistType,
  ShoplistItem as ShoplistItemType,
} from './types';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { ShoplistItemInput } from './ShoplistItemInput';
import { ValueInput } from './ValueInput';
import { Trash } from 'lucide-react';
import { currencyFormatter } from '../util/number';
import { useStore } from '../store';

const Shoplist = ({ shoplist }: { shoplist: ShoplistType }) => {
  const formatter = currencyFormatter('en-ph', 'PHP');

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
      <h2 className="text-3xl font-bold h-16 my-2">
        <ValueInput
          value={shoplist.name}
          handleBlur={(e: Event) => {
            updateShoplist('name', (e.target as HTMLInputElement).value);
          }}
          customClasses="hover:bg-slate-700"
          hideTooltip
        />
      </h2>
      {/* TODO: INSERT SHOPLIST ITEM INPUT HERE */}
      <ShoplistItemInput shoplist={shoplist} />
      <div className="flex flex-row w-[800px] justify-between h-12 items-center px-2">
        <div className="basis-1/3 font-bold select-none">ITEM</div>
        <div className="basis-1/6 font-bold select-none">QTY</div>
        <div className="basis-1/6 font-bold select-none">UNIT</div>
        <div className="basis-1/6 font-bold text-right select-none">
          UNIT PRICE
        </div>
        <div className="basis-1/6 font-bold text-right select-none">PRICE</div>
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
            <div className="basis-1/6 h-full px-2 flex items-center justify-end select-none">
              {formatter.format(shoplistItem.qty * shoplistItem.unitPrice)}
            </div>

            <Tooltip>
              <TooltipTrigger className="absolute -right-10">
                <Button
                  onClick={() => {
                    deleteShoplistItem(shoplist.id, shoplistItem.id);
                  }}
                  className="text-transparent size-8 rounded-full hover:bg-white hover:text-slate-700"
                >
                  <Trash strokeWidth={2.5} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-200 rounded-sm text-slate-800 p-1.5">
                Delete Item
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>
    </>
  );
};

export { Shoplist };
