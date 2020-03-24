import React, {Component} from 'react';

function getComponentName(Component) {
  return Component.name || Component.displayName || Component;
}

export function wrapConfigElements(configTypes = {}) {
  return (WrappedComponent) => {
    class ConfigWrapper extends Component {
      getChildElements() {
        const foundElements = {};
        React.Children.forEach(this.props.children, (child) => {
          if (!child) {
            return;
          }
          const {configTag} = child.type;
          if (!(configTag in configTypes)) {
            throw new Error(
              `Invalid Config Element (${getComponentName(
                child.type
              )}) passed to ${getComponentName(WrappedComponent)}`
            );
          }
          if (configTag in foundElements) {
            throw new Error(
              `Cannot add multiple ConfigElements of type ${configTag} to ${getComponentName(
                WrappedComponent
              )}`
            );
          }
          foundElements[configTag] = child.props;
        });
        return foundElements;
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            elements={this.getChildElements()}
            ref={this.props.wrappedComponentRef}
          />
        );
      }
    }

    for (const key of Object.keys(configTypes)) {
      class ConfigElement extends React.Component {
        static propTypes = configTypes[key];
        static displayName = `${WrappedComponent.name ||
          WrappedComponent.displayName}.${key}`;
        static configTag = key;
        render() {
          throw new Error(
            `Render should not be called for config element ${key} on ${getComponentName(
              WrappedComponent
            )}.`
          );
        }
      }
      // Create configuration Subcomponent
      ConfigWrapper[key] = ConfigElement;
    }
    return ConfigWrapper;
  };
}
