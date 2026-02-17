import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { TimeOfDay } from '@/types'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { TIME_CHECK_INTERVAL_MS } from '@/constants/timing'

export type TimeOfDayPreference = 'auto' | TimeOfDay

const STORAGE_KEY = STORAGE_KEYS.TIME_OF_DAY

export function getTimeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'day'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

function loadPreference(): TimeOfDayPreference {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'auto' || s === 'morning' || s === 'day' || s === 'evening' || s === 'night') {
      return s
    }
  } catch { /* ignore */ }
  return 'auto'
}

function getTimeOfDay(): TimeOfDay {
  return getTimeOfDayFromHour(new Date().getHours())
}

const preference = ref<TimeOfDayPreference>(loadPreference())
const actualTime = ref<TimeOfDay>(getTimeOfDay())

export function useTimeOfDay() {
  const timeOfDay = computed(() =>
    preference.value === 'auto' ? actualTime.value : preference.value
  )

  let interval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    interval = setInterval(() => {
      actualTime.value = getTimeOfDay()
    }, TIME_CHECK_INTERVAL_MS)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return timeOfDay
}

export function useTimeOfDaySetting() {
  return {
    preference,
    setPreference(p: TimeOfDayPreference) {
      preference.value = p
      localStorage.setItem(STORAGE_KEY, p)
    },
  }
}
