import { create } from 'zustand';
import { v4 } from 'uuid';
import { Shoplist, ShoplistItem } from './components/types';
import { supabase } from './lib/supabaseClient';
import { devtools } from 'zustand/middleware';

type LocalShoplistItem = ShoplistItem & {
  _isNew?: boolean; // created locally, not yet in DB
  _isDirty?: boolean; // edited locally since last sync
  _isDeleted?: boolean; // marked for deletion on next save
  tags?: string[]; // list of tag names for the item (client-side)
};

type State = {
  shoplists: (Shoplist & { items: LocalShoplistItem[] })[];
  lastSaved: number | null;
};

type Action = {
  setShoplists: (
    newShoplists: (Shoplist & { items: LocalShoplistItem[] })[]
  ) => void;
  addShoplist: (newShoplist: {
    id?: string;
    name: string;
    description?: string;
  }) => Promise<void>;
  deleteShoplist: (shoplistId: Shoplist['id']) => Promise<void>;
  editShoplist: (
    shoplistId: Shoplist['id'],
    updatedShoplist: Partial<Shoplist>
  ) => void;

  // Local-only item ops (no immediate network calls)
  addShoplistItem: (
    shoplistId: Shoplist['id'],
    newShoplistItem: Omit<ShoplistItem, 'id'> & { tags?: string[] }
  ) => void;
  deleteShoplistItem: (
    shoplistId: Shoplist['id'],
    shoplistItemId: ShoplistItem['id']
  ) => void;
  editShoplistItem: (
    shoplistId: Shoplist['id'],
    shoplistItemId: ShoplistItem['id'],
    updatedShoplistItem: Partial<LocalShoplistItem>
  ) => void;

  setLastSaved: (timestamp: number) => void;
  saveShoplistToSupabase: (shoplistId: string) => Promise<void>;
  fetchShoplists: (userId: string) => Promise<void>;
};

