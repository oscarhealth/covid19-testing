import React from 'react';

import css from './HeightTransitioner.scss';

/**
 * HeightTransitioner is used to wrap components of dynamic height and apply transitions
 * to changes in the content height. It listens for update events to apply a css transition
 *
 * Example usage, a variable length list of items in a modal:
 *
 * <Modal>
 *  <ListView>
 *    <HeightTransitioner>
 *      {this.renderListItems()}
 *    </HeightTransitioner>
 *  <ListView>
 * </Modal>
 *
 *  As users added or removed items from the list, both the content height and modal height
 *  would be adjusted smoothly to create a nicer experience. Note: componentDidUpdate needs to
 *  be triggered on this component for the animation to fire.
 */
class HeightTransitioner extends React.Component {
  state = {
    currentHeight: 'auto',
  };

  // eslint-disable-next-line react/sort-comp
  scheduledAnimationIds = new Set();

  componentDidMount() {
    this.setInitialHeight();
  }

  componentDidUpdate() {
    this.transition(this.state.contentHeight, this.content.clientHeight);
  }

  componentWillUnmount() {
    this.scheduledAnimationIds.forEach((animationId) => {
      window.cancelAnimationFrame(animationId);
    });
  }

  setInitialHeight = () => {
    const animationId = window.requestAnimationFrame(() => {
      this.setState({contentHeight: this.content.clientHeight});
      this.scheduledAnimationIds.delete(animationId);
    });
    this.scheduledAnimationIds.add(animationId);
  };

  transition = (startHeight, endHeight = null) => {
    // The calls to setState trigger componentDidUpdate, so these checks are used
    // to prevent endless calls to this function.
    if ([startHeight, this.state.contentHeight, null].includes(endHeight)) {
      return;
    }

    this.setState({
      contentHeight: endHeight,
      currentHeight: startHeight,
    });

    const animationId = window.requestAnimationFrame(() => {
      this.setState({currentHeight: endHeight});
      this.scheduledAnimationIds.delete(animationId);
    });
    this.scheduledAnimationIds.add(animationId);
  };

  render() {
    const style = {
      height: this.state.currentHeight,
    };

    return (
      <div
        className={css.container}
        ref={(container) => (this.container = container)}
        style={style}
      >
        <div ref={(content) => (this.content = content)}>{this.props.children}</div>
      </div>
    );
  }
}

export {HeightTransitioner};
