import PropTypes from 'prop-types';
import React from 'react';

import makeUniqueId from 'javascript/anatomy/util/makeUniqueId';

import {AnatomyBaseStyles} from './AnatomyBaseStyles';
import {getDisplayName} from './anatomyUtil';

import css from './fieldMessages.scss';

class Flags extends React.PureComponent {
  static propTypes = {
    optional: PropTypes.bool,
  };

  render() {
    return (
      <AnatomyBaseStyles>
        {this.props.optional && <div className={css.flag}>Optional</div>}
      </AnatomyBaseStyles>
    );
  }
}

class ErrorMessages extends React.PureComponent {
  static propTypes = {
    errors: PropTypes.array.isRequired,
    errorLabelId: PropTypes.string,
  };

  render() {
    const errors = this.props.errors.map((error) => (
      <div className={css.error} key={error}>
        {error}
      </div>
    ));

    return (
      <AnatomyBaseStyles
        id={this.props.errorLabelId}
        role={errors.length ? 'alert' : null}
      >
        {errors}
      </AnatomyBaseStyles>
    );
  }
}

export function withFieldMessages(defaultShowFieldMessages = true) {
  return (Component) =>
    class extends React.PureComponent {
      static displayName = getDisplayName(Component, 'withFieldMessages');

      static propTypes = {
        errors: PropTypes.array,
        flags: PropTypes.shape({
          optional: PropTypes.bool,
        }),
        showFieldMessages: PropTypes.bool,
      };

      static defaultProps = {
        errors: [],
        flags: {},
        showFieldMessages: defaultShowFieldMessages,
      };
      id =
        this.props.id ||
        makeUniqueId(
          typeof this.props.label === 'string' ? this.props.label : 'unnamed'
        );

      render() {
        const {errors, flags, showFieldMessages, ...rest} = this.props;

        if (!showFieldMessages) {
          return <Component id={this.id} {...rest} />;
        }

        const hasErrors = !!errors.length;
        const errorLabelId = this.id && hasErrors ? `${this.id}-errors` : null;

        return (
          <div className={css.field}>
            <Component
              errorLabelId={errorLabelId}
              hasErrors={hasErrors}
              id={this.id}
              {...rest}
            />
            <Flags {...flags} />
            <ErrorMessages errorLabelId={errorLabelId} errors={errors} />
          </div>
        );
      }
    };
}
