'use strict';

import React from 'react';
import { formatMoney } from 'accounting';

function Checkout({total, closeCheckoutFn}) {
  return (
    <div className="checkout">
      <button onClick={closeCheckoutFn}
              className="closeCheckout">Close</button>
      <span className="total">
        Total:
        <span className="formattedTotal">{ formatMoney(total) }</span>
      </span>
    </div>
  );
}

export default Checkout;
