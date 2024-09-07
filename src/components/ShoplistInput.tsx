import { ShoplistItemInput } from './types';

const ShoplistInput = ({
  inputValue,
  setInputValue,
  addItem,
}: {
  inputValue: ShoplistItemInput;
  setInputValue: Function;
  addItem: Function;
}) => {
  const onInputChange = (prop: string, newValue: string) => {
    if (prop === 'qty' || prop === 'unitPrice') {
      setInputValue({ ...inputValue, [prop]: Number(newValue) });
      return;
    }
    setInputValue({ ...inputValue, [prop]: newValue });
  };

  return (
    <form
      className="shoplist-input"
      onSubmit={(e) => {
        e.preventDefault();
        addItem();
      }}
    >
      <input
        className="shoplist-input__title"
        type="text"
        placeholder="Add an item"
        value={inputValue.title}
        onChange={(e) => {
          onInputChange('title', e.target.value);
        }}
      />
      <input
        className="shoplist-input__qty"
        type="number"
        step={1}
        placeholder="Quantity"
        value={String(inputValue.qty)}
        onChange={(e) => {
          onInputChange('qty', e.target.value);
        }}
      />
      <input
        className="shoplist-input__unit"
        type="text"
        placeholder="Unit"
        value={inputValue.unit}
        onChange={(e) => {
          onInputChange('unit', e.target.value);
        }}
      />
      <input
        className="shoplist-input__unit-price"
        type="number"
        placeholder="Unit Price"
        value={String(inputValue.unitPrice)}
        onChange={(e) => {
          onInputChange('unitPrice', e.target.value);
        }}
      />
      <div className="shoplist-input__total-price">
        {inputValue.qty && inputValue.unitPrice
          ? inputValue.qty * inputValue.unitPrice
          : ''}
      </div>
      <input type="submit" value="Add Item" />
    </form>
  );
};

export { ShoplistInput };
