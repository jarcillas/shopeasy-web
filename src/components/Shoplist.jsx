const Shoplist = ({ shoplist = [] }) => (
  <ul className="shoplist">
    {shoplist.map((shoplistItem, shoplistItemIdx) => (
      <li key={shoplistItemIdx} className="shoplist-item">
        <div className="shoplist-item__title">{shoplistItem.title}</div>
        <div className="shoplist-item__qty">{shoplistItem.qty}</div>
        <div className="shoplist-item__unit">{shoplistItem.unit}</div>
        <div className="shoplist-item__unit-price">
          {shoplistItem.unitPrice}
        </div>
        <div className="shoplist-item__total-price">
          {shoplistItem.qty * shoplistItem.unitPrice}
        </div>
      </li>
    ))}
  </ul>
);

export { Shoplist };
