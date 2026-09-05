import { isCustomFoodFormValid, type CustomFoodFormFields } from './custom-food-form';

const validFields: CustomFoodFormFields = { name: 'My whey', calories: '120', protein: '24', carbs: '3', fat: '1.5' };

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
