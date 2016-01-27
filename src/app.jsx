'use strict';

/*
  This will contain the top React.js app component
 */

import React            from 'react';
import Catalog          from './catalog';
import ItemDetails      from './item-details';
import MyReactComponent from './my-react-component';

class App extends MyReactComponent {

  constructor(...args) {
    super(...args);

    this.state = {
      itemExpanded: null  // item to expand
      //itemExpanded: this.props.items[0] // ??? TEMP FOR NOW
    };
  }

  render() {

    const { items }        = this.props;
    const { itemExpanded } = this.state;

    console.log("KJB: in App.render()");
    return (
      <div>
        { itemExpanded && this.details() }
        <Catalog items={items}
                 itemClickFn={this.displayDetailToggle}/>
      </div>
    );
  }

  details() {
    const { itemExpanded } = this.state;
    return (
      <ItemDetails item={itemExpanded}
                   closeFn={this.closeDetail} />
    );
  }

  displayDetailToggle(item) {
    const {itemExpanded} = this.state;
    if (itemExpanded && itemExpanded.id === item.id) { // toggle off already selected
      this.closeDetail();
    }
    else {
      this.setState({itemExpanded: item});
    }
  }

  closeDetail() {
    this.setState({itemExpanded: null});
  }

}

export default App;
