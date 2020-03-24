import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {ScreenReaderHint} from 'javascript/anatomy/util/ScreenReaderHint';

import css from './Loader.scss';

/**
 * Generic Loader component
 *
 * Note: Size and color of the loader are determined by the font (and thus, are inherited).
 * To customize, wrap the component in an element with your desired color and font-size
 * or add a class with these properties defined.
 */
export class Loader extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const className = classNames({
      [css.loader]: true,
      [this.props.className]: !!this.props.className,
    });

    return <div aria-label="Loading" className={className} role="img" />;
  }
}

export class CenteredLoader extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const className = classNames({
      [this.props.className]: !!this.props.className,
    });

    return (
      <div className={css.centerWrapper}>
        <Loader className={className} />
      </div>
    );
  }
}

export class LoaderOverlay extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  render() {
    const {children, isLoading} = this.props;
    const wrapperClassName = classNames({
      [css.overlayWrapper]: isLoading,
    });

    return (
      <div
        aria-busy={isLoading}
        aria-live={isLoading ? 'polite' : 'off'}
        className={wrapperClassName}
      >
        <div aria-hidden={isLoading}>{children}</div>
        {isLoading && (
          <div className={css.overlay}>
            <ScreenReaderHint>Content loading...</ScreenReaderHint>
            <CenteredLoader />
          </div>
        )}
      </div>
    );
  }
}
