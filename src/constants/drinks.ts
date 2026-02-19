import type { DrinkType } from '@/types'

export const DRINK_TYPES: DrinkType[] = ['coffee', 'tea', 'juice', 'soda', 'water']

export const DRINK_EMOJI: Record<DrinkType, string> = {
  water: '💧',
  coffee: '☕',
  tea: '🍵',
  juice: '🧃',
  soda: '🥤',
}

export const SIMPLE_VOLUMES = [36, 100, 200, 250, 330, 500] as const
