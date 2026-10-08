export type FoodRowStyle = {
  containerClassName: string;
  nameClassName: string;
  tagClassName: string;
  tagTextClassName: string;
  detailClassName: string;
};

const SelectedFoodRowStyle: FoodRowStyle = {
  containerClassName: 'bg-ft-calories',
  nameClassName: 'text-white',
  tagClassName: 'bg-ft-calories-dark',
  tagTextClassName: 'text-blue-200',
  detailClassName: 'text-blue-200',
};

const UnselectedFoodRowStyle: FoodRowStyle = {
  containerClassName: 'bg-ft-card',
  nameClassName: 'text-ft-ink',
  tagClassName: 'bg-ft-bg',
  tagTextClassName: 'text-ft-muted-2',
  detailClassName: 'text-ft-muted-2',
};

export function resolveFoodRowStyle(isSelected: boolean): FoodRowStyle {
  if (isSelected) {
    return SelectedFoodRowStyle;
  }

  return UnselectedFoodRowStyle;
}
