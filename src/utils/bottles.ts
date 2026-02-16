import type { Bottle, BottleSize } from '@/types'

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

function createBottle(ml: number): Bottle {
  return {
    id: generateId(),
    ml,
    size: sizeForMl(ml),
    addedAt: Date.now(),
  }
}

export function mlToBottles(ml: number): Bottle[] {
  if (ml <= 0) return []

  const bottles: Bottle[] = []

  if (ml <= 1000) {
    bottles.push(createBottle(ml))
  } else {
    const fullThousands = Math.floor(ml / 1000)
    const remainder = ml % 1000

    for (let i = 0; i < fullThousands; i++) {
      bottles.push(createBottle(1000))
    }

    if (remainder > 0) {
      bottles.push(createBottle(remainder))
    }
  }

  return bottles
}

export function bottleSizeLabel(size: BottleSize): string {
  switch (size) {
    case 'small': return '200 мл'
    case 'medium': return '500 мл'
    case 'large': return '1000 мл'
  }
}
