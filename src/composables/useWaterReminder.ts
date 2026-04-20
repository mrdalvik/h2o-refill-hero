import { ref, onMounted, onUnmounted } from 'vue'
import i18n from '@/i18n'
import { shouldShowReminder, type ReminderFrequency } from '@/utils/reminder'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { REMINDER_CHECK_INTERVAL_MS } from '@/constants/timing'

export type { ReminderFrequency }

const STORAGE_KEY = STORAGE_KEYS.REMINDER
const SHOWN_KEY = STORAGE_KEYS.REMINDER_SHOWN

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

async function showNotification() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return

  const title = 'H2O: Refill Hero'
  const msg = i18n.global.t('reminder.message')

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.showNotification(title, { body: msg })
      return
    }
  }

  new Notification(title, { body: msg })
}

const frequency = ref<ReminderFrequency>(loadPreference())
let interval: ReturnType<typeof setInterval> | null = null

export function useWaterReminder(options?: { setupInterval?: boolean }) {
  const setupInterval = options?.setupInterval !== false

  function setFrequency(f: ReminderFrequency) {
    frequency.value = f
    localStorage.setItem(STORAGE_KEY, f)
    if (f !== 'never' && 'Notification' in window) {
      Notification.requestPermission().catch(() => {
        // ignore permission prompt failures
      })
    }
  }

  function checkAndNotify() {
    const hour = new Date().getHours()
    const shown = getShownToday()
    if (!shouldShowReminder(frequency.value, hour, shown)) return
    showNotification().finally(() => {
      markShown(hour)
    })
  }

  if (setupInterval) {
    onMounted(() => {
      if (frequency.value !== 'never' && 'Notification' in window) {
        Notification.requestPermission().catch(() => {
          // ignore permission prompt failures
        })
      }
      checkAndNotify()
      if (!interval) {
        interval = setInterval(checkAndNotify, REMINDER_CHECK_INTERVAL_MS)
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
