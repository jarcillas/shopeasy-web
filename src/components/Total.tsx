import { ShoplistItem } from './types';

const Total = ({ shoplist = [] }: { shoplist: ShoplistItem[] }) => {
  const calculateTotal = (values: Array<number>) =>
    values.reduce((prev, curr) => (prev += curr));
  return (
    <div className="total">
      {calculateTotal(
        shoplist.map(
          (shoplistItem: ShoplistItem) =>
            shoplistItem.qty * shoplistItem.unitPrice
        )
      )}
    </div>
  );
};

export { Total };
