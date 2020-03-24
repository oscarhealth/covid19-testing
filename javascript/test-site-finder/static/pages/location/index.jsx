// @flow
import React from 'react';

import Nav from 'nav/Nav';

import LocationPage from './Location';

export default class Location extends React.Component {
  render() {
    return (
      <>
        <Nav
          setLanguage={this.props.setLanguage}
        />
        <LocationPage />
      </>
    );
  }
}
