'use strict';

import Big from 'big.js';

export function totalCartItems(cartItems){
  return cartItems.reduce( (accum, x) => accum.plus(unitPrice(x.price, x.qty)), 
                           Big(0) ); // reduce parm (initial value)
}

export function unitPrice(price, qty) {
  return Big(price).times(Big(qty));
}
