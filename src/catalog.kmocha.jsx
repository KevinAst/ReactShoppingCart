'use strict';

import { expect, React, ReactDOM, TestUtils } from './util/karma-setup';

import App from './app';                         // KJB: component under test
const DATA = require('../public/fake-api.json'); // KJB: same fixture data browser sync is serving

import { formatMoney } from 'accounting';

describe('Catalog Tests', function () {

  // KJB: NOTE: This fixture is setup statically (i.e. outside of beforeEach()
  //      ... because I am generating dynamic tests [i.e. it()] that use this data,
  //      ... which drive the it() characteristics
  //      ... this is possible because our tests do NOT modify the fixture (i.e. it is read-only)
  let renderedComp    = TestUtils.renderIntoDocument(<App items={DATA.items}/>);
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

        // NO LONGER DISPLAYED (in our in-line version)
        // // Verify Descriptions
        // const expectedDesc = item.desc;
        // it(`description[${i}]: ${expectedDesc}`, function() {
        //   const descElm = li.querySelector(".desc");
        //   expect(descElm).toExist();
        //   expect(descElm.textContent).toEqual(expectedDesc);
        // });

      });
    }

    // dynamic interaction showing detail in modal
    // ... first item only (foo) ... kinda a brittle test
    describe("Clicking image from catalog", function() {
    
      let fooImg = null;
      
      beforeEach(function() {
        fooImg = renderedDomNode.querySelector("li[data-id='1'] img.product");
      });
    
      it("should show details for foo (when clicked)", function() {
        TestUtils.Simulate.click(fooImg); // first click should show
        const details = renderedDomNode.querySelector(".details[data-id='1']");
        expect(details).toExist();
      });
    
      it("should hide details when foo clicked twice", function() {
        TestUtils.Simulate.click(fooImg); // second click should hide
        const details = renderedDomNode.querySelector(".details[data-id='1']");
        expect(details).toNotExist();
      });
    });

  });


  describe('Check filtered items', function() {

    // dynamically generate a series of tests for each item
    for (const testSelector of ["React.js", "Nature", ""]) {

      describe(`select category '${testSelector}'`, function () {

        beforeEach(function () {
          const select = renderedDomNode.querySelector('select.category');
          TestUtils.Simulate.change(select, { target: { value: 'Nature' }});     // initially select anything
          TestUtils.Simulate.change(select, { target: { value: testSelector }}); // now select the desired item
        });

        it(`should display '${testSelector}' items`, function () {
          const listItems = renderedDomNode.querySelectorAll('.catalog li');
          expect(listItems.length).toBe(filterData(testSelector).length);
        });

        function filterData(selector) {
          return selector 
               ? DATA.items.filter(x => x.category===selector)
            : DATA.items;
        }

      });

    }

  });


});
