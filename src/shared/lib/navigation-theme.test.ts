import { withAppPalette } from './navigation-theme';

const baseTheme = {
  dark: false,
  colors: { background: '#FFFFFF', card: '#FAFAFA', text: '#000000', border: '#CCCCCC', primary: '#0A84FF', notification: '#FF3B30' },
};

const palette = { background: '#DCEAF8', card: '#F2F1F8', ink: '#274F8C', tabBarBorder: '#DCD8E6', calories: '#274F8C' };

describe('withAppPalette', () => {
  test('replaces the navigator colours with the app palette', () => {
    const result = withAppPalette(baseTheme, palette);

    expect(result.colors).toMatchObject({
      background: '#DCEAF8',
      card: '#F2F1F8',
      text: '#274F8C',
      border: '#DCD8E6',
      primary: '#274F8C',
    });
  });

  test('keeps every other part of the base theme', () => {
    const result = withAppPalette(baseTheme, palette);

    expect(result.dark).toBe(false);
    expect(result.colors.notification).toBe('#FF3B30');
  });

  test('does not mutate the base theme', () => {
    withAppPalette(baseTheme, palette);

    expect(baseTheme.colors.background).toBe('#FFFFFF');
  });
});
