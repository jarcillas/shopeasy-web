import { createFileRoute } from '@tanstack/react-router';

import { shoplists } from '../../data.json';
import { Shoplist } from '../../components/Shoplist';
import { Total } from '../../components/Total';

export const Route = createFileRoute('/shoplist/$shoplistId')({
  component: () => {
    const { shoplistId } = Route.useParams();
    const shoplist = shoplists?.[Number(shoplistId)];

    if (!shoplist) {
      return <div className="mt-4">Shoplist does not exist!</div>;
    }

    return (
      <div className="mt-4">
        <h1 className="text-lg font-bold">{shoplist.title}</h1>
        <Shoplist shoplist={shoplist.items} />
        <Total shoplist={shoplist.items} />
      </div>
    );
  },
});
