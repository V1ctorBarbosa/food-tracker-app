export type WaterEntry = {
  id: string;
  loggedAt: string;
  amountMilliliters: number;
};

export type CreateWaterEntryRequest = {
  loggedAt: string;
  amountMilliliters: number;
};
