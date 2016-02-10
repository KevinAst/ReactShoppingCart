import React from 'react';
import MyReactComponent from './my-react-component';
import ItemRow from './item-row'; // KJB: hmmmm we re-use our ItemRow component
import { formatMoney } from 'accounting';
import { totalItems, unitPrice } from './util/money';


class Cart extends MyReactComponent {

  componentDidMount() {
    this.props.regEscHandler(this.props.closeFn); // ??? NEW
  }

  componentWillUnmount() {
    this.props.unregEscHandler(this.props.closeFn); // ??? NEW
  }

  render() {
    const { cartItems, closeFn, checkoutFn, removeItemFn, changeQtyFn } = this.props;

    return (
      <div className="modal cart">
    
        <button className="continue"
                onClick={closeFn}>Continue shopping</button>
    
        <button className="checkout"
                onClick={e => checkoutFn(totalItems(cartItems), e)}
                disabled={totalItems(cartItems) <= 0}>Checkout</button>
    
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
          <span className="formattedTotal">{ formatMoney(totalItems(cartItems)) }</span>
        </div>
      </div>
    );
  }
}

export default Cart;
