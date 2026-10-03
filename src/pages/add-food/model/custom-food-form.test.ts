import { isCustomFoodFormValid, parseCustomFoodFields, type CustomFoodFormFields } from './custom-food-form';

const validFields: CustomFoodFormFields = { name: 'My whey', calories: '120', protein: '24', carbs: '3', fat: '1.5' };

describe('parseCustomFoodFields', () => {
  test('returns the name and macros as numbers', () => {
    expect(parseCustomFoodFields(validFields)).toEqual({ name: 'My whey', calories: 120, protein: 24, carbs: 3, fat: 1.5 });
  });

  test('accepts the comma a Brazilian keyboard types as the decimal separator', () => {
    const fields: CustomFoodFormFields = { name: 'Suco de laranja', calories: '45', protein: '0,7', carbs: '10', fat: '0,2' };

    expect(parseCustomFoodFields(fields)).toEqual({ name: 'Suco de laranja', calories: 45, protein: 0.7, carbs: 10, fat: 0.2 });
  });

  test('trims the name', () => {
    expect(parseCustomFoodFields({ ...validFields, name: '  My whey  ' })?.name).toBe('My whey');
  });

  test('returns null when a macro cannot be read', () => {
    expect(parseCustomFoodFields({ ...validFields, carbs: '1,2,3' })).toBeNull();
  });
});

describe('isCustomFoodFormValid with decimal commas', () => {
  test('returns true for macros typed with a comma', () => {
    expect(isCustomFoodFormValid({ ...validFields, protein: '0,7', fat: '0,2' })).toBe(true);
  });
});

describe('isCustomFoodFormValid', () => {
  test('returns true when the name and every macro field are filled in with numbers', () => {
    expect(isCustomFoodFormValid(validFields)).toBe(true);
  });

  test('returns false when the name is empty', () => {
    expect(isCustomFoodFormValid({ ...validFields, name: '' })).toBe(false);
  });

  test('returns false when the name is only whitespace', () => {
    expect(isCustomFoodFormValid({ ...validFields, name: '   ' })).toBe(false);
  });

  test('returns false when a macro field is empty', () => {
    expect(isCustomFoodFormValid({ ...validFields, protein: '' })).toBe(false);
  });

  test('returns false when a macro field is not a number', () => {
    expect(isCustomFoodFormValid({ ...validFields, carbs: 'abc' })).toBe(false);
  });

  test('accepts zero as a valid macro value', () => {
    expect(isCustomFoodFormValid({ ...validFields, fat: '0' })).toBe(true);
  });
});
