// @flow
import React from 'react';

import Nav from 'nav/Nav';

import HomePage from './Home';

export default function Home(props) {
  return (
    <>
      <Nav setLanguage={props.setLanguage} />
      <HomePage />
    </>
  );
}
