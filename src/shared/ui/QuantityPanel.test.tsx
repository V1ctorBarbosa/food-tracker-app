import { fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';

import { QuantityPanel } from './QuantityPanel';

const Preview = { calories: 5, protein: 0.4, carbs: 0.5, fat: 0.1 };
const Step = 10;

/** The panel as the pages use it: the quantity lives in the page, and an unparsable text keeps the previous one. */
function QuantityPanelHost({ initialQuantity }: { initialQuantity: number }) {
  const [quantity, setQuantity] = useState(initialQuantity);

  function handleChangeQuantityText(text: string) {
    const parsedQuantity = Number(text);
    if (text === '' || Number.isNaN(parsedQuantity)) {
      return;
    }

    setQuantity(parsedQuantity);
  }

  return (
    <QuantityPanel
      quantity={quantity}
      unitLabel="g"
      preview={Preview}
      step={Step}
      onAdjustQuantity={(delta) => setQuantity((previous) => previous + delta)}
      onChangeQuantityText={handleChangeQuantityText}
    />
  );
}

describe('QuantityPanel', () => {
  test('lets the field be emptied after its last digit is deleted', async () => {
    await render(<QuantityPanelHost initialQuantity={2} />);

    await fireEvent.changeText(screen.getByDisplayValue('2'), '');

    expect(screen.getByDisplayValue('')).toBeTruthy();
  });

  test('takes a new amount typed into the emptied field', async () => {
    await render(<QuantityPanelHost initialQuantity={2} />);
    const quantityField = screen.getByDisplayValue('2');

    await fireEvent.changeText(quantityField, '');
    await fireEvent.changeText(quantityField, '250');

    expect(screen.getByDisplayValue('250')).toBeTruthy();
  });

  test('shows the quantity again when the field is left empty', async () => {
    await render(<QuantityPanelHost initialQuantity={2} />);
    const quantityField = screen.getByDisplayValue('2');

    await fireEvent.changeText(quantityField, '');
    await fireEvent(quantityField, 'blur');

    expect(screen.getByDisplayValue('2')).toBeTruthy();
  });

  test('shows the stepped quantity when a step button is pressed while typing', async () => {
    await render(<QuantityPanelHost initialQuantity={100} />);

    await fireEvent.changeText(screen.getByDisplayValue('100'), '');
    await fireEvent.press(screen.getByLabelText('Aumentar quantidade'));

    expect(screen.getByDisplayValue('110')).toBeTruthy();
  });
});
