export type WeightEntry = {
  id: string;
  loggedAt: string;
  weightKilograms: number;
};

export type CreateWeightEntryRequest = {
  weightKilograms: number;
  /** When the weight was taken; omitted means now. Lets a forgotten day be filled in later. */
  loggedAt?: string;
};
