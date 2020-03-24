import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {
  AnatomyThemes,
  withAnatomyContextConsumer,
} from 'javascript/anatomy/inputs/shared/anatomyTypes';

import css from './NakedTextArea.scss';

class NakedTextArea extends React.PureComponent {
  static propTypes = {
    ariaDescribedBy: PropTypes.string,
    ariaLabelledBy: PropTypes.string,
    disabled: PropTypes.bool,
    hasErrors: PropTypes.bool,
    inputRef: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    hasErrors: false,
  };

  render() {
    const {
      ariaDescribedBy,
      ariaLabelledBy,
      anatomySize,
      anatomyTheme,
      anatomyUseFieldHeader,
      disabled,
      hasErrors,
      inputRef,
      minHeight,
      value,
      ...rest
    } = this.props;

    const inputClasses = classNames({
      [css.input]: true,
      [css.input_disabled]: disabled,
      [css.input_hasErrors]: hasErrors,
      [css[`input_size-${anatomySize}`]]: true,
      [css.input_hasFieldHeader]: anatomyUseFieldHeader,
    });

    if (minHeight && anatomyTheme === AnatomyThemes.STANDARD) {
      throw new Error('a minHeight cannot be set if the input theme is standard.');
    }

    return (
      <textarea
        {...rest}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        className={inputClasses}
        disabled={disabled}
        ref={inputRef}
        rows={1}
        style={{minHeight}}
        value={value}
      />
    );
  }
}

NakedTextArea = withAnatomyContextConsumer()(NakedTextArea);

export {NakedTextArea};
