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
      category:     null, // filter category <String>
      itemExpanded: null  // item to expand
    };
  }

  render() {
    const { items } = this.props;
    const { itemExpanded, category } = this.state;

    const filteredItems = category ?
                            items.filter(x => x.category === category) :
                            items;
    return (
      <div>
        <Catalog items={filteredItems}
                 itemExpanded={itemExpanded}
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

}

App.CATEGORIES = ['Nature', 'React.js']; // filter categories to select from

export default App;
