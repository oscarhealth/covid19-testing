// @flow
import React from 'react';

import {Header2, Header5} from 'common/typography';
import Nav from 'nav/Nav';

import css from './index.scss';

export default class NoMatch extends React.Component {
  render() {
    return (
      <div>
        <Nav setLanguage={this.props.setLanguage} />
        <div className={css.container}>
          <div className={css.divider} />
          <Header2 className={css.header}>Error (404)</Header2>
          <div className={css.info}>
            <Header5>We can’t find the page you’re looking for.</Header5>
          </div>
        </div>
      </div>
    );
  }
}
