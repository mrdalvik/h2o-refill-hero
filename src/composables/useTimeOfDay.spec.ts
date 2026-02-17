import { describe, it, expect } from 'vitest'
import { getTimeOfDayFromHour } from './useTimeOfDay'

describe('getTimeOfDayFromHour', () => {
  it('6:00 → morning', () => {
    expect(getTimeOfDayFromHour(6)).toBe('morning')
  })

  it('11:59 → morning', () => {
    expect(getTimeOfDayFromHour(11)).toBe('morning')
  })

  it('12:00 → day', () => {
    expect(getTimeOfDayFromHour(12)).toBe('day')
  })

  it('16:59 → day', () => {
    expect(getTimeOfDayFromHour(16)).toBe('day')
  })

  it('17:00 → evening', () => {
    expect(getTimeOfDayFromHour(17)).toBe('evening')
  })

  it('20:59 → evening', () => {
    expect(getTimeOfDayFromHour(20)).toBe('evening')
  })

  it('21:00 → night', () => {
    expect(getTimeOfDayFromHour(21)).toBe('night')
  })

  it('5:59 → night', () => {
    expect(getTimeOfDayFromHour(5)).toBe('night')
  })

  it('0:00 → night', () => {
    expect(getTimeOfDayFromHour(0)).toBe('night')
  })
})
