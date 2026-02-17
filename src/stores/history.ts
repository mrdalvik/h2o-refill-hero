import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DayRecord } from '@/types'
import { STORAGE_KEYS } from '@/constants/storageKeys'

const STORAGE_KEY = STORAGE_KEYS.HISTORY_STORE

function loadFromStorage(): DayRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore corrupted data */
  }
  return []
}

function saveToStorage(records: DayRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export const useHistoryStore = defineStore('history', () => {
  const records = ref<DayRecord[]>(loadFromStorage())

  function addRecord(record: DayRecord) {
    records.value.push(record)
    saveToStorage(records.value)
  }

  const totalAllTime = computed(() =>
    records.value.reduce((sum, r) => sum + r.totalMl, 0),
  )

  return { records, addRecord, totalAllTime }
})
