import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="mt-4">
      <h3 className="text-white">No shoplist selected</h3>
    </div>
  );
}
