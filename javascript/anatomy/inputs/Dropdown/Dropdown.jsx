import classNames from 'classnames';
import KeyCode from 'keycode-js';
import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React from 'react';

import {DropdownIcon} from 'javascript/anatomy/icons';
import {AnatomyBaseStyles} from 'javascript/anatomy/inputs/shared/AnatomyBaseStyles';
import {AnimatedLabel} from 'javascript/anatomy/inputs/shared/AnimatedLabel';
import {Label} from 'javascript/anatomy/inputs/shared/Label';
import {
  withFieldFocus,
  withHighlightableList,
  withManagedFocus,
} from 'javascript/anatomy/inputs/shared/anatomyFieldHelpers';
import {
  AnatomySizes,
  AnatomyThemes,
  withAnatomyContextProvider,
} from 'javascript/anatomy/inputs/shared/anatomyTypes';
import {withFieldMessages} from 'javascript/anatomy/inputs/shared/fieldMessages';
import {ContainedItem} from 'javascript/anatomy/inputs/shared/layout/ContainedItem';
import {UnderlinedItem} from 'javascript/anatomy/inputs/shared/layout/UnderlinedItem';
import {DropdownOverlay} from 'javascript/anatomy/inputs/shared/overlays/DropdownOverlay';
import {compose} from 'javascript/anatomy/util/compose';
import makeUniqueId from 'javascript/anatomy/util/makeUniqueId';

import css from './Dropdown.scss';

const ContainerComponents = {
  [AnatomyThemes.CONTAINED]: ContainedItem,
  [AnatomyThemes.STANDARD]: UnderlinedItem,
};

export function getTextFromValue({value, options, choices, multiple}) {
  const optionsList = choices || options;
  if (multiple && value !== undefined) {
    const valueList = [].concat(value);
    if (valueList.length) {
      return `${valueList.length} selected`;
    }
  }

  const option = optionsList.find((option) => option[0] === value);
  return option ? option[1] : null;
}

