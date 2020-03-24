// @flow
// Note: this can be removed if react-intl is upgraded and we
// switch all useIntl callsites to use the hook from react-intl
import React from 'react';
import {injectIntl} from 'react-intl';
import type {IntlShape} from 'react-intl';

const defaultContextValue: any = null;
export const IntlContext = React.createContext<IntlShape>(defaultContextValue);

// Pulls intl from the injectIntl HOC and provides it through the react 16+ new
// context so that it can be used via useIntl.
// Only used once at the top level of the app.
export const IntlProviderNewContextAdapter = injectIntl(({intl, children}) => (
  <IntlContext.Provider value={intl}>{children}</IntlContext.Provider>
));

export function useIntl() {
  return React.useContext(IntlContext);
}
