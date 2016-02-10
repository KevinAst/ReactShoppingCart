'use strict';

import React from 'react';
import MyReactComponent from './my-react-component';
import ItemRow from './item-row';
import { totalItems, unitPrice } from './util/money';
import { formatMoney } from 'accounting';
import Esc from './util/esc';

class Receipt extends MyReactComponent {

  componentDidMount() {
    Esc.regEscHandler(this.props.closeFn);
  }

  componentWillUnmount() {
    Esc.unregEscHandler(this.props.closeFn);
  }

  render() {
    const { items, receiptId, closeFn } = this.props;

    return (
      <div className="modal receipt">
        <button className="close" onClick={closeFn}>Close</button>
        <h1>Receipt</h1>
        <div className="receiptNumber">
          Receipt#: <span className="receiptId">{ receiptId }</span>
        </div>
        <ul>
          { items.map(item =>
            <ItemRow key={item.id}
                     item={item} >
              <span className="qty">Quantity:
                <span className="qtyValue">{ item.qty }</span>
              </span>
              <span className="lineTotal">
                { formatMoney(unitPrice(item.price, item.qty)) }
              </span>
            </ItemRow> ) }
        </ul>
        <div className="total">Total:
          <span className="formattedTotal">{ formatMoney(totalItems(items)) }</span>
        </div>
      </div>
    );
  }
}

export default Receipt;
