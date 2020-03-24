# COVID-19 Testing Site Finder with Risk Assessment

## Getting Started

* Install [Node.js](https://nodejs.org/en/) >= 8.9.4 and npm >= 5.6.0
    * Check your node version with `node -v`
    * Check your npm version with `npm -v`
* Clone this repo and change directory to the cloned repo
* Add your Google Maps API key to `javascript/test-site-finder/webpack.config.babel.js`
    * Replace `REPLACE_WITH_GOOGLE_MAPS_API_KEY` with yours
* Install dependencies with `npm install`
* Run webpack dev with `npm run webpack-dev`
    * View the app at the local URL of [http://localhost:8082](http://localhost:8082)
    * Search for sites around New York City in order to locate fake site data for testing the application.
* Run webpack builds with `npm run build`
