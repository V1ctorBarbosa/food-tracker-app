/**
 * What the quantity field shows: the text being typed while it is edited, the quantity otherwise.
 * The draft is what lets the field be emptied to type a new amount: an empty text is not a number,
 * so showing the quantity instead would put the old digit straight back.
 */
export function resolveQuantityInputText(draftText: string | null, quantity: number): string {
  if (draftText !== null) {
    return draftText;
  }

  return String(quantity);
}
