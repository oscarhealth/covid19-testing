import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {withAnatomyContextConsumer} from './anatomyTypes';

import css from './NakedTextInput.scss';

class NakedTextInput extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    errorLabelId: PropTypes.string,
    hasErrors: PropTypes.bool,
    inputRef: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    hasErrors: false,
    type: 'text',
  };

  render() {
    const {
      anatomySize,
      anatomyUseFieldHeader,
      anatomyTheme,
      errorLabelId,
      isFocused,
      disabled,
      hasErrors,
      inputRef,
      ...props
    } = this.props;

    const inputClasses = classNames({
      [css.input]: true,
      [css.input_disabled]: disabled,
      [css.input_hasErrors]: hasErrors,
      [css.input_isFocused]: isFocused,
      [css['input_size-small']]: anatomySize === 'small',
      [css['input_size-medium']]: anatomySize === 'medium',
    });

    const labelledBy = errorLabelId ? `${props.id} ${errorLabelId}` : null;

    return (
      <input
        {...props}
        aria-invalid={!!errorLabelId}
        aria-labelledby={labelledBy}
        className={inputClasses}
        disabled={disabled}
        ref={inputRef}
      />
    );
  }
}

NakedTextInput = withAnatomyContextConsumer()(NakedTextInput);

export {NakedTextInput};
