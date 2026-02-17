import { ref, onMounted } from 'vue'
import { useWaterStore } from '@/stores/water'
import { DAY_RESET_ANIMATION_MS } from '@/constants/timing'

export function useDayReset() {
  const showAnimation = ref(false)
  const waterStore = useWaterStore()

  function performReset() {
    showAnimation.value = true
    setTimeout(() => {
      waterStore.resetDay()
      showAnimation.value = false
    }, DAY_RESET_ANIMATION_MS)
  }

  onMounted(() => {
    if (waterStore.isNewDay()) {
      performReset()
    }
  })

  return { showAnimation, forceReset: performReset }
}
