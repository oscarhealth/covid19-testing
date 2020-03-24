import PropTypes from 'prop-types';
import React from 'react';

import {getHeaderOffset, subscribeAnchor, unsubscribeAnchor} from './anchorActions';

import css from './PageAnchor.scss';


class PageAnchor extends React.Component {
  static propTypes = {
    anchorId: PropTypes.string.isRequired,
  };

  state = {
    headerOffset: getHeaderOffset(),
  };

  componentWillMount() {
    this.handledInitialScroll = false;
  }

  componentDidMount() {
    subscribeAnchor(this.props.anchorId, this.anchor, this.setHeaderOffset);
    this.handleInitialHashScroll();
  }

  componentDidUpdate() {
    this.handleInitialHashScroll();
  }

  componentWillUnmount() {
    unsubscribeAnchor(this.props.anchorId);
  }

  /*
   * This adjusts the scrolling of the page on the initial render to properly account for the header height,
   * which is only known post-initial render.
   */
  handleInitialHashScroll = () => {
    if (!this.state.headerOffset || this.handledInitialScroll) {
      return;
    }

    this.handledInitialScroll = true;

    const {hash} = window.location;
    if (!hash) {
      return;
    }

    const id = hash.replace('#', '');
    if (id === this.props.anchorId) {
      this.anchor.scrollIntoView();
    }
  };

  setAnchor = (anchor) => {
    this.anchor = anchor;
  };

  setHeaderOffset = (newHeaderOffset) => {
    this.setState({headerOffset: newHeaderOffset});
  };

  render() {
    return (
      <div
        className={css.anchor}
        id={this.props.anchorId}
        ref={this.setAnchor}
        style={{top: -this.state.headerOffset}}
      />
    );
  }
}

export {
  PageAnchor,
};
