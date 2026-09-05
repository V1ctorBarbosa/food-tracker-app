import { formatSignedNumber } from './format';

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
