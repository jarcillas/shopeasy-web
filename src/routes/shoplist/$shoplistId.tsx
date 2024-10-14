import { createFileRoute } from '@tanstack/react-router';

import { shoplists } from '../../data.json';
import { Shoplist } from '../../components/Shoplist';

export const Route = createFileRoute('/shoplist/$shoplistId')({
  component: () => {
    const { shoplistId } = Route.useParams();
    return (
      <div>
        <p>Hello /shoplist/{shoplistId}!</p>
        <Shoplist shoplist={shoplists[Number(shoplistId)].items} />
      </div>
    );
  },
});
