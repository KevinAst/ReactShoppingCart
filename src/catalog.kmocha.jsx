'use strict';

import { expect, React, ReactDOM, TestUtils } from './util/karma-setup';
const { renderIntoDocument, Simulate } = TestUtils; // KJB: NO LIKEY ... for the same reason you qualify ReactDOM (below) I would prefer to qualify TestUtils

import App from './app';                         // KJB: component under test
const DATA = require('../public/fake-api.json'); // KJB: same fixture data browser sync is serving

describe('catalog', function () {

  let renderedComp;
  let domNode;
  beforeEach(function () {             // KJB: create a freshly rendered App component before each test
    renderedComp = renderIntoDocument( // KJB: react's test-utils ... creates a document fragment
      <App items={DATA.items}/>
    );
    domNode = ReactDOM.findDOMNode(renderedComp);
  });

  describe('default', function() {
    it('should display all items', function () {
      // Simulate.click(domNode); // can click on or change things KJB: No simulated user interaction needed
      const li = domNode.querySelectorAll('.catalog li');
      expect(li.length).toBe(DATA.items.length);
    });
  });

});