export class Dropdown extends React.PureComponent {
  static propTypes = {
    /**
     * This is an alias for the options prop.
     */
    choices: PropTypes.arrayOf(PropTypes.array),
    disabled: PropTypes.bool,
    /**
     * Function that determines what string representation of each option should be used to search when inputting
     * alphanumeric characters. It is provided the individual option array (e.g. it contains the key and what to
     * render) as the only argument, and should return the desired string. This is necessary when the option values
     * are not strings.
     */
    getSearchStringFromOption: PropTypes.func,
    /**
     * Function that determines what text to show in the closed dropdown, given the props as the only argument.
     * This is necessary when the option values are not strings.
     */
    getTextFromValue: PropTypes.func,
    hasErrors: PropTypes.bool,
    isLoading: PropTypes.bool,
    /**
     * This labels the Dropdown.
     */
    label: PropTypes.string,
    /**
     * This is used to pass in an ID to an alterate label ID.
     * This overrides the label paassed in.
     */
    labelId: PropTypes.string,
    /**
     * If true, allows you to select multiple options.
     */
    multiple: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    /**
     * If provided, this component will be used to render the options.
     */
    optionComponent: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.array),
    /**
     * Provided as literals for react-docgen.
     */
    size: PropTypes.oneOf(['small', 'medium']),
    theme: PropTypes.oneOf(['standard', 'contained']),
    useFieldHeader: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.any, PropTypes.arrayOf(PropTypes.any)]),
  };

  static defaultProps = {
    disabled: false,
    getTextFromValue,
    isLoading: false,
    multiple: false,
    onBlur: noop,
    onChange: noop,
    onFocus: noop,
    options: [],
  };

  dropdownListId = this.props.id || makeUniqueId('dropdown-list');
  labelId = this.props.labelId || makeUniqueId('dropdown-label');
  valueId = makeUniqueId('dropdown-value');

  getOptions = () => {
    return this.props.choices || this.props.options;
  };

  getTextForDisplay = () => {
    return this.props.value !== undefined
      ? this.props.getTextFromValue(this.props)
      : null;
  };

  isShowingOverlays = () => {
    return this.props.isFocused;
  };

  onFocus = () => {
    // Adds highlight state, and simulates a keypress to assign focus
    this.props.onHighlight(this.props.highlightedIndex, true);
    this.props.onFocus();
  };

  onBlur = () => {
    if (!this.isShowingOverlays()) {
      this.props.onBlur();
    }
  };

  onChange = (value) => {
    if (this.props.multiple) {
      const newValueList = [].concat(this.props.value || []);
      const valueIndex = newValueList.indexOf(value);

      if (valueIndex !== -1) {
        newValueList.splice(valueIndex, 1);
      } else {
        newValueList.push(value);
      }

      this.props.onChange(newValueList);
      this.props.focus();
    } else {
      this.props.focusField();
      this.props.onChange(value);
      this.props.onBlur();
    }
  };

  onClickOutsideOverlay = () => {
    this.props.onBlur();
  };

  onClickDropdownArea = () => {
    if (this.props.disabled) {
      return;
    }

    if (this.props.isFocused) {
      this.props.focusField();
      this.props.onBlur();
    } else {
      this.props.focus();
    }
  };

  onKeyDown = (e) => {
    switch (e.which) {
      case KeyCode.KEY_ESCAPE:
        this.props.focusField();
        this.props.onBlur();
        // This prevents containers such as modals from closing when closing.
        e.stopPropagation();
        break;

      case KeyCode.KEY_TAB:
        e.preventDefault();
        break;

      case KeyCode.KEY_PAGE_UP:
      case KeyCode.KEY_PAGE_DOWN:
        if (this.isShowingOverlays()) {
          e.preventDefault();
        }
        break;

      case KeyCode.KEY_ENTER:
      case KeyCode.KEY_RETURN:
        if (this.props.highlightedIndex !== -1) {
          this.onChange(this.getOptions()[this.props.highlightedIndex][0]);
        }
        break;
    }

    this.props.onKeyDown(e);
  };

  onFieldKeyDown = (e) => {
    switch (e.which) {
      case KeyCode.KEY_DOWN:
      case KeyCode.KEY_UP:
      case KeyCode.KEY_SPACE:
      case KeyCode.KEY_ENTER:
      case KeyCode.KEY_RETURN:
        this.props.focus();
        break;
    }
  };

  renderArrow() {
    if (this.isShowingOverlays()) {
      return;
    }

    const classes = classNames({
      [css.arrow]: true,
      [css['arrow_size-small']]: this.props.size === AnatomySizes.SMALL,
      [css['arrow_size-medium']]: this.props.size === AnatomySizes.MEDIUM,
      [css['arrow_theme-standard']]: this.props.theme === AnatomyThemes.STANDARD,
      [css.arrow_withHeader]: this.props.useFieldHeader,
    });

    return (
      <div aria-haspopup="listbox" className={classes}>
        <DropdownIcon size="small" />
      </div>
    );
  }

  renderLabel() {
    if (!this.props.label) {
      return;
    }

    const text = this.getTextForDisplay();
    const isSubdued = this.props.isFocused ? this.props.useFieldHeader : !!text;

    return (
      <AnimatedLabel
        {...this.props}
        htmlFor={this.props.id}
        isFocused={this.props.isFocused || this.props.isFieldFocused}
        isSubdued={isSubdued}
        labelId={this.labelId}
        pointerCursor={true}
        transitionOpacity={true}
      >
        {this.props.label}
      </AnimatedLabel>
    );
  }

  renderValue() {
    const valueClasses = classNames({
      [css.value]: true,
      [css.value_hidden]: !this.props.useFieldHeader && this.props.isFocused,
    });

    return (
      <div className={valueClasses}>
        <Label disabled={this.props.disabled} id={this.valueId} isFocused={true}>
          {this.getTextForDisplay()}
        </Label>
      </div>
    );
  }

  render() {
    const ContainerComponent = ContainerComponents[this.props.theme] || ContainedItem;
    const innerContainerClasses = classNames({
      [css.innerContainer]: true,
      [css.innerContainer_disabled]: this.props.disabled,
    });

    const visibleContent = (
      <div className={css.visibleContent}>
        {this.renderLabel()}
        {this.renderValue()}
        {this.renderArrow()}
      </div>
    );

    const showOutlineClass = classNames({
      [css.outline]:
        !this.props.disabled && !this.isShowingOverlays() && this.props.isFieldFocused,
    });

    return (
      <ContainerComponent
        disabled={this.props.disabled}
        groupPosition={this.props.groupPosition}
        hasErrors={this.props.hasErrors}
        isFocused={this.props.isFieldFocused}
        noBorder={this.isShowingOverlays()}
      >
        <AnatomyBaseStyles>
          <div className={innerContainerClasses} onClick={this.onClickDropdownArea}>
            <DropdownOverlay
              {...this.props}
              highlightedIndex={this.props.highlightedIndex}
              id={this.dropdownListId}
              isShowing={this.isShowingOverlays()}
              onChange={this.onChange}
              onClickOutsideOverlay={this.onClickOutsideOverlay}
              onHighlight={this.props.onHighlight}
              onKeyDown={this.onKeyDown}
              options={this.getOptions()}
              visibleContent={visibleContent}
            />
            <div
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onKeyDown={this.onKeyDown}
              ref={this.props.inputRef}
              tabIndex={-1}
            />
            <div
              aria-expanded={this.props.isFocused}
              aria-haspopup="listbox"
              aria-labelledby={`${this.labelId} ${this.valueId}`}
              aria-owns={this.dropdownListId}
              className={showOutlineClass}
              onBlur={this.props.onFieldBlur}
              onFocus={this.props.onFieldFocus}
              onKeyDown={this.onFieldKeyDown}
              ref={this.props.fieldRef}
              role="button"
              tabIndex={this.props.disabled || this.props.isFocused ? -1 : 0}
            />
          </div>
        </AnatomyBaseStyles>
      </ContainerComponent>
    );
  }
}

Dropdown = compose(
  withFieldMessages(),
  withFieldFocus(),
  withManagedFocus(),
  withAnatomyContextProvider(),
  withHighlightableList({enableCharacterSearch: true})
)(Dropdown);
