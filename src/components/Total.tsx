import { ShoplistItem } from './types';
import { currencyFormatter } from '../util/number';

const Total = ({ shoplistItems = [] }: { shoplistItems: ShoplistItem[] }) => {
  const calculateTotal = (values: Array<number>) =>
    values.reduce((prev, curr) => (prev += curr), 0);

  const total = calculateTotal(
    shoplistItems.map(
      (shoplistItem: ShoplistItem) => shoplistItem.qty * shoplistItem.unitPrice
    )
  );

  const formatter = currencyFormatter('en-ph', 'PHP');

  return (
    <div className="w-full text-right p-2 font-bold">
      {formatter.format(total)}
    </div>
  );
};

export { Total };
