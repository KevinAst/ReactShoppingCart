'use strict';

import React from 'react';
import { formatMoney } from 'accounting';

function Checkout({fields, total, closeCheckoutFn, updatedFn}) {

  // utility function to format our Credic Card (when it looses focus)
  const updatedCreditCardFn = (e) => {
    const fieldName = e.target.name;
    const card      = e.target.value;
    updatedFn({
      target: {
        name:  fieldName,
        value: formatCreditCard(card)
      }
    });
  };

  // utility function to format our Expiry Date (when it looses focus)
  const updatedExpiryFn = (e) => {
    const fieldName = e.target.name;
    const expiry    = e.target.value;
    updatedFn({
      target: {
        name:  fieldName,
        value: formatExpiry(expiry)
      }
    });
  };

  return (
    <div className="checkout">
      <button onClick={closeCheckoutFn}
              className="closeCheckout">Close</button>
      <span className="total">
        Total:
        <span className="formattedTotal">{ formatMoney(total) }</span>
      </span>
      <div className="formWrapper">
        <form>
          <fieldset className="userInfo">
            <legend>Email</legend>
            <input name="email"
                   defaultValue={fields.email}
                   onChange={updatedFn}
                   autoFocus="true"
                   placeholder="Your email address" />
          </fieldset>
          <fieldset className="creditCardInfo">
            <legend>Credit Card</legend>
            <label className="ccLabel">
              <span>CardNumber</span>
              <input name="creditCard"
                     value={fields.creditCard}
                     onChange={updatedFn}
                     onBlur={updatedCreditCardFn}
                     placeholder="1234 5678 90123" />
              {/* ??? 
              value={fields.creditCard}
              onChange={updatedFn}
              onBlur={updatedCreditCardFn}
              */}
            </label>
            <div className="meta">
              <label>
                <span>Expiry Date</span>
                <input name="expiry"
                       onChange={updatedFn}
                       onBlur={updatedExpiryFn}
                       value={fields.expiry}
                       placeholder="mm/YY" />
              </label>
              <label>
                <span>Full Name</span>
                <input name="fullName"
                       onChange={updatedFn}
                       defaultValue={fields.fullName}
                       placeholder="John Doe"
                />

              </label>
              <label>
                <span>CV Code</span>
                <input name="cvcode"
                       onChange={updatedFn}
                       placeholder="123" />
                {/*  ??? we don't retain show any value on because it is sensitive
                     ... unsure how this works ... seems like it would blank out all the time
                     ... need to better understand
                */}
              </label>
            </div>
          </fieldset>
          <button className="pay">Pay</button>
        </form>
      </div>

    </div>
  );
}


function formatCreditCard(card) {
  const digits = card.replace(/[\D]/g, ''); // strip non-digits
  // amex 4 digits + 6 digits + 5 digits
  if (digits[0] === '3') {
    return (digits.slice(0, 4) + ' ' + // first 4
            digits.slice(4, 10) + ' ' + // next 6
            digits.slice(10)).trim(); // remaining 5
  } else {
    // other cards split groups of 4 digits
    return (digits.slice(0, 4) + ' ' +
            digits.slice(4, 8) + ' ' +
            digits.slice(8, 12) + ' ' +
            digits.slice(12)).trim();
  }
}


function formatExpiry(expiry) {
  let [mm, yy] = expiry.split('/');
  if (typeof yy !== 'string' && mm.length > 2) {
    yy = mm.slice(2);
    mm = mm.slice(0, 2);
  }
  mm = pad2(mm);
  if (!yy) return mm;
  yy = pad2(yy);
  return [mm, yy].join('/');
}

function pad2(amt) {
  if (amt.length === 1) return '0'+amt;
  return amt;
}

export default Checkout;
