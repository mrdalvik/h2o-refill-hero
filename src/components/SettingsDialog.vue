<template>
  <Teleport to="body">
    <div v-if="visible" class="settings-overlay" @click.self="$emit('close')">
      <div class="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div class="settings-header">
          <span id="settings-title" class="settings-title">{{ $t('settings.title') }}</span>
          <button class="settings-close" aria-label="Close" @click="$emit('close')">&#x2715;</button>
        </div>

        <div class="settings-section">
          <button class="how-to-use-btn" @click="showHowToUse">
            {{ $t('settings.howToUse') }}
          </button>
        </div>

        <div class="settings-section">
          <div class="settings-label">{{ $t('settings.dailyGoal') }}</div>
          <div class="goal-input-row">
            <input
              v-model.number="goalInput"
              type="number"
              min="100"
              max="10000"
              step="100"
              class="goal-input"
              @change="onGoalChange"
            />
            <span class="goal-unit">{{ $t('unit.ml') }}</span>
          </div>
          <div class="goal-row">
            <button class="goal-calc-btn" @click="showCalcPopup = true">
              {{ $t('settings.calculate') }}
            </button>
            <button
              v-for="preset in GOAL_PRESETS"
              :key="preset"
              class="goal-preset-btn"
              :class="{ 'goal-preset-active': waterStore.dailyGoal === preset }"
              @click="setGoal(preset)"
            >
              {{ preset }}
            </button>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-label">{{ $t('settings.reminder') }}</div>
          <div class="reminder-options">
            <button
              v-for="opt in REMINDER_OPTIONS"
              :key="opt.value"
              class="reminder-btn"
              :class="{ 'reminder-btn-active': reminderFrequency === opt.value }"
              @click="setReminderFrequency(opt.value)"
            >
              {{ $t(opt.label) }}
            </button>
          </div>
          <div class="reminder-hint">{{ $t('settings.reminderHint') }}</div>
        </div>

        <div class="settings-section">
          <div class="settings-label">{{ $t('settings.appearance') }}</div>
          <div class="time-options">
            <button
              v-for="opt in TIME_OPTIONS"
              :key="opt.value"
              class="time-btn"
              :class="{ 'time-btn-active': timePreference === opt.value }"
              @click="setTimePreference(opt.value)"
            >
              {{ $t(opt.label) }}
            </button>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-label">{{ $t('settings.language') }}</div>
          <select
            :value="currentLocale"
            class="language-select"
            @change="changeLocale(($event.target as HTMLSelectElement).value as SupportedLocale)"
          >
            <option
              v-for="[code, label] in SORTED_LOCALES"
              :key="code"
              :value="code"
            >
              {{ label }}
            </option>
          </select>
        </div>

        <div class="settings-section">
          <div class="settings-label">{{ $t('settings.author') }}</div>
          <div class="author-info">
            <span class="author-name">Lev Tregubov</span>
            <div class="author-links">
              <a href="https://t.me/trlev" target="_blank" rel="noopener noreferrer" class="author-link">Telegram</a>
              <a href="https://github.com/mrdalvik" target="_blank" rel="noopener noreferrer" class="author-link">GitHub</a>
            </div>
            <div class="version-row">
              <span class="app-version">{{ $t('settings.version') }} {{ appVersion }}</span>
              <button class="refresh-btn" :disabled="isRefreshing" @click="refreshApp" :title="$t('settings.refresh')">
                {{ isRefreshing ? '...' : $t('settings.refresh') }}
              </button>
              <button class="reset-btn" @click="showResetConfirm = true" :title="$t('settings.reset')">
                {{ $t('settings.reset') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SettingsResetConfirm
        v-model="showResetConfirm"
        @confirm="confirmReset"
      />

      <SettingsCalcPopup
        v-model="showCalcPopup"
        :initial-weight="calcWeight"
        :initial-activity="calcActivity"
        @apply="applyCalculatedGoal"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWaterStore } from '@/stores/water'
import { useTimeOfDaySetting, type TimeOfDayPreference } from '@/composables/useTimeOfDay'
import { useWaterReminder, type ReminderFrequency } from '@/composables/useWaterReminder'
import { SORTED_LOCALES, saveLocale, type SupportedLocale } from '@/i18n'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { GOAL_PRESETS } from '@/constants/timing'
import SettingsResetConfirm from './settings/SettingsResetConfirm.vue'
import SettingsCalcPopup from './settings/SettingsCalcPopup.vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  'show-onboarding': []
}>()

function showHowToUse() {
  emit('close')
  emit('show-onboarding')
}

const { locale } = useI18n()
const waterStore = useWaterStore()
const { preference: timePreference, setPreference: setTimePreference } = useTimeOfDaySetting()
const { frequency: reminderFrequency, setFrequency: setReminderFrequency } = useWaterReminder({ setupInterval: false })

const REMINDER_OPTIONS: { value: ReminderFrequency; label: string }[] = [
  { value: 'never', label: 'settings.reminderNever' },
  { value: '3', label: 'settings.reminder3' },
  { value: '5', label: 'settings.reminder5' },
]

const TIME_OPTIONS: { value: TimeOfDayPreference; label: string }[] = [
  { value: 'auto', label: 'settings.timeAuto' },
  { value: 'morning', label: 'settings.timeMorning' },
  { value: 'day', label: 'settings.timeDay' },
  { value: 'evening', label: 'settings.timeEvening' },
  { value: 'night', label: 'settings.timeNight' },
]

function loadCalcPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CALC_PREFS)
    if (raw) {
      const { weight, activity } = JSON.parse(raw)
      if (typeof weight === 'number' && weight >= 30 && weight <= 200) {
        return { weight, activity: ['low', 'medium', 'high'].includes(activity) ? activity : 'medium' }
      }
    }
  } catch { /* ignore */ }
  return { weight: 70, activity: 'medium' as const }
}

const goalInput = ref(waterStore.dailyGoal)
const showCalcPopup = ref(false)
const showResetConfirm = ref(false)
const prefs = loadCalcPrefs()
const calcWeight = ref(prefs.weight)
const calcActivity = ref<'low' | 'medium' | 'high'>(prefs.activity)

watch(() => props.visible, (visible) => {
  if (visible) goalInput.value = waterStore.dailyGoal
})

watch(showCalcPopup, (open) => {
  if (open) {
    const { weight, activity } = loadCalcPrefs()
    calcWeight.value = weight
    calcActivity.value = activity
  }
})

watch(() => waterStore.dailyGoal, (val) => {
  goalInput.value = val
})

function setGoal(ml: number) {
  waterStore.dailyGoal = ml
  waterStore.persist()
}

function onGoalChange() {
  const val = Math.round(Number(goalInput.value))
  const clamped = Math.min(10000, Math.max(100, isNaN(val) ? 2000 : val))
  waterStore.dailyGoal = clamped
  goalInput.value = clamped
  waterStore.persist()
}

function applyCalculatedGoal(goal: number) {
  waterStore.dailyGoal = goal
  goalInput.value = goal
  waterStore.persist()
}

const currentLocale = computed(() => locale.value)
const appVersion = __APP_VERSION__
const isRefreshing = ref(false)

async function refreshApp() {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    // Очищаем только Cache API (кеш приложения), localStorage не трогаем
    if ('caches' in window) {
      const names = await caches.keys()
      await Promise.all(names.map((n) => caches.delete(n)))
    }
    const url = new URL(window.location.href)
    url.searchParams.set('_refresh', String(Date.now()))
    window.location.href = url.toString()
  } catch {
    window.location.reload()
  }
}

function confirmReset() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
  showResetConfirm.value = false
  window.location.reload()
}

function changeLocale(code: SupportedLocale) {
  locale.value = code
  saveLocale(code)
  document.documentElement.lang = code
}
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: max(16px, env(safe-area-inset-right));
  z-index: 1100;
  animation: fadeIn 0.2s ease-out;
}

.settings-dialog {
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 8px;
  padding: 16px;
  width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  image-rendering: pixelated;
  animation: slideUp 0.25s ease-out;
  box-shadow:
    0 0 0 2px #2a2a4e,
    4px 4px 0 0 rgba(0, 0, 0, 0.3);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.settings-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 16px;
  color: #e5e7eb;
  letter-spacing: 2px;
}

.settings-close {
  background: none;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 2px;
  font-family: 'Fusion Pixel', monospace;
}

.settings-close:hover {
  background: #2a2a4e;
  color: #fff;
}

.settings-section {
  margin-bottom: 16px;
}

.how-to-use-btn {
  width: 100%;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-family: 'Fusion Pixel', monospace;
  font-size: 13px;
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}

.how-to-use-btn:hover {
  background: #3a3a5e;
  color: #e5e7eb;
  border-color: #6a6a9a;
}

.settings-label {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 1px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.goal-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.goal-input {
  width: 100px;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #e5e7eb;
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 4px;
}

.goal-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.goal-unit {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #9ca3af;
}

.goal-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.goal-calc-btn {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.goal-calc-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.goal-preset-btn {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.goal-preset-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.goal-preset-btn.goal-preset-active {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #fff;
}

.time-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.time-btn {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.time-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.time-btn.time-btn-active {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #fff;
}

.reminder-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.reminder-btn {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.reminder-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.reminder-btn.reminder-btn-active {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #fff;
}

.reminder-hint {
  margin-top: 8px;
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.3;
}

.language-select {
  width: 100%;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #e5e7eb;
  font-family: 'Fusion Pixel', monospace;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;
}

.language-select:hover {
  border-color: #6a6a9a;
}

.language-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.author-name {
  font-family: 'Fusion Pixel', monospace;
  font-size: 13px;
  color: #e5e7eb;
}

.version-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.app-version {
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  color: #6b7280;
}

.refresh-btn {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 10px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.refresh-btn:hover:not(:disabled) {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-btn {
  background: #4a1a1a;
  border: 2px solid #7a2a2a;
  color: #fca5a5;
  font-family: 'Fusion Pixel', monospace;
  font-size: 10px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.reset-btn:hover {
  background: #5a2a2a;
  border-color: #9a3a3a;
  color: #fecaca;
}

.author-links {
  display: flex;
  gap: 12px;
}

.author-link {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.15s;
}

.author-link:hover {
  color: #60a5fa;
}

@media (max-width: 479px) {
  .settings-overlay {
    align-items: flex-end;
    justify-content: center;
    padding-right: 0;
  }

  .settings-dialog {
    width: 100%;
    max-width: 100vw;
    border-radius: 12px 12px 0 0;
    border-bottom: none;
    padding: 16px 12px calc(env(safe-area-inset-bottom, 12px) + 12px);
    max-height: 70vh;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>
