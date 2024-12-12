export const isInGrid = (
  [r, c]: [number, number],
  rows: number,
  cols: number
) => r >= 0 && r < rows && c >= 0 && c < cols;
