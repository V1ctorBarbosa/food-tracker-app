import { resolveQuantityInputText } from './quantity-input';

describe('resolveQuantityInputText', () => {
  test('shows the quantity when nothing is being typed', () => {
    expect(resolveQuantityInputText(null, 150)).toBe('150');
  });

  test('stays empty after the last digit is deleted, instead of putting the old amount back', () => {
    expect(resolveQuantityInputText('', 2)).toBe('');
  });

  test('shows the amount being typed, even before it is a whole number', () => {
    expect(resolveQuantityInputText('12,', 12)).toBe('12,');
  });
});
