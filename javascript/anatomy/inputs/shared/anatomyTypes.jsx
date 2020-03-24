import PropTypes from 'prop-types';
import React from 'react';

import {getDisplayName} from './anatomyUtil';

export const AnatomySizes = {
  XSMALL: 'xsmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

export const AnatomyThemes = {
  CONTAINED: 'contained',
  STANDARD: 'standard',
};

export const AnatomyContextTypes = {
  anatomySize: PropTypes.oneOf(Object.values(AnatomySizes)),
  anatomyTheme: PropTypes.oneOf(Object.values(AnatomyThemes)),
};

export function withAnatomyContextProvider() {
  return (Component) =>
    class extends React.Component {
      static displayName = getDisplayName(Component, 'withAnatomyContextProvider');

      static propTypes = {
        size: AnatomyContextTypes.anatomySize,
        theme: AnatomyContextTypes.anatomyTheme,
        useFieldHeader: PropTypes.bool,
      };

      static defaultProps = {
        size: AnatomySizes.MEDIUM,
        theme: AnatomyThemes.CONTAINED,
        useFieldHeader: true,
      };

      static childContextTypes = {
        anatomySize: AnatomyContextTypes.anatomySize,
        anatomyTheme: AnatomyContextTypes.anatomyTheme,
        anatomyUseFieldHeader: PropTypes.bool,
      };

      getChildContext() {
        return {
          anatomySize:
            this.props.size === 'xsmall' || this.props.size === 'small'
              ? 'small'
              : 'medium',
          anatomyTheme: this.props.theme,
          anatomyUseFieldHeader: this.props.useFieldHeader,
        };
      }

      render() {
        return <Component {...this.props} />;
      }
    };
}

export function withAnatomyContextConsumer() {
  return (Component) =>
    class extends React.Component {
      static displayName = getDisplayName(Component, 'withAnatomyContextConsumer');

      static contextTypes = {
        anatomySize: AnatomyContextTypes.anatomySize.isRequired,
        anatomyTheme: AnatomyContextTypes.anatomyTheme.isRequired,
        anatomyUseFieldHeader: PropTypes.bool,
      };

      render() {
        return <Component {...this.context} {...this.props} />;
      }
    };
}
