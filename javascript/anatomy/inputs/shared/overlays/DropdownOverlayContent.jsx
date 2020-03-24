import classNames from 'classnames';
import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React from 'react';

import {AnatomyBaseStyles} from 'javascript/anatomy/inputs/shared/AnatomyBaseStyles';
import {CenteredLoader} from 'javascript/anatomy/loader';
import {PrimaryText} from 'javascript/anatomy/typography/core';
import {HeightTransitioner} from 'javascript/height-transitioner/HeightTransitioner';

import {DropdownOverlayItem} from './DropdownOverlayItem';

import css from './DropdownOverlayContent.scss';

class DropdownOverlayContentPlaceholder extends React.PureComponent {
  render() {
    return (
      <div className={css.placeholderWrapper}>
        <div className={css.placeholder}>{this.props.children}</div>
      </div>
    );
  }
}

export class DropdownOverlayContent extends React.PureComponent {
  static propTypes = {
    /**
     * The ref provided to this function is used to detect clicking outside the overlay.
     */
    contentRef: PropTypes.func,
    hasFetchError: PropTypes.bool,
    highlightedIndex: PropTypes.number,
    /**
     * Indicates whether the current highlighted index was activated with a key press.
     * We want to scroll the item into view only if this is true to avoid weird
     * interactions with mouse highlighting.
     */
    highlightedWithKeyPress: PropTypes.bool,
    // only relevant for Typeaheads
    highlightMatchedSubstring: PropTypes.bool,
    /**
     * Indicates whether this should render above the anchor rather than below.
     */
    isInverted: PropTypes.bool,
    isLoading: PropTypes.bool,
    isShowing: PropTypes.bool,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    /**
     * This will be called when an item is highlighted.
     */
    onHighlight: PropTypes.func,
    /**
     * If provided, this component will be used to render the options.
     */
    optionComponent: PropTypes.func,
    options: PropTypes.array,
    /**
     * This will be rendered when no results are found.
     */
    renderNoResultsElement: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.any, PropTypes.arrayOf(PropTypes.any)]),
    /**
     * The width can be explicitly provided, particularly when this component should
     * match the width of its parent.
     */
    width: PropTypes.number,
  };

  static defaultProps = {
    contentRef: noop,
    hasFetchError: false,
    isInverted: false,
    multiple: false,
    onChange: noop,
    onHighlight: noop,
    options: [],
    renderNoResultsElement: () => <PrimaryText>No results found</PrimaryText>,
  };

  constructor(props) {
    super(props);
    this.items = {};
  }

  componentDidUpdate() {
    if (!this.props.highlightedWithKeyPress || !this.props.isShowing) {
      return;
    }

    const item = this.items[this.props.highlightedIndex];
    if (!item) {
      return;
    }

    const itemRect = item.getBoundingClientRect();
    const contentRect = this.content.getBoundingClientRect();

    const itemTooHigh = contentRect.top - itemRect.top > 0;
    const itemTooLow = contentRect.bottom - itemRect.bottom < 0;
    if (itemTooHigh || itemTooLow) {
      item.scrollIntoView(itemTooHigh);
    }

    if (this.props.isFocused && !this.props.isFieldFocused) {
      item.focus();
    }
  }

  getContentRef = (ref) => {
    this.content = ref;
    this.props.contentRef(ref);
  };

  onClick = (_, index) => {
    this.props.onChange(...this.props.options[index]);
  };

  onItemMouseEnter = (_, index) => {
    this.props.onHighlight(index);
  };

  onMouseLeave = () => {
    this.props.onHighlight(-1);
  };

  setItemRef = (ref, index) => {
    this.items[index] = ref;
  };

  renderChildren() {
    if (!this.props.isShowing) {
      return;
    }

    if (this.props.isLoading) {
      return (
        <DropdownOverlayContentPlaceholder>
          <CenteredLoader />
        </DropdownOverlayContentPlaceholder>
      );
    }

    if (this.props.hasFetchError) {
      return (
        <DropdownOverlayContentPlaceholder>
          <PrimaryText>Sorry, something went wrong.</PrimaryText>
        </DropdownOverlayContentPlaceholder>
      );
    }

    if (!this.props.options.length) {
      return (
        <DropdownOverlayContentPlaceholder>
          {this.props.renderNoResultsElement(this.props)}
        </DropdownOverlayContentPlaceholder>
      );
    }
    const valueList = [].concat(this.props.value);
    const children = this.props.options.map((child, idx) => (
      <DropdownOverlayItem
        highlightMatchedSubstring={this.props.highlightMatchedSubstring}
        id={child[0]}
        index={idx}
        inputRef={this.setItemRef}
        isHighlighted={idx === this.props.highlightedIndex}
        isSelected={valueList.indexOf(child[0]) !== -1}
        item={child[1]}
        key={child[0]}
        onClick={this.onClick}
        onMouseEnter={this.onItemMouseEnter}
        optionComponent={this.props.optionComponent}
        // child[0] is not the user input, it's a key passed in by clients to be able to identify options passed
        // userInputValue is a workaround to keep this prop value around to be used by overlay item components
        userInputValue={this.props.query}
        value={child[0]}
      />
    ));

    let activeDescendant = null;
    if (this.props.options && this.props.options[this.props.highlightedIndex]) {
      activeDescendant = this.props.options[this.props.highlightedIndex][0];
    }

    return (
      <ul
        aria-activedescendant={activeDescendant}
        aria-multiselectable={this.props.multiple ? 'true' : 'false'}
        id={this.props.id}
        onKeyDown={this.props.onKeyDown}
        role="listbox"
      >
        {children}
      </ul>
    );
  }

  render() {
    const style = this.props.width
      ? {
          width: this.props.width,
        }
      : {};

    const classes = classNames({
      [css.overlay]: true,
      [css.overlay_hidden]: !this.props.isShowing,
      [css.overlay_inverted]: this.props.isInverted,
      [css.overlay_autoOverflow]: !this.props.isLoading && this.props.isShowing,
    });

    return (
      <div
        className={classes}
        onMouseLeave={this.onMouseLeave}
        ref={this.getContentRef}
        style={style}
      >
        <AnatomyBaseStyles>
          <HeightTransitioner>{this.renderChildren()}</HeightTransitioner>
        </AnatomyBaseStyles>
      </div>
    );
  }
}
