import { buildAddMealDestination } from './add-meal-destination';

describe('buildAddMealDestination', () => {
  test('sends foods and drinks to the search, each with its own list', () => {
    expect(buildAddMealDestination('food', 'Lunch', undefined)).toEqual({ pathname: '/add-food', params: { mealType: 'Lunch', kind: 'food' } });
    expect(buildAddMealDestination('drink', 'Lunch', undefined)).toEqual({ pathname: '/add-food', params: { mealType: 'Lunch', kind: 'drink' } });
  });

  test('sends the photo and description options to the estimate, each with its own source', () => {
    expect(buildAddMealDestination('photo', 'Dinner', undefined)).toEqual({
      pathname: '/meal-estimate',
      params: { mealType: 'Dinner', source: 'photo' },
    });
    expect(buildAddMealDestination('description', 'Dinner', undefined)).toEqual({
      pathname: '/meal-estimate',
      params: { mealType: 'Dinner', source: 'description' },
    });
  });

  test('carries the meal being added to along', () => {
    expect(buildAddMealDestination('photo', 'Dinner', 'meal-1').params).toEqual({ mealType: 'Dinner', mealId: 'meal-1', source: 'photo' });
  });

  test('leaves the meal id out when starting a new meal', () => {
    expect(buildAddMealDestination('food', 'Lunch', undefined).params).not.toHaveProperty('mealId');
  });
});
