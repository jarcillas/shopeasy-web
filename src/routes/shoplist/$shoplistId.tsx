import { createFileRoute } from '@tanstack/react-router';

import { shoplists } from '../../data.json';
import { Shoplist } from '../../components/Shoplist';

export const Route = createFileRoute('/shoplist/$shoplistId')({
  component: () => {
    const { shoplistId } = Route.useParams();
    const shoplist = shoplists?.[Number(shoplistId)];

    if (!shoplist) {
      return <div>Shoplist does not exist!</div>;
    }

    return (
      <div>
        <h1 className="text-lg font-bold mt-4">{shoplist.title}</h1>
        <Shoplist shoplist={shoplist.items} />
      </div>
    );
  },
});
