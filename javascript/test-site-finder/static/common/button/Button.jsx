// @flow
import classNames from 'classnames';
import React from 'react';
import type {Node} from 'react';
import {Link} from 'react-router-dom';

import type {
  ButtonType,
  GroupPositionType,
  NativeType,
  SizeType,
} from './constants';
import {CONTAINED_GROUP_POSITION} from './constants';
import {ButtonContext} from './ButtonContext';

import css from './Button.scss';

type ButtonProps = {|
  /**
   * Only in the style guide, __hover and __pressed allow you to force
   * a particular state for demonstration purposes.
   */
  __hovered?: boolean,
  __pressed?: boolean,
  children: Node, // TODO: Refine type
  className: string,
  disabled: boolean,
  groupPosition?: GroupPositionType,
  /**
   * pass an href prop if you want the button to render as an <a> element.
   */
  href?: string,
  nativeType: NativeType,
  onClick?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void | Promise<void>,
  size: SizeType,
  target?: string,
  /**
   * Pass a to prop if you want the button to render as a <Link> element.
   * See https://github.com/reactjs/react-router/blob/master/docs/API.md#link
   */
  to?: string,
  type: ButtonType,
|};

type State = {|
  hideFocusRing: boolean,
|};

/**
 * Return if we're an icon-only button, determined by the presence of only one
 * `ButtonIcon` and no other non-null children (like the actual text of the
 * button).
 *
 * We can have null values as children since React can render nulls (e.g.
 * `condition && <Element ... />`) and the React.Children API doesn't abstract
 * that away with `map`.
 */
export const checkIconButton = (props: ButtonProps): boolean => {
  let iconChildren = 0;
  let nonNullChildren = 0;
  React.Children.forEach(props.children, (child) => {
    if (child) {
      if (child.type && child.type.name === 'ButtonIcon') {
        iconChildren++;
      } else {
        nonNullChildren++;
      }
    }
  });
  return iconChildren === 1 && nonNullChildren === 0;
};

/**
 * Standard button. If you pass an `href`, the button will be rendered
 * as an anchor element and standard link behavior (right-clicking to open in
 * a new tab, etc.) will work.
 */
class Button extends React.Component<ButtonProps, State> {
  static defaultProps = {
    className: '',
    disabled: false,
    type: 'neutral',
    nativeType: 'button',
    size: 'medium',
  };

  constructor(props: ButtonProps) {
    super(props);
    if (props.href && props.to) {
      throw new Error('Pass either “href” or “to” into Button - not both.');
    }
    this.didMouseDown = false;
  }

  state = {
    hideFocusRing: false,
  };

  contextValues() {
    return {
      isIconButton: checkIconButton(this.props),
      buttonSize: this.props.size,
      buttonType: this.props.type,
    };
  }

  didMouseDown = false;

  onClick = (event: SyntheticMouseEvent<HTMLButtonElement>, ...args: any) => {
    if (this.props.disabled) {
      event.preventDefault();
      return;
    }

    // If this isn't a link, we never want to perform the default action,
    // which might be submitting a form. We'll always defer to the onClick
    // prop.
    // However, if the button type is 'reset' or 'submit', then default action should be allowed.
    if (!this.props.href && !this.props.to && this.props.nativeType === 'button') {
      event.preventDefault();
    }

    this.didMouseDown = false;

    if (this.props.onClick) {
      this.props.onClick(event, ...args);
    }
  };

  onMouseDown = () => {
    this.didMouseDown = true;
  };

  onFocus = () => {
    this.setState({
      hideFocusRing: this.didMouseDown,
    });

    this.didMouseDown = false;
  };

  render() {
    const {disabled} = this.props;

    const classes = classNames({
      [css.buttonBase]: true,
      [css.iconButton]: checkIconButton(this.props),
      [css['button_primary']]: this.props.type === 'primary',
      [css['button_neutral']]: this.props.type === 'neutral',
      [css['button_destructive']]: this.props.type === 'destructive',
      [css['button_knocked-out']]: this.props.type === 'knocked-out',
      [css.buttonBase_disabled]: disabled,
      [css['button_xsmall']]: this.props.size === 'xsmall',
      [css['button_small']]: this.props.size === 'small',
      [css['button_medium']]: this.props.size === 'medium',
      [css['button_large']]: this.props.size === 'large',
      [css['button_xlarge']]: this.props.size === 'xlarge',
      [css.hideFocusRing]: this.state.hideFocusRing,
      [this.props.className]: !!this.props.className.length,
      [css.buttonBase__hovered]: !!this.props['__hovered'],
      [css.buttonBase__pressed]: !!this.props['__pressed'],
      [css.leftChild]: this.props.groupPosition === CONTAINED_GROUP_POSITION.LEFT_CHILD,
      [css.middleChild]:
        this.props.groupPosition === CONTAINED_GROUP_POSITION.MIDDLE_CHILD,
      [css.rightChild]:
        this.props.groupPosition === CONTAINED_GROUP_POSITION.RIGHT_CHILD,
      [css.topChild]: this.props.groupPosition === CONTAINED_GROUP_POSITION.TOP_CHILD,
      [css.bottomChild]:
        this.props.groupPosition === CONTAINED_GROUP_POSITION.BOTTOM_CHILD,
    });

    let El = 'button';

    if (this.props.href) {
      El = 'a';
    } else if (this.props.to) {
      El = Link;
    }

    const propsForDisabled = disabled
      ? {'aria-disabled': disabled, 'tabIndex': -1}
      : null;

    return (
      <ButtonContext.Provider value={this.contextValues()}>
        <El
          {...propsForDisabled}
          className={classes}
          href={this.props.href}
          onClick={this.onClick}
          onFocus={this.onFocus}
          onMouseDown={this.onMouseDown}
          role="button"
          target={this.props.target}
          to={this.props.to}
          type={this.props.nativeType}
        >
          {this.props.children}
        </El>
      </ButtonContext.Provider>
    );
  }
}

export {Button};
