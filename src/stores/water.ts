import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Cell, Bottle, CellPosition } from '@/types'
import { GRID_ROWS, GRID_COLS, DEFAULT_DAILY_GOAL } from '@/types'
import { mlToBottles } from '@/utils/bottles'
import { useHistoryStore } from './history'
import { STORAGE_KEYS } from '@/constants/storageKeys'

const STORAGE_KEY = STORAGE_KEYS.WATER_STORE

function createEmptyGrid(): Cell[][] {
  const grid: Cell[][] = []
  for (let row = 0; row < GRID_ROWS; row++) {
    const rowCells: Cell[] = []
    for (let col = 0; col < GRID_COLS; col++) {
      rowCells.push({ position: { row, col }, bottles: [] })
    }
    grid.push(rowCells)
  }
  return grid
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

interface WaterState {
  cells: Cell[][]
  totalMl: number
  dailyGoal: number
  currentDate: string
  bottles: Bottle[]
}

function loadFromStorage(): WaterState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore corrupted data */
  }
  return null
}

function saveToStorage(state: WaterState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const useWaterStore = defineStore('water', () => {
  const saved = loadFromStorage()

  const cells = ref<Cell[][]>(saved?.cells ?? createEmptyGrid())
  const totalMl = ref(saved?.totalMl ?? 0)
  const dailyGoal = ref(saved?.dailyGoal ?? DEFAULT_DAILY_GOAL)
  const currentDate = ref(saved?.currentDate ?? getTodayDate())
  const bottles = ref<Bottle[]>(saved?.bottles ?? [])

  const goalReached = computed(() => totalMl.value >= dailyGoal.value)
  const percentage = computed(() =>
    Math.min(100, Math.round((totalMl.value / dailyGoal.value) * 100))
  )

  function persist() {
    saveToStorage({
      cells: cells.value,
      totalMl: totalMl.value,
      dailyGoal: dailyGoal.value,
      currentDate: currentDate.value,
      bottles: bottles.value,
    })
  }

  function findNextFreeCell(): Cell | null {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (cells.value[row][col].bottles.length === 0) {
          return cells.value[row][col]
        }
      }
    }
    return null
  }

  function findCellWithOneBottle(): Cell | null {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (cells.value[row][col].bottles.length === 1) {
          return cells.value[row][col]
        }
      }
    }
    return null
  }

  function placeBottle(bottle: Bottle): boolean {
    const freeCell = findNextFreeCell()
    if (freeCell) {
      freeCell.bottles.push(bottle)
      return true
    }
    const secondRowCell = findCellWithOneBottle()
    if (secondRowCell) {
      secondRowCell.bottles.push(bottle)
      return true
    }
    return false
  }

  function addWater(ml: number) {
    if (ml <= 0) return

    const newBottles = mlToBottles(ml)
    for (const bottle of newBottles) {
      placeBottle(bottle)
      bottles.value.push(bottle)
    }
    totalMl.value += ml
    persist()
  }

  function removeBottle(bottleId: string) {
    const bottle = bottles.value.find((b) => b.id === bottleId)
    if (!bottle) return

    for (const row of cells.value) {
      for (const cell of row) {
        const idx = cell.bottles.findIndex((b) => b.id === bottleId)
        if (idx >= 0) {
          cell.bottles.splice(idx, 1)
          totalMl.value -= bottle.ml
          bottles.value = bottles.value.filter((b) => b.id !== bottleId)
          persist()
          return
        }
      }
    }
  }

  function restoreBottle(bottle: Bottle, position: CellPosition) {
    const cell = cells.value[position.row]?.[position.col]
    if (!cell) return
    cell.bottles.push(bottle)
    bottles.value.push(bottle)
    totalMl.value += bottle.ml
    persist()
  }

  function resetDay() {
    const historyStore = useHistoryStore()
    if (totalMl.value > 0) {
      historyStore.addRecord({
        date: currentDate.value,
        totalMl: totalMl.value,
        bottleCount: bottles.value.length,
        bottles: [...bottles.value],
      })
    }

    cells.value = createEmptyGrid()
    totalMl.value = 0
    bottles.value = []
    currentDate.value = getTodayDate()
    persist()
  }

  function isNewDay(): boolean {
    return currentDate.value !== getTodayDate()
  }

  return {
    cells,
    totalMl,
    dailyGoal,
    currentDate,
    bottles,
    goalReached,
    percentage,
    addWater,
    removeBottle,
    restoreBottle,
    resetDay,
    isNewDay,
    persist,
  }
})
