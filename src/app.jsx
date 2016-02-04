'use strict';

/*
  This provides the top React.js app component.
 */

import React            from 'react';
import MyReactComponent from './my-react-component';
import Catalog          from './catalog';
import Checkout         from './checkout';
import Receipt          from './receipt';

class App extends MyReactComponent {

  constructor(...args) {
    super(...args);

    this.state = {
      category:     null,  // filter category <String>
      itemExpanded: null,  // item to expand

      // ***
      // *** state related to checkout
      // ***

      checkoutOpen: false, // is the checkout dialog open?
      total:        null,  // currency KJB: unsure yet how this is going to work

      receiptId:    null,

      // fields supporting our checkout
      // ... attr names must match <Checkout> form field names
      // KJB: Can state have depth in it's structure, rather than this flat list of field?
      addr1:      "", // string
      addr2:      "", // string
      city:       "", // string
      state:      "IN", // string TODO: we initialize our state strictly to accomidate our unit test ... Can't get TestUtils.Simulate.change() to work with react-select component
      zip:        "", // string
      email:      "", // string
      creditCard: "", // string
      expiry:     "", // string
      fullName:   "", // string
      cvcode:     "", // string
    };
  }

  render() {
    const { items } = this.props;
    const { itemExpanded, category, checkoutOpen, receiptId } = this.state;

    const filteredItems = category ?
                            items.filter(x => x.category === category) :
                            items;
    return (
      <div>
        { checkoutOpen && this.renderCheckoutDialog() }
        { receiptId && this.renderReceiptDialog() } {/* KJB: auto render receipt dialog, when checkout defines a receiptId  */}
        <Catalog items={filteredItems}
                 itemExpanded={itemExpanded}
                 buyFn={this.showCheckoutDialog}
                 categories={App.CATEGORIES}
                 catChangeFn={this.catChange}
                 itemClickFn={this.displayDetailToggle}/>
      </div>
    );
  }


  // ***
  // *** filter category related ...
  // ***

  catChange(e) {
    const cat = e.target.value || null;
    this.setState({ category: cat });
  }



  // ***
  // *** show detail related ...
  // ***

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
  // *** Buy/Checkout related ...
  // ***

  renderCheckoutDialog() {
    const { total } = this.state;

    // fields to send to <Checkout> as a simple property object
    // ... making it simpler to pass to CheckOut
    const fields = {
      addr1:      this.state.addr1,
      addr2:      this.state.addr2,
      city:       this.state.city,
      state:      this.state.state,
      zip:        this.state.zip,
      email:      this.state.email,
      creditCard: this.state.creditCard,
      expiry:     this.state.expiry,
      fullName:   this.state.fullName,
      cvcode:     this.state.cvcode,
    };

    return (
      <div className="checkoutModal">
        <div className="checkoutContainer">
          <Checkout fields={fields}
                    updatedFn={this.updateCheckoutField}
                    total={total}
                    closeCheckoutFn={this.closeCheckoutDialog}
                    saleCompletedFn={this.saleCompleted} />
        </div>
      </div>
    );
  }

  updateCheckoutField(e) {
    // KJB: the property we wish to set is the same as the name of
    //      our input form field (defined in our event as: e.target.name)
    console.log(`SETTING: '${e.target.name}' TO: '${e.target.value}' `);
    this.setState({ [e.target.name]: e.target.value }); // KJB: use new ES6 feature: Computed Property Keys in our JSON
  }

  showCheckoutDialog(item) {
    this.setState({
      checkoutOpen: true,
      total:        item.price
    });
  }

  closeCheckoutDialog() {
    this.setState({ 
      checkoutOpen: false,
      creditCard:   null,      // clear sensitive state
      cvcode:       null,      // clear sensitive state
    });
  }

  saleCompleted(receiptId) {
    this.setState({
      total:        null,
      checkoutOpen: false,     // close our buy/checkout dialog
      receiptId:    receiptId,
      creditCard:   null,      // clear sensitive state
      cvcode:       null,      // clear sensitive state
    });
  }


  // ***
  // *** Receipt related ...
  // ***

  renderReceiptDialog () {
    return (
      <Receipt
          receiptId={this.state.receiptId}
          closeFn={this.closeReceiptDialog} />
    );
  }

  closeReceiptDialog() {
    this.setState({ 
      receiptId:    null
    });
  }


}

App.CATEGORIES = ['Nature', 'React.js']; // filter categories to select from

export default App;
