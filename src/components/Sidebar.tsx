import { Link } from '@tanstack/react-router';
import { v4 } from 'uuid';
import { Button } from './ui/button';
import { useStore } from '@/store';

const Sidebar = () => {
  const shoplists = useStore((state) => state.shoplists);
  const addShoplist = useStore((state) => state.addShoplist);

  return (
    <div className="flex flex-col grow-0 shrink-0 w-[200px] m-4 space-y-4">
      <h2 className="font-semibold text-white">Shoplists</h2>
      <ul className="flex flex-col ml-4 space-y-2 text-white">
        {shoplists.map((list, listIdx) => (
          <li
            key={listIdx}
            className="text-ellipsis overflow-hidden whitespace-nowrap"
          >
            <Link
              to="/shoplist/$shoplistId"
              params={{ shoplistId: String(listIdx) }}
            >
              {list.name}
            </Link>
          </li>
        ))}
      </ul>
      <Button
        variant={'outline'}
        className="w-fit text-slate-700"
        onClick={() => {
          addShoplist({
            id: v4(),
            name: `Shoplist ${shoplists.length + 1}`,
            items: [],
          });
        }}
      >
        New Shoplist
      </Button>
    </div>
  );
};

export { Sidebar };
