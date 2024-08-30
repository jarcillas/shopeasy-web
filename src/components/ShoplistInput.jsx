const ShoplistInput = ({ inputValue, setInputValue, addItem }) => {
  const onInputChange = (prop, newValue) => {
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
          onInputChange('qty', Number(e.target.value));
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
          onInputChange('unitPrice', Number(e.target.value));
        }}
      />
      <div className="shoplist-input__total-price">
        {inputValue.qty * inputValue.unitPrice}
      </div>
      <input type="submit" value="Add Item" />
    </form>
  );
};

export { ShoplistInput };
