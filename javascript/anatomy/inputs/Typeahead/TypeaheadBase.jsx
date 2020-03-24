import classNames from 'classnames';
import KeyCode from 'keycode-js';
import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React from 'react';

import {AnatomyBaseStyles} from 'javascript/anatomy/inputs/shared/AnatomyBaseStyles';
import {AnimatedLabel} from 'javascript/anatomy/inputs/shared/AnimatedLabel';
import {Label} from 'javascript/anatomy/inputs/shared/Label';
import {NakedTextInput} from 'javascript/anatomy/inputs/shared/NakedTextInput';
import {
  withFieldFocus,
  withHighlightableList,
  withManagedFocus,
} from 'javascript/anatomy/inputs/shared/anatomyFieldHelpers';
import {
  AnatomyThemes,
  withAnatomyContextConsumer,
} from 'javascript/anatomy/inputs/shared/anatomyTypes';
import {ContainedItem} from 'javascript/anatomy/inputs/shared/layout/ContainedItem';
import {UnderlinedItem} from 'javascript/anatomy/inputs/shared/layout/UnderlinedItem';
import {DropdownOverlay} from 'javascript/anatomy/inputs/shared/overlays/DropdownOverlay';
import {compose} from 'javascript/anatomy/util/compose';
import makeUniqueId from 'javascript/anatomy/util/makeUniqueId';

import css from './TypeaheadBase.scss';

const ContainerComponents = {
  [AnatomyThemes.CONTAINED]: ContainedItem,
  [AnatomyThemes.STANDARD]: UnderlinedItem,
};

/**
 * TODO (@phou)
 * - Add tests
 */

class TypeaheadBase extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    hasErrors: PropTypes.bool,
    highlightMatchedSubstring: PropTypes.bool,
    isLoading: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.array),
    query: PropTypes.string,
    showOverlayWhenEmpty: PropTypes.bool,
    value: PropTypes.any,
    /**
     * Since the value can be any arbitrary renderable type, this prop indicates what to display in the typeahead's
     * text input if the corresponding option is selected.
     */
    valueAsString: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    isLoading: false,
    showOverlayWhenEmpty: false,
    onChange: noop,
    options: [],
  };

  id = this.props.id || makeUniqueId(this.props.label);

  getTextForDisplay = () => {
    if (this.props.valueAsString) {
      return this.props.valueAsString;
    }

    return this.props.value !== undefined ? this.props.value : null;
  };

  isShowingOverlays = () => {
    return !!(
      (this.props.showOverlayWhenEmpty || this.props.query) &&
      this.props.isFocused
    );
  };

  onChange = (value) => {
    this.props.focusField();
    this.props.onChange(value);
    this.props.onBlur();
  };

  onClickOutsideOverlay = () => {
    this.props.onBlur();
  };

  onClickTypeaheadArea = () => {
    if (!this.props.disabled) {
      this.props.focus();
    }
  };

  /**
   * If the overlays are shown, calling onBlur prematurely closes the dropdown
   * and fails to capture the pending click on the item. Thus we use onChange
   * and onClickOutsideOverlay to manually call onBlur instead.
   */
  onNakedInputBlur = () => {
    if (!this.isShowingOverlays()) {
      this.props.onBlur();
    }
  };

  onKeyDown = (e) => {
    switch (e.which) {
      case KeyCode.KEY_ESCAPE:
        this.props.focusField();
        this.props.onBlur();
        break;

      case KeyCode.KEY_TAB:
        if (this.props.query) {
          e.preventDefault();
        }
        break;

      case KeyCode.KEY_PAGE_UP:
      case KeyCode.KEY_PAGE_DOWN:
        if (this.props.query) {
          e.preventDefault();
        }
        break;

      case KeyCode.KEY_ENTER:
      case KeyCode.KEY_RETURN:
        if (this.props.highlightedIndex !== -1) {
          this.onChange(this.props.options[this.props.highlightedIndex][0]);
        }
        break;
    }

    this.props.onKeyDown(e);
  };

  onFieldKeyDown = (e) => {
    switch (e.which) {
      case KeyCode.KEY_SPACE:
      case KeyCode.KEY_ENTER:
      case KeyCode.KEY_RETURN:
        this.props.focus();
        break;
    }
  };

  renderLabel() {
    if (!this.props.label) {
      return;
    }

    const text = this.getTextForDisplay();

    return (
      <AnimatedLabel
        {...this.props}
        htmlFor={this.id}
        isFocused={this.props.isFocused || this.props.isFieldFocused}
        isSubdued={!!text || this.props.isFocused}
        transitionOpacity={true}
      >
        {this.props.label}
      </AnimatedLabel>
    );
  }

  renderTextInput() {
    const inputClasses = classNames({
      [css.textInput]: true,
      [css.textInput_hidden]: !this.props.isFocused,
    });

    return (
      <div className={inputClasses}>
        <NakedTextInput
          anatomyUseFieldHeader={this.props.anatomyUseFieldHeader}
          disabled={this.props.disabled}
          id={this.id}
          inputRef={this.props.inputRef}
          onBlur={this.onNakedInputBlur}
          onChange={this.props.onChangeQuery}
          onFocus={this.props.onFocus}
          onKeyDown={this.onKeyDown}
          tabIndex={-1}
          value={this.props.query}
        />
      </div>
    );
  }

  renderValue() {
    const valueClasses = classNames({
      [css.value]: true,
      [css.value_hidden]: this.props.isFocused,
    });

    return (
      <div className={valueClasses}>
        <Label disabled={this.props.disabled} isFocused={true}>
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
      [css.innerContainer_focused]: this.props.isFocused,
    });

    const visibleContent = (
      <div className={css.visibleContent}>
        {this.renderLabel()}
        {this.renderTextInput()}
        {this.renderValue()}
      </div>
    );

    return (
      <ContainerComponent
        disabled={this.props.disabled}
        groupPosition={this.props.groupPosition}
        hasErrors={this.props.hasErrors}
        isFocused={this.props.isFocused || this.props.isFieldFocused}
        noBorder={this.isShowingOverlays()}
      >
        <AnatomyBaseStyles>
          <div className={innerContainerClasses} onClick={this.onClickTypeaheadArea}>
            <DropdownOverlay
              {...this.props}
              isShowing={this.isShowingOverlays()}
              onChange={this.onChange}
              onClickOutsideOverlay={this.onClickOutsideOverlay}
              onKeyDown={this.onKeyDown}
              visibleContent={visibleContent}
            />
            <div
              onBlur={this.props.onFieldBlur}
              onFocus={this.props.onFieldFocus}
              onKeyDown={this.onFieldKeyDown}
              ref={this.props.fieldRef}
              tabIndex={this.props.disabled || this.props.isFocused ? -1 : 0}
            />
          </div>
        </AnatomyBaseStyles>
      </ContainerComponent>
    );
  }
}

TypeaheadBase = compose(
  withFieldFocus(),
  withManagedFocus(),
  withAnatomyContextConsumer(),
  withHighlightableList()
)(TypeaheadBase);

export {TypeaheadBase};
