import {flatten, values} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {AnatomySizes} from 'javascript/anatomy/inputs/shared/anatomyTypes';
import {withFieldMessages} from 'javascript/anatomy/inputs/shared/fieldMessages';

import css from './ContainedGroup.scss';

const CONTAINED_GROUP_POSITION = {
  LEFT_CHILD: 'LEFT_CHILD',
  MIDDLE_CHILD: 'MIDDLE_CHILD',
  RIGHT_CHILD: 'RIGHT_CHILD',
  TOP_CHILD: 'TOP_CHILD',
  BOTTOM_CHILD: 'BOTTOM_CHILD',
};

const ANATOMY_TO_BUTTON_SIZE = {
  [AnatomySizes.SMALL]: 'large',
  [AnatomySizes.MEDIUM]: 'xlarge',
};

const GroupPositionPropType = PropTypes.oneOf(values(CONTAINED_GROUP_POSITION));

class ContainedGroup extends React.PureComponent {
  static propTypes = {
    size: PropTypes.oneOf(values(AnatomySizes)).isRequired,
  };

  getGroupPosition = (idx, groupSize) => {
    if (idx === 0) {
      return CONTAINED_GROUP_POSITION.LEFT_CHILD;
    } else if (idx === groupSize - 1) {
      return CONTAINED_GROUP_POSITION.RIGHT_CHILD;
    }

    return CONTAINED_GROUP_POSITION.MIDDLE_CHILD;
  };

  getSize = (child) => {
    if (child.type.name && child.type.name.includes('Button')) {
      return (
        ANATOMY_TO_BUTTON_SIZE[this.props.size] ||
        ANATOMY_TO_BUTTON_SIZE[AnatomySizes.MEDIUM]
      );
    }

    return this.props.size;
  };

  renderChild(child, idx) {
    const newChild = React.cloneElement(child, {
      width: undefined,
    });

    return (
      <div
        className={css.child}
        key={idx}
        style={child.props.width ? {width: child.props.width} : {}}
      >
        {newChild}
      </div>
    );
  }

  render() {
    const count = React.Children.count(this.props.children);
    const children = React.Children.map(this.props.children, (child, idx) =>
      React.cloneElement(child, {
        groupPosition: this.getGroupPosition(idx, count),
        showFieldMessages: false,
        size: this.getSize(child),
      })
    ).map((child, idx) => this.renderChild(child, idx));
    const errors = flatten(
      React.Children.map(this.props.children, (child) => child.props.errors)
    );

    return (
      <FieldMessageAggregator errors={errors}>
        <div className={css.group}>{children}</div>
      </FieldMessageAggregator>
    );
  }
}

class FieldMessageAggregator extends React.PureComponent {
  render() {
    return <div>{this.props.children}</div>;
  }
}

FieldMessageAggregator = withFieldMessages()(FieldMessageAggregator);

export {ContainedGroup, CONTAINED_GROUP_POSITION, GroupPositionPropType};
