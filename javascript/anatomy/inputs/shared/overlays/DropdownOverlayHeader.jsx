import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {
  CONTAINED_GROUP_POSITION,
  GroupPositionPropType,
} from 'javascript/anatomy/inputs/groups/ContainedGroup';
import {withAnatomyContextConsumer} from 'javascript/anatomy/inputs/shared/anatomyTypes';

import css from './DropdownOverlayHeader.scss';

class DropdownOverlayHeader extends React.PureComponent {
  static propTypes = {
    isShowing: PropTypes.bool.isRequired,
    /**
     * This function will be provided the ref of the div wrapping the overlay header, which is useful for measuring.
     */
    groupPosition: GroupPositionPropType,
    inputRef: PropTypes.func,
    isInverted: PropTypes.bool,
    visibleContent: PropTypes.any,
  };

  render() {
    const {
      anatomySize,
      anatomyTheme,
      anatomyUseFieldHeader,
      children,
      inputRef,
      isInverted,
      isShowing,
      visibleContent,
    } = this.props;

    const containerClasses = classNames({
      [css.overlayContainer]: true,
      [css.overlayContainer_inverted]: isInverted && isShowing,
      [css[`overlayContainer_theme-${anatomyTheme}`]]: true,
    });

    const classes = classNames({
      [css.overlay]: true,
      [css.overlay_inverted]: isInverted,
      [css.overlay_hidden]: !isShowing,
      [css.overlay_withHeader]: !!anatomyUseFieldHeader,
      [css[`overlay_size-${anatomySize}`]]: true,
      [css[`overlay_theme-${anatomyTheme}`]]: true,
      [css.leftChild]: this.props.groupPosition === CONTAINED_GROUP_POSITION.LEFT_CHILD,
      [css.middleChild]:
        this.props.groupPosition === CONTAINED_GROUP_POSITION.MIDDLE_CHILD,
      [css.rightChild]:
        this.props.groupPosition === CONTAINED_GROUP_POSITION.RIGHT_CHILD,
    });

    return (
      <div className={containerClasses} ref={inputRef}>
        <div className={classes}>{children}</div>
        {visibleContent}
      </div>
    );
  }
}

DropdownOverlayHeader = withAnatomyContextConsumer()(DropdownOverlayHeader);

export {DropdownOverlayHeader};
