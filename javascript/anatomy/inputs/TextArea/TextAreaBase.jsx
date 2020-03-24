// @flow
import classNames from 'classnames';
import {noop} from 'lodash';
import React from 'react';

import {AnatomyBaseStyles} from 'javascript/anatomy/inputs/shared/AnatomyBaseStyles';
import {AnimatedLabel} from 'javascript/anatomy/inputs/shared/AnimatedLabel';
import {AnatomyThemes} from 'javascript/anatomy/inputs/shared/anatomyTypes';
import {ContainedItem} from 'javascript/anatomy/inputs/shared/layout/ContainedItem';
import {UnderlinedItem} from 'javascript/anatomy/inputs/shared/layout/UnderlinedItem';
import makeUniqueId from 'javascript/anatomy/util/makeUniqueId';

import {NakedTextArea} from './NakedTextArea';

import css from './TextAreaBase.scss';

const ContainerComponents = {
  contained: ContainedItem,
  standard: UnderlinedItem,
};

export type TextAreaProps = {|
  ariaDescribedBy?: string,
  ariaLabelledBy?: string,
  disabled?: boolean,
  hasErrors?: boolean,
  /**
   * This is used to set the id of the raw input as well as the htmlFor of the label.
   */
  id?: string,
  /**
   * This function takes the ref of the raw text input as its only argument, which is useful for things like focusing.
   */
  isFocused?: boolean,
  label: string,
  /**
   * Minimum height (set by css property value), only allowed for contained inputs.
   */
  minHeight?: string,
  name?: string,
  onBlur?: () => void,
  /**
   * This function takes the string value of the text input element as its only argument.
   */
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
  onClick?: (SyntheticMouseEvent<HTMLElement>) => void,
  onFocus?: () => void,
  placeholder?: string,
  size?: 'small' | 'medium',
  theme?: 'standard' | 'contained',
  // TODO(iain): Move to general anatomy props
  useFieldHeader?: boolean,
  value: string,
|};

type TextAreaBaseProps = {|
  focus: () => void,
  groupPosition?: string,
  inputRef?: (HTMLInputElement) => void,
  style?: string,
  ...TextAreaProps,
|};

/**
 * A TextArea is a TextField that supports multiple lines.
 */
export class TextAreaBase extends React.PureComponent<TextAreaBaseProps> {
  static propTypes = {};

  // TODO(iain): remove default props and make functional defaults
  static defaultProps = {
    disabled: false,
    hasErrors: false,
    onBlur: noop,
    onChange: noop,
    onClick: noop,
  };

  id = this.props.id || makeUniqueId(this.props.label);

  focus = () => {
    if (this.props.disabled || this.props.isFocused) {
      return;
    }

    this.props.focus();
  };

  onClick = (evt: SyntheticMouseEvent<HTMLElement>) => {
    this.focus();
    if (this.props.onClick) {
      this.props.onClick(evt);
    }
  };

  render() {
    const {
      ariaDescribedBy,
      ariaLabelledBy,
      disabled,
      groupPosition,
      hasErrors,
      isFocused,
      inputRef,
      label,
      name,
      onBlur,
      onChange,
      onFocus,
      size,
      theme,
      minHeight,
      value,
      style,
    } = this.props;

    const fieldContentClasses = classNames({
      [css.fieldContent]: true,
      [css['fieldContent_theme-contained']]: theme === 'contained',
    });

    const labelContainerClasses = classNames({
      [css['labelContainer_size-medium']]: size === 'medium',
      [css['labelContainer_size-small']]: size === 'small',
    });

    const ContainerComponent = theme ? ContainerComponents[theme] : ContainedItem;

    const minHeightWithDefault =
      theme === AnatomyThemes.CONTAINED && !minHeight ? '4em' : minHeight;

    return (
      <ContainerComponent
        disabled={disabled}
        groupPosition={groupPosition}
        hasErrors={hasErrors}
        isFocused={isFocused}
        itemGrow={true}
      >
        <div className={fieldContentClasses} onClick={this.onClick}>
          <AnatomyBaseStyles>
            <div className={css.innerContent}>
              {label && (
                <div className={labelContainerClasses}>
                  <AnimatedLabel
                    {...this.props}
                    htmlFor={this.id}
                    isSubdued={!!value || isFocused}
                  >
                    {label}
                  </AnimatedLabel>
                </div>
              )}
              <NakedTextArea
                ariaDescribedBy={ariaDescribedBy}
                ariaLabelledBy={ariaLabelledBy}
                disabled={disabled}
                id={this.id}
                inputRef={inputRef}
                minHeight={minHeightWithDefault}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                onFocus={onFocus}
                style={style}
                value={value}
              />
            </div>
          </AnatomyBaseStyles>
        </div>
      </ContainerComponent>
    );
  }
}
