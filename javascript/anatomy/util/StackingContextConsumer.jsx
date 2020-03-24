import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import css from './StackingContextConsumer.scss';

/**
 * See documentation on StackedContextProvider for more context as to why these components exist (no pun intended!)
 *
 * This component provides z-index styling based on it's closest StackingContextProvider parent.  Which defines
 * the baseZIndex context value.
 */
export class StackingContextConsumer extends React.Component {
  static contextTypes = {
    baseZIndex: PropTypes.string,
  };

  render() {
    const zIndexStyle = css[`zIndex_${this.context.baseZIndex}`];

    if (__DEBUG__ && this.context.baseZIndex && !zIndexStyle) {
      throw `StackingContextConsumer received an unexpected z-index! ${
        this.context.baseZIndex
      }`;
    }

    const classes = classNames({
      [css.zIndex]: true,
      [zIndexStyle]: !!zIndexStyle,
    });

    return <div className={classes}>{this.props.children}</div>;
  }
}
