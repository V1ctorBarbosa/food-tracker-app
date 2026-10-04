import { resolveDayCellState } from './day-picker-view';

const today = '2026-10-03';

describe('resolveDayCellState', () => {
  test('marks the selected day', () => {
    expect(resolveDayCellState('2026-09-20', '2026-09-20', today)).toBe('selected');
  });

  test('rings today when another day is selected', () => {
    expect(resolveDayCellState('2026-10-03', '2026-09-20', today)).toBe('today');
  });

  test('prefers selected over today when they are the same day', () => {
    expect(resolveDayCellState('2026-10-03', '2026-10-03', today)).toBe('selected');
  });

  test('marks any day after today as future', () => {
    expect(resolveDayCellState('2026-10-04', '2026-09-20', today)).toBe('future');
    expect(resolveDayCellState('2026-12-31', '2026-10-03', today)).toBe('future');
  });

  test('leaves ordinary past days alone', () => {
    expect(resolveDayCellState('2026-09-21', '2026-09-20', today)).toBe('default');
  });
});
