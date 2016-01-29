'use strict';

import { expect, React, ReactDOM, TestUtils } from './util/karma-setup';

import App from './app';                         // KJB: component under test
const DATA = require('../public/fake-api.json'); // KJB: same fixture data browser sync is serving

import { formatMoney } from 'accounting';

describe('Checkout Tests', function () {

  // KJB: NOTE: This fixture is setup statically (i.e. outside of beforeEach()
  //      ... because I am generating dynamic tests [i.e. it()] that use this data,
  //      ... which drive the it() characteristics
  //      ... this is possible because our tests do NOT modify the fixture (i.e. it is read-only)
  let renderedComp    = TestUtils.renderIntoDocument(<App items={DATA.items}/>);
  let renderedDomNode = ReactDOM.findDOMNode(renderedComp);

  describe('item-row buy clicked', function () {
    beforeEach(function () {
      TestUtils.Simulate.click(renderedDomNode.querySelector('.catalog li[data-id="1"] button.buy'));
    });
  
    it('should show checkout modal', function () {
      const modal = renderedDomNode.querySelector('.checkoutModal .checkout');
      expect(modal).toExist();
    });
  
    it('should have proper total', function () {
      const formattedTotal = renderedDomNode.querySelector('.checkout .formattedTotal');
      const expectedValue = formatMoney(DATA.items[0].price);
      expect(formattedTotal.innerHTML).toBe(expectedValue);
    });
  });

});
