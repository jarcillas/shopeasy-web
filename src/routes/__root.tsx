import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

// import Store
import { useStore } from '../store';

import { Sidebar } from '../components/Sidebar';
import '../index.css';

export const Route = createRootRoute({
  component: () => {
    return (
      <div className="h-screen w-screen bg-slate-900">
        <div className="flex flex-row">
          <Sidebar />
          <Outlet />
        </div>
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    );
  },
});
