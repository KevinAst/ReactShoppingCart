'use strict';

import React from 'react';
import { formatMoney } from 'accounting';

function ItemDetails({item, closeFn}) {
  return (
    <div className="modal details"
         data-id={item.id}>

      <button onClick={closeFn}>Close</button>

      <img className="itemImg" src={item.img}/>

      <div><span className="text-label">Name:</span>        { item.name }</div>
      <div><span className="text-label">Category:</span>    { item.category }</div>
      <div><span className="text-label">Price:</span>       { formatMoney(item.price) }</div>
      <div><span className="text-label">Description:</span> { item.desc }</div>
      <div><span className="text-label">Details:</span>     { item.details }</div>

    </div>
  );
}

export default ItemDetails;
