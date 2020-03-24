const React = require('react');

const ReactDOM = require('react-dom');

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;

/**
 * Generic component to mount a given node to the body.
 *
 * Note: This element is not compatible with TimeoutTransitionGroup components because
 * it renders itself outside of the "render" method. Further, because TimeoutTransitionGroup
 * is a hack on top of React's TransitionGroup, it also "steals" the relevant lifecycle
 * methods. Hopefully this can be addressed when we update to React >0.14.
 *
 * In the meantime, to transition elements using this component, make sure the
 * TimeoutTransitionGroup is a descendant of BodyMount.
 */
class BodyMount extends React.Component {
  componentDidMount() {
    this.renderBodyMount(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.renderBodyMount(newProps);
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.node);
    document.body.removeChild(this.node);
    this.node = null;
  }

  renderBodyMount = (props) => {
    if (!this.node) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);
    }

    const el = <div {...props}>{props.children}</div>;

    renderSubtreeIntoContainer(this, el, this.node);
  };

  render() {
    return null;
  }
}


module.exports = {
  BodyMount,
};
