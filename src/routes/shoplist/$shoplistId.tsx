import { createFileRoute } from '@tanstack/react-router';

import { Shoplist } from '../../components/Shoplist';
import { Total } from '../../components/Total';
import { useStore } from '../../store';

export const Route = createFileRoute('/shoplist/$shoplistId')({
  component: () => {
    const { shoplistId } = Route.useParams();
    const shoplists = useStore((state) => state.shoplists);
    const shoplist = shoplists?.[Number(shoplistId)];

    console.log('Opened shoplist:');
    console.log(shoplist);

    if (!shoplist) {
      return <div className="mt-4">Shoplist does not exist!</div>;
    }

    return (
      <div className="mt-2">
        <h1 className="text-xl font-bold">What are we buying today?</h1>
        <Shoplist shoplist={shoplist} />
        <Total shoplist={shoplist.items} />
      </div>
    );
  },
});
