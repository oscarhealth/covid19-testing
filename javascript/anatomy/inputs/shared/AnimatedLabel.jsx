import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {Label} from './Label';
import {withAnatomyContextConsumer} from './anatomyTypes';
import {
  AnatomySizes,
  AnatomyThemes,
} from 'javascript/anatomy/inputs/shared/anatomyTypes';

import css from './AnimatedLabel.scss';

class AnimatedLabel extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    hasErrors: PropTypes.bool,
    htmlFor: PropTypes.string,
    isFocused: PropTypes.bool,
    isSubdued: PropTypes.bool,
    labelId: PropTypes.string,
    pointerCursor: PropTypes.bool,
    transitionOpacity: PropTypes.bool,
  };

  static defaultProps = {
    isSubdued: false,
    pointerCursor: false,
    transitionOpacity: false,
  };

  // This section allocates the space that the label moves into when subdued
  renderHeaderSection() {
    if (!this.props.anatomyUseFieldHeader) {
      return;
    }

    const headerSectionClasses = classNames({
      [css['headerSection_size-small']]: this.props.anatomySize === AnatomySizes.SMALL,
      [css['headerSection_size-medium']]:
        this.props.anatomySize === AnatomySizes.MEDIUM,
    });

    return <div className={headerSectionClasses} />;
  }

  render() {
    const labelClasses = classNames({
      [css.label]: true,
      [css.label_isSubdued]: this.props.isSubdued,
      [css.label_transitionOpacity]: this.props.transitionOpacity,
      [css.label_withHeader]: this.props.anatomyUseFieldHeader,
      [css['label_size-small']]: this.props.anatomySize === AnatomySizes.SMALL,
      [css['label_size-medium']]: this.props.anatomySize === AnatomySizes.MEDIUM,
      [css['label_theme-contained']]:
        this.props.anatomyTheme === AnatomyThemes.CONTAINED,
      [css['label_theme-standard']]: this.props.anatomyTheme === AnatomyThemes.STANDARD,
    });

    return (
      <div>
        {this.renderHeaderSection()}
        <div className={labelClasses}>
          <Label
            disabled={this.props.disabled}
            hasErrors={this.props.hasErrors}
            htmlFor={this.props.htmlFor}
            id={this.props.labelId}
            isFocused={this.props.isFocused}
            pointerCursor={this.props.pointerCursor}
          >
            {this.props.children}
          </Label>
        </div>
      </div>
    );
  }
}

AnimatedLabel = withAnatomyContextConsumer()(AnimatedLabel);

export {AnimatedLabel};
