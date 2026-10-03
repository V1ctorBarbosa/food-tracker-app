export type ChartCoordinate = {
  x: number;
  y: number;
};

export type PlotArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AxisTicks = {
  domainMin: number;
  domainMax: number;
  values: number[];
};

const MinimumPointCountForLine = 2;
const SingleIndexFallback = 1;

/** Rounds the value range outward to whole multiples of `step`, so gridlines land on round numbers. */
export function buildAxisTicks(values: number[], step: number): AxisTicks {
  if (values.length === 0) {
    return { domainMin: 0, domainMax: step, values: [0, step] };
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const domainMin = Math.floor(rawMin / step) * step;
  let domainMax = Math.ceil(rawMax / step) * step;
  if (domainMax === domainMin) {
    domainMax = domainMin + step;
  }

  const tickValues: number[] = [];
  for (let tick = domainMin; tick <= domainMax; tick += step) {
    tickValues.push(tick);
  }

  return { domainMin, domainMax, values: tickValues };
}

export function mapValueToY(value: number, domainMin: number, domainMax: number, plotArea: PlotArea): number {
  const domainSpan = domainMax - domainMin;

  return plotArea.y + plotArea.height - ((value - domainMin) / domainSpan) * plotArea.height;
}

/** Positions each value along an evenly-spaced x-axis, scaled against the given [domainMin, domainMax] on the y-axis. */
export function buildLineChartCoordinates(values: number[], domainMin: number, domainMax: number, plotArea: PlotArea): ChartCoordinate[] {
  const lastIndex = values.length - 1 || SingleIndexFallback;

  return values.map((value, index) => ({
    x: plotArea.x + (index / lastIndex) * plotArea.width,
    y: mapValueToY(value, domainMin, domainMax, plotArea),
  }));
}

/** Total length of the straight segments joining the coordinates, in the chart's own units. */
export function calculatePolylineLength(coordinates: ChartCoordinate[]): number {
  let totalLength = 0;

  for (let index = 1; index < coordinates.length; index++) {
    const previous = coordinates[index - 1];
    const current = coordinates[index];
    totalLength += Math.hypot(current.x - previous.x, current.y - previous.y);
  }

  return totalLength;
}

/** An SVG path `d` string connecting each value's coordinate, or null when there aren't enough points to draw a line. */
export function buildLineChartPath(values: number[], domainMin: number, domainMax: number, plotArea: PlotArea): string | null {
  if (values.length < MinimumPointCountForLine) {
    return null;
  }

  const coordinates = buildLineChartCoordinates(values, domainMin, domainMax, plotArea);

  return coordinates.map((coordinate, index) => `${index === 0 ? 'M' : 'L'} ${coordinate.x} ${coordinate.y}`).join(' ');
}
