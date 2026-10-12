import { formatNutritionPreviewLabels } from './nutrition-preview-labels';

describe('formatNutritionPreviewLabels', () => {
  test('shows calories as they are and macros in whole grams', () => {
    const labels = formatNutritionPreviewLabels({ calories: 130, protein: 4.2, carbs: 22.6, fat: 2.5 });

    expect(labels).toEqual({ calories: '130', protein: '4g', carbs: '23g', fat: '3g' });
  });

  test('keeps zero values visible', () => {
    const labels = formatNutritionPreviewLabels({ calories: 0, protein: 0, carbs: 0, fat: 0 });

    expect(labels).toEqual({ calories: '0', protein: '0g', carbs: '0g', fat: '0g' });
  });
});
