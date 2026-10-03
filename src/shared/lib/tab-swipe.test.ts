import { resolveAdjacentTab, resolveSwipeDirection } from './tab-swipe';

describe('resolveSwipeDirection', () => {
  test.each([
    [-120, 0, 'next'],
    [120, 0, 'previous'],
    [-60, 0, 'next'],
    [60, 0, 'previous'],
  ])('a drag of %p px is long enough to go %p', (translationX, velocityX, expected) => {
    expect(resolveSwipeDirection(translationX, velocityX)).toBe(expected);
  });

  test('ignores a short, slow drag', () => {
    expect(resolveSwipeDirection(-40, 100)).toBeNull();
    expect(resolveSwipeDirection(40, -100)).toBeNull();
  });

  test('accepts a short but fast flick', () => {
    expect(resolveSwipeDirection(-30, -1200)).toBe('next');
    expect(resolveSwipeDirection(30, 1200)).toBe('previous');
  });

  test('ignores a tiny movement even when it is fast', () => {
    expect(resolveSwipeDirection(-5, -2000)).toBeNull();
  });

  test('ignores no movement at all', () => {
    expect(resolveSwipeDirection(0, 0)).toBeNull();
  });
});

describe('resolveAdjacentTab', () => {
  const tabs = ['today', 'log', 'charts', 'you'] as const;

  test.each([
    ['today', 'next', 'log'],
    ['log', 'next', 'charts'],
    ['charts', 'previous', 'log'],
    ['you', 'previous', 'charts'],
  ])('from %p going %p lands on %p', (currentTab, direction, expected) => {
    expect(resolveAdjacentTab(tabs, currentTab, direction as 'next' | 'previous')).toBe(expected);
  });

  test('stops at the first tab when swiping back', () => {
    expect(resolveAdjacentTab(tabs, 'today', 'previous')).toBeNull();
  });

  test('stops at the last tab when swiping forward', () => {
    expect(resolveAdjacentTab(tabs, 'you', 'next')).toBeNull();
  });

  test('returns null when the current screen is not a tab', () => {
    expect(resolveAdjacentTab(tabs, 'log-water', 'next')).toBeNull();
    expect(resolveAdjacentTab(tabs, undefined, 'previous')).toBeNull();
  });
});
