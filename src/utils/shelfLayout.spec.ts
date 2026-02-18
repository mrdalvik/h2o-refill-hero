import { describe, it, expect } from 'vitest'
import { shelfTop, shelfLeft } from './shelfLayout'

describe('shelfLayout', () => {
  describe('shelfTop', () => {
    it('returns correct percent for row 0', () => {
      expect(shelfTop(0)).toBe('28%')
    })
    it('returns correct percent for row 1', () => {
      expect(shelfTop(1)).toBe('45%')
    })
    it('returns correct percent for row 2', () => {
      expect(shelfTop(2)).toBe('62%')
    })
    it('returns correct percent for row 3', () => {
      expect(shelfTop(3)).toBe('79%')
    })
    it('returns fallback for out-of-range row', () => {
      expect(shelfTop(10)).toBe('45%')
    })
  })

  describe('shelfLeft', () => {
    it('returns correct percent for col 0', () => {
      expect(shelfLeft(0)).toBe('12.5%')
    })
    it('returns correct percent for col 1', () => {
      expect(shelfLeft(1)).toBe('37.5%')
    })
    it('returns correct percent for col 2', () => {
      expect(shelfLeft(2)).toBe('62.5%')
    })
    it('returns correct percent for col 3', () => {
      expect(shelfLeft(3)).toBe('87.5%')
    })
    it('returns fallback for out-of-range col', () => {
      expect(shelfLeft(10)).toBe('50%')
    })
  })
})
