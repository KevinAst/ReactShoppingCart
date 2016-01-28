'use strict';

import React           from 'react';
import { formatMoney } from 'accounting';
import ItemDetails     from './item-details';

function ItemRow({item, itemExpanded, clickFn }) {
  return (
    <li data-id={item.id} onClick={clickFn}>
      <img src={item.img} className="product"/>
      <div className="summary">
        <div className="name">
          { item.name }
        </div>
        { item === itemExpanded
          ? <span>
              <button>
                Collapse Details
              </button>
              <ItemDetails item={itemExpanded}/>
            </span>
          : <span>
              <div className="pricing">
                <span className="price">{ formatMoney(item.price) }</span>
              </div>
              <button>
                Expand Details
              </button>
            </span>
        }
      </div>
    </li>
  );
}

export default ItemRow;
