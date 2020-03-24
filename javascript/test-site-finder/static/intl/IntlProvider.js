// @flow

import React from 'react';
import type {Node} from 'react';
import {addLocaleData, IntlProvider} from 'react-intl';
// $FlowFixMe
import localDataEs from 'react-intl/locale-data/es';

import {polyfillIntl} from './polyfillIntl';
import {IntlProviderNewContextAdapter} from './context';

// $FlowFixMe
import spanishMessages from './message_es.yml';

type OwnProps = {|
  children: Node,
  userLanguage: string,
|};

type StateProps = {|
  userLanguage: string,
|};

type Props = {|
  ...OwnProps,
  ...StateProps,
|};

const LanguageToLocale = {
  en: 'en-US',
  es: 'es-US',
};

export function SpanishIntlProvider(props: Props) {
  // Not ideal that these side effect functions (polyfillIntl, addLocaleData)
  // are happening directly in the render, since render will be executed many
  // times. Hesitant to change that behavior right now without understanding
  // intl/react-intl more deeply.
  polyfillIntl(props.userLanguage);

  let intlMessages;
  if (props.userLanguage === 'es') {
    intlMessages = spanishMessages;
    addLocaleData(localDataEs);
  }

  const locale = LanguageToLocale[props.userLanguage];
  return (
    <IntlProvider defaultLocale="en-US" locale={locale} messages={intlMessages}>
      <IntlProviderNewContextAdapter>{props.children}</IntlProviderNewContextAdapter>
    </IntlProvider>
  );
}
