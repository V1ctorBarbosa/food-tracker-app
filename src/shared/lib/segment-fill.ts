const FullPercent = 100;

/**
 * How full one segment of a segmented bar is, 0-100. A segment fills only while the overall
 * progress is inside its own slice, so the bar fills one segment after another.
 */
export function calculateSegmentFillPercent(segmentIndex: number, segmentCount: number, progressPercent: number): number {
  const segmentSpanPercent = FullPercent / segmentCount;
  const segmentStartPercent = segmentIndex * segmentSpanPercent;
  const fillRatio = (progressPercent - segmentStartPercent) / segmentSpanPercent;

  return Math.min(1, Math.max(0, fillRatio)) * FullPercent;
}
