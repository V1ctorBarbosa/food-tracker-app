const CompactTitleThresholdDaysBack = 1;

/**
 * "Hoje" and "Ontem" are short enough for the big heading; "12 dias atrás" is not, and would
 * crowd out the buttons beside it, so anything older than yesterday steps down a size.
 */
export function resolveDayTitleSizeClassName(daysBack: number): string {
  if (daysBack > CompactTitleThresholdDaysBack) {
    return 'text-[28px]';
  }

  return 'text-4xl';
}
