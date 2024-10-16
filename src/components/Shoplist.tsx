import { ShoplistItem } from './types';
import { currencyFormatter } from '../util/number';

const Shoplist = ({ shoplist = [] }: { shoplist: ShoplistItem[] }) => {
  const formatter = currencyFormatter('en-ph', 'PHP');

  return (
    <ul className="p-4 w-full">
      {shoplist.map((shoplistItem, shoplistItemIdx) => (
        <li
          key={shoplistItemIdx}
          className="flex flex-row w-[800px] bg-slate-500 justify-between rounded-md my-4 p-2"
        >
          <div>{shoplistItem.title}</div>
          <div>{shoplistItem.qty}</div>
          <div>{shoplistItem.unit}</div>
          <div>{formatter.format(shoplistItem.unitPrice)}</div>
          <div>
            {formatter.format(shoplistItem.qty * shoplistItem.unitPrice)}
          </div>
        </li>
      ))}
    </ul>
  );
};

export { Shoplist };
