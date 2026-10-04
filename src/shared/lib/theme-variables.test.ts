import { buildThemeVariables, hexToRgbTriplet, themeKeyToCssVariable } from './theme-variables';
import themeJson from '../config/theme.json';

describe('hexToRgbTriplet', () => {
  test.each([
    ['#274F8C', '39 79 140'],
    ['#000000', '0 0 0'],
    ['#FFFFFF', '255 255 255'],
    ['#dcEAf8', '220 234 248'],
  ])('converts %p to %p', (hex, expected) => {
    expect(hexToRgbTriplet(hex)).toBe(expected);
  });

  test.each([['274F8C'], ['#FFF'], ['rgba(0, 0, 0, 0.1)'], ['']])('rejects %p', (value) => {
    expect(() => hexToRgbTriplet(value)).toThrow();
  });
});

describe('themeKeyToCssVariable', () => {
  test.each([
    ['background', '--ft-background'],
    ['caloriesDark', '--ft-calories-dark'],
    ['textMuted2', '--ft-text-muted2'],
    ['hairStrong', '--ft-hair-strong'],
  ])('maps %p to %p', (key, expected) => {
    expect(themeKeyToCssVariable(key)).toBe(expected);
  });
});

describe('buildThemeVariables', () => {
  test('exposes a solid colour as an RGB triplet under its variable name', () => {
    expect(buildThemeVariables({ calories: '#274F8C' })).toEqual({ '--ft-calories': '39 79 140' });
  });

  test('skips translucent entries', () => {
    expect(buildThemeVariables({ hair: 'rgba(0, 0, 0, 0.05)', card: '#F2F1F8' })).toEqual({ '--ft-card': '242 241 248' });
  });

  test('light and dark palettes define exactly the same keys', () => {
    expect(Object.keys(themeJson.dark).sort()).toEqual(Object.keys(themeJson.light).sort());
  });

  test('every solid colour in both real palettes converts without error', () => {
    expect(() => buildThemeVariables(themeJson.light)).not.toThrow();
    expect(() => buildThemeVariables(themeJson.dark)).not.toThrow();
  });
});
