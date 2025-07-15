import { useState, useRef, useLayoutEffect } from 'react';
import { useStore } from '@/store';

import {
  ShoplistItem as ShoplistItemType,
  Shoplist as ShoplistType,
  MakeOptional,
} from './types';

import { Input } from './ui/input';
import { Button } from './ui/button';

interface ShoplistItemInputProps {
  shoplist: ShoplistType;
}

const ShoplistItemInput = ({ shoplist }: ShoplistItemInputProps) => {
  const [itemInput, setItemInput]: [
    MakeOptional<Omit<ShoplistItemType, 'id'>, 'unitPrice'>,
    Function,
  ] = useState({
    name: '',
    qty: 1,
    unit: undefined,
    unitPrice: undefined,
  });
  const [expanded, setExpanded] = useState(false);
  const [expandHeight, setExpandHeight] = useState(0);
  const addShoplistItem = useStore((state) => state.addShoplistItem);
  const expandableRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    prop: keyof ShoplistItemType
  ) => {
    setItemInput((item: Omit<ShoplistItemType, 'id'>) => ({
      ...item,
      [prop]: event.target.value,
    }));
  };

  useLayoutEffect(() => {
    if (expanded && expandableRef.current) {
      setExpandHeight(expandableRef.current.scrollHeight);
    } else {
      setExpandHeight(0);
    }
  }, [expanded, itemInput]);

  return (
    <form className="flex flex-col gap-x-2 p-2 bg-slate-700 rounded-md">
      <div className="flex flex-row items-center gap-x-2">
        <Input
          placeholder="Item Name"
          value={itemInput.name}
          className="flex-grow-2 border-slate-500 text-slate-300"
          onChange={(e) => {
            handleChange(e, 'name');
          }}
        />
        <Input
          placeholder="Price"
          type="number"
          value={itemInput.unitPrice}
          className="border-slate-500 text-slate-300"
          onChange={(e) => {
            handleChange(e, 'unitPrice');
          }}
        />
        <Button
          variant={'outline'}
          type="submit"
          className="text-slate-700"
          onClick={(event) => {
            event.preventDefault();
            if (!itemInput.name || !itemInput.unitPrice) return;
            const item: Omit<ShoplistItemType, 'id'> = {
              ...itemInput,
              qty: itemInput.qty || 1,
              unitPrice: itemInput.unitPrice ?? 0,
            };

            addShoplistItem(shoplist.id, item);
          }}
        >
          Add Item
        </Button>
        <Button
          variant={'outline'}
          type="button"
          className="text-slate-700"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Less' : 'More'}
        </Button>
      </div>
      <div
        style={{
          height: expanded ? expandHeight : 0,
          opacity: expanded ? 1 : 0,
          transition: 'height 0.3s ease, opacity 0.3s ease',
          overflow: 'hidden',
          marginTop: expanded ? 8 : 0,
        }}
        ref={expandableRef}
      >
        {expanded && (
          <div className="flex flex-row items-center gap-2">
            <Input
              placeholder="Qty"
              type="number"
              value={itemInput.qty}
              className="flex-grow-0 w-fit border-slate-500 text-slate-300"
              onChange={(e) => {
                handleChange(e, 'qty');
              }}
            />
            <Input
              placeholder="Unit"
              value={itemInput.unit ?? ''}
              className="border-slate-500 text-slate-300"
              onChange={(e) => {
                handleChange(e, 'unit');
              }}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export { ShoplistItemInput };
