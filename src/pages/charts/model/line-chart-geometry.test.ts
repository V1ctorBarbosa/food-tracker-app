import { buildLineChartCoordinates, buildLineChartPath } from './line-chart-geometry';

describe('buildLineChartCoordinates', () => {
  test('spreads points evenly across the width and scales values to fill the height', () => {
    expect(buildLineChartCoordinates([0, 50, 100], 100, 100, 0)).toEqual([
      { x: 0, y: 100 },
      { x: 50, y: 50 },
      { x: 100, y: 0 },
    ]);
  });

  test('insets every point by the padding on both axes', () => {
    expect(buildLineChartCoordinates([0, 100], 100, 100, 10)).toEqual([
      { x: 10, y: 90 },
      { x: 90, y: 10 },
    ]);
  });

  test('centers a single value on both axes without dividing by zero', () => {
    expect(buildLineChartCoordinates([42], 100, 100, 0)).toEqual([{ x: 0, y: 50 }]);
  });

  test('centers every point vertically when all values are equal', () => {
    expect(buildLineChartCoordinates([5, 5, 5], 100, 100, 0)).toEqual([
      { x: 0, y: 50 },
      { x: 50, y: 50 },
      { x: 100, y: 50 },
    ]);
  });
});

describe('buildLineChartPath', () => {
  test('returns null when there are fewer than two values', () => {
    expect(buildLineChartPath([], 100, 100, 0)).toBeNull();
    expect(buildLineChartPath([42], 100, 100, 0)).toBeNull();
  });

  test('builds an SVG path connecting every coordinate with move-then-line commands', () => {
    expect(buildLineChartPath([0, 100], 100, 100, 0)).toBe('M 0 100 L 100 0');
  });
});
