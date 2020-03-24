import PropTypes from 'prop-types';
import React from 'react';

import {Text} from 'common/typography';

import css from './ErrorField.scss';

const EMPTY_ERROR_CHAR = '\u00A0';

export function ErrorField({meta: {invalid, error}, shallow}) {
  if (!invalid || (shallow && typeof error !== 'string')) {
    return <Text className={css.error}>{EMPTY_ERROR_CHAR}</Text>;
  }
  return <Text className={css.error}>{error.toString()}</Text>;
}

ErrorField.propTypes = {
  meta: PropTypes.shape({
    invalid: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }),
};
