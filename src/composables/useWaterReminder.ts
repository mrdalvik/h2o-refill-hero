import { ref, onMounted, onUnmounted } from 'vue'
import i18n from '@/i18n'
import { shouldShowReminder, type ReminderFrequency } from '@/utils/reminder'

export type { ReminderFrequency }

const STORAGE_KEY = 'h2o-reminder'
const SHOWN_KEY = 'h2o-reminder-shown'

function loadPreference(): ReminderFrequency {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'never' || s === '3' || s === '5') return s
  } catch { /* ignore */ }
  return 'never'
}

function getShownToday(): number[] {
  try {
    const raw = localStorage.getItem(SHOWN_KEY)
    if (raw) {
      const { date, slots } = JSON.parse(raw)
      const today = new Date().toDateString()
      if (date === today && Array.isArray(slots)) return slots
    }
  } catch { /* ignore */ }
  return []
}

function markShown(slotHour: number) {
  const today = new Date().toDateString()
  const slots = getShownToday()
  if (!slots.includes(slotHour)) {
    slots.push(slotHour)
    localStorage.setItem(SHOWN_KEY, JSON.stringify({ date: today, slots }))
  }
}

function showNotification() {
  if (!('Notification' in window)) return
  const msg = i18n.global.t('reminder.message')
  if (Notification.permission === 'granted') {
    new Notification('H2O: Refill Hero', { body: msg })
  }
}

const frequency = ref<ReminderFrequency>(loadPreference())
let interval: ReturnType<typeof setInterval> | null = null

export function useWaterReminder(options?: { setupInterval?: boolean }) {
  const setupInterval = options?.setupInterval !== false

  function setFrequency(f: ReminderFrequency) {
    frequency.value = f
    localStorage.setItem(STORAGE_KEY, f)
    if (f !== 'never') {
      Notification.requestPermission()
    }
  }

  function checkAndNotify() {
    const hour = new Date().getHours()
    const shown = getShownToday()
    if (!shouldShowReminder(frequency.value, hour, shown)) return
    showNotification()
    markShown(hour)
  }

  if (setupInterval) {
    onMounted(() => {
      if (frequency.value !== 'never') {
        Notification.requestPermission()
      }
      checkAndNotify()
      if (!interval) {
        interval = setInterval(checkAndNotify, 60_000)
      }
    })

    onUnmounted(() => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    })
  }

  return { frequency, setFrequency }
}
