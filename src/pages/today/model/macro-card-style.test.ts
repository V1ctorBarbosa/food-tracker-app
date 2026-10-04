import { resolveMacroCardStyle } from './macro-card-style';

describe('resolveMacroCardStyle', () => {
  test.each([
    ['protein', 'bg-ft-protein'],
    ['carbs', 'bg-ft-carbs'],
    ['fat', 'bg-ft-fat'],
  ] as const)('paints the %p card with its own colour', (macro, expectedBackground) => {
    expect(resolveMacroCardStyle(macro).backgroundClassName).toBe(expectedBackground);
  });

  test.each([['protein'], ['carbs']] as const)('uses white text and a translucent white track on the %p card', (macro) => {
    const style = resolveMacroCardStyle(macro);

    expect(style.textClassName).toBe('text-white');
    expect(style.fillClassName).toBe('bg-white');
    expect(style.trackClassName).toBe('bg-white/30');
  });

  test('switches the light fat card to the deep blue so its text stays readable', () => {
    const style = resolveMacroCardStyle('fat');

    expect(style.textClassName).toBe('text-ft-on-fat');
    expect(style.fillClassName).toBe('bg-ft-on-fat');
    expect(style.trackClassName).toBe('bg-ft-on-fat/20');
  });
});
