'use strict';

import { expect, React, ReactDOM, TestUtils } from './util/karma-setup';
const { renderIntoDocument, Simulate } = TestUtils;
import App from './app';

const DATA = require('../public/fake-api.json');

describe('receipt', function () {
  let renderedComp;
  let domNode;
  beforeEach(function () {
    renderedComp = renderIntoDocument(
      <App items={DATA.items} />
    );
    domNode = ReactDOM.findDOMNode(renderedComp);
  });

  it('should not have a receipt', function () {
    const modal = domNode.querySelector('.modal.receipt');
    expect(modal).toNotExist();
  });

  function enterData(data) {
    const fieldNames = ['addr1', 'addr2', 'city', 'state', 'zip', 'email', 'creditCard', 'expiry', 'fullName', 'cvcode'];
    const inputMap = fieldNames.reduce((acc, name) => {
      acc[name] = domNode.querySelector(`.checkout input[name="${name}"]`);
      return acc;
    }, {});
    Object.keys(data).forEach(k => {
      const v = data[k];
      Simulate.change(inputMap[k], { target: { name: k, value: v }});
    });
  }

  describe('clicked on bar buy button from catalog and checkout', function () {
    beforeEach(function () {
      Simulate.click(domNode.querySelector('li[data-id="2"] button.buy'));
      Simulate.click(domNode.querySelector('button.checkout'));
    });

    describe('after entering all fields and clicking pay button', function () {
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
        Simulate.click(domNode.querySelector('.checkout button.pay'));
      });

      it('should show receipt', function () {
        const modal = domNode.querySelector('.modal.receipt');
        expect(modal).toExist();
      });

      describe('clicking close', function () {
        beforeEach(function () {
          Simulate.click(domNode.querySelector('.receipt button.close'));
        });

        it('should close the receipt', function () {
          const modal = domNode.querySelector('.modal.receipt');
          expect(modal).toNotExist();
        });
      });
    });
  });
});