export const useStore = create<State & Action>()(
  devtools((set, get) => ({
    shoplists: [],
    lastSaved: null,

    setShoplists: (newShoplists) => set({ shoplists: newShoplists }),
    setLastSaved: (timestamp) => set({ lastSaved: timestamp }),

    // Fetch normalized data from Supabase and assemble in-memory shoplists + items + tags
    fetchShoplists: async (userId: string) => {
      // 1) fetch shoplists
      const { data: shoplistsData, error: shoplistsError } = await supabase
        .from('shoplists')
        .select('*')
        .eq('user_id', userId)
        .order('created', { ascending: true });

      if (shoplistsError || !shoplistsData) return;

      const shoplistIds = shoplistsData.map((s) => s.id);

      // 2) fetch items for these shoplists
      const { data: itemsData, error: itemsError } = await supabase
        .from('shoplist_items')
        .select('*')
        .in('shoplist_id', shoplistIds);

      if (itemsError) return;

      const itemIds = itemsData.map((i) => i.id);

      // 3) fetch tags join rows for these items
      const { data: itemTagsData, error: itemTagsError } = await supabase
        .from('shoplist_item_tags')
        .select('*')
        .in('item_id', itemIds);

      if (itemTagsError) return;

      const tagIds = Array.from(new Set(itemTagsData.map((t) => t.tag_id)));

      // 4) fetch tag records
      const tagsById: Record<string, { id: string; name: string }> = {};
      if (tagIds.length > 0) {
        const { data: tagsData, error: tagsError } = await supabase
          .from('tags')
          .select('*')
          .in('id', tagIds);
        if (!tagsError && tagsData) {
          tagsData.forEach((tg) => {
            tagsById[tg.id] = tg;
          });
        }
      }

      // 5) assemble tags per item
      const tagsByItemId: Record<string, string[]> = {};
      itemTagsData.forEach((it) => {
        const t = tagsById[it.tag_id];
        if (!t) return;
        tagsByItemId[it.item_id] = tagsByItemId[it.item_id] || [];
        tagsByItemId[it.item_id].push(t.name);
      });

      // 6) group items by shoplist_id
      const itemsByShoplist: Record<string, LocalShoplistItem[]> = {};
      itemsData.forEach((it) => {
        itemsByShoplist[it.shoplist_id] = itemsByShoplist[it.shoplist_id] || [];
        itemsByShoplist[it.shoplist_id].push({
          id: it.id,
          name: it.name,
          qty: it.qty,
          unit: it.unit,
          unitPrice: it.unit_price,
          tags: tagsByItemId[it.id] ?? [],
        });
      });

      // 7) set local store shape
      const assembled = shoplistsData.map((s) => ({
        ...s,
        items: itemsByShoplist[s.id] ?? [],
      }));

      set({ shoplists: assembled });
    },

    addShoplist: async (newShoplist) => {
      const created = {
        id: newShoplist.id ?? v4(),
        name: newShoplist.name,
        description: newShoplist.description ?? null,
        created: Math.floor(Date.now() / 1000),
        updated: Math.floor(Date.now() / 1000),
      };
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data, error } = await supabase
        .from('shoplists')
        .insert([{ ...created, user_id: user.id }])
        .select();

      if (!error && data && data[0]) {
        set((state) => ({
          shoplists: [...state.shoplists, { ...data[0], items: [] }],
        }));
      }
    },

    deleteShoplist: async (shoplistId) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data, error } = await supabase
        .from('shoplists')
        .delete()
        .eq('id', shoplistId)
        .eq('user_id', user.id);
      if (!error && data) {
        set((state) => ({
          shoplists: state.shoplists.filter((s) => s.id !== shoplistId),
        }));
      }
    },

    editShoplist: (shoplistId, updatedShoplist) =>
      set((state) => ({
        shoplists: state.shoplists.map((s) =>
          s.id === shoplistId ? { ...s, ...updatedShoplist } : s
        ),
      })),

    addShoplistItem: (shoplistId, newShoplistItem) =>
      set((state) => {
        const shoplist = state.shoplists.find((s) => s.id === shoplistId);
        if (!shoplist) return {};
        const item: LocalShoplistItem = {
          id: v4(), // temporary id; will be replaced when persisted
          name: newShoplistItem.name,
          qty: newShoplistItem.qty ?? 1,
          unit: newShoplistItem.unit,
          unitPrice: newShoplistItem.unitPrice,
          tags: newShoplistItem.tags ?? [],
          _isNew: true,
        };
        const updated = { ...shoplist, items: [...shoplist.items, item] };
        return {
          shoplists: state.shoplists.map((s) =>
            s.id === shoplistId ? updated : s
          ),
        };
      }),

    deleteShoplistItem: (shoplistId, shoplistItemId) =>
      set((state) => {
        const shoplist = state.shoplists.find((s) => s.id === shoplistId);
        if (!shoplist) return {};
        const updatedItems = shoplist.items.map((it) =>
          it.id === shoplistItemId ? { ...it, _isDeleted: true } : it
        );
        const updated = { ...shoplist, items: updatedItems };
        return {
          shoplists: state.shoplists.map((s) =>
            s.id === shoplistId ? updated : s
          ),
        };
      }),

    editShoplistItem: (shoplistId, shoplistItemId, updatedShoplistItem) =>
      set((state) => {
        const shoplist = state.shoplists.find((s) => s.id === shoplistId);
        if (!shoplist) return {};
        const updatedItems = shoplist.items.map((it) =>
          it.id === shoplistItemId
            ? { ...it, ...updatedShoplistItem, _isDirty: true }
            : it
        );
        const updated = { ...shoplist, items: updatedItems };
        return {
          shoplists: state.shoplists.map((s) =>
            s.id === shoplistId ? updated : s
          ),
        };
      }),

    // Save to Supabase only when user clicks Save
    saveShoplistToSupabase: async (shoplistId) => {
      const state = get();
      const shoplist = state.shoplists.find((s) => s.id === shoplistId);
      if (!shoplist) return;

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // Separate items according to action
      const items: LocalShoplistItem[] = shoplist.items || [];
      const toInsert = items.filter((i) => i._isNew && !i._isDeleted);
      const toUpdate = items.filter((i) => !i._isNew && (i._isDirty || i.tags));
      const toDelete = items
        .filter((i) => i._isDeleted && !i._isNew)
        .map((i) => i.id);

      // 1) Insert new items
      const insertedItemsMap: Record<
        string,
        {
          id: string;
          shoplist_id: string;
          name: string;
          qty: number;
          unit: string;
          unit_price: number;
          [key: string]: unknown;
        }
      > = {}; // tempId -> db row
      if (toInsert.length > 0) {
        const payload = toInsert.map((it) => ({
          // omit transient fields
          temp_id: it.id, // keep original temporary id so we can map later
          shoplist_id: shoplistId,
          name: it.name,
          qty: it.qty,
          unit: it.unit,
          unit_price: it.unitPrice,
        }));
        // We assume `shoplist_items` has a `temp_id` text column that can be ignored later OR
        // we can insert without temp_id and map via returned position. If you don't have temp_id,
        // use insert(...).select() and match by unique combination (less reliable).
        // For simplicity, insert then map by returning rows (supabase returns rows in order).
        const { data: inserted, error: insertError } = await supabase
          .from('shoplist_items')
          .insert(payload)
          .select();

        if (!insertError && inserted) {
          inserted.forEach((row, idx) => {
            const temp = payload[idx].temp_id;
            insertedItemsMap[temp] = row;
          });
        }
      }

      // 2) Update existing items
      for (const it of toUpdate) {
        // guard: must have DB id
        if (!it.id) continue;
        await supabase
          .from('shoplist_items')
          .update({
            name: it.name,
            qty: it.qty,
            unit: it.unit,
            unit_price: it.unitPrice,
            updated_at: new Date().toISOString(),
          })
          .eq('id', it.id);
      }

      // 3) Delete removed items
      if (toDelete.length > 0) {
        await supabase.from('shoplist_items').delete().in('id', toDelete);
        // also cascade deletions in join table if RLS/cascades are set
      }

      // 4) Tags handling: upsert tag names into tags table, then rebuild shoplist_item_tags for affected items
      // Collect all tag names for items that were inserted/updated
      const affectedItems = [...toInsert, ...toUpdate];
      if (affectedItems.length > 0) {
        // collect unique tag names
        const tagNames = Array.from(
          new Set(
            affectedItems
              .flatMap((it) => it.tags ?? [])
              .filter(Boolean)
              .map((t) => t.trim())
          )
        ).filter(Boolean);

        // Upsert tags for user (requires unique constraint on (user_id, name))
        const tagRowsByName: Record<
          string,
          { id: string; name: string; user_id: string }
        > = {};
        if (tagNames.length > 0) {
          const upsertPayload = tagNames.map((name) => ({
            user_id: user.id,
            name,
          }));
          const { data: upsertedTags, error: tagsError } = await supabase
            .from('tags')
            .upsert(upsertPayload, { onConflict: 'user_id,name' })
            .select();

          if (!tagsError && upsertedTags) {
            upsertedTags.forEach((tg) => {
              tagRowsByName[tg.name] = tg;
            });
          }
        }

        // For each affected item:
        // - determine DB item id (for newly inserted items, use insertedItemsMap)
        // - delete existing shoplist_item_tags for that item
        // - insert new shoplist_item_tags linking to upserted tag ids
        for (const item of affectedItems) {
          const dbRow =
            item._isNew && insertedItemsMap[item.id]
              ? insertedItemsMap[item.id]
              : item; // if not new, item.id should be DB id

          const dbItemId = dbRow.id;
          if (!dbItemId) continue;

          // remove existing links
          await supabase
            .from('shoplist_item_tags')
            .delete()
            .eq('item_id', dbItemId);

          const itemTags = item.tags ?? [];
          if (itemTags.length === 0) continue;

          const linksPayload = itemTags
            .map((name) => tagRowsByName[name])
            .filter(Boolean)
            .map((tg) => ({ item_id: dbItemId, tag_id: tg.id }));

          if (linksPayload.length > 0) {
            await supabase.from('shoplist_item_tags').insert(linksPayload);
          }
        }
      }

      // 5) Update shoplist.updated timestamp
      await supabase
        .from('shoplists')
        .update({ updated: Math.floor(Date.now() / 1000) })
        .eq('id', shoplistId);

      // 6) Refresh local shoplist from DB for this shoplist to ensure canonical ids/state
      // Fetch items and tags only for this shoplist
      const { data: refreshedItems } = await supabase
        .from('shoplist_items')
        .select('*')
        .eq('shoplist_id', shoplistId);

      const itemIdsRef = (refreshedItems || []).map((r) => r.id);
      const { data: refreshedItemTags } = await supabase
        .from('shoplist_item_tags')
        .select('*')
        .in('item_id', itemIdsRef);

      const tagIdsRef = Array.from(
        new Set((refreshedItemTags || []).map((t) => t.tag_id))
      );
      const refreshedTagsById: Record<string, { id: string; name: string }> =
        {};
      if (tagIdsRef.length > 0) {
        const { data: refreshedTags } = await supabase
          .from('tags')
          .select('*')
          .in('id', tagIdsRef);
        (refreshedTags || []).forEach((tg) => (refreshedTagsById[tg.id] = tg));
      }

      const refreshedTagsByItem: Record<string, string[]> = {};
      (refreshedItemTags || []).forEach((it) => {
        refreshedTagsByItem[it.item_id] = refreshedTagsByItem[it.item_id] || [];
        refreshedTagsByItem[it.item_id].push(
          refreshedTagsById[it.tag_id]?.name
        );
      });

      // assemble refreshed items
      const refreshedLocalItems: LocalShoplistItem[] = (
        refreshedItems || []
      ).map((it) => ({
        id: it.id,
        name: it.name,
        qty: it.qty,
        unit: it.unit,
        unitPrice: it.unit_price,
        tags: refreshedTagsByItem[it.id] ?? [],
      }));

      // update store: replace items for this shoplist
      set((s) => ({
        shoplists: s.shoplists.map((sl) =>
          sl.id === shoplistId ? { ...sl, items: refreshedLocalItems } : sl
        ),
        lastSaved: Date.now(),
      }));
    },
  }))
);
