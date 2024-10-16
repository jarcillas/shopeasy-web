import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { Sidebar } from '../components/Sidebar';
import '../index.css';

export const Route = createRootRoute({
  component: () => (
    <div className="h-screen w-screen">
      <div className="flex flex-row">
        <Sidebar />
        <Outlet />
      </div>
      {/* <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div> */}
      <TanStackRouterDevtools />
    </div>
  ),
});
