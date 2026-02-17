import { ref, onMounted, onUnmounted } from 'vue'
import type { TimeOfDay } from '@/types'

export function getTimeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'day'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

function getTimeOfDay(): TimeOfDay {
  return getTimeOfDayFromHour(new Date().getHours())
}

export function useTimeOfDay() {
  const timeOfDay = ref<TimeOfDay>(getTimeOfDay())
  let interval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    interval = setInterval(() => {
      timeOfDay.value = getTimeOfDay()
    }, 60_000)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return timeOfDay
}
