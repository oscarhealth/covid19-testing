/* eslint-disable local/use-emdash */
import {flatten} from 'lodash';
import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React from 'react';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {createTextMaskInputElement} from 'text-mask-core';

import {NakedTextInput} from './NakedTextInput';

// text-mask-core expects single characters in the mask array, so this helper breaks apart multi-character strings
export function formatMask(mask) {
  return flatten(
    mask.map((maskPiece) =>
      typeof maskPiece === 'string' ? maskPiece.split('') : maskPiece
    )
  );
}

export function yearInRangePipe() {
  /**
   * Returns value if input is within given year range, otherwise false to indicate that it failed to pipe.
   * Min/max years are hardcoded to 1900 and 2100 for now as we couldn't find a use case for other min/max years.
   * Please refer to https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md for more info on pipes
   */
  const minYearStr = '1900';
  const maxYearStr = '2100';

  return function(conformedValue) {
    const value = parseInt(conformedValue); // remove placeholder spaces
    const valueStr = parseInt(conformedValue).toString();

    return value < parseInt(minYearStr.substring(0, valueStr.length)) ||
      value > parseInt(maxYearStr.substring(0, valueStr.length))
      ? false
      : conformedValue;
  };
}

export function npiPipe(conformedValue) {
  /**
   * Returns value if NPI starts with 1 or 2, otherwise false to indicate that it failed to pipe.
   * Please refer to https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md for more info on pipes
   */
  const valueStr = conformedValue.replace(/\D/g, ''); // remove placeholder spaces
  if (!valueStr) {
    return conformedValue;
  }

  const firstNumber = valueStr.charAt(0);
  return firstNumber === '1' || firstNumber === '2' ? conformedValue : false;
}

export function claimIdPipe(conformedValue) {
  /**
   * Returns value if claim ID contains R or S followed by at most 7 numbers. R would automatically be prefixed if
   * it only contains numbers. If it doesn't match claim ID format, it returns false to indicate it failed to pipe.
   * Please refer to https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md for more info on pipes
   */
  if (!conformedValue) {
    return conformedValue;
  }
  const firstChar = conformedValue.charAt(0).toUpperCase();
  const claimNumber = conformedValue.replace(/\D/g, '');

  if (!/^([0-9]{0,7})$/.test(claimNumber)) {
    return false;
  }
  // No need to check whether first character is R or S, as mask is specified to only allow those two characters
  const prefix = isNaN(firstChar) ? firstChar : 'R';
  return prefix + claimNumber;
}

// TODO: update this to use flow
/**
 * A map of available mask type to its props. Some common props are explained below.
 * For more information, please refer to https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md
 * mask: Array<string | RegExp> | string => Array<string | RegExp>
 *   - Array or function defining how user input is to be masked. Function takes raw value and returns an array.
 * guide?: boolean
 *   - Determines whether to always show mask characters or add them dynamically (when set to false). Defaults to true.
 * keepCharPositions?: boolean
 *   - Determines whether to keep (when set to true) or shift (when set to false) existing character positions
 *     when adding or deleting characters. Defaults to false.
 * pipe?: (string, Object) => string | boolean | {value: string, indexesOfPipedChars: Array<number>}
 *   - Function that allows the conformed (masked) value to be further modified before displaying it on the screen.
 *     Boolean value (false) should be returned when rejecting the conformed value to keep it from changing.
 *     String value should be returned when returning a modified value without adding any new characters.
 *     Object should be returned when modified value contains newly added characters, where value is the modified value
 *     and indexesOfPipedChars is an array of integers containing indexes of all the characters that were added.
 * placeholder?: ?string
 *   - Value to display when input is focused. Defaults to undefined.
 */
