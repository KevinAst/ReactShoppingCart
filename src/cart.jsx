'use strict';

import React from 'react';
import MyReactComponent from './my-react-component';
import ItemRow from './item-row'; // KJB: hmmmm we re-use our ItemRow component
import { formatMoney } from 'accounting';
import { totalItems, unitPrice } from './util/money';
import Esc from './util/esc';

class Cart extends MyReactComponent {

  componentDidMount() {
    Esc.regEscHandler(this.props.closeFn);
  }

  componentWillUnmount() {
    Esc.unregEscHandler(this.props.closeFn);
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

                <img src="/assets/plus_minus_btn.gif" useMap="#plus_minus_map"/>
                <map name="plus_minus_map">
                  <area shape="rect" coords="0,0,15,15"  onClick={e => {if (item.qty>0) changeQtyFn(item, item.qty-1)}}/>
                  <area shape="rect" coords="0,16,15,30" onClick={e => changeQtyFn(item, item.qty+1)}/>
                </map>

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
