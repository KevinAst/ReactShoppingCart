'use strict';

/*
  This provides the top React.js app component.
 */

import React            from 'react';
import MyReactComponent from './my-react-component';
import Catalog          from './catalog';
import Cart             from './cart';
import Checkout         from './checkout';
import Receipt          from './receipt';

class App extends MyReactComponent {

  constructor(...args) {
    super(...args);

    this.state = {
      category:     null,  // filter category <String>
      itemExpanded: null,  // item to expand


      // ***
      // *** state related to cart
      // ***

      cartOpen: false,
      cartItems: [],

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
    const { itemExpanded, cartOpen, category, checkoutOpen, receiptId } = this.state;

    const filteredItems = category ?
                            items.filter(x => x.category === category) :
                            items;
    return (
      <div>
        { cartOpen && this.renderCartDialog() }
        { checkoutOpen && this.renderCheckoutDialog() }
        { receiptId && this.renderReceiptDialog() } {/* KJB: auto render receipt dialog, when checkout defines a receiptId  */}

        <span className="cartButton">
          <a onClick={this.toggleCartDisplayed}>Cart</a>
        </span>

        <Catalog items={filteredItems}
                 itemExpanded={itemExpanded}
                 buyFn={this.buyItem}
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
  // *** Cart related ...
  // ***

  renderCartDialog() {
    const cartItems = this.state.cartItems;
    return (
      <Cart cartItems={cartItems}
            closeFn={this.toggleCartDisplayed}
            removeItemFn={this.removeItem}
            changeQtyFn={this.changeQty}
            checkoutFn={total =>
              this.setState({checkoutOpen:true,  /* open checkout ... kinda new showCheckoutDialog() */
                             total: total        /* with this total */}) } />
    );
  }

  toggleCartDisplayed() {
    this.setState({ cartOpen: !this.state.cartOpen });
  }

  removeItem(cartItem) {
    // filter out all but supplied item
    const _cartItems = this.state.cartItems.filter(x => cartItem.id !== x.id);
    this.setState({ cartItems: _cartItems });
  }

  changeQty(cartItem, nextQty) {
    const _cartItems = this.state.cartItems.map(x => {
      if (x.id === cartItem.id)
        return Object.assign({}, x, { qty: nextQty });
      else
        return x;
    });
    this.setState({ cartItems: _cartItems });
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

  // buy selected item
  // ... either place in our shopping cart (on first occurrance), or increment quantity (when item is already in cart)
  // ... NOTE: KEY: this is where item is morphed into a cartItem
  buyItem(item) { // NOTE: item is a raw item (from Catalog), NOT a cartItem
    // KJB: We want to setState with a new array of cartItems (because of our immutable state)
    //      ... we can re-use array elms (if they do not change)
    // KJB: This kjb version will NOT force existing cartItems to be at end

    // clone cartItems state array, identifying location of desired item (if present)
    let itemIndx = -1;
    const _cartItems = this.state.cartItems.filter( (x,indx) => {
      if (item.id === x.id)
        itemIndx = indx;
      return true; // retain all items
    });

    // if desired item is NOT present, inject new cartItem at end
    if (itemIndx === -1) {
      _cartItems.push( Object.assign({}, item, {qty: 0}) ); // NOTE: we morph a regular item into a cartItem here <KEY>!
      itemIndx = _cartItems.length - 1;
    }

    // increment our quantity
    _cartItems[itemIndx].qty++;

    // retain our state new state
    this.setState({
      cartOpen:     true,       // open cart
      cartItems:    _cartItems, // our new array with new cartItem or incremented qty
      itemExpanded: null        // close expansion (when expanded)
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
      cartItems:    [],        // clear our shopping cart
      cartOpen:     false,     // close our shopping cart
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
