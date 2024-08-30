const Sidebar = () => (
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
);

export { Sidebar };
