import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { Shoplist } from '../../components/Shoplist';
import { Total } from '../../components/Total';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';

export const Route = createFileRoute('/shoplist/$shoplistId')({
  component: () => {
    const { shoplistId } = Route.useParams();
    const shoplists = useStore((state) => state.shoplists);
    const deleteShoplist = useStore((state) => state.deleteShoplist);
    const saveShoplistToSupabase = useStore(
      (state) => state.saveShoplistToSupabase
    );
    const setLastSaved = useStore((state) => state.setLastSaved);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>(
      'idle'
    );
    const shoplist = shoplists?.[Number(shoplistId)];

    function timeAgo(timestamp: number) {
      const now = Date.now();
      const seconds = Math.floor((now - timestamp) / 1000);
      if (seconds < 5) return 'just now';
      if (seconds < 60) return `${seconds} seconds ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minutes ago`;
      const hours = Math.floor(minutes / 60);
      return `${hours} hours ago`;
    }

    const handleSave = async () => {
      setSaveStatus('saving');
      await saveShoplistToSupabase(shoplist.id);
      setSaveStatus('saved');
      setLastSaved(Date.now());
      setTimeout(() => setSaveStatus('idle'), 2000);
    };

    if (!shoplist) {
      return <div className="mt-4">Shoplist does not exist!</div>;
    }

    return (
      <div className="mt-4 text-white">
        <div className="w-[800px]">
          <h1 className="text-xl font-bold">What are we buying today?</h1>
          <Shoplist shoplist={shoplist} />
          <Total shoplistItems={shoplist.items} />
          <div className="flex flex-row gap-2 mt-4 items-center">
            <Button
              variant="outline"
              className="text-slate-700"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteShoplist(shoplist.id);
              }}
            >
              Delete Shoplist
            </Button>
            {saveStatus === 'saving' && (
              <div className="text-slate-400 text-sm ml-2 h-full">
                Saving...
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="text-green-400 text-sm ml-2 h-full">
                Saved ({timeAgo(Date.now())})
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
});
