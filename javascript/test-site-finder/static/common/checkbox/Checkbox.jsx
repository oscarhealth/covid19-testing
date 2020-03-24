import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {Text} from 'common/typography';
import {provideUniqueFieldId} from 'common/util/UniqueFieldId';

import css from './Checkbox.scss';

class Checkbox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    fieldId: PropTypes.string,
    hasErrors: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    size: PropTypes.oneOf(['small', 'medium']),
    value: PropTypes.bool,
  };

  static defaultProps = {
    hasErrors: false,
    size: 'medium',
  };

  render() {
    const {label, fieldId, className, id, hasErrors, ...props} = this.props;

    if (__DEBUG__ && fieldId && !id) {
      throw new Error('Missing ID when fieldId is given.');
    }

    const controlClasses = classNames({
      [css.control]: true,
      [css.control_hasErrors]: hasErrors,
      [css.control_disabled]: this.props.disabled,
      [css['control_size-medium']]: this.props.size === 'medium',
    });

    const labelClasses = classNames({
      [css.label]: true,
      [css.label_hasErrors]: hasErrors,
      [css.label_disabled]: this.props.disabled,
      [css['label_size-medium']]: this.props.size === 'medium',
    });

    return (
      <label className={classNames(css.checkbox, className)} htmlFor={id}>
        <input
          checked={this.props.value}
          className={css.checkboxInput}
          type="checkbox"
          id={id}
          {...props}
        />
        <span className={controlClasses} />
        {!!label && (
          <span className={labelClasses} htmlFor={fieldId}>
            <Text className={css.labelText}>{label}</Text>
          </span>
        )}
      </label>
    );
  }
}

Checkbox = provideUniqueFieldId(Checkbox);

export {Checkbox};
