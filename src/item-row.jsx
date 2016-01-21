'use strict';

import { formatMoney } from 'accounting';
// KJB TEMP (till accounting pkg installed): function formatMoney(i) { return i; }
import React from 'react';

function ItemRow({ item }) {
  return (
    <li data-id={item.id}>  {/* KJB: data-id for testing */}
      <img src={item.img} className="product"/>
      <div className="summary">
        <div className="name">
          { item.name }
        </div>
        <div className="pricing">
          <span className="price">{ formatMoney(item.price) }</span>
        </div>
        <div className="desc">
          { item.desc }
        </div>
      </div>
    </li>
  );
}

export default ItemRow;
