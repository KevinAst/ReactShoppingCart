import React from 'react';
import ItemRow from './item-row'; // KJB: hmmmm we re-use our ItemRow component
import { formatMoney } from 'accounting';
import { totalCartItems, unitPrice } from './util/money';

function Cart({ cartItems, closeFn, checkoutFn, removeItemFn, changeQtyFn }) {
  return (
    <div className="modal cart">

      <button className="continue"
              onClick={closeFn}>Continue shopping</button>

      <button className="checkout"
              onClick={e => checkoutFn(totalCartItems(cartItems), e)}
              disabled={totalCartItems(cartItems) <= 0}>Checkout</button>

      <h1>Cart</h1>
      <ul>
        { cartItems.map(item =>
          <ItemRow key={item.id}
                   item={item} >
            <span className="qty">
              Quantity:
              <input name="qty"
                     value={item.qty}
                     onChange={e => changeQtyFn(item, parseInt(e.target.value, 10) || 0)} />
            </span>

            <button className="remove" onClick={e => removeItemFn(item, e)} >Remove</button>

            <span className="lineTotal">
              { formatMoney(unitPrice(item.price, item.qty)) }
            </span>
          </ItemRow> ) }
      </ul>
      <div className="total">Total:
        <span className="formattedTotal">{ formatMoney(totalCartItems(cartItems)) }</span>
      </div>
    </div>
  );
}

export default Cart;
