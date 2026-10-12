import {
  canRequestEstimate,
  formatDescriptionCounter,
  MaximumDescriptionLength,
  MinimumDescriptionLengthWithoutPhoto,
  toDescriptionRequest,
} from './description-rules';

describe('canRequestEstimate', () => {
  test('accepts a photo with no description', () => {
    expect(canRequestEstimate(true, '')).toBe(true);
  });

  test('accepts a photo with a short description', () => {
    expect(canRequestEstimate(true, 'frito')).toBe(true);
  });

  test('rejects a description alone that is too short to estimate from', () => {
    expect(canRequestEstimate(false, 'almoço')).toBe(false);
  });

  test('accepts a description alone of exactly the minimum length', () => {
    expect(canRequestEstimate(false, 'a'.repeat(MinimumDescriptionLengthWithoutPhoto))).toBe(true);
  });

  test('ignores surrounding spaces when counting', () => {
    expect(canRequestEstimate(false, '   almoço   ')).toBe(false);
  });

  test('rejects a description longer than the maximum, even with a photo', () => {
    expect(canRequestEstimate(true, 'a'.repeat(MaximumDescriptionLength + 1))).toBe(false);
  });
});

describe('toDescriptionRequest', () => {
  test('trims the description', () => {
    expect(toDescriptionRequest('  o frango é empanado  ')).toBe('o frango é empanado');
  });

  test('sends nothing when the description is blank', () => {
    expect(toDescriptionRequest('   ')).toBeNull();
  });
});

describe('formatDescriptionCounter', () => {
  test('shows the length against the maximum', () => {
    expect(formatDescriptionCounter('frito')).toBe('5/500');
  });
});
