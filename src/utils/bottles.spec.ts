import { describe, it, expect } from 'vitest'
import { mlToBottles, bottleSizeLabelKey } from './bottles'

describe('mlToBottles', () => {
  it('returns empty array for 0', () => {
    expect(mlToBottles(0)).toEqual([])
  })

  it('returns empty array for negative', () => {
    expect(mlToBottles(-100)).toEqual([])
  })

  it('returns one small bottle for 200', () => {
    const bottles = mlToBottles(200)
    expect(bottles).toHaveLength(1)
    expect(bottles[0].ml).toBe(200)
    expect(bottles[0].size).toBe('small')
  })

  it('returns one medium bottle for 500', () => {
    const bottles = mlToBottles(500)
    expect(bottles).toHaveLength(1)
    expect(bottles[0].ml).toBe(500)
    expect(bottles[0].size).toBe('medium')
  })

  it('returns one large bottle for 1000', () => {
    const bottles = mlToBottles(1000)
    expect(bottles).toHaveLength(1)
    expect(bottles[0].ml).toBe(1000)
    expect(bottles[0].size).toBe('large')
  })

  it('returns 1000 + 500 for 1500', () => {
    const bottles = mlToBottles(1500)
    expect(bottles).toHaveLength(2)
    expect(bottles[0].ml).toBe(1000)
    expect(bottles[1].ml).toBe(500)
  })

  it('returns 1000 + 1000 + 500 for 2500', () => {
    const bottles = mlToBottles(2500)
    expect(bottles).toHaveLength(3)
    expect(bottles[0].ml).toBe(1000)
    expect(bottles[1].ml).toBe(1000)
    expect(bottles[2].ml).toBe(500)
  })

  it('returns three 1000ml bottles for 3000', () => {
    const bottles = mlToBottles(3000)
    expect(bottles).toHaveLength(3)
    expect(bottles.every((b) => b.ml === 1000)).toBe(true)
  })

  it('returns small for ml <= 200', () => {
    expect(mlToBottles(100)[0].size).toBe('small')
    expect(mlToBottles(200)[0].size).toBe('small')
  })

  it('returns medium for 201-500', () => {
    expect(mlToBottles(250)[0].size).toBe('medium')
    expect(mlToBottles(500)[0].size).toBe('medium')
  })

  it('returns large for > 500', () => {
    expect(mlToBottles(501)[0].size).toBe('large')
    expect(mlToBottles(1000)[0].size).toBe('large')
  })

  it('creates bottles with id, addedAt and drinkType', () => {
    const bottles = mlToBottles(500)
    expect(bottles[0].id).toBeDefined()
    expect(typeof bottles[0].id).toBe('string')
    expect(bottles[0].addedAt).toBeDefined()
    expect(typeof bottles[0].addedAt).toBe('number')
    expect(bottles[0].drinkType).toBe('water')
  })

  it('creates bottles with custom drinkType', () => {
    const bottles = mlToBottles(250, 'coffee')
    expect(bottles[0].drinkType).toBe('coffee')
  })
})

describe('bottleSizeLabelKey', () => {
  it('returns correct keys for each size', () => {
    expect(bottleSizeLabelKey('small')).toBe('bottles.small')
    expect(bottleSizeLabelKey('medium')).toBe('bottles.medium')
    expect(bottleSizeLabelKey('large')).toBe('bottles.large')
  })
})
