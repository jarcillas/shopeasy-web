import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CreateShoplist } from './CreateShoplist';
import { Plus } from 'lucide-react';
import { useStore } from '@/store';

const Sidebar = () => {
  const shoplists = useStore((state) => state.shoplists);

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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className="w-fit text-slate-700">
            Add Shoplist
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="p-2 flex flex-col gap-2 w-[200px]"
        >
          <CreateShoplist />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { Sidebar };
