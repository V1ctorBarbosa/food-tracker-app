export type ChartCoordinate = {
  x: number;
  y: number;
};

const MinimumPointCountForLine = 2;
const SingleIndexFallback = 1;
const CenteredNormalizedPosition = 0.5;

/** Positions each value along an evenly-spaced x-axis, scaled to fill the given height on the y-axis. */
export function buildLineChartCoordinates(values: number[], width: number, height: number, padding: number): ChartCoordinate[] {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueSpan = maxValue - minValue;
  const lastIndex = values.length - 1 || SingleIndexFallback;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  return values.map((value, index) => {
    let normalizedPosition = CenteredNormalizedPosition;
    if (valueSpan !== 0) {
      normalizedPosition = (value - minValue) / valueSpan;
    }

    return {
      x: padding + (index / lastIndex) * plotWidth,
      y: height - padding - normalizedPosition * plotHeight,
    };
  });
}

/** An SVG path `d` string connecting each value's coordinate, or null when there aren't enough points to draw a line. */
export function buildLineChartPath(values: number[], width: number, height: number, padding: number): string | null {
  if (values.length < MinimumPointCountForLine) {
    return null;
  }

  const coordinates = buildLineChartCoordinates(values, width, height, padding);

  return coordinates.map((coordinate, index) => `${index === 0 ? 'M' : 'L'} ${coordinate.x} ${coordinate.y}`).join(' ');
}
