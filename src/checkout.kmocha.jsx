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
  //      TODO: this has started to be a bit dicy with the advent of entering data (must fill in fields in the right order)
  let renderedComp    = TestUtils.renderIntoDocument(<App items={DATA.items}/>);
  let renderedDomNode = ReactDOM.findDOMNode(renderedComp);

  
  // KJB: utility driving GUI data entry for validation tests
  function enterData(data) { // data is simple object with field/value pairs ... ex: { email: 'a@b.com', expiry: '12/20' }
    const fieldNames = ['addr1', 'addr2', 'city', 'state', 'zip', 'email', 'creditCard', 'expiry', 'fullName', 'cvcode'];

    // KJB: kool - provides a DOM mapping of all our input fields
    //      ... ex: inputDomMap.email is the dom input for email
    const inputDomMap = fieldNames.reduce((acc, name) => {
      acc[name] = renderedDomNode.querySelector(`.checkout input[name="${name}"]`);
      return acc;
    }, {});

    // KJB: for each item passed in (ex: data.email), use it's value to update the GUI
    Object.keys(data).forEach(k => {
      const v = data[k];

      // KJB: kool - simulate change in our input dom
      // TODO: for k==="state", figure out how TestUtils.Simulate.change() works with react-select component, THEN un-initialize this.state.state in app.jsx
      TestUtils.Simulate.change(inputDomMap[k], { target: { name: k, value: v }});
    });
  }


  describe('item-row buy clicked and checkout', function () {
    beforeEach(function () {
      TestUtils.Simulate.click(renderedDomNode.querySelector('.catalog li[data-id="1"] button.buy'));
      TestUtils.Simulate.click(renderedDomNode.querySelector('button.checkout'));
    });

    // KJB: do this first due to non beforeEach() setup, don't want buy button to be clicked twice
    it('should have proper total', function () {
      const formattedTotal = renderedDomNode.querySelector('.checkout .formattedTotal');
      const expectedValue = formatMoney(DATA.items[0].price);
      expect(formattedTotal.innerHTML).toBe(expectedValue);
    });
  
    it('should show checkout modal', function () {
      const modal = renderedDomNode.querySelector('.checkoutModal .checkout');
      expect(modal).toExist();
    });

    it('should not have errors displayed initially', function () {
      const errors = renderedDomNode.querySelector('.checkout .errors');
      expect(errors).toNotExist();
    });


    describe('clicking pay button without filling anything in', function () {
      beforeEach(function () {
        TestUtils.Simulate.click(renderedDomNode.querySelector('button.pay'));
      });

      it('should show 8 errors', function () {
        const errorDivs = renderedDomNode.querySelectorAll('.checkout .error');
        expect(errorDivs.length).toBe(8);
      });

      describe('after entering email', function () {
        beforeEach(function () {
          const email = renderedDomNode.querySelector('.checkout input[name="email"]');
          TestUtils.Simulate.change(email, { target: { name: 'email', value: 'a@b.com' }});
        });

        it('should have 7 errors', function () {
          const errorDivs = renderedDomNode.querySelectorAll('.checkout .error');
          expect(errorDivs.length).toBe(7);
        });

      });

      describe('after entering partial data', function () {

        beforeEach(function () {
          enterData({
            email: 'a@b.com',
            creditCard: '4111111111111111',
            expiry: '12/20'
          });
        });

        it('should have 5 errors', function () {
          const errorDivs = renderedDomNode.querySelectorAll('.checkout .error');
          expect(errorDivs.length).toBe(5);
        });
      });

      describe('after entering all fields', function () {
        beforeEach(function () {
          enterData({
            addr1: '3005 Williams Ct.',
            city:  'Kokomo',
            state: 'IN',
            zip:   '54321',
            email: 'a@b.com',
            creditCard: '4111111111111111',
            expiry: '12/20',
            fullName: 'John Smith',
            cvcode: '123'
          });
        });

        it('should NOT have errors', function () {
          const errors = renderedDomNode.querySelector('.checkout .errors');
          expect(errors).toNotExist();
        });
      });

    });

  });
});
