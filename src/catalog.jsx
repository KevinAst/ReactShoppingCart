'use strict';

import React from 'react';
import ItemRow from './item-row';

function Catalog({items, itemExpanded, itemClickFn}) {
  return (
    <ul className="product catalog">
      { items.map(item => (
          <ItemRow key={item.id}
                   item={item}
                   itemExpanded={itemExpanded}
                   clickFn={() => itemClickFn(item)}/> ))
      }
    </ul>
  );
}

export default Catalog;
