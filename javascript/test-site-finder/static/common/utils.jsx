/**
 * Format a number by number of decimals. It also trims any trailing zeros.
 * @param {number} input - Input number.
 * @param {number} decimals - Decimals to be rounded to.
 * @return {string} Formatted string.
 *
 */
export function toFixedNoTrailing(input: number, decimals: number): string {
  const base = Math.pow(10, decimals);
  return `${Math.round(input * base) / base}`;
}

/**
 * Converts a plain string of digits to a phone number with parens around area code. Does not try to do anything
 * to fancy.
 *
 * @param {number} phoneNumberString Phone number (digits only) as a string
 *
 * e.g.
 * '8009453669' -> '(800) 945-3669'
 */
export function formatPhoneNumberWithParens(phoneNumberString) {
  const areaCode = `(${phoneNumberString.substring(0, 3)})`;
  // eslint-disable-next-line local/use-emdash
  return `${areaCode} ${phoneNumberString.substring(3, 6)}-${phoneNumberString.substring(6, 10)}`;
}