import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DayRecord } from '@/types'

const STORAGE_KEY = 'h2o-history-store'

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

  function getRecords(): DayRecord[] {
    return records.value
  }

  const totalAllTime = () =>
    records.value.reduce((sum, r) => sum + r.totalMl, 0)

  return { records, addRecord, getRecords, totalAllTime }
})
