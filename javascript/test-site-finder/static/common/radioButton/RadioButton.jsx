import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {Text} from 'common/typography';
import {provideUniqueFieldId} from 'common/util/UniqueFieldId';

import css from './RadioButton.scss';

export class RadioGroup extends React.Component {
  static propTypes = {
    direction: PropTypes.oneOf(['column', 'row']),
    id: PropTypes.string,
    label: PropTypes.string,
    labelId: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium']),
  };

  render() {
    // pop a few props here: fieldId/id are added by FieldWrapper and not
    // wanted in this case since we're rendering subordinate inputs; checked
    // is added by wrapForm and not wanted, className would override styling
    // of the inputs which we don't want, and we use choices.
    const {
      choices,
      id,
      checked,
      defaultChecked,
      direction,
      className,
      ...restProps
    } = this.props;

    // the checked/defaultChecked nonsense below is to accommodate both
    // controlled/uncontrolled uses of this component. if you pass an
    // `onChange` handler, we expect that the state of the component is
    // controlled and thus want `checked` prop.

    const radioGroupClasses = classNames({
      [css.radioGroup]: true,
      [css.radioGroup_column]: direction === 'column',
    });

    return (
      <div
        aria-label={this.props.label}
        aria-labelledby={this.props.labelId}
        className={radioGroupClasses}
        role="radiogroup"
      >
        {choices.map(([value, label]) => (
          <RadioButton
            className={css.radioGroupItem}
            key={value}
            {...restProps}
            {...{
              [restProps.onChange ? 'checked' : 'defaultChecked']:
                value === restProps.value,
            }}
            label={label}
            size={this.props.size}
            value={value}
          />
        ))}
      </div>
    );
  }
}

class RadioButton extends React.Component {
  static propTypes = {
    hasErrors: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    size: PropTypes.oneOf(['small', 'medium']),
    value: PropTypes.string,
  };

  static defaultProps = {
    hasErrors: false,
    size: 'medium',
  };

  render() {
    const {label, hasErrors, className, fieldId, id, ...restProps} = this.props;

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

    const containerLabelClasses = classNames({
      [css.radioButton]: true,
      [className]: !!className,
    });

    return (
      <label className={containerLabelClasses} htmlFor={id}>
        <input {...restProps} id={id} className={css.radioButtonInput} type="radio" />
        <span className={controlClasses} />
        {!!label && (
          <span className={labelClasses}>
            <Text className={css.labelText}>{label}</Text>
          </span>
        )}
      </label>
    );
  }
}

RadioButton = provideUniqueFieldId(RadioButton);

export {RadioButton};
