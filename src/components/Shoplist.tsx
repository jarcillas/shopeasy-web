import { Shoplist as ShoplistType } from './types';
import { ValueInput } from './ValueInput';
import { currencyFormatter } from '../util/number';
import { useStore } from '../store';

const Shoplist = ({ shoplist }: { shoplist: ShoplistType }) => {
  const formatter = currencyFormatter('en-ph', 'PHP');

  const editShoplist = useStore((state) => state.editShoplist);

  const updateShoplist = (
    key: keyof ShoplistType,
    value: ShoplistType[keyof ShoplistType]
  ) => {
    const newShoplist = { ...shoplist, [key]: value };
    editShoplist(shoplist.id, newShoplist);
  };

  return (
    <>
      <h2 className="text-lg font-bold my-2">
        <ValueInput
          value={shoplist.name}
          handleBlur={(e: Event) => {
            updateShoplist('name', (e.target as HTMLInputElement).value);
          }}
        />
      </h2>
      <ul className="w-full divide-y divide-slate-400 border-b border-b-slate-400 border-slate-400">
        {shoplist.items.map((shoplistItem, shoplistItemIdx) => (
          <li
            key={shoplistItemIdx}
            className="flex flex-row w-[800px] justify-between h-12 items-center px-2"
          >
            <div className="basis-1/3">{shoplistItem.name}</div>
            <div className="basis-1/6">
              <ValueInput value={shoplistItem.qty} />
            </div>
            <div className="basis-1/6">{shoplistItem.unit}</div>
            <div className="basis-1/6 text-right">
              {formatter.format(shoplistItem.unitPrice)}
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
