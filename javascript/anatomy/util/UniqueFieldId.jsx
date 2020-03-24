import _ from 'lodash';
import React from 'react';

export const provideUniqueFieldId = (component) => {
  return class extends React.Component {
    static displayName = 'UniqueFieldIdProvider';

    componentWillMount() {
      this.fieldId = _.uniqueId(`label-${this.props.name || 'unnamed-field'}-`);
    }

    render() {
      const Component = component;
      return <Component fieldId={this.fieldId} id={this.fieldId} {...this.props} />;
    }
  };
};
