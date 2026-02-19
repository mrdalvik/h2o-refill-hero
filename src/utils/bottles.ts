import type { Bottle, BottleSize, DrinkType } from '@/types'

let bottleCounter = 0

function generateId(): string {
  bottleCounter++
  return `bottle-${Date.now()}-${bottleCounter}`
}

function sizeForMl(ml: number): BottleSize {
  if (ml <= 200) return 'small'
  if (ml <= 500) return 'medium'
  return 'large'
}

function createBottle(ml: number, drinkType: DrinkType = 'water'): Bottle {
  return {
    id: generateId(),
    ml,
    size: sizeForMl(ml),
    drinkType,
    addedAt: Date.now(),
  }
}

export function mlToBottles(ml: number, drinkType: DrinkType = 'water'): Bottle[] {
  if (ml <= 0) return []

  const bottles: Bottle[] = []

  if (ml <= 1000) {
    bottles.push(createBottle(ml, drinkType))
  } else {
    const fullThousands = Math.floor(ml / 1000)
    const remainder = ml % 1000

    for (let i = 0; i < fullThousands; i++) {
      bottles.push(createBottle(1000, drinkType))
    }

    if (remainder > 0) {
      bottles.push(createBottle(remainder, drinkType))
    }
  }

  return bottles
}

export function ensureBottleDrinkType(bottle: Bottle | (Omit<Bottle, 'drinkType'> & { drinkType?: DrinkType })): Bottle {
  const b = bottle as Partial<Bottle>
  if (b.drinkType && ['water', 'coffee', 'tea', 'juice', 'soda'].includes(b.drinkType)) {
    return b as Bottle
  }
  return { ...bottle, drinkType: 'water' } as Bottle
}

export function bottleSizeLabelKey(size: BottleSize): string {
  switch (size) {
    case 'small': return 'bottles.small'
    case 'medium': return 'bottles.medium'
    case 'large': return 'bottles.large'
  }
}
