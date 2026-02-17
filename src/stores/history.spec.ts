import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHistoryStore } from './history'

describe('history store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.removeItem('h2o-history-store')
  })

  it('addRecord adds to records', () => {
    const store = useHistoryStore()
    store.addRecord({
      date: '2025-02-16',
      totalMl: 2000,
      bottleCount: 4,
      bottles: [],
    })
    expect(store.records).toHaveLength(1)
    expect(store.records[0].totalMl).toBe(2000)
  })

  it('totalAllTime sums totalMl', () => {
    const store = useHistoryStore()
    store.addRecord({ date: '2025-02-15', totalMl: 1500, bottleCount: 3, bottles: [] })
    store.addRecord({ date: '2025-02-16', totalMl: 2000, bottleCount: 4, bottles: [] })
    expect(store.totalAllTime()).toBe(3500)
  })
})
