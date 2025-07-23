import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TooltipProvider } from '@/components/ui/tooltip';
import { lazy } from 'react';

import { Sidebar } from '../components/Sidebar';
import '../index.css';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';

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
    const { user, loading } = useAuth();
    return (
      <TooltipProvider>
        <div className="h-screen w-screen flex flex-col">
          <Header />
          <div className="h-full p-4 text-white bg-slate-900">
            <div className="flex flex-row">
              {user && <Sidebar />}
              <div className="flex-1">
                {user ? (
                  <Outlet />
                ) : (
                  !loading && (
                    <div className="mt-8 text-center text-lg text-slate-300">
                      Please log in to view your shoplists.
                    </div>
                  )
                )}
              </div>
            </div>
            <TanStackRouterDevtools position="bottom-right" />
          </div>
        </div>
      </TooltipProvider>
    );
  },
});
