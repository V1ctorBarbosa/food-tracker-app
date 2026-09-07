import { buildAxisTicks, buildLineChartCoordinates, buildLineChartPath, mapValueToY, type PlotArea } from './line-chart-geometry';

const fullPlotArea: PlotArea = { x: 0, y: 0, width: 100, height: 100 };

describe('buildAxisTicks', () => {
  test('rounds the domain outward to whole multiples of the step', () => {
    expect(buildAxisTicks([1820, 2140], 500)).toEqual({ domainMin: 1500, domainMax: 2500, values: [1500, 2000, 2500] });
  });

  test('extends a zero-span domain by one step so there is always a real range', () => {
    expect(buildAxisTicks([40, 40], 40)).toEqual({ domainMin: 40, domainMax: 80, values: [40, 80] });
  });

  test('falls back to [0, step] when there are no values yet', () => {
    expect(buildAxisTicks([], 10)).toEqual({ domainMin: 0, domainMax: 10, values: [0, 10] });
  });
});

describe('mapValueToY', () => {
  test('maps the domain minimum to the bottom of the plot area', () => {
    expect(mapValueToY(0, 0, 100, fullPlotArea)).toBe(100);
  });

  test('maps the domain maximum to the top of the plot area', () => {
    expect(mapValueToY(100, 0, 100, fullPlotArea)).toBe(0);
  });

  test('maps a mid-domain value to the vertical middle of the plot area', () => {
    expect(mapValueToY(50, 0, 100, fullPlotArea)).toBe(50);
  });

  test('respects a plot area offset from the SVG origin', () => {
    const insetPlotArea: PlotArea = { x: 10, y: 10, width: 80, height: 80 };

    expect(mapValueToY(0, 0, 100, insetPlotArea)).toBe(90);
    expect(mapValueToY(100, 0, 100, insetPlotArea)).toBe(10);
  });
});

describe('buildLineChartCoordinates', () => {
  test('spreads points evenly across the plot width and scales values against the given domain', () => {
    expect(buildLineChartCoordinates([0, 50, 100], 0, 100, fullPlotArea)).toEqual([
      { x: 0, y: 100 },
      { x: 50, y: 50 },
      { x: 100, y: 0 },
    ]);
  });

  test('centers a single value horizontally without dividing by zero', () => {
    expect(buildLineChartCoordinates([42], 0, 100, fullPlotArea)).toEqual([{ x: 0, y: 58 }]);
  });
});

describe('buildLineChartPath', () => {
  test('returns null when there are fewer than two values', () => {
    expect(buildLineChartPath([], 0, 100, fullPlotArea)).toBeNull();
    expect(buildLineChartPath([42], 0, 100, fullPlotArea)).toBeNull();
  });

  test('builds an SVG path connecting every coordinate with move-then-line commands', () => {
    expect(buildLineChartPath([0, 100], 0, 100, fullPlotArea)).toBe('M 0 100 L 100 0');
  });
});
