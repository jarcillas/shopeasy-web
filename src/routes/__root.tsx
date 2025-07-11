import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TooltipProvider } from '@/components/ui/tooltip';
import { lazy } from 'react';

import { Sidebar } from '../components/Sidebar';
import '../index.css';
import { Header } from '@/components/Header';

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
        <div className="h-screen w-screen flex flex-col">
          <Header />
          <div className="h-full p-4 text-white bg-slate-900">
            <div className="flex flex-row">
              <Sidebar />
              <Outlet />
            </div>
            <TanStackRouterDevtools position="bottom-right" />
          </div>
        </div>
      </TooltipProvider>
    );
  },
});
