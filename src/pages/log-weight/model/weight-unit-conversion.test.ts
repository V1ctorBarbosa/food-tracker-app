import {
  convertDisplayUnitToKilograms,
  convertKilogramsToDisplayUnit,
  kilogramsToPounds,
  poundsToKilograms,
} from './weight-unit-conversion';

describe('kilogramsToPounds', () => {
  it('converts 80kg to approximately 176.4lb', () => {
    expect(kilogramsToPounds(80)).toBeCloseTo(176.37, 1);
  });
});

describe('poundsToKilograms', () => {
  it('converts 176.4lb to approximately 80kg', () => {
    expect(poundsToKilograms(176.37)).toBeCloseTo(80, 1);
  });

  it('round-trips with kilogramsToPounds', () => {
    expect(poundsToKilograms(kilogramsToPounds(87.6))).toBeCloseTo(87.6, 5);
  });
});

describe('convertKilogramsToDisplayUnit', () => {
  it('returns the value unchanged for Kilograms', () => {
    expect(convertKilogramsToDisplayUnit(87.6, 'Kilograms')).toBe(87.6);
  });

  it('converts to pounds for Pounds', () => {
    expect(convertKilogramsToDisplayUnit(80, 'Pounds')).toBeCloseTo(176.37, 1);
  });
});

describe('convertDisplayUnitToKilograms', () => {
  it('returns the value unchanged for Kilograms', () => {
    expect(convertDisplayUnitToKilograms(87.6, 'Kilograms')).toBe(87.6);
  });

  it('converts from pounds for Pounds', () => {
    expect(convertDisplayUnitToKilograms(176.37, 'Pounds')).toBeCloseTo(80, 1);
  });
});
