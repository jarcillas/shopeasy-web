import { ShoplistItem } from './types';

const Shoplist = ({ shoplist = [] }: { shoplist: ShoplistItem[] }) => (
  <ul className="p-4 w-full">
    {shoplist.map((shoplistItem, shoplistItemIdx) => (
      <li
        key={shoplistItemIdx}
        className="flex flex-row w-[800px] bg-slate-500 justify-between rounded-md my-4 p-2"
      >
        <div>{shoplistItem.title}</div>
        <div>{shoplistItem.qty}</div>
        <div>{shoplistItem.unit}</div>
        <div>{shoplistItem.unitPrice}</div>
        <div>{shoplistItem.qty * shoplistItem.unitPrice}</div>
      </li>
    ))}
  </ul>
);

export { Shoplist };