export const MASKS = {
  'claimId': {
    guide: false,
    mask: [/[rRsS0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
    placeholder: 'R or S #',
    pipe: claimIdPipe,
  },
  'date': {
    keepCharPositions: true,
    mask: formatMask([
      /[0-9]/,
      /[0-9]/,
      ' / ',
      /[0-9]/,
      /[0-9]/,
      ' / ',
      /[12]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
    ]),
    placeholder: 'MM / DD / YYYY',
    pipe: createAutoCorrectedDatePipe('mm / dd / yyyy'),
  },
  'dollarAmount': {
    guide: false,
    mask: createNumberMask({
      allowDecimal: true,
    }),
    placeholder: '$',
  },
  'npi': {
    mask: createNumberMask({
      prefix: '',
      includeThousandsSeparator: false,
      integerLimit: 10,
    }),
    pipe: npiPipe,
  },
  'shortDate': {
    keepCharPositions: true,
    mask: formatMask([/[0-9]/, /[0-9]/, ' / ', /[12]/, /[0-9]/, /[0-9]/, /[0-9]/]),
    placeholder: 'MM / YYYY',
    pipe: createAutoCorrectedDatePipe('mm / yyyy'),
  },
  'ssn': {
    guide: false,
    mask: formatMask([
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      ' - ',
      /[0-9]/,
      /[0-9]/,
      ' - ',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
    ]),
    placeholder: '\u2007\u2007\u2007 - \u2007\u2007 - \u2007\u2007\u2007\u2007',
  },
  'time': {
    mask: formatMask([/[01]/, /[0-9]/, ':', /[0-5]/, /[0-9]/, ' ', /[AaPp]/, /[Mm]/]),
    placeholder: 'HH:MM AM',
  },
  'tin': {
    guide: false,
    mask: formatMask([
      /[0-9]/,
      /[0-9]/,
      ' - ',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
    ]),
    placeholder: '\u2007\u2007 - \u2007\u2007\u2007\u2007\u2007\u2007\u2007',
  },
  '24time': {
    mask: formatMask([/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/]),
    placeholder: 'HH:MM',
  },
  'usPhone': {
    guide: false,
    mask: formatMask([
      '(',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      ') ',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '-',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
    ]),
    placeholder: '(\u2007\u2007\u2007) \u2007\u2007\u2007-\u2007\u2007\u2007\u2007',
  },
  'year': {
    mask: createNumberMask({
      prefix: '',
      includeThousandsSeparator: false,
      integerLimit: 4,
    }),
    placeholder: 'YYYY',
    pipe: yearInRangePipe(),
  },
  'zipcode': {
    mask: createNumberMask({
      prefix: '',
      includeThousandsSeparator: false,
      integerLimit: 5,
      allowLeadingZeroes: true,
    }),
  },
};

export class MaskedInput extends React.Component {
  static propTypes = {
    /**
     * Please refer to https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md for documentation
     * on this component's props.
     */
    customMask: PropTypes.shape({
      mask: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
      placeholder: PropTypes.string,
      guide: PropTypes.bool,
      keepCharPositions: PropTypes.bool,
      pipe: PropTypes.func,
      placeholderChar: PropTypes.string,
      showMask: PropTypes.bool,
    }),
    isFocused: PropTypes.bool,
    label: PropTypes.string,
    maskType: PropTypes.oneOf(Object.keys(MASKS)),
    onChange: PropTypes.func,
    pipe: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    onChange: noop,
  };

  componentDidMount() {
    this.updateTextMask();
  }

  componentDidUpdate() {
    this.updateTextMask();
  }

  updateTextMask() {
    const {
      props,
      props: {value},
    } = this;
    const maskProp = props.customMask || MASKS[props.maskType];

    this.textMaskInputElement = createTextMaskInputElement({
      inputElement: this.inputElement,
      placeholderChar: '\u2007',
      ...maskProp,
    });
    this.textMaskInputElement.update(value);
  }

  onChange = (event) => {
    this.textMaskInputElement.update();

    this.props.onChange(event);
  };

  setInputRef = (ref) => {
    this.inputElement = ref;
    this.props.inputRef(ref);
  };

  render() {
    const {
      customMask,
      isFocused,
      label,
      maskType,
      useFieldHeader,
      ...props
    } = this.props;
    const focusedPlaceholder = customMask
      ? customMask.placeholder
      : MASKS[maskType].placeholder;
    const {placeholder: blurredPlaceholder} = this.props;
    let placeholder = undefined;

    if (isFocused) {
      placeholder = focusedPlaceholder;
    } else if (!!label) {
      placeholder = undefined;
    } else {
      placeholder = blurredPlaceholder || focusedPlaceholder;
    }

    return (
      <NakedTextInput
        {...props}
        inputRef={this.setInputRef}
        onChange={this.onChange}
        placeholder={placeholder}
      />
    );
  }
}
