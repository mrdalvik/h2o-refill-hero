export type BottleSize = 'small' | 'medium' | 'large'

export interface Bottle {
  id: string
  ml: number
  size: BottleSize
  addedAt: number
}

export interface CellPosition {
  row: number
  col: number
}

export interface Cell {
  position: CellPosition
  bottles: Bottle[]
}

export interface DayRecord {
  date: string
  totalMl: number
  bottleCount: number
  bottles: Bottle[]
}

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night'

export type BottleRemovalFn = (
  bottle: Bottle,
  position: CellPosition,
  closePopup: () => void,
) => void

export const GRID_ROWS = 4
export const GRID_COLS = 4
export const DEFAULT_DAILY_GOAL = 2000
