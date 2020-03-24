import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React from 'react';

import {DropdownOverlayAttachment} from './DropdownOverlayAttachment';
import {DropdownOverlayHeader} from './DropdownOverlayHeader';

import css from './DropdownOverlay.scss';

export class DropdownOverlay extends React.PureComponent {
  static propTypes = {
    // only relevant for Typeaheads
    highlightMatchedSubstring: PropTypes.bool,
    isShowing: PropTypes.bool,
    onClickOutsideOverlay: PropTypes.func,
    onKeyDown: PropTypes.func,
    value: PropTypes.any,
  };

  static defaultProps = {
    onClickOutsideOverlay: noop,
    onKeyDown: noop,
  };

  state = {
    isInverted: false,
  };

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.onChildKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.onChildKeyDown);
  }

  getDropdownHeader = (ref) => {
    this.dropdownHeader = ref;
  };

  getDropdownList = (ref) => {
    this.dropdownList = ref;
  };

  handleDocumentClick = (e) => {
    if (!this.props.isShowing) {
      return;
    }

    const clickedHeader = this.targetInElement(e.target, this.dropdownHeader);
    const clickedList = this.targetInElement(e.target, this.dropdownList);

    if (!clickedHeader && !clickedList) {
      this.props.onClickOutsideOverlay();
    }
  };

  onSetInvertedState = (isInverted) => {
    this.setState({
      isInverted,
    });
  };

  targetInElement = (target, element) => {
    return target === element || element.contains(target);
  };

  render() {
    return (
      <DropdownOverlayHeader
        {...this.props}
        {...this.state}
        inputRef={this.getDropdownHeader}
      >
        <div className={css.attachmentContainer}>
          <DropdownOverlayAttachment
            {...this.props}
            {...this.state}
            contentRef={this.getDropdownList}
            onSetInvertedState={this.onSetInvertedState}
          />
        </div>
      </DropdownOverlayHeader>
    );
  }
}
