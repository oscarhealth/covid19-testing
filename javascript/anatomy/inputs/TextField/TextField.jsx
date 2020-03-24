// @flow
import classNames from 'classnames';
import {noop} from 'lodash';
import React from 'react';
import type {ElementRef} from 'react';

import {AnatomyBaseStyles} from 'javascript/anatomy/inputs/shared/AnatomyBaseStyles';
import {AnimatedLabel} from 'javascript/anatomy/inputs/shared/AnimatedLabel';
import {MaskedInput} from 'javascript/anatomy/inputs/shared/MaskedInput';
import {NakedTextInput} from 'javascript/anatomy/inputs/shared/NakedTextInput';
import {withManagedFocus} from 'javascript/anatomy/inputs/shared/anatomyFieldHelpers';
import {
  AnatomyThemes,
  withAnatomyContextProvider,
} from 'javascript/anatomy/inputs/shared/anatomyTypes';
import {filterFormProps} from 'javascript/anatomy/inputs/shared/anatomyUtil';
import {withFieldMessages} from 'javascript/anatomy/inputs/shared/fieldMessages';
import {ContainedItem} from 'javascript/anatomy/inputs/shared/layout/ContainedItem';
import {UnderlinedItem} from 'javascript/anatomy/inputs/shared/layout/UnderlinedItem';
import type {
  GroupPositionType,
  MaskType,
  SizeType,
  ThemeType,
} from 'javascript/anatomy/types';
import {compose} from 'javascript/anatomy/util/compose';
import makeUniqueId from 'javascript/anatomy/util/makeUniqueId';

import css from './TextField.scss';

export type TextFieldProps = {
  customMask?: {
    mask: Array<string | RegExp> | ((string) => Array<string | RegExp>),
    pipe?: (string) => string | boolean,
    placeholder: string,
  },
  disabled?: boolean,
  errorLabelId?: string,
  focus: () => void,
  groupPosition?: GroupPositionType,
  hasErrors?: boolean,
  /**
   * This is used to set the id of the raw input as well as the htmlFor of the label.
   */
  id: string,
  /**
   * This function will be provided the ref of the raw text input, which is useful for things like focusing.
   */
  inputRef: (ElementRef<'input'>) => void,
  isFocused: boolean,
  label?: string,
  maskType?: MaskType,
  onChange?: (string) => void,
  onClick: (SyntheticMouseEvent<*>) => void,
  size?: SizeType,
  theme: ThemeType,
  useFieldHeader?: boolean,
  value?: string,
};

const ContainerComponents = {
  [AnatomyThemes.CONTAINED]: ContainedItem,
  [AnatomyThemes.STANDARD]: UnderlinedItem,
};

/**
 * TextFieldBase is a text field component without any higher-order components or focus management.
 * Note that this should only be used internally.
 */
class TextFieldBase extends React.PureComponent<TextFieldProps> {
  static defaultProps = {
    disabled: false,
    hasErrors: false,
    onBlur: noop,
    onChange: noop,
    onClick: noop,
  };

  id: ?string = this.props.id || makeUniqueId(this.props.label);

  renderInput() {
    const {
      customMask,
      errorLabelId,
      focus,
      groupPosition,
      hasErrors,
      isFocused,
      label,
      maskType,
      size,
      theme,
      useFieldHeader,
      ...rest
    } = this.props;

    if (customMask || maskType) {
      return (
        <MaskedInput
          {...filterFormProps(rest)}
          customMask={customMask}
          errorLabelId={errorLabelId}
          id={this.id}
          isFocused={isFocused}
          label={label}
          maskType={maskType}
        />
      );
    }

    return (
      <NakedTextInput
        {...filterFormProps(rest)}
        errorLabelId={errorLabelId}
        id={this.id}
        isFocused={isFocused}
      />
    );
  }

  render() {
    const {disabled, hasErrors, isFocused, label, theme, value} = this.props;
    const isContained = theme === AnatomyThemes.CONTAINED;
    const shouldRenderLabel = !isContained || !!label;

    const fieldContentClasses = classNames({
      [css.fieldContent]: true,
      [css.fieldContent_disabled]: disabled,
      [css['fieldContent_theme-contained']]: isContained,
    });

    // NOTE: we do not use '!value' here, because the user could enter '0' in a number field
    const isEmpty = value === undefined || value === null || value === '';

    const isSubdued = !isEmpty || isFocused;

    return (
      <div className={fieldContentClasses} onClick={this.props.onClick}>
        <AnatomyBaseStyles>
          <div className={css.innerContent}>
            {shouldRenderLabel && (
              <AnimatedLabel
                disabled={disabled}
                hasErrors={hasErrors}
                htmlFor={this.id}
                isFocused={isFocused}
                isSubdued={isSubdued}
              >
                {label}
              </AnimatedLabel>
            )}
            {this.renderInput()}
          </div>
        </AnatomyBaseStyles>
      </div>
    );
  }
}

/**
 * TextField is a text input component that allows a user to fill in single line inputs.
 */
class TextField extends React.PureComponent<TextFieldProps> {
  static defaultProps = {
    disabled: false,
    hasErrors: false,
    onBlur: noop,
    onChange: noop,
    onClick: noop,
  };

  focus = () => {
    if (this.props.disabled || this.props.isFocused) {
      return;
    }

    this.props.focus();
  };

  onClick = (e: SyntheticMouseEvent<*>) => {
    this.focus();
    this.props.onClick(e);
  };

  render() {
    const {disabled, groupPosition, hasErrors, isFocused, theme} = this.props;

    const ContainerComponent = theme ? ContainerComponents[theme] : ContainedItem;

    return (
      <ContainerComponent
        disabled={disabled}
        groupPosition={groupPosition}
        hasErrors={hasErrors}
        isFocused={isFocused}
      >
        <TextFieldBase {...this.props} onClick={this.onClick} />
      </ContainerComponent>
    );
  }
}

TextField = compose(
  withFieldMessages(),
  withManagedFocus(),
  withAnatomyContextProvider()
)(TextField);

export {TextField, TextFieldBase};
