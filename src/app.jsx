'use strict';

/*
  This provides the top React.js app component.
 */

import React            from 'react';
import Catalog          from './catalog';
import MyReactComponent from './my-react-component';

class App extends MyReactComponent {

  constructor(...args) {
    super(...args);

    this.state = {
      itemExpanded: null  // item to expand
    };
  }

  render() {
    const { items }        = this.props;
    const { itemExpanded } = this.state;

    return (
      <div>
        <Catalog items={items}
                 itemExpanded={itemExpanded}
                 itemClickFn={this.displayDetailToggle}/>
      </div>
    );
  }

  displayDetailToggle(item) {
    const {itemExpanded} = this.state;
    if (itemExpanded && itemExpanded.id === item.id) { // toggle off already selected
      this.setState({itemExpanded: null}); // close detail
    }
    else {
      this.setState({itemExpanded: item}); // expand detail
    }
  }

}

export default App;
