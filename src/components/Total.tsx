import { ShoplistItem } from './types';
import { currencyFormatter } from '../util/number';

const Total = ({ shoplist = [] }: { shoplist: ShoplistItem[] }) => {
  const calculateTotal = (values: Array<number>) =>
    values.reduce((prev, curr) => (prev += curr));

  const total = calculateTotal(
    shoplist.map(
      (shoplistItem: ShoplistItem) => shoplistItem.qty * shoplistItem.unitPrice
    )
  );

  const formatter = currencyFormatter('en-ph', 'PHP');

  return (
    <div className="px-6 w-full text-right">{formatter.format(total)}</div>
  );
};

export { Total };
