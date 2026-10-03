import { calculateSegmentFillPercent } from './segment-fill';

describe('calculateSegmentFillPercent', () => {
  test.each([
    [0, 4, 0, 0],
    [0, 4, 25, 100],
    [0, 4, 12.5, 50],
    [1, 4, 12.5, 0],
    [1, 4, 37.5, 50],
    [3, 4, 100, 100],
    [3, 4, 90, 60],
  ])('segment %p of %p at %p%% progress is %p%% full', (segmentIndex, segmentCount, progressPercent, expected) => {
    expect(calculateSegmentFillPercent(segmentIndex, segmentCount, progressPercent)).toBeCloseTo(expected);
  });

  test('keeps later segments empty and earlier ones full', () => {
    expect(calculateSegmentFillPercent(0, 16, 60)).toBe(100);
    expect(calculateSegmentFillPercent(15, 16, 60)).toBe(0);
  });
});
