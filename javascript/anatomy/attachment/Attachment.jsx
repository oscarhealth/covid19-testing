// @flow
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import type {Node as ReactNode} from 'react';

import {StackingContextConsumer} from 'javascript/anatomy/util/StackingContextConsumer';
import {PortalBodyMount} from 'javascript/body-mount/PortalBodyMount';

import css from './Attachment.scss';

const eventsToTriggerUpdate = ['resize', 'scroll', 'touchmove'];
const RIGHT_WINDOW_THRESHOLD = 400;
const BOTTOM_WINDOW_THRESHOLD = 200;
const ORIGIN = {x: 0, y: 0};
const InlineMount = createNamedComponent(css.mount, 'div', 'InlineMount');


function createNamedComponent(wrapperClassName = '', TargetComponent = 'div', displayName) {
  class Component extends React.Component {
    static displayName = displayName;

    static propTypes = {
      className: PropTypes.string,
    };

    static defaultProps = {
      className: null,
    };

    render() {
      const props = Object.assign({}, this.props);
      props.className = classNames({
        [wrapperClassName]: !!wrapperClassName,
        [this.props.className]: !!this.props.className,
      });

      return <TargetComponent {...props}>{this.props.children}</TargetComponent>;
    }
  }

  return Component;
}

const getOffset = (
  trigger: HTMLDivElement,
  attached: HTMLDivElement,
  isInlineMount: boolean
) => {
  const triggerRect = trigger.getBoundingClientRect();
  const attachedRect = attached.getBoundingClientRect();
  const inRightThreshold =
    triggerRect.left < window.innerWidth - RIGHT_WINDOW_THRESHOLD;
  const inBottomThreshold =
    triggerRect.top < window.innerHeight - BOTTOM_WINDOW_THRESHOLD;

  let x;
  let y;
  if (isInlineMount) {
    x = inRightThreshold ? 0 : triggerRect.width - attachedRect.width;
    y = inBottomThreshold ? 0 : -1 * (triggerRect.height + attachedRect.height);
  } else {
    x = inRightThreshold ? triggerRect.left : triggerRect.right - attachedRect.width;
    y = inBottomThreshold ? triggerRect.bottom : triggerRect.top - attachedRect.height;

    if (x < 0) {
      x = triggerRect.left;
    }
  }

  return {x: Math.round(x), y: Math.round(y)};
};

const targetInElement = (target: EventTarget, element: ?HTMLDivElement) => {
  if (!element || !(target instanceof Node)) {
    return false;
  }
  return target === element || element.contains(target);
};

type AttachmentProps = {
  attachedComponent: ReactNode,
  children: ReactNode,
  getOffset: (
    trigger: HTMLDivElement,
    attachment: HTMLDivElement,
    isInlineMount: boolean
  ) => {
    x: number,
    y: number,
  },
  isInlineMount: boolean,
  isShowing: boolean,
  onClickOff: () => void,
  stopPropagation: boolean,
};

type AttachmentState = {
  offset: {
    x: number,
    y: number,
  },
};

export class Attachment extends React.Component<AttachmentProps, AttachmentState> {
  static propTypes = {
    attachedComponent: PropTypes.element.isRequired,
    children: PropTypes.node.isRequired,
    getOffset: PropTypes.func,
    isInlineMount: PropTypes.bool,
    isShowing: PropTypes.bool,
    onClickOff: PropTypes.func,
    stopPropagation: PropTypes.bool,
  };

  static defaultProps = {
    getOffset,
    isShowing: false,
    isInlineMount: false,
    onClickOff: () => {},
    stopPropagation: true,
  };

  state = {
    offset: ORIGIN,
  };

  // TODO(iain): Rewrite using hooks.
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: AttachmentProps) {
    if (nextProps.isInlineMount && !_.isEqual(this.state.offset, ORIGIN)) {
      this.setState({offset: ORIGIN});
    }
    if (nextProps.isShowing) {
      this.updateOffsetState();
      this.addListeners();
    } else {
      this.removeListeners();
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  trigger = React.createRef<HTMLDivElement>();
  attached = React.createRef<HTMLDivElement>();

  addListeners = () => {
    eventsToTriggerUpdate.forEach((eventName) =>
      window.addEventListener(eventName, this.updateOffsetState, true)
    );
    document.addEventListener('click', this.handleDocumentClick, true);
  };

  removeListeners = () => {
    eventsToTriggerUpdate.forEach((eventName) =>
      window.removeEventListener(eventName, this.updateOffsetState, true)
    );
    document.removeEventListener('click', this.handleDocumentClick, true);
  };

  updateOffsetState = () => {
    if (!this.attached.current || !this.trigger.current) {
      // In case the tooltip is triggered before rendered.
      return;
    }
    const offset = this.props.getOffset(
      this.trigger.current,
      this.attached.current,
      this.props.isInlineMount
    );

    if (!_.isEqual(offset, this.state.offset)) {
      this.setState({offset});
    }
  };

  handleDocumentClick = (e: MouseEvent) => {
    const clickedAttached = targetInElement(e.target, this.attached.current);
    const clickedTrigger = targetInElement(e.target, this.trigger.current);
    if (!clickedAttached && !clickedTrigger) {
      this.props.onClickOff();
    }
  };

  onClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    if (this.props.stopPropagation) {
      e.stopPropagation();
    }
  };

  render() {
    const {x, y} = this.state.offset;
    const {isShowing} = this.props;
    const attachmentOffset = {left: x, top: y};

    const attachedContentClasses = classNames({
      [css.attachedContent]: true,
      [css.attachedContent_showing]: isShowing,
      [css.attachedContent_isInlineMount]: this.props.isInlineMount,
    });

    const Mount = this.props.isInlineMount ? InlineMount : PortalBodyMount;

    return (
      <div className={css.attachment} onClick={this.onClick}>
        <div className={css.trigger} ref={this.trigger}>
          {this.props.children}
        </div>
        <Mount>
          <StackingContextConsumer>
            <div
              className={attachedContentClasses}
              ref={this.attached}
              style={attachmentOffset}
            >
              {this.props.attachedComponent}
            </div>
          </StackingContextConsumer>
        </Mount>
      </div>
    );
  }
}
