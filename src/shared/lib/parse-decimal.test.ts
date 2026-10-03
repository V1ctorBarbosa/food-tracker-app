import { parseDecimalInput } from './parse-decimal';

describe('parseDecimalInput', () => {
  test.each([
    ['0,7', 0.7],
    ['0.7', 0.7],
    ['45', 45],
    ['  12,5  ', 12.5],
    ['0', 0],
    ['-3,2', -3.2],
  ])('reads %p as %p', (text, expected) => {
    expect(parseDecimalInput(text)).toBe(expected);
  });

  test.each([[''], ['   '], ['abc'], ['1,2,3'], ['1.2.3'], ['12kg']])('rejects %p', (text) => {
    expect(parseDecimalInput(text)).toBeNull();
  });
});
