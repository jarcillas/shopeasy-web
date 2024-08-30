const Total = ({ shoplist = [] }) => {
  const calculateTotal = (values) =>
    values.reduce((prev, curr) => (prev += curr));
  return (
    <div className="total">
      {calculateTotal(
        shoplist.map(
          (shoplistItem) => shoplistItem.qty * shoplistItem.unitPrice
        )
      )}
    </div>
  );
};

export { Total };
