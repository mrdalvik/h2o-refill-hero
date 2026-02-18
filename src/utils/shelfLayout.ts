/** Процент top для каждой строки полки (4 ряда) */
const SHELF_TOP_PERCENTS = ['28%', '45%', '62%', '79%'] as const

/** Процент left для каждого столбца (4 колонки) */
const SHELF_LEFT_PERCENTS = ['12.5%', '37.5%', '62.5%', '87.5%'] as const

export function shelfTop(row: number): string {
  return SHELF_TOP_PERCENTS[row] ?? '45%'
}

export function shelfLeft(col: number): string {
  return SHELF_LEFT_PERCENTS[col] ?? '50%'
}
