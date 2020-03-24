import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {withAnatomyContextConsumer} from 'javascript/anatomy/inputs/shared/anatomyTypes';

import css from './UnderlinedItem.scss';

class UnderlinedItem extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    hasErrors: PropTypes.bool,
    isFocused: PropTypes.bool,
  };

  render() {
    const {
      anatomySize,
      anatomyUseFieldHeader,
      disabled,
      hasErrors,
      isFocused,
      itemGrow,
    } = this.props;
    const itemSizeClass = css[`item_size-${anatomySize}`];

    const itemClasses = classNames({
      [css.item]: true,
      [css.item_disabled]: disabled,
      [css.item_hasErrors]: hasErrors,
      [css.item_isFocused]: isFocused,
      [css.item_fixedHeight]: !itemGrow,
      [css.item_withHeader]: anatomyUseFieldHeader,
      [itemSizeClass]: itemSizeClass,
    });

    return <div className={itemClasses}>{this.props.children}</div>;
  }
}

UnderlinedItem = withAnatomyContextConsumer()(UnderlinedItem);

export {UnderlinedItem};
