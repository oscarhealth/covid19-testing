// @flow
import React from 'react';
import type {Node} from 'react';

import css from './AnatomyBaseStyles.scss';

type Props = {
  children: Node,
};

export class AnatomyBaseStyles extends React.Component<Props> {
  render() {
    const {children, ...rest} = this.props;
    return (
      <div {...rest} className={css.anatomyStyles}>
        {children}
      </div>
    );
  }
}
