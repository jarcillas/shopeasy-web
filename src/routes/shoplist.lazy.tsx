import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/shoplist')({
  component: Shoplist,
});

function Shoplist() {
  return <div className="p-2">Shoplist goes here</div>;
}
