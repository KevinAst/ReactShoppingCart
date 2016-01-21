'use strict';

/*
   Main file which browser launches

   Catalog and Shopping Cart example app
   - Fetches catalog data from REST API
   - Renders as catalog
   - Shopping cart of selected items
   - Checkout form with validation
 */

// KJB: include needed polyfills (since this the top-level js entry point in our app)
import './util/polyfill'; // first import polyfills
import httpClient from 'axios';

function fetchData() {
  return httpClient({ url: '/fake-api.json' });
}

function fetchDataAndRender() {
  fetchData()
    .then(resp => console.log('data', resp.data))
    .catch(err => {
      console.error(err);
    });
}

fetchDataAndRender();
