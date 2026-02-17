import { describe, it, expect } from 'vitest'
import { shouldShowReminder, getSlotsForFrequency, SLOTS_3, SLOTS_5 } from './reminder'

describe('getSlotsForFrequency', () => {
  it('3/day returns [10, 14, 18]', () => {
    expect(getSlotsForFrequency('3')).toEqual(SLOTS_3)
    expect(getSlotsForFrequency('3')).toEqual([10, 14, 18])
  })

  it('5/day returns [9, 12, 15, 18, 21]', () => {
    expect(getSlotsForFrequency('5')).toEqual(SLOTS_5)
    expect(getSlotsForFrequency('5')).toEqual([9, 12, 15, 18, 21])
  })
})

describe('shouldShowReminder', () => {
  it('never → false', () => {
    expect(shouldShowReminder('never', 10, [])).toBe(false)
  })

  it('hour < 8 → false', () => {
    expect(shouldShowReminder('3', 7, [])).toBe(false)
    expect(shouldShowReminder('5', 5, [])).toBe(false)
  })

  it('hour >= 22 → false', () => {
    expect(shouldShowReminder('3', 22, [])).toBe(false)
    expect(shouldShowReminder('3', 23, [])).toBe(false)
  })

  it('hour in slot, not shown → true', () => {
    expect(shouldShowReminder('3', 10, [])).toBe(true)
    expect(shouldShowReminder('3', 14, [])).toBe(true)
    expect(shouldShowReminder('3', 18, [])).toBe(true)
    expect(shouldShowReminder('5', 9, [])).toBe(true)
    expect(shouldShowReminder('5', 12, [])).toBe(true)
  })

  it('hour in slot, already shown → false', () => {
    expect(shouldShowReminder('3', 10, [10])).toBe(false)
    expect(shouldShowReminder('5', 15, [15])).toBe(false)
  })

  it('hour not in slot → false', () => {
    expect(shouldShowReminder('3', 11, [])).toBe(false)
    expect(shouldShowReminder('5', 10, [])).toBe(false)
  })
})
