// @flow
/* eslint-disable local/import-order, local/prefer-es6-imports */

// Polyfill intl API for older browsers
// This is mostly in its own file because it is very flow and eslint unfriendly
export function polyfillIntl(userLanguage: string) {
  if (!global.Intl) {
    if (userLanguage === 'es') {
      // $FlowFixMe
      require.ensure(['intl', 'intl/locale-data/jsonp/es-US.js'], () => {
        // $FlowFixMe
        require('intl');
        // $FlowFixMe
        require('intl/locale-data/jsonp/es-US.js');
      });
    } else {
      // Fallback to english
      // $FlowFixMe
      require.ensure(['intl', 'intl/locale-data/jsonp/en-US.js'], () => {
        // $FlowFixMe
        require('intl');
        // $FlowFixMe
        require('intl/locale-data/jsonp/en-US.js');
      });
    }
  }
}
