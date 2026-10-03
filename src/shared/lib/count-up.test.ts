import { easeOutCubic, interpolateCountUp } from './count-up';

describe('easeOutCubic', () => {
  test.each([
    [0, 0],
    [1, 1],
  ])('maps progress %p to %p', (progress, expected) => {
    expect(easeOutCubic(progress)).toBe(expected);
  });

  test('is already past the halfway mark at half the time', () => {
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875);
  });

  test('clamps progress outside 0 to 1', () => {
    expect(easeOutCubic(-3)).toBe(0);
    expect(easeOutCubic(4)).toBe(1);
  });
});

describe('interpolateCountUp', () => {
  test('starts at the origin value', () => {
    expect(interpolateCountUp(120, 480, 0)).toBe(120);
  });

  test('ends at the target value', () => {
    expect(interpolateCountUp(120, 480, 1)).toBe(480);
  });

  test('counts downward when the target is lower', () => {
    expect(interpolateCountUp(500, 100, 0.5)).toBeCloseTo(150);
  });
});
