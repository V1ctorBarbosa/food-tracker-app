import { resolveFoodRowStyle } from './food-row-style';

describe('resolveFoodRowStyle', () => {
  test('highlights the selected row with the calories colour and light text', () => {
    const style = resolveFoodRowStyle(true);

    expect(style.containerClassName).toBe('bg-ft-calories');
    expect(style.nameClassName).toBe('text-white');
    expect(style.detailClassName).toBe('text-blue-200');
  });

  test('keeps an unselected row on the card surface with the regular text colours', () => {
    const style = resolveFoodRowStyle(false);

    expect(style.containerClassName).toBe('bg-ft-card');
    expect(style.nameClassName).toBe('text-ft-ink');
    expect(style.detailClassName).toBe('text-ft-muted-2');
  });

  test('gives the source tag its own colours in each state', () => {
    expect(resolveFoodRowStyle(true).tagClassName).not.toBe(resolveFoodRowStyle(false).tagClassName);
    expect(resolveFoodRowStyle(true).tagTextClassName).not.toBe(resolveFoodRowStyle(false).tagTextClassName);
  });
});
