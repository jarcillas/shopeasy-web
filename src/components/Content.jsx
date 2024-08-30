import { useState } from 'react';

import { Sidebar } from './Sidebar';
import { ShoplistInput } from './ShoplistInput';
import { Shoplist } from './Shoplist';
import { Total } from './Total';

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
  const [inputValue, setInputValue] = useState({
    title: '',
    qty: null,
    unit: '',
    unitPrice: null,
  });

  const [shoplist, setShoplist] = useState(shoplistInit);

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
