'use strict';

/*
  This will contain the top React.js app component
 */

import React from 'react';
import Catalog from './catalog';

class App extends React.Component {
  render() {
    const items = this.props.items;
    console.log("KJB: in App.render()");
    return (
      <div>
        <Catalog items={items} />
      </div>
    );
  }
}

export default App;
