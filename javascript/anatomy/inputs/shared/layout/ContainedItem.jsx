import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {
  CONTAINED_GROUP_POSITION,
  GroupPositionPropType,
} from 'javascript/anatomy/inputs/groups/ContainedGroup';
import {withAnatomyContextConsumer} from 'javascript/anatomy/inputs/shared/anatomyTypes';

import css from './ContainedItem.scss';

class ContainedItem extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    groupPosition: GroupPositionPropType,
    hasErrors: PropTypes.bool,
    isFocused: PropTypes.bool,
    noBorder: PropTypes.bool,
  };

  render() {
    const {
      anatomySize,
      disabled,
      hasErrors,
      isFocused,
      itemGrow,
      noBorder,
    } = this.props;
    const itemSizeClass = css[`item_size-${anatomySize}`];

    const itemClasses = classNames({
      [css.item]: true,
      [css.item_disabled]: disabled,
      [css.item_hasErrors]: hasErrors,
      [css.item_isFocused]: isFocused,
      [css.item_noBorder]: noBorder,
      [css.item_fixedHeight]: !itemGrow,
      [itemSizeClass]: itemSizeClass,
      [css.leftChild]: this.props.groupPosition === CONTAINED_GROUP_POSITION.LEFT_CHILD,
      [css.middleChild]:
        this.props.groupPosition === CONTAINED_GROUP_POSITION.MIDDLE_CHILD,
      [css.rightChild]:
        this.props.groupPosition === CONTAINED_GROUP_POSITION.RIGHT_CHILD,
    });

    return <div className={itemClasses}>{this.props.children}</div>;
  }
}

ContainedItem = withAnatomyContextConsumer()(ContainedItem);

export {ContainedItem};
