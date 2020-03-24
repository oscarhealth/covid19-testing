// @flow
import {createHistory} from 'history';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {combineReducers, createStore} from 'redux';
import {reducer} from 'redux-form';

import {CSSReset} from 'common/css-reset';
import {BoxSizingReset} from 'common/css-reset/BoxSizingReset';
import GoogleMapLoaded from 'common/map/GoogleMapLoaded';

import {SpanishIntlProvider} from './intl/IntlProvider';
import Home from './pages/home';
import Assessment from './pages/assessment';
import NoMatch from './pages/nomatch';
import Search from './pages/search';
import {SearchResultsProvider} from './pages/search/Context';
import SearchResult from './pages/searchresult';
import Location from './pages/location';

const store = createStore(combineReducers({form: reducer}));
const history = createHistory();

export const LanguageContext = React.createContext('en');

function App() {
  const [language, setLanguage] = useState('en');

  return (
    <>
      <CSSReset />
      <BoxSizingReset />
      <GoogleMapLoaded>
        <Provider store={store}>
          <SpanishIntlProvider userLanguage={language}>
            <Router>
              <SearchResultsProvider>
                <LanguageContext.Provider value={language}>
                  <Switch>
                    <Route path="/assessment">
                      <Assessment setLanguage={setLanguage} />
                    </Route>
                    <Route path="/location">
                      <Location setLanguage={setLanguage} />
                    </Route>
                    {/* Comes before /search becauase it's a more specific rule */}
                    <Route path="/search/result">
                      <SearchResult setLanguage={setLanguage} />
                    </Route>
                    <Route path="/search">
                      <Search setLanguage={setLanguage} />
                    </Route>
                    <Route exact path="/">
                      <Home setLanguage={setLanguage} />
                    </Route>
                    <Route path="*">
                      <NoMatch />
                    </Route>
                  </Switch>
                </LanguageContext.Provider>
              </SearchResultsProvider>
            </Router>
          </SpanishIntlProvider>
        </Provider>
      </GoogleMapLoaded>
    </>
  );
}

const domContainerNode = document.createElement('div');
document.body.appendChild(domContainerNode);

ReactDOM.render(<App />, domContainerNode);
