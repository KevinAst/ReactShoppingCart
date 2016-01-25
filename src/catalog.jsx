'use strict';

import React from 'react';
import ItemRow from './item-row';

//Stateless function components React.js 0.14+
function Catalog({items}) {
  return (
    <ul className="product catalog">
      { items.map(item => (
          <ItemRow key={item.id} item={item} /> ))
      }
    </ul>
  );
}

export default Catalog;
