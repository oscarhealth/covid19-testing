import classNames from 'classnames';
import {noop} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {Attachment} from 'javascript/anatomy/attachment/Attachment';
import {PageFreeze} from 'javascript/page-freeze';

import {DropdownOverlayContent} from './DropdownOverlayContent';

import css from './DropdownOverlayAttachment.scss';

const OVERLAY_CONTENT_HEIGHT = 300;

export class DropdownOverlayAttachment extends React.PureComponent {
  static propTypes = {
    contentRef: PropTypes.func,
    // only relevant for Typeaheads
    highlightMatchedSubstring: PropTypes.bool,
    isInverted: PropTypes.bool,
    isShowing: PropTypes.bool,
    onSetInvertedState: PropTypes.func,
    positionIgnoreViewport: PropTypes.bool,
    value: PropTypes.any,
    width: PropTypes.number,
  };

  static defaultProps = {
    positionIgnoreViewport: false,
    contentRef: noop,
    onSetInvertedState: noop,
  };

  static contextTypes = {
    baseZIndex: PropTypes.string,
  };

  state = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  };

  componentDidMount() {
    this.addListeners();
    this.refreshSizes();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.refreshSizes(nextProps);
  }

  componentWillUnmount() {
    this.removeListeners();
    this.cancelRefreshSizeRequest();
  }

  addListeners = () => {
    window.addEventListener('resize', this.onResize);
    // Prevent scrolling when overlays are open: modern browsers
    window.addEventListener('wheel', this.onWheel, {passive: false});
    // Prevent scrolling when overlays are open: mobile web
    window.addEventListener('touchmove', this.onWheel, {passive: false});
  };

  removeListeners = () => {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('wheel', this.onWheel, {passive: false});
    window.removeEventListener('touchmove', this.onWheel, {passive: false});
  };

  cancelRefreshSizeRequest = () => {
    if (this.refreshSizeRequest) {
      window.cancelAnimationFrame(this.refreshSizeRequest);
    }
  };

  onResize = () => {
    this.refreshSizes();
  };

  refreshSizes = (props = this.props) => {
    this.cancelRefreshSizeRequest();
    this.refreshSizeRequest = window.requestAnimationFrame(() => {
      this.setInvertedState(props);
      this.setWidth();
      this.setBoundaries();
      this.refreshSizeRequest = null;
    });
  };

  setBoundaries = () => {
    const {bottom, left, right, top} = this.triggerContainer.getBoundingClientRect();
    if (
      bottom !== this.state.bottom ||
      left !== this.state.left ||
      top !== this.state.top ||
      right !== this.state.right
    ) {
      this.setState({
        bottom,
        left,
        right,
        top,
      });
    }
  };

  setInvertedState = (props = this.props) => {
    const isInverted = this.isInverted();

    if (isInverted !== props.isInverted) {
      props.onSetInvertedState(isInverted);
    }
    return isInverted;
  };

  setWidth = () => {
    const width = this.getTriggerWidth();
    if (width !== this.state.width) {
      this.setState({
        width,
      });
    }
  };

  getWidth = () => {
    return this.props.width || this.state.width;
  };

  getOffset = () => {
    const x = this.isRightAligned()
      ? this.state.right - this.getWidth()
      : this.state.left;
    const y = this.getVerticalOffset();

    return {x: Math.round(x), y: Math.round(y)};
  };

  getVerticalOffset = () => {
    if (this.props.positionIgnoreViewport) {
      return this.state.bottom;
    }

    if (this.context.baseZIndex && this.exceedsBottomThreshold()) {
      return window.innerHeight - OVERLAY_CONTENT_HEIGHT;
    }

    return this.props.isInverted ? this.state.top : this.state.bottom;
  };

  getTriggerWidth = () => {
    return this.triggerContainer
      ? this.triggerContainer.getBoundingClientRect().width
      : 0;
  };

  setTriggerContainer = (ref) => {
    this.triggerContainer = ref;
  };

  setDropdownContent = (ref) => {
    this.dropdownContent = ref;
    this.props.contentRef(ref);
  };

  isInverted = () => {
    if (
      this.props.positionIgnoreViewport ||
      !this.triggerContainer ||
      this.context.baseZIndex
    ) {
      return false;
    }

    return this.exceedsBottomThreshold();
  };

  isRightAligned = () => {
    // If the triggerContainer ref hasn't been set we can't do this.
    //
    // Also, if the width prop hasn't been set, the width of the content is the same as the trigger,
    // so left-aligned and right-aligned are effectively the same thing.
    if (!this.triggerContainer || !this.props.width) {
      return false;
    }
    return (
      this.triggerContainer.getBoundingClientRect().left >
      window.innerWidth - this.props.width
    );
  };

  exceedsBottomThreshold = () => {
    return (
      this.triggerContainer.getBoundingClientRect().bottom >
      window.innerHeight - OVERLAY_CONTENT_HEIGHT
    );
  };

  onWheel = (e) => {
    // We only need to override the scroll behavior in a stacking context, and when the overlay is shown.
    if (!this.context.baseZIndex || !this.props.isShowing) {
      return;
    }

    const scrollOnContent =
      e.target === this.dropdownContent || this.dropdownContent.contains(e.target);
    if (!scrollOnContent) {
      e.preventDefault();
    }
  };

  renderContent() {
    return (
      <DropdownOverlayContent
        {...this.props}
        contentRef={this.setDropdownContent}
        width={this.getWidth()}
      />
    );
  }

  render() {
    const classes = classNames({
      [css.triggerContainer]: true,
      [css.triggerContainer_inverted]: this.props.isInverted,
    });

    return (
      <div className={classes} ref={this.setTriggerContainer}>
        {this.props.isShowing && <PageFreeze />}
        <Attachment
          attachedComponent={this.renderContent()}
          getOffset={this.getOffset}
          isShowing={true}
        >
          <div />
        </Attachment>
      </div>
    );
  }
}
