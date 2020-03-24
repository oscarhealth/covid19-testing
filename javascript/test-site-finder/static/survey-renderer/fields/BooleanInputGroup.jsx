import PropTypes from 'prop-types';
import React from 'react';

import {Checkbox} from 'common/checkbox/Checkbox';
import {RadioButton} from 'common/radioButton/RadioButton';

import {ErrorField} from './ErrorField';

import css from './BooleanInputGroup.scss';

const optionPropTypes = {
  component: PropTypes.func.isRequired,
  groupValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  isChecked: PropTypes.bool.isRequired,
  isScalar: PropTypes.bool.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  option: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  }),
};

class OptionWrapper extends React.PureComponent {
  static propTypes = optionPropTypes;

  onChange = (evt) => {
    const optionValue = this.props.option.value;
    if (this.props.isScalar) {
      return this.props.onChange(optionValue);
    }

    const newValue = [...this.props.groupValue];
    if (evt.target.checked) {
      newValue.push(optionValue);
    } else {
      newValue.splice(newValue.indexOf(optionValue), 1);
    }
    return this.props.onChange(newValue);
  };

  render() {
    const Component = this.props.component;
    return (
      <Component
        checked={this.props.isChecked}
        className={css.inputRow}
        disabled={this.props.disabled}
        label={this.props.option.name}
        name={this.props.name}
        onChange={this.onChange}
      />
    );
  }
}

export class BooleanInputGroup extends React.Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    groupValue: PropTypes.arrayOf(PropTypes.string).isRequired,
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.any,
    }).isRequired,
    isScalar: PropTypes.bool.isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }).isRequired,
    choices: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      })
    ),
    disabled: PropTypes.bool,
    label: PropTypes.string,
    language: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      })
    ),
  };

  isOptionChecked = (optionValue) => {
    const input = this.props.input;
    const groupValue = input.value;

    if (this.props.isScalar) {
      return optionValue === groupValue;
    }
    return groupValue.indexOf(optionValue) !== -1;
  };

  render() {
    const {
      component,
      disabled,
      language,
      options,
      choices,
      input,
      isScalar,
      meta,
    } = this.props;

    return (
      <div>
        <ul aria-labelledby={this.props['aria-labelledby']}>
          {(options || choices).map((option, index) => (
            <div key={index}>
              <OptionWrapper
                component={component}
                disabled={disabled}
                groupValue={input.value}
                isChecked={this.isOptionChecked(option.value)}
                isScalar={isScalar}
                name={input.name}
                onChange={input.onChange}
                option={option}
              />
            </div>
          ))}
        </ul>
        {meta.touched && <ErrorField meta={meta} />}
      </div>
    );
  }
}

export function CheckboxInputGroup(props) {
  return <BooleanInputGroup {...props} component={Checkbox} isScalar={false} />;
}

export function RadioInputGroup(props) {
  return <BooleanInputGroup {...props} component={RadioButton} isScalar={true} />;
}
