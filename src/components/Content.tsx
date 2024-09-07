import { useState } from 'react';

import { Sidebar } from './Sidebar.tsx';
import { ShoplistInput } from './ShoplistInput.tsx';
import { Shoplist } from './Shoplist.tsx';
import { Total } from './Total.tsx';

import { ShoplistItem, ShoplistItemInput } from './types';

const shoplistInit = [
  {
    title: 'Vinegar (100 mL)',
    qty: 2,
    unit: 'pc',
    unitPrice: 12.5,
  },
  {
    title: 'Chicken (per kg)',
    qty: 3,
    unit: 'kg',
    unitPrice: 205,
  },
];

const Content = () => {
  const [inputValue, setInputValue]: [ShoplistItemInput, Function] = useState({
    title: '',
    qty: null,
    unit: '',
    unitPrice: null,
  });

  const [shoplist, setShoplist]: [ShoplistItem[], Function] =
    useState(shoplistInit);

  const addItem = () => {
    setShoplist([...shoplist, inputValue]);
    setInputValue({
      title: '',
      qty: null,
      unit: '',
      unitPrice: null,
    });
  };

  return (
    <div className="content">
      <Sidebar />
      <div className="shoplist-wrapper">
        <h2>Groceries</h2>
        <ShoplistInput
          addItem={addItem}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        <Shoplist shoplist={shoplist} />
        <Total shoplist={shoplist} />
      </div>
    </div>
  );
};

export { Content };
