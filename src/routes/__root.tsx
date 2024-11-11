import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TooltipProvider } from '@/components/ui/tooltip';
import { lazy } from 'react';

import { Sidebar } from '../components/Sidebar';
import '../index.css';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRoute({
  component: () => {
    return (
      <TooltipProvider>
        <div className="h-screen w-screen bg-slate-900">
          <div className="flex flex-row">
            <Sidebar />
            <Outlet />
          </div>
          <TanStackRouterDevtools position="bottom-right" />
        </div>
      </TooltipProvider>
    );
  },
});
