import { createFileRoute } from '@tanstack/react-router';

import { Shoplist } from '../../components/Shoplist';
import { Total } from '../../components/Total';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';

export const Route = createFileRoute('/shoplist/$shoplistId')({
  component: () => {
    const { shoplistId } = Route.useParams();
    const shoplists = useStore((state) => state.shoplists);
    const addShoplistItem = useStore((state) => state.addShoplistItem);
    const deleteShoplist = useStore((state) => state.deleteShoplist);
    const shoplist = shoplists?.[Number(shoplistId)];

    console.log('Opened shoplist:');
    console.log(shoplist);

    if (!shoplist) {
      return <div className="mt-4">Shoplist does not exist!</div>;
    }

    return (
      <div className="mt-4 text-white">
        <h1 className="text-xl font-bold">What are we buying today?</h1>
        <Shoplist shoplist={shoplist} />
        <Total shoplistItems={shoplist.items} />
        <Button
          variant="outline"
          className="text-slate-700 mt-2 mr-4"
          onClick={() => {
            addShoplistItem(shoplist.id, {
              qty: 1,
              unitPrice: 0,
              name: '',
            });
          }}
        >
          Add New Item
        </Button>
        <Button
          className="mt-4"
          variant="destructive"
          onClick={() => {
            deleteShoplist(shoplist.id);
          }}
        >
          Delete Shoplist
        </Button>
      </div>
    );
  },
});
