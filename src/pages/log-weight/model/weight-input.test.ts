import { convertTypedWeightToKilograms, MinimumWeightInDisplayUnit, resolveWeightInputText } from './weight-input';

describe('resolveWeightInputText', () => {
  test('shows exactly what the user typed while editing, without reformatting', () => {
    expect(resolveWeightInputText('86', 8)).toBe('86');
  });

  test('keeps a trailing decimal separator the user has not finished', () => {
    expect(resolveWeightInputText('86,', 86)).toBe('86,');
  });

  test('keeps an empty field empty so it can be cleared and retyped', () => {
    expect(resolveWeightInputText('', 70)).toBe('');
  });

  test('formats the stored weight with one decimal when not editing', () => {
    expect(resolveWeightInputText(null, 86)).toBe('86.0');
    expect(resolveWeightInputText(null, 87.64)).toBe('87.6');
  });
});

describe('typing a weight digit by digit', () => {
  test('each keystroke yields the number typed so far, so 86 is reachable', () => {
    const keystrokes = ['8', '86', '86,', '86,4'];

    const kilogramsAfterEachKeystroke = keystrokes.map((text) => convertTypedWeightToKilograms(text, 'Kilograms'));

    expect(kilogramsAfterEachKeystroke).toEqual([8, 86, 86, 86.4]);
  });
});

describe('convertTypedWeightToKilograms', () => {
  test.each([
    ['87,6', 87.6],
    ['87.6', 87.6],
    ['  70 ', 70],
  ])('reads %p kilograms as %p', (text, expected) => {
    expect(convertTypedWeightToKilograms(text, 'Kilograms')).toBe(expected);
  });

  test('converts pounds typed with a comma back to kilograms', () => {
    expect(convertTypedWeightToKilograms('176,4', 'Pounds')).toBeCloseTo(80, 1);
  });

  test('never goes below the minimum weight', () => {
    expect(convertTypedWeightToKilograms('0', 'Kilograms')).toBe(MinimumWeightInDisplayUnit);
    expect(convertTypedWeightToKilograms('-5', 'Kilograms')).toBe(MinimumWeightInDisplayUnit);
  });

  test.each([[''], ['   '], ['abc'], ['1,2,3']])('returns null for %p', (text) => {
    expect(convertTypedWeightToKilograms(text, 'Kilograms')).toBeNull();
  });
});
