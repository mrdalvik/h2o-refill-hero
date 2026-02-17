import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWaterStore } from './water'
import { useHistoryStore } from './history'

const STORAGE_KEY = 'h2o-water-store'

describe('water store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('h2o-history-store')
  })

  describe('addWater', () => {
    it('ignores ml <= 0', () => {
      const store = useWaterStore()
      const initial = store.totalMl
      store.addWater(0)
      store.addWater(-100)
      expect(store.totalMl).toBe(initial)
    })

    it('addWater(500) increases totalMl by 500 and adds 1 bottle', () => {
      const store = useWaterStore()
      store.addWater(500)
      expect(store.totalMl).toBe(500)
      expect(store.bottles).toHaveLength(1)
      expect(store.bottles[0].ml).toBe(500)
      expect(store.cells.flat().some((c) => c.bottles.length > 0)).toBe(true)
    })

    it('addWater(1500) adds 2 bottles', () => {
      const store = useWaterStore()
      store.addWater(1500)
      expect(store.totalMl).toBe(1500)
      expect(store.bottles).toHaveLength(2)
    })

    it('addWater(2500) adds 3 bottles', () => {
      const store = useWaterStore()
      store.addWater(2500)
      expect(store.totalMl).toBe(2500)
      expect(store.bottles).toHaveLength(3)
    })
  })

  describe('removeBottle', () => {
    it('removes bottle from cells and bottles, decreases totalMl', () => {
      const store = useWaterStore()
      store.addWater(500)
      const bottleId = store.bottles[0].id
      const initialTotal = store.totalMl
      store.removeBottle(bottleId)
      expect(store.totalMl).toBe(initialTotal - 500)
      expect(store.bottles).toHaveLength(0)
      expect(store.cells.flat().every((c) => c.bottles.length === 0)).toBe(true)
    })

    it('non-existent id does nothing', () => {
      const store = useWaterStore()
      store.addWater(500)
      const initialTotal = store.totalMl
      store.removeBottle('non-existent')
      expect(store.totalMl).toBe(initialTotal)
    })
  })

  describe('goalReached', () => {
    it('true when totalMl >= dailyGoal', () => {
      const store = useWaterStore()
      store.dailyGoal = 1000
      store.addWater(1000)
      expect(store.goalReached).toBe(true)
    })

    it('false when totalMl < dailyGoal', () => {
      const store = useWaterStore()
      store.dailyGoal = 2000
      store.addWater(500)
      expect(store.goalReached).toBe(false)
    })
  })

  describe('percentage', () => {
    it('1000/2000 = 50', () => {
      const store = useWaterStore()
      store.dailyGoal = 2000
      store.addWater(1000)
      expect(store.percentage).toBe(50)
    })

    it('caps at 100 when over goal', () => {
      const store = useWaterStore()
      store.dailyGoal = 2000
      store.addWater(2500)
      expect(store.percentage).toBe(100)
    })
  })

  describe('cells', () => {
    it('starts with 4x4 empty grid', () => {
      const store = useWaterStore()
      expect(store.cells).toHaveLength(4)
      expect(store.cells[0]).toHaveLength(4)
      expect(store.cells.flat().every((c) => c.bottles.length === 0)).toBe(true)
    })
  })

  describe('resetDay', () => {
    it('clears cells, totalMl, bottles', () => {
      const store = useWaterStore()
      const historyStore = useHistoryStore()
      store.addWater(500)
      store.resetDay()
      expect(store.totalMl).toBe(0)
      expect(store.bottles).toHaveLength(0)
      expect(store.cells.flat().every((c) => c.bottles.length === 0)).toBe(true)
      expect(historyStore.records.length).toBeGreaterThan(0)
    })
  })
})
