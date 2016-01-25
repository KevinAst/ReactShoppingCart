'use strict';

import { expect, React, ReactDOM, TestUtils } from './util/karma-setup';
const { renderIntoDocument, Simulate } = TestUtils; // KJB: NO LIKEY ... for the same reason you qualify ReactDOM (below) I would prefer to qualify TestUtils

import App from './app';                         // KJB: component under test
const DATA = require('../public/fake-api.json'); // KJB: same fixture data browser sync is serving

import { formatMoney } from 'accounting';

describe('Catalog Tests', function () {

  // KJB: NOTE: This fixture is setup statically (i.e. outside of beforeEach()
  //      ... because I am generating dynamic tests [i.e. it()] that use this data,
  //      ... which drive the it() characteristics
  //      ... this is possible because our tests do NOT modify the fixture (i.e. it is read-only)
  let renderedComp    = renderIntoDocument(<App items={DATA.items}/>);
  let renderedDomNode = ReactDOM.findDOMNode(renderedComp);
  let renderedLiNodes = renderedDomNode.querySelectorAll('.catalog li');

  describe('Checking rendered items', function() {

    it('Setup should be as expected', function () {
      expect(renderedComp).toExist();
      expect(renderedDomNode).toExist();
      expect(renderedLiNodes).toExist();
    });

    it('Insure we render ALL items', function () {
      expect(renderedLiNodes.length).toBe(DATA.items.length);
    });

    // dynamically generate a series of tests for each item
    for (let i=0; i<renderedLiNodes.length; i++) {
      const li   = renderedLiNodes[i];
      const item = DATA.items[i];

      describe(`Verify Item[${i}]`, function() {

        // Verify Names
        const expectedName = item.name;
        it(`name[${i}]: ${expectedName}`, function() {
          const nameElm = li.querySelector(".name");
          expect(nameElm).toExist();
          expect(nameElm.textContent).toEqual(expectedName);
        });

        // Verify Prices
        const expectedPrice = formatMoney(item.price);
        it(`price[${i}]: ${expectedPrice}`, function() {
          const priceElm = li.querySelector(".price");
          expect(priceElm).toExist();
          expect(priceElm.textContent).toEqual(expectedPrice);
        });

        // Verify Descriptions
        const expectedDesc = item.desc;
        it(`description[${i}]: ${expectedDesc}`, function() {
          const descElm = li.querySelector(".desc");
          expect(descElm).toExist();
          expect(descElm.textContent).toEqual(expectedDesc);
        });

      });
    }
  });
});
