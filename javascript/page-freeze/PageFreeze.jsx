import React from 'react';

import {freeze, unfreeze} from './pageFreezeActions';

export class PageFreeze extends React.Component {
  componentWillMount() {
    freeze();
  }

  componentWillUnmount() {
    unfreeze();
  }

  render() {
    return null;
  }
}
