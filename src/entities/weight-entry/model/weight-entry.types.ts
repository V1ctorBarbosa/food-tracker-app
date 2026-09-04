export type WeightEntry = {
  id: string;
  loggedAt: string;
  weightKilograms: number;
};

export type CreateWeightEntryRequest = {
  weightKilograms: number;
};
