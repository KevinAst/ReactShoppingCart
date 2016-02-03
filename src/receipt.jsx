'use strict';

import React from 'react';

function Receipt({ receiptId, closeFn }) {
  return (
    <div className="modal receipt">
      <button className="close" onClick={closeFn}>Close</button>
      <h1>Receipt</h1>
      <div className="receiptNumber">
        Receipt#: <span className="receiptId">{ receiptId }</span>
      </div>
    </div>
  );
}

export default Receipt;
