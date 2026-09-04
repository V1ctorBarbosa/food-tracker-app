export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export type Meal = {
  id: string;
  date: string;
  mealType: MealType;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};
