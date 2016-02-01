# ReactShoppingCart

This is Kevin's sandbox for CodeWinds University React training course
(Jeff Barczewski http://codewinds.com/).

This project implements a shopping cart application, with check-out
and receipt, retrieving data from simulated rest service.

## Various branches include:

- 185-fetch-data: Fetching data with Axios
- 190-catalog: Provide a visual catalog of our items for sale
- 215-216-testing: Introduction to unit testing using Karma, Mocha, and Expect
- 220-item-details: Added support for "show item details" in our app
- 226-inline-detail: Display details inline
- 230-catalog-filter: Provide a category filter in our Catalog display
- 240-catalog-buy-buttons: Provide "buy" button basics
- 250-checkout: Collect billing info with a form
- 260-validate-submit: Provide checkout validation using joi framework


## Jeff's Notes:

Features:

 - **React.js JSX example which fetches from REST source and renders**
 - **simple build and auto rebuild** (watch) using npm run scripts
 - **browser-sync** for auto reloading in browser on change
 - **ES6/7 and JSX compiling** to ES5 with **babeljs**
 - **eslint** for linting
 - **browserify** (w/babelify) for bundling javascript for the browser
 - **watchify** to automatically rebuild on changes
 - **uglify** for js minification
 - **less** CSS style compiler
 - **autoprefixer** for automatically adding css prefixes
 - **cleancss** for css minification
 - **karma** for js unit testing in browsers or phantomjs
 - **phantomjs** for headless testing in browser
 - **axios** for promise based HTTP client
 - **cross platform** - runs on Mac OS X, linux, unix, windows


Structure:

 - package.json - dependencies and build commands
 - public/index.html - main HTML
 - public/fake-api.json - mock REST api returning json data
 - src/browser.jsx - React.js JSX code which fetches REST data and renders App component into the main HTML
 - src/app.jsx - Main app component used to display data
 - src/items.kmocha.jsx - sample karma mocha test for items
 - src/util/polyfill.js - Import any core-js or other polyfills here
 - src/util/karma-setup.js - common karma setup
 - style/site.less - CSS styles used by site, edit or import into
 - .babelrc - babel configuration
 - bs-config.js - browser-sync config, set browser to launch
 - karma.conf.js - karma test configuration
 - postcss.json - postcss config controls autoprefixer
 - dist/ - contains compiled and minified css and js

Notes:

 - My default browser for browser-sync is `Google Chrome`, if you want
   to use a different browser like `Google Chrome Canary` or `Mozilla
   Firefox` edit `bs-config.js`


## Installation

Requires node.js/iojs >= 0.10

```bash
npm install ## install dependent node modules
```

## Usage

TODO: update with your usage

Primary use - auto build and reload browser
```bash
npm run watch # build and watch, auto recompile and load changes
# use control-c to exit the autobuild watch

# start is also aliased to run watch
npm start # executes npm run watch
```

Build only
```bash
npm run build # build only
```

Single run of tests
```bash
npm test
```

Build for Production
```bash
npm run prod-build # sets NODE_ENV=production then builds
```


## Goals

TODO: Add your goals here

## Why

TODO: Add your description of why you created this

## Get involved

If you have input or ideas or would like to get involved, you may:

 - contact me via twitter @jeffbski  - <http://twitter.com/jeffbski>
 - open an issue on github to begin a discussion - <https://github.com/jeffbski/react-cart/issues>
 - fork the repo and send a pull request (ideally with tests) - <https://github.com/jeffbski/react-cart>

## License

 - [MIT license](http://github.com/jeffbski/react-cart/raw/master/LICENSE)
