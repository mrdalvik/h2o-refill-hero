import { ref, onMounted } from 'vue'
import { useWaterStore } from '@/stores/water'

export function useDayReset() {
  const showAnimation = ref(false)
  const waterStore = useWaterStore()

  onMounted(() => {
    if (waterStore.checkAndHandleNewDay()) {
      showAnimation.value = true
      setTimeout(() => {
        waterStore.resetDay()
        showAnimation.value = false
      }, 5000)
    }
  })

  function forceReset() {
    showAnimation.value = true
    setTimeout(() => {
      waterStore.resetDay()
      showAnimation.value = false
    }, 5000)
  }

  return { showAnimation, forceReset }
}
