import { describe, it, expect } from 'vitest'
import { calculateDailyGoal } from './waterGoal'

describe('calculateDailyGoal', () => {
  it('70 kg, low activity → 2100', () => {
    expect(calculateDailyGoal(70, 'low')).toBe(2100)
  })

  it('70 kg, medium activity → 2500 (rounded to 100)', () => {
    expect(calculateDailyGoal(70, 'medium')).toBe(2500)
  })

  it('70 kg, high activity → 3200 (rounded to 100)', () => {
    expect(calculateDailyGoal(70, 'high')).toBe(3200)
  })

  it('50 kg, low activity → 1500', () => {
    expect(calculateDailyGoal(50, 'low')).toBe(1500)
  })

  it('100 kg, high activity → 4500', () => {
    expect(calculateDailyGoal(100, 'high')).toBe(4500)
  })

  it('rounds to nearest 100', () => {
    expect(calculateDailyGoal(33, 'low')).toBe(1000)
    expect(calculateDailyGoal(34, 'low')).toBe(1000)
    expect(calculateDailyGoal(35, 'low')).toBe(1100)
  })
})
