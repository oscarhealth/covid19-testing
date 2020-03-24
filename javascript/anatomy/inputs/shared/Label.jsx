import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {withAnatomyContextConsumer} from './anatomyTypes';

import css from './Label.scss';

class Label extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    hasErrors: PropTypes.bool,
    isFocused: PropTypes.bool,
    pointerCursor: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    hasErrors: false,
    isFocused: false,
    pointerCursor: false,
  };

  render() {
    const {
      anatomySize,
      anatomyTheme,
      anatomyUseFieldHeader,
      disabled,
      hasErrors,
      isFocused,
      pointerCursor,
      ...props
    } = this.props;

    const classes = classNames({
      [css.label]: true,
      [css.label_disabled]: disabled,
      [css.label_focused]: isFocused,
      [css.label_hasErrors]: hasErrors,
      [css.label_pointerCursor]: pointerCursor,
      [css[`label_size-${anatomySize}`]]: true,
    });

    return <label {...props} className={classes} />;
  }
}

Label = withAnatomyContextConsumer()(Label);

export {Label};
