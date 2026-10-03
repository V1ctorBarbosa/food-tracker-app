import { formatMaxDecimals, formatSignedNumber, formatWholeNumber } from './format';

describe('formatWholeNumber', () => {
  test.each([
    [0, '0'],
    [1949.6, '1.950'],
    [2000, '2.000'],
    [37.2, '37'],
  ])('formats %p as %p', (value, expected) => {
    expect(formatWholeNumber(value)).toBe(expected);
  });
});

describe('formatSignedNumber', () => {
  test('prefixes a positive value with +', () => {
    expect(formatSignedNumber(1.5, 1)).toBe('+1.5');
  });

  test('prefixes zero with +', () => {
    expect(formatSignedNumber(0, 1)).toBe('+0.0');
  });

  test('does not add an extra sign to a negative value', () => {
    expect(formatSignedNumber(-1.5, 1)).toBe('-1.5');
  });

  test('rounds to the given number of decimal places', () => {
    expect(formatSignedNumber(1.567, 2)).toBe('+1.57');
  });
});

describe('formatMaxDecimals', () => {
  test('rounds a floating-point value to the given number of decimals', () => {
    expect(formatMaxDecimals(14.819999999999999, 1)).toBe('14,8');
  });

  test('trims a trailing zero decimal for a whole number', () => {
    expect(formatMaxDecimals(2000, 0)).toBe('2.000');
  });
});
