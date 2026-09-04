export type NutritionHistoryEntry = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMilliliters: number;
};

export type WeightHistoryEntry = {
  date: string;
  weightKilograms: number;
};

export type Dashboard = {
  dailyCalorieTarget: number;
  currentWeightKilograms: number | null;
  targetWeightKilograms: number | null;
  dailyWaterTargetMilliliters: number | null;
  dailyProteinTargetGrams: number | null;
  dailyCarbsTargetGrams: number | null;
  dailyFatTargetGrams: number | null;
  weightHistory: WeightHistoryEntry[];
  nutritionHistory: NutritionHistoryEntry[];
};
