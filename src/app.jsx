'use strict';

/*
  This provides the top React.js app component.
 */

import React            from 'react';
import MyReactComponent from './my-react-component';
import Catalog          from './catalog';
import Checkout         from './checkout';

class App extends MyReactComponent {

  constructor(...args) {
    super(...args);

    this.state = {
      category:     null,  // filter category <String>
      itemExpanded: null,  // item to expand
      checkoutOpen: false, // is the checkout dialog open?
      total:        null,  // currency TODO: KJB should we be passing the item to checkout rather than the total?
    };
  }

  render() {
    const { items } = this.props;
    const { itemExpanded, category, checkoutOpen } = this.state;

    const filteredItems = category ?
                            items.filter(x => x.category === category) :
                            items;
    return (
      <div>
        { checkoutOpen && this.checkout() }
        <Catalog items={filteredItems}
                 itemExpanded={itemExpanded}
                 buyFn={this.buyItem}
                 categories={App.CATEGORIES}
                 catChangeFn={this.catChange}
                 itemClickFn={this.displayDetailToggle}/>
      </div>
    );
  }

  catChange(e) {
    const cat = e.target.value || null;
    this.setState({ category: cat });
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




  // ***
  // *** Checkout related ...
  // ***

  checkout() {
    const { total } = this.state;
    return (
      <div className="checkoutModal">
        <div className="checkoutContainer">
          <Checkout total={total}
                    closeCheckoutFn={this.closeCheckoutClicked} />
        </div>
      </div>
    );
  }

  buyItem(item) {
    this.setState({
      checkoutOpen: true,
      total:        item.price
    });
  }

  closeCheckoutClicked() {
    this.setState({ checkoutOpen: false });
  }

}

App.CATEGORIES = ['Nature', 'React.js']; // filter categories to select from

export default App;
