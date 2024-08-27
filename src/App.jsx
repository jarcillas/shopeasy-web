import './App.css';

function App() {
  return (
    <div className="container">
      <h1 className="header">ShopEasy</h1>
      <div className="content">
        <div className="sidebar">
          <h2>Shoplists</h2>
          <ul className="shoplist-links">
            <li className="shoplist-links__item">
              <a href="/shoplist/1">Groceries</a>
            </li>
            <li className="shoplist-links__item">
              <a href="/shoplist/2">Toiletries</a>
            </li>
            <li className="shoplist-links__item">
              <a href="/shoplist/3">Clothes</a>
            </li>
          </ul>
        </div>
        <div className="shoplist-wrapper">
          <h2>Groceries</h2>
          <form className="shoplist-input">
            <input
              className="shoplist-input__title"
              type="text"
              placeholder="Add an item"
            />
            <input
              className="shoplist-input__qty"
              type="number"
              step={1}
              placeholder="Quantity"
            />
            <input
              className="shoplist-input__unit-price"
              type="number"
              placeholder="Unit Price"
            />
            <div className="shoplist-input__total-price"></div>
            <input type="submit" value="Add Item" />
          </form>
          <ul className="shoplist">
            <li className="shoplist-item">
              <div className="shoplist-item__title">Vinegar (100 ml)</div>
              <div className="shoplist-item__qty">2</div>
              <div className="shoplist-item__unit">pc</div>
              <div className="shoplist-item__unit-price">PHP 12.50</div>
              <div className="shoplist-item__total-price">PHP 25.00</div>
            </li>
            <li className="shoplist-item">
              <div className="shoplist-item__title">Chicken Breasts</div>
              <div className="shoplist-item__qty">0.5</div>
              <div className="shoplist-item__unit">kg</div>
              <div className="shoplist-item__unit-price">PHP 250.00</div>
              <div className="shoplist-item__total-price">PHP 125.00</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
