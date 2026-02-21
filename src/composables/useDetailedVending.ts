import { ref, watch } from 'vue'
import { STORAGE_KEYS } from '@/constants/storageKeys'

function getStored(): boolean {
  return localStorage.getItem(STORAGE_KEYS.DETAILED_VENDING) === '1'
}

export function useDetailedVending() {
  const detailed = ref(getStored())

  watch(detailed, (v) => {
    if (v) {
      localStorage.setItem(STORAGE_KEYS.DETAILED_VENDING, '1')
    } else {
      localStorage.removeItem(STORAGE_KEYS.DETAILED_VENDING)
    }
  })

  const toggle = () => {
    detailed.value = !detailed.value
  }

  return { detailed, toggle }
}
