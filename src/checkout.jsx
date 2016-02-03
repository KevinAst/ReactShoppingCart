'use strict';

import React from 'react';
import MyReactComponent from './my-react-component';
import { formatMoney } from 'accounting';
import Joi from 'joi-browser';
import shortid from 'shortid';

const CHECKOUT_SCHEMA = Joi.object().keys({

  addr1:      Joi.string().required(),
  addr2:      Joi.any().optional(),
  city:       Joi.string().required(),
  state:      Joi.string().required(),
  zip:        Joi.string().required().regex(/^\d{5}(-\d{4})?$/, 'ddddd[-dddd]'),

  email:      Joi.string().required(),

  creditCard: Joi.string().required().creditCard(),
  expiry:     Joi.string().required().regex(/^[01][0-9]\/[0-9]{2}$/, 'mm/YY'),
  fullName:   Joi.string().required(),
  cvcode:     Joi.string().required().min(3).max(4).regex(/^\d{3,4}$/, 'all digits')
});



class Checkout extends MyReactComponent {

  constructor(...args) {
    super(...args);

    this.state = {
      showErrors: false, // are we showing errors in our dialog?
      error:      null   // the most current joi validation errors result {array}
    };
  }

  render() {
    const { fields, total, closeCheckoutFn, updatedFn, saleCompletedFn} = this.props;

    const { error, showErrors } = this.state;

    // utility function to peform validation, in addition to our normal parameterized update
    const updateAndValidateFn = (e) => {
      const updatedProps = 
              Object.assign({},
                            fields, // merge our current fields
                            { [e.target.name]: e.target.value }); // with the recent change

      // perform our usual update
      updatedFn(e);

      // validate our fields and reflect errors in our gui
      const res = validate(updatedProps);
      this.setState({ error: res.error }); // ... can be undefined, when valid
    };

    // utility function to format our Credic Card (when it looses focus)
    const updatedCreditCardFn = (e) => {
      const fieldName = e.target.name;
      const card      = e.target.value;
      updateAndValidateFn({
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
      updateAndValidateFn({
        target: {
          name:  fieldName,
          value: formatExpiry(expiry)
        }
      });
    };

    // utility function to process a purchase
    const purchaseClick = (e) => {

      // prevent other handlers from firing (in this case our form would do a submit)
      // ... KJB: vs. stopPropagation()
      //          google: event stopPropagation vs. preventDefault
      e.preventDefault();

      // perform validation
      const res = validate(fields);
      this.setState({ showErrors: res.error, // (boolean truethy) stop showing errors once valid again
                      error:      res.error
                     }, 
                    () => { // callback of setState() to be executed once state has been applied and rendered

                      // for errors ...
                      if (res.error) {
                        // give focus to first invalid field
                        this.refs[res.error.details[0].path].focus();
                      }
                      
                      // for no errors ...
                      else {
                        // we can now submit to server and if successful transition
                        // to receipt
                        // be sure to send server item ids and total, let it verify total
                        // again, if anything is wrong return error
                        // TODO post to server
                        const receiptId = shortid.generate(); // TODO eventually from server
                        saleCompletedFn(receiptId);
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
        { error && showErrors && this.errors() }
        <div className="formWrapper">
          <form>
            <fieldset className="userInfo">
              <legend>User Info</legend>

              <fieldset>
                <legend>Shipping Address</legend>
                <input name="addr1" ref="addr1" defaultValue={fields.addr1} onChange={updateAndValidateFn} placeholder="address line 1" autoFocus="true"/>
                <input name="addr2" ref="addr2" defaultValue={fields.addr2} onChange={updateAndValidateFn} placeholder="address line 2"/>
                <input name="city"  ref="city"  defaultValue={fields.city}  onChange={updateAndValidateFn} placeholder="city"/>
                <input name="state" ref="state" defaultValue={fields.state} onChange={updateAndValidateFn} placeholder="state"/>
                <input name="zip"   ref="zip"   defaultValue={fields.zip}   onChange={updateAndValidateFn} placeholder="zip"/>
              </fieldset>

              <fieldset>
                <legend>Email</legend>
                <input name="email"
                       ref="email"
                       defaultValue={fields.email}
                       onChange={updateAndValidateFn}
                       placeholder="Your email address" />
              </fieldset>
            </fieldset>

            <fieldset className="creditCardInfo">
              <legend>Credit Card</legend>
              <label className="ccLabel">
                <span>CardNumber</span>
                <input name="creditCard"
                       ref="creditCard"
                       value={fields.creditCard}
                       onChange={updateAndValidateFn}
                       onBlur={updatedCreditCardFn}
                       placeholder="1234 5678 90123" />
              </label>
              <div className="meta">
                <label>
                  <span>Expiry Date</span>
                  <input name="expiry"
                         ref="expiry"
                         onChange={updateAndValidateFn}
                         onBlur={updatedExpiryFn}
                         value={fields.expiry}
                         placeholder="mm/YY" />
                </label>
                <label>
                  <span>Full Name</span>
                  <input name="fullName"
                         ref="fullName"
                         onChange={updateAndValidateFn}
                         defaultValue={fields.fullName}
                         placeholder="John Doe"
                  />
  
                </label>
                <label>
                  <span>CV Code</span>
                  <input name="cvcode"
                         ref="cvcode"
                         onChange={updateAndValidateFn}
                         placeholder="123" />
                  {/*  KJB: we don't retain show any value on because it is sensitive
                            ... unsure how this works
                            ... seems like it would blank out all the time
                            ... need to better understand
                  */}
                </label>
              </div>
            </fieldset>
            <button className="pay"
                    onClick={purchaseClick}>
              Pay
            </button>
          </form>
        </div>
  
      </div>
    );
  }

  errors() {
    const errors = this.state.error.details;
    return (
      <div className="errors">
        { errors.map(x => (
            <div className="error" key={x.message}>
              { x.message }
            </div>
          )) }
      </div>
    );
  }


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

// perform Joi validation
function validate(fields) {
  const ccFormatted = fields.creditCard || '';
  const rawFields = Object.assign(
    {},
    fields,
    { creditCard: ccFormatted.replace(/\s/g, '') } // KJB: raw creditCard (i.e. remove spaces)
  );
  return Joi.validate(rawFields, CHECKOUT_SCHEMA, {
    abortEarly: false // KJB: give us all the errors at once
  });
}

export default Checkout;
