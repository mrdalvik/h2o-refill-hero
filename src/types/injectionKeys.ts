import type { InjectionKey } from 'vue'
import type { BottleRemovalFn } from '@/types'

export const BOTTLE_REMOVAL_KEY: InjectionKey<BottleRemovalFn> = Symbol('requestBottleRemoval')
