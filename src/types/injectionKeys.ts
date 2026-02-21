import type { InjectionKey } from 'vue'
import type { BottleRemovalFn } from '@/types'

export const BOTTLE_REMOVAL_KEY: InjectionKey<BottleRemovalFn> = Symbol('requestBottleRemoval')

import type { Ref } from 'vue'

export const DETAILED_VENDING_KEY: InjectionKey<{ detailed: Ref<boolean>; toggle: () => void }> =
  Symbol('detailedVending')
