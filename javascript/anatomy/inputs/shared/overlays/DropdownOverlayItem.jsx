/* eslint css-modules/no-unused-class: [2, { markAsUsed: ['item_size-small', 'item_size-medium'] }] */
import classNames from 'classnames';
import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React from 'react';

import {CheckmarkIcon} from 'javascript/anatomy/icons';
import {
  AnatomySizes,
  withAnatomyContextConsumer,
} from 'javascript/anatomy/inputs/shared/anatomyTypes';
import {Highlight} from './Highlight';

import css from './DropdownOverlayItem.scss';

class DropdownOverlayItemDefault extends React.PureComponent {
  static propTypes = {
    // only relevant for Typeaheads
    highlightMatchedSubstring: PropTypes.bool,
    isHighlighted: PropTypes.bool,
    isSelected: PropTypes.bool,
    userInputValue: PropTypes.any,
  };

  render() {
    const classes = classNames({
      [css.item]: true,
      [css.item_highlighted]: this.props.isHighlighted,
      [css.item_selected]: this.props.isSelected,
      [css['item_size-small']]: this.props.anatomySize === AnatomySizes.SMALL,
      [css['item_size-medium']]: this.props.anatomySize === AnatomySizes.MEDIUM,
    });

    let itemDisplayValue = this.props.item;
    // Item prop is typed as type any and some usages pass in a Node, which breaks this
    if (this.props.highlightMatchedSubstring && typeof itemDisplayValue === 'string') {
      itemDisplayValue = Highlight.getSubstringHighlightedElement(
        this.props.item,
        this.props.userInputValue,
        css.substringMatchedItem_highlight
      );
    }

    return (
      <div
        aria-label={`${this.props.isSelected ? '✓ ' : ''}${this.props.item}`}
        aria-selected={this.props.isSelected}
        className={classes}
      >
        {this.props.isSelected && (
          <div aria-hidden={true} className={css.checkmark}>
            <CheckmarkIcon size="small" />
          </div>
        )}
        {itemDisplayValue}
      </div>
    );
  }
}

DropdownOverlayItemDefault = withAnatomyContextConsumer()(DropdownOverlayItemDefault);

export {DropdownOverlayItemDefault};

class DropdownOverlayItem extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.any.isRequired,
    // only relevant for Typeaheads
    highlightMatchedSubstring: PropTypes.bool,
    id: PropTypes.string,

    /**
     * The ref provided to this function is used to scroll an item into the viewport.
     */
    inputRef: PropTypes.func,
    isHighlighted: PropTypes.bool,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    optionComponent: PropTypes.func,
    userInputValue: PropTypes.any,
  };

  static defaultProps = {
    inputRef: noop,
    isHighlighted: false,
    isSelected: false,
    onClick: noop,
    onMouseEnter: noop,
    optionComponent: DropdownOverlayItemDefault,
  };

  getItemRef = (ref) => {
    this.props.inputRef(ref, this.props.index);
  };

  onClick = (e) => {
    this.props.onClick(e, this.props.index);
  };

  onMouseEnter = (e) => {
    this.props.onMouseEnter(e, this.props.index);
  };

  render() {
    const OptionComponent = this.props.optionComponent;
    return (
      <li
        aria-selected={this.props.isSelected}
        className={css.unselectable}
        id={this.props.id}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        ref={this.getItemRef}
        role="option"
        tabIndex={0}
      >
        <OptionComponent {...this.props} />
      </li>
    );
  }
}

DropdownOverlayItem = withAnatomyContextConsumer()(DropdownOverlayItem);

export {DropdownOverlayItem};
